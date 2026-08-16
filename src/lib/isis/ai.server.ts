// Server-only helper that talks to the AI gateway. The API key never leaves the
// server; the client only calls the typed server function in ai.functions.ts.

const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";

export const SAFETY_RULES = `You are ISIS. You turn health information into personalized action.
HARD RULES:
- Never diagnose, predict, score, or label a medical or mental-health condition.
  You may organize information supplied by the user or their documents and provide
  general wellness actions that are not medical treatment.
- If anything reads as a concerning medical situation, encourage contacting a
  qualified professional instead of assessing, scoring or treating it.
- Never invent a deadline, dose, schedule, reminder time, priority or health fact
  that is not present in the source text. Dates, timing, ordering and status are
  computed by the application, not by you.
- SOURCE VERIFICATION: a "source" must be an exact substring of the source text.
  If you cannot find one, return source: null. Never paraphrase and present it as
  a quotation.`;

export async function callModel(
  system: string,
  user: string,
  json: boolean,
): Promise<string> {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("AI is not configured.");
  const res = await fetch(GATEWAY, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: `${SAFETY_RULES}\n\n${system}` },
        { role: "user", content: user },
      ],
      ...(json ? { response_format: { type: "json_object" } } : {}),
    }),
  });
  if (res.status === 429) throw new Error("Rate limit reached — try again shortly.");
  if (res.status === 402) throw new Error("AI credits exhausted for this workspace.");
  if (!res.ok) throw new Error(`AI request failed (${res.status}).`);
  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  return data.choices?.[0]?.message?.content ?? "";
}

export function parseJson<T>(raw: string, fallback: T): T {
  try {
    const cleaned = raw
      .trim()
      .replace(/^```(?:json)?/i, "")
      .replace(/```$/, "");
    return JSON.parse(cleaned) as T;
  } catch {
    const m = raw.match(/[[{][\s\S]*[\]}]/);
    if (m) {
      try {
        return JSON.parse(m[0]) as T;
      } catch {
        return fallback;
      }
    }
    return fallback;
  }
}

// Source verification is enforced here in application code too: a quote the model
// returns that is not literally present in the document becomes source: null.
export function verifySource(doc: string, quote?: string | null): string | null {
  if (!quote) return null;
  const norm = (s: string) => s.replace(/\s+/g, " ").toLowerCase().trim();
  return norm(doc).includes(norm(quote)) ? quote.trim() : null;
}
