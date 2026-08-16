import { useState } from "react";
import { useIsis, type Category } from "@/lib/isis/store";
import { alpha } from "@/lib/isis/theme";
import { Btn, Confetti, Display, Eyebrow, Brush, TornCard, WhyThis } from "./ui";
import { Bell, Check, Download, Trash2 } from "lucide-react";

export const CATEGORY_COLORS = (c: ReturnType<typeof useIsis>["c"]): Record<Category, string> => ({
  Health: c.rose,
  Learning: c.violet,
  Mindfulness: c.teal,
  Movement: c.marigold,
});

export function DailyGoals({ onAllDone }: { onAllDone: () => void }) {
  const { c, items, addItem, toggleDone, updateItem, removeItem } = useIsis();
  const cat = CATEGORY_COLORS(c);
  const habits = items.filter((i) => i.kind === "habit" || i.kind === "action");
  const doneCount = habits.filter((h) => h.done).length;
  const pct = habits.length ? Math.round((doneCount / habits.length) * 100) : 0;
  const bestStreak = habits.reduce((m, h) => Math.max(m, h.streak), 0);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Category>("Health");
  const [time, setTime] = useState("08:00");
  const [confetti, setConfetti] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [undo, setUndo] = useState<null | { undo: () => void; label: string }>(null);

  const complete = (id: string, wasDone: boolean, streak: number) => {
    const { undo: revert } = toggleDone(id);
    if (!wasDone) {
      if ((streak + 1) % 5 === 0) {
        setConfetti(true);
        setTimeout(() => setConfetti(false), 2200);
      }
      const remaining = habits.filter((h) => !h.done && h.id !== id).length;
      if (remaining === 0) onAllDone();
    }
    setUndo({ undo: revert, label: wasDone ? "Marked not done" : "Nice — marked done" });
    setTimeout(() => setUndo(null), 5000);
  };

  const exportCsv = () => {
    const rows = [
      ["title", "category", "time", "done", "streak", "notes"],
      ...habits.map((h) => [
        h.title,
        h.category,
        h.time ?? "",
        String(h.done),
        String(h.streak),
        h.notes.map((n) => n.text).join(" / "),
      ]),
    ];
    const csv = rows.map((r) => r.map((v) => `"${v.replace(/"/g, '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "isis-weekly-habits.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const requestNotify = async (id: string, time?: string) => {
    if (typeof Notification === "undefined") return;
    const perm = await Notification.requestPermission();
    if (perm === "granted") {
      updateItem(id, { notify: true });
      new Notification("ISIS reminder set", { body: `We'll nudge you at ${time ?? "the set time"}.` });
    }
  };

  const field = {
    padding: "0.5rem 0.65rem",
    background: c.canvasAlt,
    border: `1.5px solid ${c.line}`,
    color: c.ink,
    fontSize: "0.88rem",
  } as const;

  return (
    <TornCard accent={c.marigold}>
      <Confetti show={confetti} />
      <Eyebrow color={c.marigold}>Daily goals</Eyebrow>
      <Display size="1.6rem">Small habits, kept</Display>
      <Brush color={c.marigold} />

      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1.5rem", color: c.marigold }}>
          🔥 {bestStreak}
        </span>
        <span style={{ color: c.inkSoft, fontSize: "0.85rem" }}>best streak · {doneCount}/{habits.length} today</span>
        <WhyThis reason={`Streak = consecutive completions counted by app logic. Today: ${doneCount} of ${habits.length} complete (${pct}%).`} />
      </div>
      <div style={{ height: 10, background: alpha(c.marigold, 0.18), marginTop: 10, borderRadius: 999 }}>
        <div style={{ width: `${pct}%`, height: "100%", background: c.marigold, borderRadius: 999, transition: "width .4s ease" }} />
      </div>

      {/* 7-day consistency strip */}
      <div style={{ display: "flex", gap: 6, marginTop: 14 }}>
        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
          <div
            key={i}
            title={`Day ${i + 1}`}
            style={{
              flex: 1,
              textAlign: "center",
              padding: "6px 0",
              fontSize: "0.7rem",
              fontFamily: "'JetBrains Mono', monospace",
              color: i <= bestStreak ? c.paper : c.inkSoft,
              background: i <= bestStreak ? c.sage : alpha(c.inkSoft, 0.12),
            }}
          >
            {d}
          </div>
        ))}
      </div>

      <ul style={{ listStyle: "none", padding: 0, margin: "1.2rem 0 0", display: "grid", gap: 10 }}>
        {habits.map((h) => (
          <li
            key={h.id}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
              padding: "0.7rem 0.8rem",
              background: alpha(cat[h.category], 0.09),
              borderLeft: `3px solid ${cat[h.category]}`,
            }}
          >
            <button
              onClick={() => complete(h.id, h.done, h.streak)}
              aria-label="Toggle complete"
              style={{
                width: 26,
                height: 26,
                flexShrink: 0,
                borderRadius: 8,
                border: `1.5px solid ${cat[h.category]}`,
                background: h.done ? cat[h.category] : "transparent",
                color: c.paper,
                cursor: "pointer",
                display: "grid",
                placeItems: "center",
                transition: "transform .15s ease",
              }}
              onMouseDown={(e) => (e.currentTarget.style.transform = "scale(1.18)")}
              onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              {h.done && <Check size={15} />}
            </button>
            <div style={{ flex: 1 }}>
              <div style={{ color: c.ink, textDecoration: h.done ? "line-through" : "none", fontSize: "0.95rem" }}>
                {h.title}
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginTop: 4 }}>
                <span style={{ fontSize: "0.68rem", color: cat[h.category], border: `1px solid ${cat[h.category]}`, padding: "1px 7px", borderRadius: 999 }}>
                  {h.category}
                </span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem", color: c.inkSoft }}>
                  {h.time ?? "anytime"} · streak {h.streak}
                </span>
                <button onClick={() => requestNotify(h.id, h.time)} title="Remind me" style={{ background: "none", border: "none", cursor: "pointer", color: h.notify ? c.marigold : c.inkSoft }}>
                  <Bell size={13} />
                </button>
                <button onClick={() => removeItem(h.id)} title="Remove" style={{ background: "none", border: "none", cursor: "pointer", color: c.inkSoft }}>
                  <Trash2 size={13} />
                </button>
              </div>
              <input
                placeholder="Quick note…"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.currentTarget.value.trim()) {
                    updateItem(h.id, { notes: [...h.notes, { at: Date.now(), text: e.currentTarget.value.trim() }] });
                    e.currentTarget.value = "";
                  }
                }}
                style={{ ...field, marginTop: 6, width: "100%" }}
              />
              {showNotes && h.notes.length > 0 && (
                <ul style={{ margin: "6px 0 0", paddingLeft: 16, color: c.inkSoft, fontSize: "0.78rem" }}>
                  {h.notes.map((n) => (
                    <li key={n.at}>{new Date(n.at).toLocaleTimeString()} — {n.text}</li>
                  ))}
                </ul>
              )}
            </div>
          </li>
        ))}
      </ul>

      {undo && (
        <div style={{ marginTop: 10, display: "flex", gap: 10, alignItems: "center", fontSize: "0.82rem", color: c.inkSoft }}>
          {undo.label}
          <Btn small variant="ghost" accent={c.poppy} onClick={() => { undo.undo(); setUndo(null); }}>
            Undo
          </Btn>
        </div>
      )}

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: "1.2rem" }}>
        <input style={{ ...field, flex: 1, minWidth: 140 }} placeholder="New habit" value={title} onChange={(e) => setTitle(e.target.value)} />
        <select style={field} value={category} onChange={(e) => setCategory(e.target.value as Category)}>
          {(["Health", "Learning", "Mindfulness", "Movement"] as Category[]).map((k) => (
            <option key={k}>{k}</option>
          ))}
        </select>
        <input style={field} type="time" value={time} onChange={(e) => setTime(e.target.value)} />
        <Btn
          small
          accent={c.marigold}
          onClick={() => {
            if (!title.trim()) return;
            addItem({ title: title.trim(), kind: "habit", category, time, source: null, origin: "You added this" });
            setTitle("");
          }}
        >
          Add
        </Btn>
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
        <Btn small variant="ghost" accent={c.inkSoft} onClick={() => setShowNotes((s) => !s)}>
          {showNotes ? "Hide" : "Show"} past notes
        </Btn>
        <Btn small variant="ghost" accent={c.sage} onClick={exportCsv}>
          <span style={{ display: "inline-flex", gap: 5, alignItems: "center" }}>
            <Download size={13} /> Export CSV
          </span>
        </Btn>
      </div>

      <div style={{ marginTop: 14, padding: "0.7rem 0.9rem", background: alpha(c.teal, 0.1), fontSize: "0.83rem", color: c.ink }}>
        <strong>Challenge:</strong> keep any Health habit 7 days in a row — {Math.max(0, 7 - bestStreak)} to go.
      </div>
    </TornCard>
  );
}
