import { useState } from "react";
import { useIsis, type Category } from "@/lib/isis/store";
import { speak } from "@/lib/isis/store";
import { alpha } from "@/lib/isis/theme";
import { SAMPLE_DOC } from "@/lib/isis/sample";
import { extractActions, type ExtractedAction } from "@/lib/isis/ai.functions";
import { Brush, Btn, Display, Eyebrow, Pipeline, SourceTag, TornCard, TryDifferentWay, WhyThis } from "../ui";

const kindToCategory = (k: ExtractedAction["kind"]): Category =>
  k === "movement" ? "Movement" : k === "other" ? "Learning" : "Health";

// Application logic (never the model) assigns concrete clock times.
const timeFor = (t: ExtractedAction["timeOfDay"]) =>
  t === "morning" ? "08:00" : t === "midday" ? "13:00" : t === "evening" ? "20:00" : "10:00";

export function DocumentFlow({ general = false }: { general?: boolean }) {
  const { c, profile, personalizationOn, addItem, logDoc, items } = useIsis();
  const [text, setText] = useState(general ? "" : SAMPLE_DOC);
  const [stage, setStage] = useState(-1);
  const [result, setResult] = useState<{ summary: string; actions: ExtractedAction[] } | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const style = personalizationOn ? profile.explanationStyle : "detailed";
  const accent = general ? c.poppy : c.rose;

  const run = async () => {
    setBusy(true);
    setErr(null);
    setResult(null);
    setStage(0);
    const timers = [1, 2, 3, 4, 5].map((s, i) => setTimeout(() => setStage(s), 400 * (i + 1)));
    try {
      const r = await extractActions({ data: { document: text, style, general } });
      setResult(r);
      setStage(6);
      logDoc(general ? "General document" : "Health document", text.length);
      if (personalizationOn && profile.voice) speak(r.summary);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Something went wrong reading that.");
      setStage(-1);
    } finally {
      timers.forEach(clearTimeout);
      setBusy(false);
    }
  };

  const onFile = (f: File) => {
    const reader = new FileReader();
    reader.onload = () => setText(String(reader.result ?? "").slice(0, 8000));
    reader.readAsText(f);
  };

  const planText = result
    ? `${result.summary}\n\n${result.actions.map((a) => `• ${a.title}: ${a.detail}`).join("\n")}`
    : "";

  return (
    <div style={{ display: "grid", gap: 22 }}>
      <TornCard accent={accent}>
        <Eyebrow color={accent}>{general ? "Understand" : "Health Vault"}</Eyebrow>
        <Display size="1.8rem">
          {general ? "Any document, made actionable" : "Your instruction sheet, decoded"}
        </Display>
        <Brush color={accent} />
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste the text of your document here…"
          style={{
            width: "100%",
            minHeight: 180,
            background: c.canvasAlt,
            border: `1.5px solid ${c.line}`,
            color: c.ink,
            padding: "0.8rem",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.82rem",
            lineHeight: 1.6,
          }}
        />
        <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap", alignItems: "center" }}>
          <Btn accent={accent} onClick={run} disabled={busy || text.trim().length < 5}>
            {busy ? "Reading…" : "Understand this"}
          </Btn>
          <label style={{ fontSize: "0.82rem", color: c.inkSoft, cursor: "pointer" }}>
            <input
              type="file"
              accept=".txt,.md,text/*,image/*"
              style={{ display: "none" }}
              onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
            />
            Upload a file
          </label>
          {!general && (
            <Btn small variant="ghost" accent={c.inkSoft} onClick={() => setText(SAMPLE_DOC)}>
              Load sample sheet
            </Btn>
          )}
        </div>
        {err && <p style={{ color: c.poppy, fontSize: "0.85rem" }}>{err}</p>}
        {stage >= 0 && (
          <div style={{ marginTop: 16, padding: "0.8rem", background: alpha(c.inkSoft, 0.08) }}>
            <Pipeline stage={stage} />
          </div>
        )}
      </TornCard>

      {result && (
        <TornCard accent={c.sage} tilt={0.6}>
          <Eyebrow color={c.sage}>
            {result.actions.length} action{result.actions.length === 1 ? "" : "s"} found
          </Eyebrow>
          <Display size="1.5rem">Here's what you need to do</Display>
          <p style={{ color: c.inkSoft, fontSize: style === "simple" ? "1rem" : "0.92rem", lineHeight: 1.65 }}>
            {result.summary}
          </p>
          <div style={{ display: "grid", gap: 14, marginTop: 8 }}>
            {result.actions.map((a, i) => {
              const already = items.some((it) => it.title === a.title);
              return (
                <div key={i} style={{ padding: "0.85rem", background: alpha(c.sage, 0.08), borderLeft: `3px solid ${c.sage}` }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                    {personalizationOn && profile.visual && (
                      <span style={{ fontSize: "1.1rem" }}>
                        {a.kind === "medication" ? "💊" : a.kind === "movement" ? "🤸" : a.kind === "appointment" ? "📅" : "📌"}
                      </span>
                    )}
                    <strong style={{ color: c.ink, fontSize: style === "simple" ? "1.05rem" : "0.98rem" }}>{a.title}</strong>
                    <SourceTag source={a.source} />
                  </div>
                  <p style={{ color: c.inkSoft, fontSize: "0.88rem", margin: "6px 0", lineHeight: 1.6 }}>{a.detail}</p>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                    <Btn
                      small
                      accent={c.poppy}
                      disabled={already}
                      onClick={() =>
                        addItem({
                          title: a.title,
                          detail: a.detail,
                          kind: a.kind === "medication" ? "medication" : a.kind === "appointment" ? "appointment" : "action",
                          category: kindToCategory(a.kind),
                          time: timeFor(a.timeOfDay),
                          source: a.source,
                          origin: general ? "Understand document" : "Health document",
                        })
                      }
                    >
                      {already ? "In your day" : "Make this part of my day"}
                    </Btn>
                    <Btn small variant="ghost" accent={c.marigold} onClick={() => speak(`${a.title}. ${a.detail}`)}>
                      Read aloud
                    </Btn>
                    <WhyThis
                      reason={
                        a.source
                          ? `Literal source passage: “${a.source}”. Scheduling (${timeFor(a.timeOfDay)}) is assigned by app logic from the stated time of day, not invented by the model.`
                          : "No exact supporting passage was found in your document, so this is shown as unverified. Nothing was paraphrased into a fake quote."
                      }
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <TryDifferentWay text={planText} />
          <p style={{ marginTop: 16, fontSize: "0.76rem", color: c.inkSoft, lineHeight: 1.6 }}>
            ISIS never diagnoses, predicts, scores or labels a medical or mental-health
            condition. It organizes information you supplied and offers general wellness
            actions that are not medical treatment. Contact a qualified professional about
            anything concerning.
          </p>
        </TornCard>
      )}
    </div>
  );
}
