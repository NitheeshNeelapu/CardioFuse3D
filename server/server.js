import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
  })
);

app.use(express.json({ limit: "20kb" }));

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    predictionModelConnected: false,
    message: "Research prototype only; no validated prediction model connected.",
  });
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const is503Error = (err) =>
  err?.status === 503 ||
  err?.code === 503 ||
  err?.error?.code === 503 ||
  (typeof err?.message === "string" && err.message.includes("503"));

app.post("/api/explain", async (req, res) => {
  const { patientInput, selectedVessel, modalities } = req.body ?? {};

  if (
    !patientInput ||
    typeof patientInput !== "object" ||
    !["LAD", "LCX", "RCA"].includes(selectedVessel)
  ) {
    return res.status(400).json({
      error: "A valid patientInput and selectedVessel are required.",
    });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(503).json({
      error: "Gemini API key is not configured on the server.",
    });
  }

  const input = {
    age: patientInput.age ?? null,
    sex: patientInput.sex ?? null,
    systolicBP: patientInput.systolicBP ?? null,
    diastolicBP: patientInput.diastolicBP ?? null,
    cholesterol: patientInput.cholesterol ?? null,
    restingHeartRate: patientInput.restingHeartRate ?? null,
    bmi: patientInput.bmi ?? null,
    ecg:
      modalities?.ecg && patientInput.ecg?.available
        ? {
          pattern: patientInput.ecg.pattern ?? null,
          leadNotes: patientInput.ecg.leadNotes ?? null,
          source: "User-entered; not independently verified",
        }
        : "Unavailable or disabled",
    symptoms:
      modalities?.symptoms && patientInput.symptoms?.available
        ? patientInput.symptoms.narrativeText ?? ""
        : "Unavailable or disabled",
    modalities: {
      clinical: Boolean(modalities?.clinical),
      ecg: Boolean(modalities?.ecg),
      symptoms: Boolean(modalities?.symptoms),
    },
    missingFields: [
      patientInput.systolicBP == null && "Systolic blood pressure",
      patientInput.diastolicBP == null && "Diastolic blood pressure",
      patientInput.cholesterol == null && "Cholesterol",
      patientInput.restingHeartRate == null && "Resting heart rate",
      patientInput.bmi == null && "BMI",
      (!modalities?.ecg || !patientInput.ecg?.available) && "ECG evidence",
      (!modalities?.symptoms || !patientInput.symptoms?.available) &&
      "Symptom narrative",
      "Medical imaging",
      "Laboratory biomarkers",
    ].filter(Boolean),
  };

  try {
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const generatePayload = {
      model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Explain the supplied data for a student cardiovascular research prototype.
The selected anatomical region is ${selectedVessel}. Selection is a UI choice, not evidence of disease in that vessel.
Rules:
- Explain only the information actually supplied.
- Clearly separate reported inputs from missing information.
- Do not diagnose or calculate disease, blockage, or heart-attack probabilities.
- Do not infer ECG findings from a pattern label.
- Do not invent imaging, lab results, or model outputs.
- Do not claim that a trained prediction model or clinical validation exists.
- Use concise headings: "Available information", "Evidence limitations", and "Important note".
- If information is missing, explicitly say it is unavailable.
- Encourage qualified medical assessment for health concerns.
Data:
${JSON.stringify(input, null, 2)}`,
            },
          ],
        },
      ],
      config: {
        temperature: 0.2,
        maxOutputTokens: 450,
      },
    };

    let result;
    try {
      result = await ai.models.generateContent(generatePayload);
    } catch (firstError) {
      if (is503Error(firstError)) {
        console.warn("Gemini returned 503; retrying once after 1.5s delay...");
        await sleep(1500);
        result = await ai.models.generateContent(generatePayload);
      } else {
        throw firstError;
      }
    }

    res.json({
      explanation: result.text || "No explanation was returned.",
      source: "Gemini",
      clinicallyValidated: false,
      predictionModelConnected: false,
      disclaimer:
        "Educational research output only. Not a diagnosis or a validated cardiovascular prediction.",
    });
  } catch (error) {
    console.error("Gemini request failed:", error);

    if (is503Error(error)) {
      return res.status(503).json({
        error:
          "Gemini is currently experiencing high demand. Please try again in a moment.",
      });
    }

    res.status(502).json({
      error:
        "Gemini explanation failed. Check the server terminal and API configuration.",
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});