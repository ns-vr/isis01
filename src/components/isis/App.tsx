import { useEffect } from "react";
import { IsisProvider, useIsis } from "@/lib/isis/store";
import { Homepage } from "./Homepage";
import { Login } from "./Login";
import { Onboarding } from "./Onboarding";
import { Dashboard } from "./Dashboard";

function Shell() {
  const { view, setTheme, c } = useIsis();

  // Respect prefers-color-scheme for the initial value; the manual toggle wins after.
  useEffect(() => {
    if (window.matchMedia?.("(prefers-color-scheme: dark)").matches) setTheme("dark");
  }, [setTheme]);

  useEffect(() => {
    document.body.style.background = c.canvas;
  }, [c]);

  return (
    <div style={{ fontFamily: "'Work Sans', system-ui, sans-serif" }}>
      {view === "home" && <Homepage />}
      {view === "login" && <Login />}
      {view === "onboarding" && <Onboarding />}
      {view === "dashboard" && <Dashboard />}
    </div>
  );
}

export function IsisApp() {
  return (
    <IsisProvider>
      <Shell />
    </IsisProvider>
  );
}
