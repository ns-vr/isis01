import { useState, type CSSProperties, type ReactNode } from "react";
import { useIsis, speak } from "@/lib/isis/store";
import { TORN_TOP, alpha } from "@/lib/isis/theme";
import { rephrase } from "@/lib/isis/ai.functions";
import { HelpCircle } from "lucide-react";

export function TornCard({
  children,
  accent,
  tilt = 0,
  style,
  className = "",
}: {
  children: ReactNode;
  accent?: string;
  tilt?: number;
  style?: CSSProperties;
  className?: string;
}) {
  const { c } = useIsis();
  const a = accent ?? c.violet;
  return (
    <div
      className={className}
      style={{
        clipPath: TORN_TOP,
        background: c.paper,
        boxShadow: c.shadow(a),
        borderTop: `3px solid ${a}`,
        transform: `rotate(${tilt}deg)`,
        padding: "1.75rem 1.5rem",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function Brush({ color, width = 140 }: { color?: string; width?: number }) {
  const { c } = useIsis();
  return (
    <svg width={width} height="12" viewBox="0 0 140 12" fill="none" aria-hidden>
      <path
        d="M2 8C22 3 38 9 58 6c18-3 32 4 50 1 10-2 18 1 28-2"
        stroke={color ?? c.marigold}
        strokeWidth="3.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Eyebrow({ children, color }: { children: ReactNode; color?: string }) {
  const { c } = useIsis();
  return (
    <div
      style={{
        color: color ?? c.poppy,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        fontSize: "0.68rem",
        fontWeight: 700,
        fontFamily: "'Work Sans', sans-serif",
      }}
    >
      {children}
    </div>
  );
}

export function Display({
  children,
  size = "2.4rem",
}: {
  children: ReactNode;
  size?: string;
}) {
  const { c } = useIsis();
  return (
    <h2
      style={{
        fontFamily: "'Fraunces', Georgia, serif",
        fontSize: size,
        lineHeight: 1.08,
        color: c.ink,
        margin: "0.4rem 0",
        fontWeight: 600,
      }}
    >
      {children}
    </h2>
  );
}

export function Btn({
  children,
  onClick,
  accent,
  variant = "solid",
  disabled,
  small,
  style,
}: {
  children: ReactNode;
  onClick?: () => void;
  accent?: string;
  variant?: "solid" | "ghost";
  disabled?: boolean;
  small?: boolean;
  style?: CSSProperties;
}) {
  const { c } = useIsis();
  const a = accent ?? c.poppy;
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: variant === "solid" ? a : "transparent",
        color: variant === "solid" ? (c.paper === "#FFFDF8" ? "#FFFDF8" : "#17151F") : a,
        border: `1.5px solid ${a}`,
        borderRadius: 999,
        padding: small ? "0.35rem 0.85rem" : "0.6rem 1.25rem",
        fontSize: small ? "0.8rem" : "0.92rem",
        fontWeight: 600,
        fontFamily: "'Work Sans', sans-serif",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.55 : 1,
        transition: "transform .15s ease, opacity .15s ease",
        ...style,
      }}
      onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.96)")}
      onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      {children}
    </button>
  );
}

/** Global "Show me why" — one reusable reveal built from real app state. */
export function WhyThis({ reason }: { reason: string }) {
  const { c } = useIsis();
  const [open, setOpen] = useState(false);
  return (
    <span style={{ display: "inline-block" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
          background: "none",
          border: "none",
          color: c.inkSoft,
          fontSize: "0.75rem",
          cursor: "pointer",
          padding: 0,
          fontFamily: "'Work Sans', sans-serif",
        }}
      >
        <HelpCircle size={13} /> Why this?
      </button>
      {open && (
        <div
          style={{
            marginTop: 6,
            background: alpha(c.teal, 0.12),
            borderLeft: `3px solid ${c.teal}`,
            padding: "0.5rem 0.7rem",
            fontSize: "0.78rem",
            color: c.ink,
            fontFamily: "'JetBrains Mono', monospace",
            lineHeight: 1.5,
          }}
        >
          {reason}
        </div>
      )}
    </span>
  );
}

export function SourceTag({ source }: { source: string | null }) {
  const { c } = useIsis();
  const [open, setOpen] = useState(false);
  if (!source)
    return (
      <span
        style={{
          fontSize: "0.7rem",
          color: c.inkSoft,
          border: `1px dashed ${c.line}`,
          padding: "2px 8px",
          borderRadius: 999,
        }}
      >
        unverified — no exact passage found
      </span>
    );
  return (
    <span>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          fontSize: "0.7rem",
          color: c.sage,
          border: `1px solid ${c.sage}`,
          background: "transparent",
          padding: "2px 8px",
          borderRadius: 999,
          cursor: "pointer",
        }}
      >
        source verified
      </button>
      {open && (
        <blockquote
          style={{
            margin: "6px 0 0",
            borderLeft: `3px solid ${c.sage}`,
            paddingLeft: 10,
            fontSize: "0.78rem",
            color: c.inkSoft,
            fontStyle: "italic",
          }}
        >
          “{source}”
        </blockquote>
      )}
    </span>
  );
}

