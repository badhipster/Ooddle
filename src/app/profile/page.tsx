"use client";

import { motion } from "framer-motion";
import { User, Mail, Target, Dumbbell, Apple, Moon, Shield, Bell, Palette } from "lucide-react";
import { useStore } from "@/lib/store";
import {
  ONBOARDING_GOALS,
  FITNESS_LEVELS,
  DIETARY_PREFERENCES,
  SLEEP_PATTERNS,
} from "@/lib/constants";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

export default function ProfilePage() {
  const { state } = useStore();
  const user = state.user;

  const fitnessLabel = FITNESS_LEVELS.find((l) => l.id === user?.fitnessLevel)?.label || "Not set";
  const dietLabel = DIETARY_PREFERENCES.find((p) => p.id === user?.dietaryPreference)?.label || "Not set";
  const sleepLabel = SLEEP_PATTERNS.find((p) => p.id === user?.sleepPattern)?.label || "Not set";

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
          Profile & Settings
        </h1>
        <p style={{ fontSize: 15, color: "var(--text-secondary)" }}>
          Manage your account and wellness preferences.
        </p>
      </motion.div>

      {/* Profile card */}
      <motion.div
        variants={fadeUp}
        custom={1}
        style={{
          background: "var(--surface-0)",
          borderRadius: "var(--radius-lg)",
          padding: "28px",
          border: "1px solid var(--border-light)",
          marginBottom: 20,
          display: "flex",
          alignItems: "center",
          gap: 20,
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "linear-gradient(135deg, var(--ooddle-primary), var(--pillar-cognition))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: 26,
            flexShrink: 0,
          }}
        >
          {user?.name?.charAt(0) || "U"}
        </div>
        <div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 800, marginBottom: 4 }}>
            {user?.name}
          </h2>
          <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--text-secondary)", fontSize: 14 }}>
            <Mail size={14} />
            {user?.email}
          </div>
          <div style={{ fontSize: 12, color: "var(--text-tertiary)", marginTop: 4 }}>
            Member since {new Date(user?.createdAt || "").toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </div>
        </div>
      </motion.div>

      {/* Health profile */}
      <motion.div
        variants={fadeUp}
        custom={2}
        style={{
          background: "var(--surface-0)",
          borderRadius: "var(--radius-lg)",
          padding: "28px",
          border: "1px solid var(--border-light)",
          marginBottom: 20,
        }}
      >
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 17,
            fontWeight: 700,
            marginBottom: 20,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <User size={18} style={{ color: "var(--ooddle-primary)" }} />
          Health Profile
        </h3>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
          <ProfileField
            icon={<Target size={16} style={{ color: "var(--pillar-metabolic)" }} />}
            label="Health Goals"
            value={
              user?.goals && user.goals.length > 0
                ? user.goals
                    .map((g) => ONBOARDING_GOALS.find((og) => og.id === g))
                    .filter(Boolean)
                    .map((g) => `${g!.emoji} ${g!.label}`)
                    .join(", ")
                : "Not set"
            }
          />
          <ProfileField
            icon={<Dumbbell size={16} style={{ color: "var(--pillar-movement)" }} />}
            label="Fitness Level"
            value={fitnessLabel}
          />
          <ProfileField
            icon={<Apple size={16} style={{ color: "var(--ooddle-primary)" }} />}
            label="Diet"
            value={dietLabel}
          />
          <ProfileField
            icon={<Moon size={16} style={{ color: "var(--pillar-recovery)" }} />}
            label="Sleep Pattern"
            value={sleepLabel}
          />
        </div>
      </motion.div>

      {/* Settings */}
      <motion.div
        variants={fadeUp}
        custom={3}
        style={{
          background: "var(--surface-0)",
          borderRadius: "var(--radius-lg)",
          padding: "28px",
          border: "1px solid var(--border-light)",
          marginBottom: 20,
        }}
      >
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 17,
            fontWeight: 700,
            marginBottom: 20,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Bell size={18} style={{ color: "var(--pillar-cognition)" }} />
          Preferences
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <SettingRow label="Push Notifications" description="Daily reminders for micro-actions" />
          <SettingRow label="Weekly Summary Emails" description="Get a weekly progress digest" />
          <SettingRow label="Streak Alerts" description="Alert when your streak is at risk" />
        </div>
      </motion.div>

      {/* App info */}
      <motion.div
        variants={fadeUp}
        custom={4}
        style={{
          background: "var(--surface-0)",
          borderRadius: "var(--radius-lg)",
          padding: "28px",
          border: "1px solid var(--border-light)",
        }}
      >
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 17,
            fontWeight: 700,
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Palette size={18} style={{ color: "var(--pillar-supplements)" }} />
          About Ooddle
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "var(--text-secondary)" }}>
            <span>Version</span>
            <span style={{ fontWeight: 600 }}>1.0.0 MVP</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "var(--text-secondary)" }}>
            <span>AI Engine</span>
            <span style={{ fontWeight: 600 }}>Ooddle AI (Mock)</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "var(--text-secondary)" }}>
            <span>Data Storage</span>
            <span style={{ fontWeight: 600 }}>Local (Browser)</span>
          </div>
        </div>
        <div
          style={{
            marginTop: 16,
            padding: "12px 16px",
            borderRadius: "var(--radius-md)",
            background: "var(--pillar-supplements-bg)",
            border: "1px solid rgba(244, 63, 94, 0.15)",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Shield size={16} style={{ color: "var(--pillar-supplements)", flexShrink: 0 }} />
          <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5 }}>
            Ooddle provides wellness guidance, not medical advice. Always consult a healthcare professional for medical decisions.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ProfileField({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div
      style={{
        padding: "14px 16px",
        borderRadius: "var(--radius-md)",
        background: "var(--surface-1)",
        border: "1px solid var(--border-light)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
        {icon}
        <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          {label}
        </span>
      </div>
      <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>{value}</div>
    </div>
  );
}

function SettingRow({ label, description }: { label: string; description: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>{label}</div>
        <div style={{ fontSize: 12, color: "var(--text-tertiary)" }}>{description}</div>
      </div>
      <div
        style={{
          width: 44,
          height: 24,
          borderRadius: 12,
          background: "var(--ooddle-primary)",
          position: "relative",
          cursor: "pointer",
        }}
      >
        <div
          style={{
            width: 18,
            height: 18,
            borderRadius: "50%",
            background: "white",
            position: "absolute",
            top: 3,
            right: 3,
            boxShadow: "var(--shadow-xs)",
          }}
        />
      </div>
    </div>
  );
}
