import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { palettes, type Palette, type ThemeName } from "./theme";

export type View = "home" | "login" | "onboarding" | "dashboard";
export type Mode = "home" | "understand" | "health" | "wellness" | "express" | "privacy";
export type Category = "Health" | "Learning" | "Mindfulness" | "Movement";

export interface Profile {
  explanationStyle: "simple" | "detailed";
  visual: boolean;
  voice: boolean;
  currentState: "steady" | "overloaded";
  name: string;
}

export interface TrackableItem {
  id: string;
  title: string;
  detail?: string;
  kind: "habit" | "medication" | "appointment" | "action";
  category: Category;
  time?: string; // HH:MM — deterministic app data, never model-generated
  done: boolean;
  streak: number;
  notes: { at: number; text: string }[];
  source: string | null;
  origin: string;
  createdAt: number;
  notify?: boolean;
}

export interface FeedbackEvent {
  interventionType: string;
  context: string;
  outcome: "better" | "same" | "still not great";
  timestamp: number;
}

export const INTERVENTIONS = [
  "movement break",
  "breathing sequence",
  "stretch reminder",
  "short walk",
] as const;
export type Intervention = (typeof INTERVENTIONS)[number];

const baselineScores = (): Record<string, number> =>
  Object.fromEntries(INTERVENTIONS.map((i) => [i, 1])) as Record<string, number>;

export interface CheckIn {
  at: number;
  energy: number;
  overload: number;
}

interface Ctx {
  theme: ThemeName;
  setTheme: (t: ThemeName) => void;
  c: Palette;
  view: View;
  setView: (v: View) => void;
  mode: Mode;
  setMode: (m: Mode) => void;
  profile: Profile;
  setProfile: (p: Partial<Profile>) => void;
  personalizationOn: boolean;
  setPersonalizationOn: (v: boolean) => void;
  items: TrackableItem[];
  addItem: (i: Omit<TrackableItem, "id" | "done" | "streak" | "notes" | "createdAt">) => void;
  updateItem: (id: string, patch: Partial<TrackableItem>) => void;
  removeItem: (id: string) => void;
  toggleDone: (id: string) => { undo: () => void };
  scores: Record<string, number>;
  feedback: FeedbackEvent[];
  recordFeedback: (e: Omit<FeedbackEvent, "timestamp">) => void;
  pickIntervention: () => Intervention;
  forgetPersonalization: () => void;
  clearSession: () => void;
  clearHealth: () => void;
  docs: { name: string; at: number; chars: number }[];
  logDoc: (name: string, chars: number) => void;
  checkIns: CheckIn[];
  addCheckIn: (c: Omit<CheckIn, "at">) => void;
  lastBreak: number;
  markBreak: () => void;
  history: { day: string; Health: number; Learning: number; Mindfulness: number; Movement: number }[];
}

const IsisCtx = createContext<Ctx | null>(null);

const seedHistory = () => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const base = [2, 3, 1, 3, 2, 4, 2];
  return days.map((day, i) => ({
    day,
    Health: base[i],
    Learning: (base[i] + i) % 3,
    Mindfulness: (base[i] + 1) % 4,
    Movement: (i + 2) % 4,
  }));
};

let seq = 0;
const uid = () => `it_${Date.now().toString(36)}_${seq++}`;

