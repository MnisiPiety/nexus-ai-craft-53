const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-3-flash-preview";

export type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

export class AiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

/** Single low-level entry point to the AI provider. Swap this file to change providers. */
export async function chat(messages: ChatMessage[], json = false): Promise<string> {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new AiError(401, "AI is not configured yet (missing API key).");

  const res = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      ...(json ? { response_format: { type: "json_object" } } : {}),
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    if (res.status === 429) throw new AiError(429, "Too many requests right now — please retry in a moment.");
    if (res.status === 402)
      throw new AiError(402, "AI credits are exhausted. Add credits in Lovable to keep generating.");
    throw new AiError(res.status, `AI request failed (${res.status}). ${text.slice(0, 200)}`);
  }

  const data = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new AiError(500, "The AI returned an empty response.");
  return content;
}

export async function chatJson<T>(messages: ChatMessage[]): Promise<T> {
  const raw = await chat(messages, true);
  const cleaned = raw.trim().replace(/^```(?:json)?/i, "").replace(/```$/, "");
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    throw new AiError(502, "The AI returned an unexpected format. Try again.");
  }
}
