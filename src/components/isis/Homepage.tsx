import { useIsis } from "@/lib/isis/store";
import { alpha } from "@/lib/isis/theme";
import { Brush, Btn, Display, Eyebrow, TornCard } from "./ui";
import { BookOpen, HeartPulse, Leaf, MessageCircle, Moon, ShieldCheck, Sun } from "lucide-react";

function ThemeToggle() {
  const { theme, setTheme, c } = useIsis();
  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      aria-label="Toggle colour theme"
      style={{
        width: 40,
        height: 40,
        borderRadius: 999,
        border: `1.5px solid ${c.line}`,
        background: alpha(c.marigold, 0.16),
        color: c.marigold,
        display: "grid",
        placeItems: "center",
        cursor: "pointer",
        transition: "transform .35s ease",
        transform: theme === "dark" ? "rotate(180deg)" : "rotate(0deg)",
      }}
    >
      {theme === "light" ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}

function Blob({
  color,
  size,
  delay,
  style,
}: {
  color: string;
  size: number;
  delay: number;
  style: React.CSSProperties;
}) {
  return (
    <div
      style={{
        position: "absolute",
        width: size,
        height: size,
        background: color,
        filter: "blur(2px)",
        borderRadius: "58% 42% 63% 37% / 42% 55% 45% 58%",
        animation: `isis-float 9s ease-in-out ${delay}s infinite`,
        ...style,
      }}
    />
  );
}

export function Homepage() {
  const { c, setView, setMode } = useIsis();

  const modes = [
    { name: "Understand", color: c.poppy, Icon: BookOpen, copy: "Read any document and pull out what actually needs doing." },
    { name: "Health", color: c.rose, Icon: HeartPulse, copy: "Your Health Vault: instructions, doses and appointments, source-verified." },
    { name: "Wellness", color: c.teal, Icon: Leaf, copy: "Short guided resets that adapt to what has helped you before." },
    { name: "Express", color: c.violet, Icon: MessageCircle, copy: "Build the sentence you need to say, out loud if you want." },
  ];

  return (
    <div style={{ background: c.canvas, color: c.ink, minHeight: "100vh" }}>
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1.1rem clamp(1rem, 5vw, 4rem)",
          position: "sticky",
          top: 0,
          background: alpha(c.canvas, 0.88),
          backdropFilter: "blur(8px)",
          zIndex: 20,
        }}
      >
        <span style={{ fontFamily: "'Fraunces', serif", fontSize: "1.5rem", fontWeight: 700, letterSpacing: "0.04em" }}>
          ISIS
        </span>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <ThemeToggle />
          <Btn variant="ghost" accent={c.inkSoft} small onClick={() => { setView("dashboard"); setMode("privacy"); }}>
            Privacy Center
          </Btn>
          <Btn accent={c.poppy} small onClick={() => setView("login")}>
            Get started
          </Btn>
        </div>
      </nav>

      {/* HERO — product statement, tagline, subtitle, three layers */}
      <header
        style={{
          position: "relative",
          overflow: "hidden",
          padding: "clamp(2rem, 6vw, 5rem) clamp(1rem, 5vw, 4rem) 4rem",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.5,
            backgroundImage: `radial-gradient(${alpha(c.inkSoft, 0.18)} 1px, transparent 1px)`,
            backgroundSize: "16px 16px",
          }}
        />
        <Blob color={alpha(c.marigold, 0.32)} size={340} delay={0} style={{ right: "4%", top: "6%" }} />
        <Blob color={alpha(c.teal, 0.26)} size={220} delay={1.4} style={{ right: "22%", top: "38%" }} />
        <Blob color={alpha(c.violet, 0.22)} size={150} delay={2.6} style={{ right: "12%", bottom: "6%" }} />

        <div style={{ position: "relative", maxWidth: 620 }}>
          <Eyebrow>Understand · Protect · Restore</Eyebrow>
          <h1
            style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontSize: "clamp(2.6rem, 6vw, 4.2rem)",
              lineHeight: 1.02,
              margin: "0.6rem 0 0.4rem",
              fontWeight: 600,
            }}
          >
            ISIS turns health information into personalized action.
          </h1>
          <Brush color={c.poppy} width={190} />
          <p style={{ color: c.inkSoft, fontSize: "1.08rem", lineHeight: 1.65, maxWidth: 540 }}>
            It understands what your health information says, adapts it to how you prefer
            to understand information, turns it into actions for your day, and helps you
            follow through with wellness support.
          </p>
          <p style={{ fontStyle: "italic", color: c.ink, fontSize: "1rem" }}>
            Same information. Different way of understanding it.
          </p>
          <div style={{ display: "flex", gap: 10, marginTop: "1.4rem", flexWrap: "wrap" }}>
            <Btn accent={c.poppy} onClick={() => setView("login")}>
              Start with a document
            </Btn>
            <Btn variant="ghost" accent={c.teal} onClick={() => { setView("dashboard"); setMode("wellness"); }}>
              Take a 2-minute reset
            </Btn>
          </div>

          <div style={{ display: "grid", gap: 12, marginTop: "2.5rem", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
            {[
              { t: "Understand", d: "AI understands health information.", col: c.poppy },
              { t: "Protect", d: "Privacy, source verification, your control.", col: c.sage },
              { t: "Restore", d: "Personalized wellness intervention.", col: c.teal },
            ].map((x) => (
              <div key={x.t} style={{ borderLeft: `3px solid ${x.col}`, paddingLeft: 12 }}>
                <div style={{ fontFamily: "'Fraunces', serif", fontSize: "1.15rem", color: x.col }}>{x.t}</div>
                <div style={{ color: c.inkSoft, fontSize: "0.88rem" }}>{x.d}</div>
              </div>
            ))}
          </div>
        </div>

        <TornCard
          accent={c.rose}
          tilt={-1.2}
          style={{ position: "relative", maxWidth: 420, marginTop: "3rem" }}
        >
          <svg width="46" height="46" viewBox="0 0 48 48" fill="none" aria-hidden>
            <rect x="9" y="5" width="26" height="34" rx="3" stroke={c.rose} strokeWidth="2.4" />
            <path d="M15 15h14M15 22h14M15 29h8" stroke={c.inkSoft} strokeWidth="2" strokeLinecap="round" />
            <circle cx="35" cy="34" r="9" fill={c.sage} />
            <path d="M31 34.2l3 3 6-6.4" stroke={c.paper} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <Eyebrow color={c.rose}>The relatable bit</Eyebrow>
          <Display size="1.5rem">You leave the clinic holding a page you can't parse.</Display>
          <p style={{ color: c.inkSoft, fontSize: "0.93rem", lineHeight: 1.6, margin: 0 }}>
            Health information is often written for doctors, not for the person who has to
            live with it. ISIS reads it with you, shows you exactly where each instruction
            came from, and puts it into your day.
          </p>
        </TornCard>
      </header>

      {/* MODES */}
      <section style={{ padding: "3rem clamp(1rem, 5vw, 4rem)", background: c.canvasAlt }}>
        <Eyebrow color={c.violet}>The pipeline</Eyebrow>
        <Display>Four modes, one journey</Display>
        <Brush color={c.violet} />
        <p style={{ color: c.inkSoft, maxWidth: 560 }}>
          Health information → AI understanding → personalized action → wellness
          intervention → feedback → learning.
        </p>
        <div style={{ display: "grid", gap: 20, gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", marginTop: "2rem" }}>
          {modes.map((m, i) => (
            <TornCard key={m.name} accent={m.color} tilt={i % 2 ? 0.8 : -0.8}>
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  display: "grid",
                  placeItems: "center",
                  background: alpha(m.color, 0.18),
                  color: m.color,
                  marginBottom: 10,
                }}
              >
                <m.Icon size={20} />
              </div>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: "1.25rem", color: c.ink }}>{m.name}</div>
              <p style={{ color: c.inkSoft, fontSize: "0.88rem", lineHeight: 1.55 }}>{m.copy}</p>
            </TornCard>
          ))}
        </div>
      </section>

      {/* PHILOSOPHY + TRUST */}
      <section style={{ padding: "3.5rem clamp(1rem, 5vw, 4rem)" }}>
        <Eyebrow color={c.sage}>Our position</Eyebrow>
        <Display>We don't try to tell you what's wrong.</Display>
        <Brush color={c.sage} />
        <p style={{ color: c.inkSoft, maxWidth: 620, lineHeight: 1.7 }}>
          Most health AI tries to diagnose you. ISIS helps you understand what you already
          know and actually do something with it. No cameras reading your face, no stress
          scores, no inferred physiology — every wellness signal comes from what you tell
          us or from plain arithmetic on your own schedule.
        </p>
        <div
          style={{
            marginTop: "2rem",
            display: "flex",
            gap: 14,
            alignItems: "center",
            flexWrap: "wrap",
            padding: "1rem 1.25rem",
            background: alpha(c.sage, 0.12),
            borderLeft: `3px solid ${c.sage}`,
          }}
        >
          <ShieldCheck size={22} color={c.sage} />
          <div style={{ fontSize: "0.9rem", color: c.ink }}>
            Privacy-first architecture. Designed around data minimization and user control.
          </div>
          <Btn small variant="ghost" accent={c.sage} onClick={() => { setView("dashboard"); setMode("privacy"); }}>
            Open Privacy Center
          </Btn>
        </div>
      </section>

      <footer style={{ padding: "2rem clamp(1rem, 5vw, 4rem)", color: c.inkSoft, fontSize: "0.8rem", borderTop: `1px solid ${c.line}` }}>
        ISIS · Understand. Protect. Restore. — ISIS never diagnoses, predicts, scores or
        labels a medical or mental-health condition.
      </footer>
    </div>
  );
}
