import { useEffect, useState } from "react";
import { useIsis, type Mode, type Intervention } from "@/lib/isis/store";
import { alpha } from "@/lib/isis/theme";
import { Btn } from "./ui";
import { ResetModal } from "./ResetModal";
import { DashboardHome } from "./views/DashboardHome";
import { DocumentFlow } from "./views/DocumentFlow";
import { Wellness } from "./views/Wellness";
import { Express } from "./views/Express";
import { Privacy } from "./views/Privacy";
import { BookOpen, Home, HeartPulse, Leaf, MessageCircle, Moon, ShieldCheck, Sun } from "lucide-react";

const NAV: { id: Mode; label: string; Icon: typeof Home }[] = [
  { id: "home", label: "Home", Icon: Home },
  { id: "understand", label: "Understand", Icon: BookOpen },
  { id: "health", label: "Health", Icon: HeartPulse },
  { id: "wellness", label: "Wellness", Icon: Leaf },
  { id: "express", label: "Express", Icon: MessageCircle },
  { id: "privacy", label: "Privacy Center", Icon: ShieldCheck },
];

export function Dashboard() {
  const { c, mode, setMode, setView, theme, setTheme, pickIntervention } = useIsis();
  const [reset, setReset] = useState<{ open: boolean; ctx: string; type: Intervention }>({
    open: false,
    ctx: "",
    type: "breathing sequence",
  });
  const [palette, setPalette] = useState(false);

  const openReset = (ctx: string) => setReset({ open: true, ctx, type: pickIntervention() });

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPalette((p) => !p);
      }
      if (e.key === "Escape") setPalette(false);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  return (
    <div style={{ background: c.canvas, minHeight: "100vh", display: "flex", color: c.ink }}>
      <aside
        style={{
          width: 232,
          flexShrink: 0,
          background: c.canvasAlt,
          padding: "1.4rem 1rem",
          borderRight: `1px solid ${c.line}`,
          position: "sticky",
          top: 0,
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        <button
          onClick={() => setView("home")}
          style={{ background: "none", border: "none", textAlign: "left", cursor: "pointer", fontFamily: "'Fraunces', serif", fontSize: "1.4rem", color: c.ink, marginBottom: 12 }}
        >
          ISIS
        </button>
        {NAV.map((n) => (
          <button
            key={n.id}
            onClick={() => setMode(n.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "0.55rem 0.7rem",
              background: mode === n.id ? alpha(c.poppy, 0.14) : "transparent",
              color: mode === n.id ? c.poppy : c.inkSoft,
              border: "none",
              cursor: "pointer",
              fontSize: "0.92rem",
              textAlign: "left",
              borderRadius: 8,
            }}
          >
            <n.Icon size={16} /> {n.label}
          </button>
        ))}
        <div style={{ marginTop: "auto", display: "grid", gap: 8 }}>
          <Btn small accent={c.teal} onClick={() => openReset("user asked for a reset")}>
            Take a reset
          </Btn>
          <Btn small variant="ghost" accent={c.marigold} onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
            <span style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>
              {theme === "light" ? <Sun size={13} /> : <Moon size={13} />} {theme === "light" ? "Light" : "Dark"}
            </span>
          </Btn>
          <span style={{ fontSize: "0.7rem", color: c.inkSoft, fontFamily: "'JetBrains Mono', monospace" }}>Ctrl+K for actions</span>
        </div>
      </aside>

      <main style={{ flex: 1, padding: "clamp(1rem, 3vw, 2.5rem)", maxWidth: 980 }}>
        {mode === "home" && <DashboardHome onReset={openReset} />}
        {mode === "understand" && <DocumentFlow general />}
        {mode === "health" && <DocumentFlow />}
        {mode === "wellness" && <Wellness onReset={openReset} />}
        {mode === "express" && <Express />}
        {mode === "privacy" && <Privacy />}
      </main>

      {palette && (
        <div
          onClick={() => setPalette(false)}
          style={{ position: "fixed", inset: 0, background: alpha("#000000", 0.5), zIndex: 70, display: "flex", justifyContent: "center", paddingTop: "12vh" }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ background: c.paper, width: "min(460px, 92vw)", height: "fit-content", padding: "0.6rem", boxShadow: c.shadow(c.violet) }}
          >
            {NAV.map((n) => (
              <button
                key={n.id}
                onClick={() => {
                  setMode(n.id);
                  setPalette(false);
                }}
                style={{ display: "block", width: "100%", textAlign: "left", padding: "0.6rem 0.8rem", background: "none", border: "none", color: c.ink, cursor: "pointer", fontSize: "0.92rem" }}
              >
                Go to {n.label}
              </button>
            ))}
            <button
              onClick={() => {
                setPalette(false);
                openReset("opened from the command palette");
              }}
              style={{ display: "block", width: "100%", textAlign: "left", padding: "0.6rem 0.8rem", background: "none", border: "none", color: c.teal, cursor: "pointer", fontSize: "0.92rem" }}
            >
              Start a wellness reset
            </button>
          </div>
        </div>
      )}

      <ResetModal
        open={reset.open}
        intervention={reset.type}
        context={reset.ctx}
        onClose={() => setReset((r) => ({ ...r, open: false }))}
      />
    </div>
  );
}
