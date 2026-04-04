"use client";

import { motion } from "framer-motion";
import { Check, Flame, Trophy, Calendar, TrendingUp } from "lucide-react";
import { useStore } from "@/lib/store";
import { PILLARS, PillarId } from "@/lib/constants";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

export default function DashboardPage() {
  const { state, toggleAction } = useStore();
  const completedCount = state.todayActions.filter((a) => a.completed).length;
  const totalCount = state.todayActions.length;
  const completionPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.08 } } }}>
      {/* Header */}
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
          {greeting()}, {state.user?.name?.split(" ")[0] || "there"} 👋
        </h1>
        <p style={{ fontSize: 15, color: "var(--text-secondary)" }}>
          Here are your 5 micro-actions for today. Small steps, big impact.
        </p>
      </motion.div>

      {/* Stats row */}
      <motion.div
        variants={fadeUp}
        custom={1}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: 14,
          marginBottom: 28,
        }}
      >
        {/* Completion ring */}
        <div
          style={{
            background: "var(--surface-0)",
            borderRadius: "var(--radius-lg)",
            padding: "20px",
            border: "1px solid var(--border-light)",
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div style={{ position: "relative", width: 52, height: 52 }}>
            <svg width={52} height={52} viewBox="0 0 52 52" style={{ transform: "rotate(-90deg)" }}>
              <circle cx="26" cy="26" r="22" fill="none" stroke="var(--border-light)" strokeWidth="4" />
              <circle
                cx="26"
                cy="26"
                r="22"
                fill="none"
                stroke="var(--ooddle-primary)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={`${(completionPercent / 100) * 138.23} 138.23`}
                style={{ transition: "stroke-dasharray 0.5s ease" }}
              />
            </svg>
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                fontWeight: 800,
                color: "var(--ooddle-primary)",
                fontFamily: "var(--font-display)",
              }}
            >
              {completionPercent}%
            </div>
          </div>
          <div>
            <div style={{ fontSize: 13, color: "var(--text-tertiary)", fontWeight: 500 }}>Today</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>
              {completedCount}/{totalCount}
            </div>
          </div>
        </div>

        {/* Streak */}
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
              background: "var(--pillar-metabolic-bg)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Flame size={22} style={{ color: "var(--pillar-metabolic)" }} className={state.streak > 0 ? "animate-fire" : ""} />
          </div>
          <div>
            <div style={{ fontSize: 13, color: "var(--text-tertiary)", fontWeight: 500 }}>Streak</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>
              {state.streak} {state.streak === 1 ? "day" : "days"}
            </div>
          </div>
        </div>

        {/* Total */}
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
              background: "var(--pillar-cognition-bg)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Trophy size={20} style={{ color: "var(--pillar-cognition)" }} />
          </div>
          <div>
            <div style={{ fontSize: 13, color: "var(--text-tertiary)", fontWeight: 500 }}>Total Done</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>
              {state.totalCompleted}
            </div>
          </div>
        </div>

        {/* Day */}
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
              background: "var(--pillar-recovery-bg)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Calendar size={20} style={{ color: "var(--pillar-recovery)" }} />
          </div>
          <div>
            <div style={{ fontSize: 13, color: "var(--text-tertiary)", fontWeight: 500 }}>Protocol</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>
              Day {Math.max(state.weeklyProgress.length, 1)}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Section header */}
      <motion.div
        variants={fadeUp}
        custom={2}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 16,
        }}
      >
        <TrendingUp size={18} style={{ color: "var(--ooddle-primary)" }} />
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 18,
            fontWeight: 700,
            color: "var(--text-primary)",
          }}
        >
          Today&apos;s Micro-Actions
        </h2>
      </motion.div>

      {/* Action cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {state.todayActions.map((action, i) => {
          const pillar = PILLARS[action.pillarId as PillarId];
          const Icon = pillar.icon;
          return (
            <motion.div
              key={action.id}
              variants={fadeUp}
              custom={i + 3}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => toggleAction(action.id)}
              style={{
                background: "var(--surface-0)",
                borderRadius: "var(--radius-lg)",
                padding: "18px 20px",
                border: `1px solid ${action.completed ? pillar.color : "var(--border-light)"}`,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 16,
                transition: "border-color 0.3s, background 0.3s",
                opacity: action.completed ? 0.85 : 1,
              }}
            >
              {/* Pillar icon */}
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "var(--radius-md)",
                  backgroundColor: pillar.bgColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Icon size={20} style={{ color: pillar.color }} />
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 4,
                  }}
                >
                  <span
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      textDecoration: action.completed ? "line-through" : "none",
                      fontFamily: "var(--font-display)",
                    }}
                  >
                    {action.title}
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      padding: "2px 8px",
                      borderRadius: "var(--radius-full)",
                      backgroundColor: pillar.bgColor,
                      color: pillar.darkColor,
                    }}
                  >
                    {pillar.name}
                  </span>
                </div>
                <p
                  style={{
                    fontSize: 13,
                    color: "var(--text-secondary)",
                    lineHeight: 1.5,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {action.description}
                </p>
                <div style={{ display: "flex", gap: 12, marginTop: 6 }}>
                  <span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>⏱ {action.duration}</span>
                  <span style={{ fontSize: 12, color: "var(--text-tertiary)", textTransform: "capitalize" }}>
                    📊 {action.difficulty}
                  </span>
                </div>
              </div>

              {/* Check button */}
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  border: `2px solid ${action.completed ? pillar.color : "var(--border-medium)"}`,
                  background: action.completed ? pillar.color : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  transition: "all 0.3s",
                }}
              >
                {action.completed && <Check size={16} color="white" strokeWidth={3} />}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Completion celebration */}
      {completedCount === totalCount && totalCount > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            marginTop: 28,
            padding: "28px",
            borderRadius: "var(--radius-xl)",
            background: "linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(59, 130, 246, 0.08))",
            border: "1px solid rgba(16, 185, 129, 0.2)",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 36, marginBottom: 12 }}>🎉</div>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 800, marginBottom: 8 }}>
            All actions completed!
          </h3>
          <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>
            Amazing work today! Every micro-action compounds into lasting change. See you tomorrow! 🌟
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
