"use client";

import { motion } from "framer-motion";
import { TrendingUp, Flame, Calendar, BarChart3 } from "lucide-react";
import { useStore } from "@/lib/store";
import { PILLARS, PILLAR_LIST, PillarId } from "@/lib/constants";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

export default function ProgressPage() {
  const { state } = useStore();

  // Calculate pillar-level completion rates
  const pillarStats = PILLAR_LIST.map((pillar) => {
    const total = state.weeklyProgress.reduce((sum, day) => {
      return sum + day.actions.filter((a) => a.pillarId === pillar.id).length;
    }, 0);
    const completed = state.weeklyProgress.reduce((sum, day) => {
      return sum + day.actions.filter((a) => a.pillarId === pillar.id && a.completed).length;
    }, 0);
    return {
      ...pillar,
      total,
      completed,
      rate: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  });

  // Last 7 days for chart
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split("T")[0];
    const dayData = state.weeklyProgress.find((p) => p.date === dateStr);
    return {
      date: d.toLocaleDateString("en-US", { weekday: "short" }),
      completed: dayData?.completedCount ?? 0,
      total: 5,
    };
  });

  const maxBar = 5;

  return (
    <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.08 } } }}>
      <motion.div variants={fadeUp} custom={0} style={{ marginBottom: 28 }}>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(24px, 3vw, 32px)",
            fontWeight: 800,
            color: "var(--text-primary)",
            marginBottom: 4,
          }}
        >
          Your Progress 📊
        </h1>
        <p style={{ fontSize: 15, color: "var(--text-secondary)" }}>
          Track your wellness journey across all 5 pillars.
        </p>
      </motion.div>

      {/* Overview stats */}
      <motion.div
        variants={fadeUp}
        custom={1}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: 14,
          marginBottom: 28,
        }}
      >
        <StatCard
          icon={<TrendingUp size={20} style={{ color: "var(--ooddle-primary)" }} />}
          bg="var(--pillar-movement-bg)"
          label="Total Completed"
          value={state.totalCompleted.toString()}
        />
        <StatCard
          icon={<Flame size={20} style={{ color: "var(--pillar-metabolic)" }} className={state.streak > 0 ? "animate-fire" : ""} />}
          bg="var(--pillar-metabolic-bg)"
          label="Current Streak"
          value={`${state.streak} days`}
        />
        <StatCard
          icon={<Calendar size={20} style={{ color: "var(--pillar-recovery)" }} />}
          bg="var(--pillar-recovery-bg)"
          label="Days Active"
          value={state.weeklyProgress.length.toString()}
        />
        <StatCard
          icon={<BarChart3 size={20} style={{ color: "var(--pillar-cognition)" }} />}
          bg="var(--pillar-cognition-bg)"
          label="Completion Rate"
          value={`${state.weeklyProgress.length > 0 ? Math.round((state.totalCompleted / (state.weeklyProgress.length * 5)) * 100) : 0}%`}
        />
      </motion.div>

      {/* Weekly bar chart */}
      <motion.div
        variants={fadeUp}
        custom={2}
        style={{
          background: "var(--surface-0)",
          borderRadius: "var(--radius-lg)",
          padding: "24px",
          border: "1px solid var(--border-light)",
          marginBottom: 24,
        }}
      >
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 700, marginBottom: 20 }}>
          Last 7 Days
        </h2>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 140 }}>
          {last7.map((day, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--ooddle-primary)" }}>
                {day.completed > 0 ? day.completed : ""}
              </div>
              <div
                style={{
                  width: "100%",
                  maxWidth: 36,
                  height: `${(day.completed / maxBar) * 100}px`,
                  minHeight: day.completed > 0 ? 8 : 4,
                  borderRadius: "var(--radius-sm)",
                  background:
                    day.completed === 5
                      ? "linear-gradient(to top, var(--ooddle-primary), var(--ooddle-primary-light))"
                      : day.completed > 0
                        ? "var(--ooddle-primary)"
                        : "var(--border-light)",
                  transition: "height 0.5s ease",
                  opacity: day.completed > 0 ? 1 : 0.4,
                }}
              />
              <div style={{ fontSize: 11, color: "var(--text-tertiary)", fontWeight: 500 }}>{day.date}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Pillar breakdown */}
      <motion.div
        variants={fadeUp}
        custom={3}
        style={{
          background: "var(--surface-0)",
          borderRadius: "var(--radius-lg)",
          padding: "24px",
          border: "1px solid var(--border-light)",
        }}
      >
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 700, marginBottom: 20 }}>
          Pillar Breakdown
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {pillarStats.map((ps) => {
            const Icon = PILLARS[ps.id as PillarId].icon;
            return (
              <div key={ps.id} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: "var(--radius-md)",
                    backgroundColor: ps.bgColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon size={18} style={{ color: ps.color }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>{ps.name}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: ps.color }}>
                      {ps.rate}%
                    </span>
                  </div>
                  <div style={{ height: 6, borderRadius: 3, background: "var(--surface-2)", overflow: "hidden" }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${ps.rate}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      style={{
                        height: "100%",
                        borderRadius: 3,
                        background: ps.color,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {state.weeklyProgress.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📈</div>
            <p style={{ fontSize: 14, color: "var(--text-tertiary)" }}>
              Complete your first micro-actions to see your progress here!
            </p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

function StatCard({
  icon,
  bg,
  label,
  value,
}: {
  icon: React.ReactNode;
  bg: string;
  label: string;
  value: string;
}) {
  return (
    <div
      style={{
        background: "var(--surface-0)",
        borderRadius: "var(--radius-lg)",
        padding: "20px",
        border: "1px solid var(--border-light)",
        display: "flex",
        alignItems: "center",
        gap: 14,
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: "var(--radius-md)",
          backgroundColor: bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 12, color: "var(--text-tertiary)", fontWeight: 500 }}>{label}</div>
        <div style={{ fontSize: 18, fontWeight: 800, fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
          {value}
        </div>
      </div>
    </div>
  );
}