export function IsisProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeName>("light");
  const [view, setView] = useState<View>("home");
  const [mode, setMode] = useState<Mode>("home");
  const [personalizationOn, setPersonalizationOn] = useState(true);
  const [profile, setProfileState] = useState<Profile>({
    explanationStyle: "simple",
    visual: true,
    voice: false,
    currentState: "steady",
    name: "Friend",
  });
  const [items, setItems] = useState<TrackableItem[]>([
    {
      id: uid(),
      title: "Drink a glass of water",
      kind: "habit",
      category: "Health",
      time: "09:00",
      done: false,
      streak: 4,
      notes: [],
      source: null,
      origin: "You added this",
      createdAt: Date.now(),
    },
    {
      id: uid(),
      title: "Two minutes of stillness",
      kind: "habit",
      category: "Mindfulness",
      time: "13:30",
      done: false,
      streak: 2,
      notes: [],
      source: null,
      origin: "You added this",
      createdAt: Date.now(),
    },
  ]);
  const [scores, setScores] = useState<Record<string, number>>(baselineScores);
  const [feedback, setFeedback] = useState<FeedbackEvent[]>([]);
  const [docs, setDocs] = useState<{ name: string; at: number; chars: number }[]>([]);
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [lastBreak, setLastBreak] = useState<number>(Date.now() - 95 * 60 * 1000);
  const [history] = useState(seedHistory);

  const setProfile = useCallback(
    (p: Partial<Profile>) => setProfileState((prev) => ({ ...prev, ...p })),
    [],
  );

  const addItem: Ctx["addItem"] = useCallback((i) => {
    setItems((prev) => [
      ...prev,
      { ...i, id: uid(), done: false, streak: 0, notes: [], createdAt: Date.now() },
    ]);
  }, []);

  const updateItem: Ctx["updateItem"] = useCallback((id, patch) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  // Deterministic app logic: completion + streak, with a 5s undo.
  const toggleDone: Ctx["toggleDone"] = useCallback((id) => {
    let prevSnapshot: TrackableItem | undefined;
    setItems((prev) =>
      prev.map((it) => {
        if (it.id !== id) return it;
        prevSnapshot = it;
        return {
          ...it,
          done: !it.done,
          streak: !it.done ? it.streak + 1 : Math.max(0, it.streak - 1),
        };
      }),
    );
    return {
      undo: () =>
        setItems((prev) =>
          prev.map((it) => (it.id === id && prevSnapshot ? prevSnapshot : it)),
        ),
    };
  }, []);

  const recordFeedback: Ctx["recordFeedback"] = useCallback((e) => {
    setFeedback((prev) => [...prev, { ...e, timestamp: Date.now() }]);
    setScores((prev) => {
      const cur = prev[e.interventionType] ?? 1;
      const delta = e.outcome === "better" ? 0.35 : e.outcome === "same" ? 0 : -0.3;
      return { ...prev, [e.interventionType]: Math.max(0.1, +(cur + delta).toFixed(2)) };
    });
  }, []);

  // Selection is weighted by the learned preference scores (never random order).
  const pickIntervention = useCallback((): Intervention => {
    const ranked = [...INTERVENTIONS].sort(
      (a, b) => (scores[b] ?? 1) - (scores[a] ?? 1),
    );
    return ranked[0];
  }, [scores]);

  const forgetPersonalization = useCallback(() => {
    setScores(baselineScores());
    setFeedback([]);
  }, []);

  const clearHealth = useCallback(() => {
    setItems((prev) => prev.filter((i) => i.origin !== "Health document"));
    setDocs([]);
  }, []);

  const clearSession = useCallback(() => {
    setItems([]);
    setDocs([]);
    setCheckIns([]);
    setFeedback([]);
    setScores(baselineScores());
  }, []);

  const logDoc = useCallback((name: string, chars: number) => {
    setDocs((prev) => [...prev, { name, at: Date.now(), chars }]);
  }, []);

  const addCheckIn: Ctx["addCheckIn"] = useCallback((c) => {
    setCheckIns((prev) => [...prev, { ...c, at: Date.now() }]);
  }, []);

  const markBreak = useCallback(() => setLastBreak(Date.now()), []);

  const value = useMemo<Ctx>(
    () => ({
      theme,
      setTheme,
      c: palettes[theme],
      view,
      setView,
      mode,
      setMode,
      profile,
      setProfile,
      personalizationOn,
      setPersonalizationOn,
      items,
      addItem,
      updateItem,
      removeItem,
      toggleDone,
      scores,
      feedback,
      recordFeedback,
      pickIntervention,
      forgetPersonalization,
      clearSession,
      clearHealth,
      docs,
      logDoc,
      checkIns,
      addCheckIn,
      lastBreak,
      markBreak,
      history,
    }),
    [
      theme, view, mode, profile, personalizationOn, items, scores, feedback, docs,
      checkIns, lastBreak, history, setProfile, addItem, updateItem, removeItem,
      toggleDone, recordFeedback, pickIntervention, forgetPersonalization,
      clearSession, clearHealth, logDoc, addCheckIn, markBreak,
    ],
  );

  return <IsisCtx.Provider value={value}>{children}</IsisCtx.Provider>;
}

export function useIsis() {
  const ctx = useContext(IsisCtx);
  if (!ctx) throw new Error("useIsis must be used inside IsisProvider");
  return ctx;
}

export function speak(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
}
