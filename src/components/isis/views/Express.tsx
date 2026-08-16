import { useState } from "react";
import { useIsis, speak } from "@/lib/isis/store";
import { alpha } from "@/lib/isis/theme";
import { composeSentence } from "@/lib/isis/ai.functions";
import { Brush, Btn, Display, Eyebrow, TornCard } from "../ui";

const GROUPS: { label: string; chips: string[] }[] = [
  { label: "Who", chips: ["Doctor", "Pharmacist", "Family", "Coach"] },
  { label: "About", chips: ["Medication", "A side effect", "My appointment", "A stretch"] },
  { label: "I need", chips: ["More time", "A simpler explanation", "To reschedule", "A repeat prescription"] },
];

export function Express() {
  const { c, items, toggleDone } = useIsis();
  const [chips, setChips] = useState<string[]>([]);
  const [sentence, setSentence] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const build = async () => {
    setBusy(true);
    setErr(null);
    try {
      const r = await composeSentence({ data: { chips } });
      setSentence(r.text);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Couldn't build that sentence.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ display: "grid", gap: 22 }}>
      <TornCard accent={c.violet}>
        <Eyebrow color={c.violet}>Express</Eyebrow>
        <Display size="1.8rem">Build the sentence you need</Display>
        <Brush color={c.violet} />
        {GROUPS.map((g) => (
          <div key={g.label} style={{ marginTop: 12 }}>
            <div style={{ fontSize: "0.75rem", color: c.inkSoft, textTransform: "uppercase", letterSpacing: "0.1em" }}>{g.label}</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 6 }}>
              {g.chips.map((ch) => {
                const on = chips.includes(ch);
                return (
                  <button
                    key={ch}
                    onClick={() => setChips((p) => (on ? p.filter((x) => x !== ch) : [...p, ch]))}
                    style={{
                      padding: "0.35rem 0.8rem",
                      borderRadius: 999,
                      border: `1.5px solid ${on ? c.violet : c.line}`,
                      background: on ? alpha(c.violet, 0.18) : "transparent",
                      color: on ? c.violet : c.inkSoft,
                      cursor: "pointer",
                      fontSize: "0.85rem",
                    }}
                  >
                    {ch}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
        <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
          <Btn accent={c.violet} onClick={build} disabled={busy || chips.length === 0}>
            {busy ? "Composing…" : "Compose"}
          </Btn>
          {sentence && (
            <Btn small variant="ghost" accent={c.marigold} onClick={() => speak(sentence)}>
              Speak
            </Btn>
          )}
        </div>
        {err && <p style={{ color: c.poppy, fontSize: "0.85rem" }}>{err}</p>}
        {sentence && (
          <p style={{ marginTop: 12, fontSize: "1.1rem", color: c.ink, fontFamily: "'Fraunces', serif" }}>“{sentence}”</p>
        )}
      </TornCard>

      <TornCard accent={c.sage}>
        <Eyebrow color={c.sage}>Action checklist</Eyebrow>
        <Display size="1.4rem">Shared with your day</Display>
        <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 8 }}>
          {items.map((i) => (
            <li key={i.id} style={{ display: "flex", gap: 10, alignItems: "center", color: c.ink, fontSize: "0.9rem" }}>
              <input type="checkbox" checked={i.done} onChange={() => toggleDone(i.id)} style={{ accentColor: c.sage }} />
              <span style={{ textDecoration: i.done ? "line-through" : "none" }}>{i.title}</span>
            </li>
          ))}
        </ul>
      </TornCard>
    </div>
  );
}
