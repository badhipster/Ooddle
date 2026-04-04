"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Shield,
  Zap,
  MessageCircle,
  BarChart3,
  Target,
} from "lucide-react";
import { PILLAR_LIST } from "@/lib/constants";

/* ── Animation Variants ── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function LandingPage() {
  return (
    <div style={{ background: "var(--surface-0)", minHeight: "100vh" }}>
      {/* ── Navbar ── */}
      <nav
        className="glass"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          padding: "16px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "var(--radius-md)",
              background: "linear-gradient(135deg, var(--ooddle-primary), var(--pillar-cognition))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: 18,
            }}
          >
            O
          </div>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 22,
              color: "var(--text-primary)",
            }}
          >
            Ooddle
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link
            href="/login"
            style={{
              padding: "8px 20px",
              borderRadius: "var(--radius-full)",
              color: "var(--text-secondary)",
              fontWeight: 500,
              fontSize: 14,
              textDecoration: "none",
              transition: "color 0.2s",
            }}
          >
            Log in
          </Link>
          <Link
            href="/signup"
            style={{
              padding: "10px 24px",
              borderRadius: "var(--radius-full)",
              background: "linear-gradient(135deg, var(--ooddle-primary), var(--ooddle-primary-dark))",
              color: "white",
              fontWeight: 600,
              fontSize: 14,
              textDecoration: "none",
              boxShadow: "var(--shadow-md), 0 0 20px rgba(16, 185, 129, 0.2)",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
          >
            Start Free
          </Link>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          padding: "120px 24px 80px",
        }}
      >
        {/* Mesh gradient background */}
        <div
          className="gradient-mesh"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
          }}
        />

        {/* Floating orbs */}
        {PILLAR_LIST.map((pillar, i) => (
          <motion.div
            key={pillar.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.12, scale: 1 }}
            transition={{ delay: 0.5 + i * 0.2, duration: 1 }}
            className="animate-float"
            style={{
              position: "absolute",
              width: 200 + i * 40,
              height: 200 + i * 40,
              borderRadius: "50%",
              background: pillar.color,
              filter: "blur(60px)",
              top: `${15 + i * 15}%`,
              left: `${10 + i * 18}%`,
              animationDelay: `${i * 0.5}s`,
              zIndex: 0,
            }}
          />
        ))}

        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          style={{
            position: "relative",
            zIndex: 1,
            textAlign: "center",
            maxWidth: 800,
          }}
        >
          <motion.div
            variants={fadeUp}
            custom={0}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 16px",
              borderRadius: "var(--radius-full)",
              background: "var(--pillar-movement-bg)",
              color: "var(--ooddle-primary-dark)",
              fontSize: 13,
              fontWeight: 600,
              marginBottom: 24,
              border: "1px solid rgba(16, 185, 129, 0.2)",
            }}
          >
            <Sparkles size={14} />
            AI-Powered Wellness Platform
          </motion.div>

          <motion.h1
            variants={fadeUp}
            custom={1}
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(40px, 6vw, 72px)",
              fontWeight: 900,
              lineHeight: 1.1,
              color: "var(--text-primary)",
              marginBottom: 20,
              letterSpacing: "-0.02em",
            }}
          >
            Your Personal{" "}
            <span
              style={{
                background: "linear-gradient(135deg, var(--ooddle-primary), var(--pillar-cognition))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Health Operating
            </span>{" "}
            System
          </motion.h1>

          <motion.p
            variants={fadeUp}
            custom={2}
            style={{
              fontSize: 18,
              color: "var(--text-secondary)",
              maxWidth: 580,
              margin: "0 auto 36px",
              lineHeight: 1.7,
            }}
          >
            Ooddle guides you daily across 5 wellness pillars with AI-powered
            micro-actions. Small steps, massive transformation in 30 days.
          </motion.p>

          <motion.div
            variants={fadeUp}
            custom={3}
            style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}
          >
            <Link
              href="/signup"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "14px 32px",
                borderRadius: "var(--radius-full)",
                background: "linear-gradient(135deg, var(--ooddle-primary), var(--ooddle-primary-dark))",
                color: "white",
                fontWeight: 700,
                fontSize: 16,
                textDecoration: "none",
                boxShadow: "var(--shadow-lg), 0 0 30px rgba(16, 185, 129, 0.3)",
                transition: "transform 0.2s",
              }}
            >
              Start Your Journey <ArrowRight size={18} />
            </Link>
            <Link
              href="#pillars"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "14px 32px",
                borderRadius: "var(--radius-full)",
                background: "var(--surface-1)",
                color: "var(--text-primary)",
                fontWeight: 600,
                fontSize: 16,
                textDecoration: "none",
                border: "1px solid var(--border-light)",
                transition: "background 0.2s",
              }}
            >
              Explore the 5 Pillars
            </Link>
          </motion.div>

          {/* Stats bar */}
          <motion.div
            variants={fadeUp}
            custom={4}
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 40,
              marginTop: 60,
              flexWrap: "wrap",
            }}
          >
            {[
              { value: "5", label: "Health Pillars" },
              { value: "30", label: "Day Protocol" },
              { value: "24/7", label: "AI Guidance" },
            ].map((stat) => (
              <div key={stat.label} style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 32,
                    fontWeight: 800,
                    background: "linear-gradient(135deg, var(--ooddle-primary), var(--pillar-cognition))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {stat.value}
                </div>
                <div style={{ fontSize: 13, color: "var(--text-tertiary)", fontWeight: 500 }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ── 5 Pillars Section ── */}
      <section
        id="pillars"
        style={{
          padding: "100px 24px",
          background: "var(--surface-1)",
        }}
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
          style={{ maxWidth: 1100, margin: "0 auto" }}
        >
          <motion.div variants={fadeUp} custom={0} style={{ textAlign: "center", marginBottom: 60 }}>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(28px, 4vw, 42px)",
                fontWeight: 800,
                color: "var(--text-primary)",
                marginBottom: 16,
              }}
            >
              The 5 Pillars of Wellness
            </h2>
            <p style={{ fontSize: 16, color: "var(--text-secondary)", maxWidth: 500, margin: "0 auto" }}>
              A holistic approach to health, powered by AI that understands your
              unique needs and adapts daily.
            </p>
          </motion.div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 20,
            }}
          >
            {PILLAR_LIST.map((pillar, i) => {
              const Icon = pillar.icon;
              return (
                <motion.div
                  key={pillar.id}
                  variants={fadeUp}
                  custom={i + 1}
                  whileHover={{ y: -6, scale: 1.02 }}
                  style={{
                    background: "var(--surface-0)",
                    borderRadius: "var(--radius-lg)",
                    padding: 28,
                    boxShadow: "var(--shadow-sm)",
                    border: "1px solid var(--border-light)",
                    cursor: "default",
                    transition: "box-shadow 0.3s",
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: "var(--radius-md)",
                      backgroundColor: pillar.bgColor,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 16,
                    }}
                  >
                    <Icon size={24} style={{ color: pillar.color }} />
                  </div>
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 18,
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      marginBottom: 8,
                    }}
                  >
                    {pillar.name}
                  </h3>
                  <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                    {pillar.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* ── Features Section ── */}
      <section style={{ padding: "100px 24px" }}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
          style={{ maxWidth: 1000, margin: "0 auto" }}
        >
          <motion.div variants={fadeUp} custom={0} style={{ textAlign: "center", marginBottom: 60 }}>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(28px, 4vw, 42px)",
                fontWeight: 800,
                color: "var(--text-primary)",
                marginBottom: 16,
              }}
            >
              How Ooddle Works
            </h2>
            <p style={{ fontSize: 16, color: "var(--text-secondary)", maxWidth: 500, margin: "0 auto" }}>
              Simple daily actions, powered by AI, building towards lasting
              transformation.
            </p>
          </motion.div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 24,
            }}
          >
            {[
              {
                icon: Target,
                title: "Daily Micro-Actions",
                desc: "5 personalized actions per day — one per pillar. Simple, doable, science-backed.",
                color: "var(--ooddle-primary)",
                bg: "var(--pillar-movement-bg)",
              },
              {
                icon: MessageCircle,
                title: "AI Wellness Guide",
                desc: "Chat with Ooddle anytime. Get personalized advice, tips, and motivation.",
                color: "var(--pillar-cognition)",
                bg: "var(--pillar-cognition-bg)",
              },
              {
                icon: BarChart3,
                title: "Progress Tracking",
                desc: "Visual progress across all pillars. Streaks, charts, and weekly insights.",
                color: "var(--pillar-metabolic)",
                bg: "var(--pillar-metabolic-bg)",
              },
              {
                icon: Zap,
                title: "30-Day Protocol",
                desc: "Structured day-by-day journey that adapts to your pace and progress.",
                color: "var(--pillar-supplements)",
                bg: "var(--pillar-supplements-bg)",
              },
              {
                icon: Shield,
                title: "Safe & Private",
                desc: "Your health data is encrypted and never shared. No medical claims, just guidance.",
                color: "var(--pillar-recovery)",
                bg: "var(--pillar-recovery-bg)",
              },
              {
                icon: Sparkles,
                title: "Adaptive Intelligence",
                desc: "The more you use Ooddle, the smarter it gets about what works for you.",
                color: "var(--ooddle-primary)",
                bg: "var(--pillar-movement-bg)",
              },
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  variants={fadeUp}
                  custom={i + 1}
                  style={{
                    padding: 28,
                    borderRadius: "var(--radius-lg)",
                    border: "1px solid var(--border-light)",
                    background: "var(--surface-0)",
                    transition: "box-shadow 0.3s",
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: "var(--radius-md)",
                      backgroundColor: feature.bg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 16,
                    }}
                  >
                    <Icon size={22} style={{ color: feature.color }} />
                  </div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 700, marginBottom: 8 }}>
                    {feature.title}
                  </h3>
                  <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                    {feature.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* ── CTA Section ── */}
      <section style={{ padding: "80px 24px 120px" }}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          style={{
            maxWidth: 700,
            margin: "0 auto",
            textAlign: "center",
            padding: "60px 40px",
            borderRadius: "var(--radius-xl)",
            background: "linear-gradient(135deg, rgba(16, 185, 129, 0.06), rgba(59, 130, 246, 0.06))",
            border: "1px solid rgba(16, 185, 129, 0.15)",
          }}
        >
          <motion.h2
            variants={fadeUp}
            custom={0}
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 32,
              fontWeight: 800,
              marginBottom: 16,
            }}
          >
            Ready to transform your health?
          </motion.h2>
          <motion.p
            variants={fadeUp}
            custom={1}
            style={{ fontSize: 16, color: "var(--text-secondary)", marginBottom: 32, maxWidth: 440, margin: "0 auto 32px" }}
          >
            Join thousands who are already using Ooddle to build healthier habits, one micro-action at a time.
          </motion.p>
          <motion.div variants={fadeUp} custom={2}>
            <Link
              href="/signup"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "14px 36px",
                borderRadius: "var(--radius-full)",
                background: "linear-gradient(135deg, var(--ooddle-primary), var(--ooddle-primary-dark))",
                color: "white",
                fontWeight: 700,
                fontSize: 16,
                textDecoration: "none",
                boxShadow: "var(--shadow-lg), 0 0 30px rgba(16, 185, 129, 0.3)",
              }}
            >
              Start Free — No Credit Card <ArrowRight size={18} />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer
        style={{
          padding: "40px 24px",
          borderTop: "1px solid var(--border-light)",
          textAlign: "center",
          color: "var(--text-tertiary)",
          fontSize: 13,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 8 }}>
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: 6,
              background: "linear-gradient(135deg, var(--ooddle-primary), var(--pillar-cognition))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: 12,
            }}
          >
            O
          </div>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 14, color: "var(--text-secondary)" }}>
            Ooddle
          </span>
        </div>
        © {new Date().getFullYear()} Ooddle. Your wellness, your way.
      </footer>
    </div>
  );
}
