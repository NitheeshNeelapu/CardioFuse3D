export type LlmTask =
  | 'agent_explain'
  | 'patient_summary'
  | 'translate_narrative'
  | 'ecg_extract';

export interface LlmResponse<T = any> {
  ok: boolean;
  data?: T;
  text?: string;
  error?: string;
}

/**
 * Universal client proxy caller for LLM tasks.
 * Has a strict 20s AbortController timeout and always returns null on failure.
 * Every caller implements a deterministic fallback.
 */
export async function callLlm<T = any>(
  task: LlmTask,
  payload: any
): Promise<T | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 20000);

  try {
    const res = await fetch('/api/llm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ task, payload }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      return null;
    }

    const json: LlmResponse<T> = await res.json();
    if (!json || !json.ok) {
      return null;
    }

    if (json.data !== undefined) {
      return json.data;
    }

    if (json.text !== undefined) {
      return json.text as unknown as T;
    }

    return null;
  } catch {
    clearTimeout(timeoutId);
    return null;
  }
}
