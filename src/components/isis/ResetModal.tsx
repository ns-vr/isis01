import { useEffect, useState } from "react";
import { useIsis, type Intervention } from "@/lib/isis/store";
import { wellnessCopy } from "@/lib/isis/ai.functions";
import { alpha } from "@/lib/isis/theme";
import { Btn, Display, TornCard } from "./ui";

export function ResetModal({
  open,
  onClose,
  intervention,
  context,
}: {
  open: boolean;
  onClose: () => void;
  intervention: Intervention;
  context: string;
}) {
  const { c, recordFeedback, markBreak, scores } = useIsis();
  const [copy, setCopy] = useState<{ invite: string; steps: string[] } | null>(null);
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState<"guide" | "measure" | "learned">("guide");
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setCopy(null);
    setStep(0);
    setPhase("guide");
    setErr(null);
    wellnessCopy({ data: { interventionType: intervention, context } })
      .then(setCopy)
      .catch((e) =>
        setErr(e instanceof Error ? e.message : "Couldn't load this reset right now."),
      );
  }, [open, intervention, context]);

  if (!open) return null;

  const steps = copy?.steps ?? [];
  const best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];

  const finish = (outcome: "better" | "same" | "still not great") => {
    recordFeedback({ interventionType: intervention, context, outcome });
    markBreak();
    setPhase("learned");
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: alpha("#000000", 0.55),
        zIndex: 80,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      <TornCard accent={c.teal} style={{ maxWidth: 480, width: "100%" }}>
        <Display size="1.6rem">{intervention}</Display>
        {err && <p style={{ color: c.poppy, fontSize: "0.85rem" }}>{err}</p>}

        {phase === "guide" && (
          <>
            <p style={{ color: c.inkSoft, fontSize: "0.9rem" }}>
              {copy?.invite ?? "Preparing a short reset…"}
            </p>
            <div
              style={{
                margin: "1.5rem auto",
                width: 130,
                height: 130,
                borderRadius: "50%",
                background: alpha(c.teal, 0.18),
                border: `2px solid ${c.teal}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: c.teal,
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.8rem",
                animation: "isis-breathe 6s ease-in-out infinite",
              }}
            >
              breathe
            </div>
            <p style={{ color: c.ink, minHeight: 44, fontSize: "1rem" }}>
              {steps[step] ?? (copy ? "All done." : "…")}
            </p>
            <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
              <Btn
                accent={c.teal}
                onClick={() =>
                  step + 1 < steps.length ? setStep(step + 1) : setPhase("measure")
                }
                disabled={!copy}
              >
                {step + 1 < steps.length ? "Next step" : "I'm done"}
              </Btn>
              <Btn variant="ghost" accent={c.inkSoft} onClick={onClose}>
                Close
              </Btn>
            </div>
          </>
        )}

        {phase === "measure" && (
          <>
            <p style={{ color: c.ink, fontSize: "1.05rem" }}>How do you feel now?</p>
            <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
              <Btn accent={c.sage} onClick={() => finish("better")}>
                Better
              </Btn>
              <Btn variant="ghost" accent={c.marigold} onClick={() => finish("same")}>
                Same
              </Btn>
              <Btn variant="ghost" accent={c.poppy} onClick={() => finish("still not great")}>
                Still not great
              </Btn>
            </div>
          </>
        )}

        {phase === "learned" && (
          <>
            <p style={{ color: c.ink, fontSize: "1rem", lineHeight: 1.6 }}>
              ISIS learned: <strong>{best?.[0]}</strong> works well for you right now
              (preference score{" "}
              <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                {best?.[1].toFixed(2)}
              </span>
              ). This is a preference signal only — not a health assessment.
            </p>
            <Btn accent={c.teal} onClick={onClose} style={{ marginTop: 12 }}>
              Back to my day
            </Btn>
          </>
        )}
      </TornCard>
    </div>
  );
}