/** "Try a different way": transforms the same information, never the facts. */
export function TryDifferentWay({ text }: { text: string }) {
  const { c } = useIsis();
  const [shown, setShown] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const run = async (mode: "simpler" | "visual") => {
    setBusy(mode);
    setErr(null);
    try {
      const r = await rephrase({ data: { text, mode } });
      setShown(r.text);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Couldn't rewrite that just now.");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div style={{ marginTop: "1rem" }}>
      <div style={{ fontSize: "0.85rem", color: c.inkSoft, marginBottom: 6 }}>
        Not quite right?
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <Btn small variant="ghost" accent={c.violet} onClick={() => run("simpler")}>
          {busy === "simpler" ? "…" : "Make it simpler"}
        </Btn>
        <Btn small variant="ghost" accent={c.teal} onClick={() => run("visual")}>
          {busy === "visual" ? "…" : "Show visually"}
        </Btn>
        <Btn small variant="ghost" accent={c.marigold} onClick={() => speak(shown ?? text)}>
          Read aloud
        </Btn>
      </div>
      <div style={{ fontSize: "0.72rem", color: c.inkSoft, marginTop: 6, fontStyle: "italic" }}>
        Same information. Different way of understanding it.
      </div>
      {err && (
        <div style={{ fontSize: "0.78rem", color: c.poppy, marginTop: 6 }}>{err}</div>
      )}
      {shown && (
        <pre
          style={{
            whiteSpace: "pre-wrap",
            marginTop: 10,
            background: alpha(c.violet, 0.1),
            padding: "0.75rem",
            fontFamily: "'Work Sans', sans-serif",
            fontSize: "0.88rem",
            color: c.ink,
            lineHeight: 1.55,
          }}
        >
          {shown}
        </pre>
      )}
    </div>
  );
}

export function Pipeline({ stage }: { stage: number }) {
  const { c } = useIsis();
  const stages = [
    "Input",
    "Multimodal understanding",
    "Structured facts",
    "Source verification",
    "User adaptation profile",
    "Current context (app logic)",
    "Personalized action",
  ];
  return (
    <ol style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {stages.map((s, i) => (
        <li
          key={s}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "3px 0",
            opacity: i <= stage ? 1 : 0.35,
            fontSize: "0.78rem",
            fontFamily: "'JetBrains Mono', monospace",
            color: i === stage ? c.poppy : c.inkSoft,
          }}
        >
          <span
            style={{
              width: 9,
              height: 9,
              borderRadius: 999,
              background: i <= stage ? c.poppy : c.line,
              animation: i === stage ? "isis-pulse 1.2s infinite" : undefined,
            }}
          />
          {s}
        </li>
      ))}
    </ol>
  );
}

export function Confetti({ show }: { show: boolean }) {
  const { c } = useIsis();
  if (!show) return null;
  const colors = [c.poppy, c.marigold, c.teal, c.violet, c.sage];
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 90 }}>
      {Array.from({ length: 40 }).map((_, i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            left: `${(i * 37) % 100}%`,
            top: "-5%",
            width: 8,
            height: 12,
            background: colors[i % colors.length],
            animation: `isis-fall ${1.6 + (i % 5) * 0.25}s ease-in forwards`,
            animationDelay: `${(i % 8) * 0.06}s`,
          }}
        />
      ))}
    </div>
  );
}
