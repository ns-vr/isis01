import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { callModel, parseJson, verifySource } from "./ai.server";

export interface ExtractedAction {
  title: string;
  detail: string;
  kind: "medication" | "movement" | "appointment" | "other";
  timeOfDay: "morning" | "midday" | "evening" | "anytime";
  recurring: boolean;
  source: string | null;
}

export const extractActions = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z
      .object({
        document: z.string().min(4),
        style: z.enum(["simple", "detailed"]),
        general: z.boolean().optional(),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const raw = await callModel(
      `Extract the concrete actions the reader must take from the ${
        data.general ? "document" : "health document"
      }.
Return JSON: {"summary": string, "actions": [{"title": string, "detail": string,
"kind": "medication"|"movement"|"appointment"|"other",
"timeOfDay": "morning"|"midday"|"evening"|"anytime",
"recurring": boolean, "source": string|null}]}
"source" must be an exact substring copied from the document, or null.
Write "detail" in a ${data.style === "simple" ? "very plain, short, 6th-grade" : "detailed, precise"} style.
Max 6 actions.`,
      data.document,
      true,
    );
    const parsed = parseJson<{ summary: string; actions: ExtractedAction[] }>(raw, {
      summary: "",
      actions: [],
    });
    // AI stops here; verification and everything below is deterministic app logic.
    return {
      summary: parsed.summary ?? "",
      actions: (parsed.actions ?? []).slice(0, 6).map((a) => ({
        ...a,
        source: verifySource(data.document, a.source),
      })),
    };
  });

export const rephrase = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z
      .object({
        text: z.string().min(2),
        mode: z.enum(["simpler", "visual", "detailed"]),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const instruction =
      data.mode === "simpler"
        ? "Rewrite in the simplest possible language, short sentences."
        : data.mode === "visual"
          ? "Rewrite as a compact visual list: each line starts with a single relevant emoji, then 4-8 words."
          : "Rewrite with more explanation and context.";
    const text = await callModel(
      `${instruction} Do NOT add, remove or change any fact. Same information, different way of understanding it. Plain text only.`,
      data.text,
      false,
    );
    return { text: text.trim() };
  });

export const wellnessCopy = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z
      .object({ interventionType: z.string(), context: z.string() })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const raw = await callModel(
      `Write wording for a short wellness intervention. Return JSON:
{"invite": string (one warm sentence inviting them), "steps": [3 or 4 short instruction strings]}
No medical claims, no diagnosis.`,
      `Intervention type: ${data.interventionType}. Situation: ${data.context}`,
      true,
    );
    return parseJson<{ invite: string; steps: string[] }>(raw, {
      invite: "Want a short reset before you continue?",
      steps: ["Sit comfortably.", "Breathe in for four.", "Breathe out for six.", "Notice how you feel."],
    });
  });

export const composeSentence = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ chips: z.array(z.string()).min(1) }).parse(d))
  .handler(async ({ data }) => {
    const text = await callModel(
      "Turn these chips into one clear, polite first-person sentence the user can say or send. Return only the sentence.",
      data.chips.join(" | "),
      false,
    );
    return { text: text.trim() };
  });

export const reflectionQuestion = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ habits: z.array(z.string()) }).parse(d))
  .handler(async ({ data }) => {
    const text = await callModel(
      "Write ONE short, thoughtful journal question (max 20 words) about the person's day, based on the habits they completed. No diagnosis, no advice.",
      data.habits.join(", ") || "a quiet day",
      false,
    );
    return { text: text.trim() };
  });
