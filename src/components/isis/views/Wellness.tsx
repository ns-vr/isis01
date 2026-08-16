import { useState } from "react";
import { useIsis } from "@/lib/isis/store";
import { alpha } from "@/lib/isis/theme";
import { Brush, Btn, Display, Eyebrow, TornCard, WhyThis } from "../ui";

export function Wellness({ onReset }: { onReset: (ctx: string) => void }) {
  const { c, checkIns, addCheckIn, scores, feedback, lastBreak, pickIntervention } = useIsis();
  const [energy, setEnergy] = useState(3);
  const [overload, setOverload] = useState(2);
  const last = checkIns[checkIns.length - 1];
  const mins = Math.round((Date.now() - lastBreak) / 60000);
  const next = pickIntervention();

  return (
    <div style={{ display: "grid", gap: 22 }}>
      <TornCard accent={c.teal}>
        <Eyebrow color={c.teal}>Wellness</Eyebrow>
        <Display size="1.8rem">Sense → Understand → Intervene → Measure → Learn</Display>
        <Brush color={c.teal} />
        <p style={{ color: c.inkSoft, fontSize: "0.9rem" }}>
          Every signal here comes from what you tell us or from plain arithmetic on your own
          schedule. No cameras, no microphones, no inferred physiology.
        </p>

        <div style={{ display: "grid", gap: 14, marginTop: 12 }}>
          <label style={{ color: c.ink, fontSize: "0.9rem" }}>
            Energy right now: <strong>{energy}</strong>/5
            <input type="range" min={1} max={5} value={energy} onChange={(e) => setEnergy(+e.target.value)} style={{ width: "100%", accentColor: c.teal }} />
          </label>
          <label style={{ color: c.ink, fontSize: "0.9rem" }}>
            Feeling overloaded: <strong>{overload}</strong>/5
            <input type="range" min={1} max={5} value={overload} onChange={(e) => setOverload(+e.target.value)} style={{ width: "100%", accentColor: c.poppy }} />
          </label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Btn small accent={c.teal} onClick={() => addCheckIn({ energy, overload })}>
              Log check-in
            </Btn>
            <Btn
              accent={c.teal}
              onClick={() =>
                onReset(`energy ${last?.energy ?? energy}/5, ${mins} minutes since last break`)
              }
            >
              Start {next}
            </Btn>
            <WhyThis
              reason={`Selected "${next}" because it has the highest learned preference score (${(scores[next] ?? 1).toFixed(2)}). Context: logged energy ${last?.energy ?? energy}/5, ${mins} minutes since your last break — both from your own input and app state.`}
            />
          </div>
        </div>
      </TornCard>

      <TornCard accent={c.violet}>
        <Eyebrow color={c.violet}>Learned preferences</Eyebrow>
        <Display size="1.4rem">What has helped you</Display>
        <div style={{ display: "grid", gap: 8, marginTop: 10 }}>
          {Object.entries(scores)
            .sort((a, b) => b[1] - a[1])
            .map(([k, v]) => (
              <div key={k}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: c.ink }}>
                  <span>{k}</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", color: c.inkSoft }}>{v.toFixed(2)}</span>
                </div>
                <div style={{ height: 8, background: alpha(c.violet, 0.16), borderRadius: 999 }}>
                  <div style={{ width: `${Math.min(100, (v / 2) * 100)}%`, height: "100%", background: c.violet, borderRadius: 999 }} />
                </div>
              </div>
            ))}
        </div>
        <p style={{ fontSize: "0.76rem", color: c.inkSoft, marginTop: 10 }}>
          A preference signal only — never a health assessment. {feedback.length} feedback
          event{feedback.length === 1 ? "" : "s"} recorded this session.
        </p>
      </TornCard>
    </div>
  );
}
