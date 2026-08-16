import { useIsis } from "@/lib/isis/store";
import { alpha } from "@/lib/isis/theme";
import { Brush, Btn, Display, Eyebrow, TornCard } from "../ui";

export function Privacy() {
  const {
    c, docs, items, checkIns, feedback, scores, profile, setProfile,
    personalizationOn, setPersonalizationOn, forgetPersonalization,
    clearSession, clearHealth, theme, setTheme,
  } = useIsis();

  const best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];

  const row = (label: string, value: string) => (
    <div key={label} style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "0.4rem 0", borderBottom: `1px solid ${c.line}`, fontSize: "0.87rem" }}>
      <span style={{ color: c.inkSoft }}>{label}</span>
      <span style={{ color: c.ink, fontFamily: "'JetBrains Mono', monospace" }}>{value}</span>
    </div>
  );

  return (
    <div style={{ display: "grid", gap: 22 }}>
      <TornCard accent={c.sage}>
        <Eyebrow color={c.sage}>Privacy Center</Eyebrow>
        <Display size="1.8rem">Everything ISIS holds, in plain sight</Display>
        <Brush color={c.sage} />
        <p style={{ color: c.inkSoft, fontSize: "0.88rem" }}>
          Privacy-first architecture. Designed around data minimization and user control.
        </p>
        <div style={{ marginTop: 10 }}>
          {row("Documents received", String(docs.length))}
          {row("Characters sent to the AI", String(docs.reduce((s, d) => s + d.chars, 0)))}
          {row("Processed locally (timing, ordering, streaks)", "all scheduling logic")}
          {row("Health Vault items stored", String(items.filter((i) => i.origin === "Health document").length))}
          {row("Habits & actions stored", String(items.length))}
          {row("Self-reported check-ins", String(checkIns.length))}
          {row("Feedback events", String(feedback.length))}
        </div>
      </TornCard>

      <TornCard accent={c.violet}>
        <Eyebrow color={c.violet}>Personalization memory</Eyebrow>
        <Display size="1.5rem">What ISIS has learned from your interactions</Display>
        <ul style={{ color: c.ink, fontSize: "0.92rem", lineHeight: 1.8, paddingLeft: 18 }}>
          <li>You prefer {profile.explanationStyle === "simple" ? "short, simple" : "detailed"} explanations.</li>
          <li>Voice guidance is {profile.voice ? "enabled" : "off"}.</li>
          {feedback.length > 0 && best && <li>{best[0]}s have helped you before.</li>}
        </ul>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Btn small accent={c.violet} onClick={forgetPersonalization}>
            Forget personalization
          </Btn>
          <Btn small variant="ghost" accent={c.inkSoft} onClick={() => setPersonalizationOn(!personalizationOn)}>
            Personalization: {personalizationOn ? "ON" : "OFF"}
          </Btn>
          <Btn
            small
            variant="ghost"
            accent={c.rose}
            onClick={() =>
              setProfile(
                profile.explanationStyle === "simple"
                  ? { explanationStyle: "detailed", visual: false, voice: false }
                  : { explanationStyle: "simple", visual: true, voice: true },
              )
            }
          >
            Switch profile ({profile.explanationStyle === "simple" ? "→ detailed + text" : "→ simple + visual + voice"})
          </Btn>
          <Btn small variant="ghost" accent={c.marigold} onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
            {theme === "light" ? "Dark" : "Light"} mode
          </Btn>
        </div>
      </TornCard>

      <TornCard accent={c.poppy}>
        <Eyebrow>Your controls</Eyebrow>
        <Display size="1.4rem">Delete anything, any time</Display>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
          <Btn small accent={c.rose} onClick={clearHealth}>
            Delete health data
          </Btn>
          <Btn small accent={c.poppy} onClick={clearSession}>
            Clear session data
          </Btn>
        </div>
        <p style={{ marginTop: 12, fontSize: "0.78rem", color: c.inkSoft, background: alpha(c.poppy, 0.08), padding: "0.6rem" }}>
          ISIS never diagnoses, predicts, scores or labels a medical or mental-health
          condition, and performs no facial, vocal or physiological sensing of any kind.
        </p>
      </TornCard>
    </div>
  );
}
