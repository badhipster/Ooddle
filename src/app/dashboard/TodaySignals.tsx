"use client";

/**
 * Today's manual signals panel. PRD Story 3.2.
 *
 * Surfaces the most recent value per signal type with a freshness
 * badge. Stale signals are shown with a muted state so users know the
 * recommendation engine is not relying on them.
 */

import { useStore, HealthSignal, HealthSignalType } from "@/lib/store";
import { computeFreshness, FreshnessStatus } from "@/lib/evidence";

const LABELS: Record<HealthSignalType, { label: string; emoji: string; unit?: string }> = {
  steps: { label: "Steps", emoji: "👟", unit: "steps" },
  sleep_duration: { label: "Sleep", emoji: "🌙", unit: "h" },
  bedtime: { label: "Bedtime", emoji: "🛌" },
  wake_time: { label: "Wake", emoji: "🌅" },
  mood: { label: "Mood", emoji: "🙂", unit: "/5" },
  energy: { label: "Energy", emoji: "⚡", unit: "/5" },
  water_glasses: { label: "Water", emoji: "💧", unit: "glasses" },
  protein_servings: { label: "Protein", emoji: "🥚", unit: "servings" },
};

function freshnessStyle(f: FreshnessStatus) {
  if (f === "fresh") return { color: "rgba(6, 95, 70, 1)", bg: "rgba(16, 185, 129, 0.12)", label: "fresh" };
  if (f === "aging") return { color: "rgba(120, 53, 15, 1)", bg: "rgba(245, 158, 11, 0.12)", label: "aging" };
  if (f === "stale") return { color: "var(--text-tertiary)", bg: "var(--surface-1, rgba(0,0,0,0.04))", label: "stale" };
  return { color: "var(--text-tertiary)", bg: "transparent", label: "missing" };
}

/** Keep only the most recent signal per type. */
function latestByType(signals: HealthSignal[]): HealthSignal[] {
  const byType = new Map<HealthSignalType, HealthSignal>();
  for (const s of signals) {
    const existing = byType.get(s.type);
    if (!existing || s.observedAt > existing.observedAt) {
      byType.set(s.type, s);
    }
  }
  return Array.from(byType.values()).sort((a, b) => (a.observedAt > b.observedAt ? -1 : 1));
}

export function TodaySignals() {
  const { state } = useStore();
  const signals = latestByType(state.healthSignals || []);

  if (signals.length === 0) {
    return (
      <div
        style={{
          padding: "14px 16px",
          borderRadius: "var(--radius-lg)",
          background: "var(--surface-0)",
          border: "1px dashed var(--border-light)",
          fontSize: 13,
          color: "var(--text-tertiary)",
        }}
      >
        No signals logged yet. Log steps, sleep, mood, or protein to make today&apos;s plan more specific.
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "14px 16px",
        borderRadius: "var(--radius-lg)",
        background: "var(--surface-0)",
        border: "1px solid var(--border-light)",
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: "var(--text-tertiary)",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          marginBottom: 10,
        }}
      >
        Today&apos;s signals
      </div>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexWrap: "wrap", gap: 8 }}>
        {signals.map((s) => {
          const meta = LABELS[s.type];
          const freshness = computeFreshness(s.observedAt);
          const fs = freshnessStyle(freshness);
          const muted = freshness === "stale" || freshness === "missing";
          return (
            <li
              key={s.id}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 10px",
                borderRadius: "var(--radius-full)",
                background: "var(--surface-1, rgba(0,0,0,0.03))",
                border: "1px solid var(--border-light)",
                opacity: muted ? 0.7 : 1,
              }}
              title={`Observed ${new Date(s.observedAt).toLocaleString()} (${freshness})`}
            >
              <span style={{ fontSize: 14 }}>{meta.emoji}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>
                {meta.label}: {String(s.value)}{meta.unit ? ` ${meta.unit}` : ""}
              </span>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  padding: "2px 6px",
                  borderRadius: "var(--radius-full)",
                  background: fs.bg,
                  color: fs.color,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                {fs.label}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
