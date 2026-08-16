import { useState } from "react";
import { useIsis } from "@/lib/isis/store";
import { alpha } from "@/lib/isis/theme";
import { Brush, Btn, Display, Eyebrow, TornCard } from "./ui";

export function Onboarding() {
  const { c, setView, profile, setProfile } = useIsis();
  const [step, setStep] = useState(0);

  const steps = [
    {
      q: "How should ISIS explain things to you?",
      opts: [
        { label: "Keep it simple", apply: () => setProfile({ explanationStyle: "simple" }), on: profile.explanationStyle === "simple" },
        { label: "Give me the detail", apply: () => setProfile({ explanationStyle: "detailed" }), on: profile.explanationStyle === "detailed" },
      ],
    },
    {
      q: "Do pictures and icons help you?",
      opts: [
        { label: "Yes, show visually", apply: () => setProfile({ visual: true }), on: profile.visual },
        { label: "Text is fine", apply: () => setProfile({ visual: false }), on: !profile.visual },
      ],
    },
    {
      q: "Would you like plans read aloud?",
      opts: [
        { label: "Yes, use voice", apply: () => setProfile({ voice: true }), on: profile.voice },
        { label: "No voice", apply: () => setProfile({ voice: false }), on: !profile.voice },
      ],
    },
    {
      q: "How are you feeling right now?",
      opts: [
        { label: "Steady", apply: () => setProfile({ currentState: "steady" }), on: profile.currentState === "steady" },
        { label: "A bit overloaded", apply: () => setProfile({ currentState: "overloaded" }), on: profile.currentState === "overloaded" },
      ],
    },
  ];

  const cur = steps[step]!;

  return (
    <div style={{ background: c.canvas, minHeight: "100vh", display: "grid", placeItems: "center", padding: "1.5rem" }}>
      <TornCard accent={c.violet} style={{ maxWidth: 520, width: "100%" }}>
        <Eyebrow color={c.violet}>Step {step + 1} of {steps.length}</Eyebrow>
        <Display size="1.9rem">{cur.q}</Display>
        <Brush color={c.violet} />
        <p style={{ color: c.inkSoft, fontSize: "0.86rem" }}>
          This builds your Personal Adaptation Profile — the same information will be
          rendered differently for you.
        </p>
        <div style={{ display: "grid", gap: 10, marginTop: "1rem" }}>
          {cur.opts.map((o) => (
            <button
              key={o.label}
              onClick={() => {
                o.apply();
                if (step + 1 < steps.length) setStep(step + 1);
                else setView("dashboard");
              }}
              style={{
                textAlign: "left",
                padding: "0.9rem 1rem",
                background: o.on ? alpha(c.violet, 0.16) : "transparent",
                border: `1.5px solid ${o.on ? c.violet : c.line}`,
                color: c.ink,
                fontSize: "1rem",
                cursor: "pointer",
                fontFamily: "'Work Sans', sans-serif",
              }}
            >
              {o.label}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
          {step > 0 && (
            <Btn small variant="ghost" accent={c.inkSoft} onClick={() => setStep(step - 1)}>
              Back
            </Btn>
          )}
          <Btn small variant="ghost" accent={c.inkSoft} onClick={() => setView("dashboard")}>
            Skip to dashboard
          </Btn>
        </div>
      </TornCard>
    </div>
  );
}
