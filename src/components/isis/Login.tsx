import { useState } from "react";
import { useIsis } from "@/lib/isis/store";
import { Brush, Btn, Display, Eyebrow, TornCard } from "./ui";

export function Login() {
  const { c, setView } = useIsis();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");

  const field = {
    width: "100%",
    padding: "0.65rem 0.8rem",
    background: c.canvasAlt,
    border: `1.5px solid ${c.line}`,
    color: c.ink,
    fontFamily: "'Work Sans', sans-serif",
    fontSize: "0.95rem",
    marginBottom: "0.75rem",
  } as const;

  return (
    <div
      style={{
        background: c.canvas,
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "1.5rem",
      }}
    >
      <TornCard accent={c.poppy} style={{ maxWidth: 420, width: "100%" }}>
        <Eyebrow>Welcome back</Eyebrow>
        <Display size="2rem">Sign in to ISIS</Display>
        <Brush color={c.poppy} />
        <input style={field} placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input style={field} type="password" placeholder="Password" value={pw} onChange={(e) => setPw(e.target.value)} />
        <Btn accent={c.poppy} onClick={() => setView("onboarding")} style={{ width: "100%" }}>
          Continue
        </Btn>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14 }}>
          <button
            onClick={() => setView("onboarding")}
            style={{ background: "none", border: "none", color: c.inkSoft, fontSize: "0.82rem", cursor: "pointer", textDecoration: "underline" }}
          >
            Skip sign-in
          </button>
          <button
            onClick={() => setView("home")}
            style={{ background: "none", border: "none", color: c.inkSoft, fontSize: "0.82rem", cursor: "pointer" }}
          >
            Back home
          </button>
        </div>
      </TornCard>
    </div>
  );
}
