import type { VercelRequest, VercelResponse } from '@vercel/node';

// In-memory rate limiting map: ip -> { count, resetAt }
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (entry.count >= 20) {
    return false;
  }
  entry.count += 1;
  return true;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Reject non-POST
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed. Use POST.' });
  }

  // Rate limit
  const forwarded = req.headers['x-forwarded-for'];
  const ip = typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : req.socket.remoteAddress || '127.0.0.1';
  if (!checkRateLimit(ip)) {
    return res.status(429).json({ ok: false, error: 'Rate limit exceeded (max 20 req/min). Please try again shortly.' });
  }

  // Check body existence
  const { task, payload } = req.body || {};
  if (!task || typeof task !== 'string' || !payload || typeof payload !== 'object') {
    return res.status(400).json({ ok: false, error: 'Invalid request body. Expected { task, payload }.' });
  }

  const validTasks = ['agent_explain', 'patient_summary', 'translate_narrative', 'ecg_extract'];
  if (!validTasks.includes(task)) {
    return res.status(400).json({ ok: false, error: `Invalid task '${task}'. Supported: ${validTasks.join(', ')}` });
  }

  // Check API key
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ ok: false, error: 'GEMINI_API_KEY is not configured on the server.' });
  }

  const model = process.env.LLM_MODEL || 'gemini-1.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

  // Server-side prompt construction
  let promptText = '';
  let parts: any[] = [];
  let isJsonTask = false;

  if (task === 'agent_explain') {
    promptText = `You are an evidence-to-anatomy cardiovascular AI research assistant.
The user is evaluating coronary supply bed risk estimates produced by a transparent rule-based scorer (NOT a diagnostic device).
Selected target vessel: ${payload.selectedVessel}
Active modalities: ${JSON.stringify(payload.activeModalities)}
Missing evidence ranking: ${JSON.stringify(payload.ranking)}
Clinical guideline references: ${JSON.stringify(payload.guidelineSnippets)}

Rules:
1. Write a concise, 3-4 sentence plain explanation of what diagnostic evidence is currently missing and why collecting it would reduce clinical uncertainty.
2. Clearly explain which test would be most informative next based on the ranking.
3. NEVER compute, adjust, or fabricate risk probabilities.
4. Do NOT provide medical diagnoses, treatment plans, or drug recommendations.
5. Emphasize that outputs are research demonstration scores and qualified clinician assessment is always required.`;
    parts = [{ text: promptText }];
  } else if (task === 'patient_summary') {
    isJsonTask = true;
    const targetLang = payload.language || 'English';
    promptText = `You are a clear, compassionate medical research communicator.
A research prototype evaluated cardiovascular evidence with the following model-derived demonstration estimates:
Target Vessel: ${payload.selectedVessel}
Demonstration scores: ${JSON.stringify(payload.probabilities)}
Active modalities: ${JSON.stringify(payload.activeModalities)}
${payload.agentAdvice ? `Agent note: ${payload.agentAdvice}` : ''}
Target Language: ${targetLang}

Instructions:
1. Write an explanation directly to the patient strictly and ONLY in the target language (${targetLang}). Do NOT write the patient explanation in English unless the target language is English.
2. The explanation must be simple (approx grade-6 reading level) and state clearly that this is an experimental computer demonstration score and NOT a medical diagnosis of coronary disease.
3. NEVER provide prescriptions, medications, or medical treatment advice.
4. Urge the patient to speak with a qualified physician about their health.
5. Maximum ~120 words for the patient explanation in ${targetLang}.
6. Write a 2-3 sentence clinician summary in English.

Return STRICT JSON with exactly these two keys:
{
  "patientText": "<explanation written exclusively in ${targetLang}>",
  "clinicianTextEn": "<2-3 sentence English clinician summary>"
}`;
    parts = [{ text: promptText }];
  } else if (task === 'translate_narrative') {
    isJsonTask = true;
    promptText = `Translate the following clinical symptom narrative into concise medical English suitable for cardiovascular feature extraction:
Original language: ${payload.language || 'unknown'}
Original text: "${payload.text || ''}"

Return STRICT JSON with exactly this key:
{
  "english": "<translated clinical English text>"
}`;
    parts = [{ text: promptText }];
  } else if (task === 'ecg_extract') {
    isJsonTask = true;
    const { mimeType, base64 } = payload;
    if (!mimeType || !['image/jpeg', 'image/png', 'image/webp'].includes(mimeType)) {
      return res.status(400).json({ ok: false, error: 'Invalid or unsupported image mimeType. Only JPEG, PNG, and WebP are allowed.' });
    }
    if (!base64 || typeof base64 !== 'string') {
      return res.status(400).json({ ok: false, error: 'Missing image base64 data.' });
    }
    if (base64.length > 5 * 1024 * 1024) {
      return res.status(413).json({ ok: false, error: 'Image payload exceeds 4MB limit.' });
    }

    promptText = `Examine this 12-lead ECG paper recording or tracing photo.
Extract ONLY values that are printed or clearly measurable on the tracing or header:
- heartRate: integer bpm (range ~20-250) or null
- prInterval: integer ms (range ~60-400) or null
- qrsDuration: integer ms (range ~40-250) or null
- qtcInterval: integer ms (range ~250-700) or null
- rhythm: string label e.g. 'Normal Sinus Rhythm', 'Sinus Tachycardia', etc., or null
- confidence: 'low' | 'medium' | 'high'
- notes: short 1-line note of any observable abnormalities or signal quality, or null

CRITICAL SAFETY RULES:
- If any value is blurred, unreadable, omitted, or doubtful, set its value to null.
- NEVER guess, hallucinate, or estimate numbers.
- Return STRICT JSON with exactly these keys:
{
  "heartRate": number | null,
  "prInterval": number | null,
  "qrsDuration": number | null,
  "qtcInterval": number | null,
  "rhythm": string | null,
  "confidence": "low" | "medium" | "high",
  "notes": string | null
}`;
    parts = [
      { text: promptText },
      {
        inlineData: {
          mimeType,
          data: base64,
        },
      },
    ];
  }

  // Upstream Gemini call with 20s timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 20000);

  try {
    const geminiBody: any = {
      contents: [{ role: 'user', parts }],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 800,
      },
    };

    if (isJsonTask) {
      geminiBody.generationConfig.responseMimeType = 'application/json';
    }

    const upstreamRes = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify(geminiBody),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!upstreamRes.ok) {
      return res.status(502).json({ ok: false, error: 'Upstream LLM service responded with an error.' });
    }

    const jsonRes = await upstreamRes.json();
    const candidateText = jsonRes?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!candidateText || typeof candidateText !== 'string') {
      return res.status(502).json({ ok: false, error: 'No content returned from upstream LLM service.' });
    }

    if (isJsonTask) {
      try {
        const parsed = JSON.parse(candidateText.trim());
        return res.status(200).json({ ok: true, data: parsed });
      } catch {
        return res.status(502).json({ ok: false, error: 'Malformed JSON from upstream LLM service.' });
      }
    }

    return res.status(200).json({ ok: true, text: candidateText });
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err?.name === 'AbortError') {
      return res.status(504).json({ ok: false, error: 'Upstream LLM call timed out after 20 seconds.' });
    }
    return res.status(502).json({ ok: false, error: 'Failed to communicate with LLM service.' });
  }
}
