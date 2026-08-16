import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useIsis } from "@/lib/isis/store";
import { alpha } from "@/lib/isis/theme";
import { QUOTES } from "@/lib/isis/sample";
import { reflectionQuestion } from "@/lib/isis/ai.functions";
import { Brush, Btn, Display, Eyebrow, TornCard, WhyThis } from "../ui";
import { DailyGoals, CATEGORY_COLORS } from "../DailyGoals";
import { Award } from "lucide-react";

export function DashboardHome({ onReset }: { onReset: (ctx: string) => void }) {
  const { c, items, profile, lastBreak, feedback, history, toggleDone } = useIsis();
  const cat = CATEGORY_COLORS(c);
  const [reflection, setReflection] = useState<string | null>(null);
  const [quote] = useState(() => QUOTES[Math.floor(Math.random() * QUOTES.length)]!);

  const minsSinceBreak = Math.round((Date.now() - lastBreak) / 60000);

  // Deterministic app logic: priority scoring, ordering, cap at 3.
  const brief = useMemo(() => {
    const now = new Date();
    const mins = now.getHours() * 60 + now.getMinutes();
    const scored = items
      .filter((i) => !i.done)
      .map((i) => {
        const [h, m] = (i.time ?? "23:59").split(":").map(Number);
        const due = (h ?? 23) * 60 + (m ?? 59);
        const overdue = mins - due;
        const weight =
          (i.kind === "medication" ? 60 : i.kind === "appointment" ? 40 : 20) +
          (overdue > 0 ? Math.min(overdue, 120) : -Math.min(-overdue, 120) / 4);
        return { item: i, overdue, weight, due };
      })
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 3);
    return scored;
  }, [items]);

  const badges = [
    { name: "First reset", earned: feedback.length > 0, color: c.teal },
    { name: "5-day streak", earned: items.some((i) => i.streak >= 5), color: c.marigold },
    { name: "Category explorer", earned: new Set(items.map((i) => i.category)).size >= 3, color: c.violet },
    { name: "Vault started", earned: items.some((i) => i.origin === "Health document"), color: c.rose },
  ];

  const askReflection = async () => {
    const done = items.filter((i) => i.done).map((i) => i.title);
    try {
      const r = await reflectionQuestion({ data: { habits: done } });
      setReflection(r.text);
    } catch {
      setReflection("What felt easiest about today, and what got in the way?");
    }
  };

  return (
    <div style={{ display: "grid", gap: 24 }}>
      {profile.currentState === "overloaded" && (
        <div style={{ background: alpha(c.teal, 0.15), borderLeft: `3px solid ${c.teal}`, padding: "0.9rem 1rem", display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ color: c.ink, fontSize: "0.92rem" }}>You said you're feeling overloaded. Want a short reset first?</span>
          <Btn small accent={c.teal} onClick={() => onReset("user reported feeling overloaded")}>
            Take a reset
          </Btn>
        </div>
      )}

      <TornCard accent={c.poppy}>
        <Eyebrow>Today's brief</Eyebrow>
        <Display size="1.8rem">Three things, in order</Display>
        <Brush color={c.poppy} />
        {brief.length === 0 && <p style={{ color: c.inkSoft }}>Nothing outstanding. Add a habit or upload a health document.</p>}
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 12 }}>
          {brief.map(({ item, overdue, weight }, idx) => (
            <li key={item.id} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "0.75rem", background: alpha(cat[item.category], 0.08) }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", color: c.poppy, fontSize: "0.8rem" }}>
                {idx + 1}
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ color: c.ink, fontSize: "1rem" }}>{item.title}</div>
                <div style={{ fontSize: "0.75rem", color: c.inkSoft, fontFamily: "'JetBrains Mono', monospace" }}>
                  {overdue > 0 ? `overdue by ${overdue} min` : `in ${Math.abs(overdue)} min`} · {item.kind}
                </div>
                <div style={{ marginTop: 4 }}>
                  <WhyThis
                    reason={`Deterministic priority: kind=${item.kind}, scheduled ${item.time ?? "anytime"}, ${overdue > 0 ? `overdue ${overdue}m` : `${-overdue}m away`} → score ${weight.toFixed(0)}. Ordering is computed by app logic, not the model.`}
                  />
                </div>
              </div>
              <Btn small variant="ghost" accent={c.sage} onClick={() => toggleDone(item.id)}>
                Done
              </Btn>
            </li>
          ))}
        </ul>
        {minsSinceBreak > 60 && (
          <div style={{ marginTop: 14, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ color: c.inkSoft, fontSize: "0.85rem" }}>
              It's been {minsSinceBreak} minutes since your last break.
            </span>
            <Btn small accent={c.teal} onClick={() => onReset(`no break for ${minsSinceBreak} minutes`)}>
              2-minute reset
            </Btn>
            <WhyThis reason={`Computed from app state: last break at ${new Date(lastBreak).toLocaleTimeString()}, ${minsSinceBreak} minutes elapsed. No physiological sensing is used.`} />
          </div>
        )}
      </TornCard>

      <DailyGoals onAllDone={askReflection} />

      {reflection && (
        <TornCard accent={c.violet}>
          <Eyebrow color={c.violet}>Daily reflection</Eyebrow>
          <Display size="1.4rem">{reflection}</Display>
          <textarea
            placeholder="Write a line or two…"
            style={{ width: "100%", minHeight: 80, background: c.canvasAlt, border: `1.5px solid ${c.line}`, color: c.ink, padding: "0.6rem" }}
          />
          <Btn small variant="ghost" accent={c.inkSoft} onClick={() => setReflection(null)}>
            Close
          </Btn>
        </TornCard>
      )}

      <TornCard accent={c.teal}>
        <Eyebrow color={c.teal}>Last 7 days</Eyebrow>
        <Display size="1.4rem">Completion by category</Display>
        <div style={{ height: 240, marginTop: 12 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={history}>
              <CartesianGrid strokeDasharray="3 3" stroke={c.line} />
              <XAxis dataKey="day" stroke={c.inkSoft} fontSize={12} />
              <YAxis stroke={c.inkSoft} fontSize={12} allowDecimals={false} />
              <Tooltip contentStyle={{ background: c.paper, border: `1px solid ${c.line}`, color: c.ink }} />
              <Legend wrapperStyle={{ fontSize: 12, color: c.inkSoft }} />
              <Bar dataKey="Health" fill={c.rose} />
              <Bar dataKey="Learning" fill={c.violet} />
              <Bar dataKey="Mindfulness" fill={c.teal} />
              <Bar dataKey="Movement" fill={c.marigold} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p style={{ fontStyle: "italic", color: c.inkSoft, fontSize: "0.88rem", textAlign: "center" }}>“{quote}”</p>
      </TornCard>

      <TornCard accent={c.marigold}>
        <Eyebrow color={c.marigold}>Badges</Eyebrow>
        <Display size="1.4rem">Earned along the way</Display>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 10 }}>
          {badges.map((b) => (
            <div
              key={b.name}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "0.5rem 0.85rem",
                border: `1.5px solid ${b.earned ? b.color : c.line}`,
                color: b.earned ? b.color : c.inkSoft,
                opacity: b.earned ? 1 : 0.55,
                borderRadius: 999,
                fontSize: "0.83rem",
              }}
            >
              <Award size={15} /> {b.name}
            </div>
          ))}
        </div>
      </TornCard>

      <TornCard accent={c.rose}>
        <Eyebrow color={c.rose}>Health Vault</Eyebrow>
        <Display size="1.4rem">
          {items.filter((i) => i.origin === "Health document").length} items from your documents
        </Display>
        <ul style={{ color: c.inkSoft, fontSize: "0.88rem", paddingLeft: 18 }}>
          {items
            .filter((i) => i.origin === "Health document")
            .slice(0, 4)
            .map((i) => (
              <li key={i.id}>{i.title}</li>
            ))}
          {items.filter((i) => i.origin === "Health document").length === 0 && (
            <li>Nothing yet — upload an instruction sheet in Health mode.</li>
          )}
        </ul>
      </TornCard>
    </div>
  );
}
