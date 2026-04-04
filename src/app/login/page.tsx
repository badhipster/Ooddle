"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { useStore } from "@/lib/store";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    login("User", email);
    router.push("/dashboard");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div className="gradient-mesh" style={{ position: "absolute", inset: 0, zIndex: 0 }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 440,
          background: "var(--surface-0)",
          borderRadius: "var(--radius-xl)",
          padding: "40px 36px",
          boxShadow: "var(--shadow-xl)",
          border: "1px solid var(--border-light)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "var(--radius-md)",
                  background: "linear-gradient(135deg, var(--ooddle-primary), var(--pillar-cognition))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  fontSize: 20,
                }}
              >
                O
              </div>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 24, color: "var(--text-primary)" }}>
                Ooddle
              </span>
            </div>
          </Link>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 800, marginBottom: 8 }}>
            Welcome back
          </h1>
          <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>
            Log in to continue your wellness journey
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6 }}>
              Email
            </label>
            <div style={{ position: "relative" }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                style={{
                  width: "100%",
                  padding: "12px 16px 12px 42px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-light)",
                  fontSize: 14,
                  background: "var(--surface-1)",
                  color: "var(--text-primary)",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
              <Mail size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-tertiary)" }} />
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6 }}>
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                required
                style={{
                  width: "100%",
                  padding: "12px 16px 12px 42px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-light)",
                  fontSize: 14,
                  background: "var(--surface-1)",
                  color: "var(--text-primary)",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
              <Lock size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-tertiary)" }} />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "13px",
              borderRadius: "var(--radius-md)",
              background: loading ? "var(--text-tertiary)" : "linear-gradient(135deg, var(--ooddle-primary), var(--ooddle-primary-dark))",
              color: "white",
              fontWeight: 700,
              fontSize: 15,
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              boxShadow: "var(--shadow-md), 0 0 20px rgba(16, 185, 129, 0.2)",
            }}
          >
            {loading ? (
              <div className="animate-pulse-ring" style={{ width: 20, height: 20, borderRadius: "50%", background: "rgba(255,255,255,0.5)" }} />
            ) : (
              <>
                Log in <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <p style={{ textAlign: "center", fontSize: 13, color: "var(--text-tertiary)", marginTop: 24 }}>
          Don&apos;t have an account?{" "}
          <Link href="/signup" style={{ color: "var(--ooddle-primary)", fontWeight: 600, textDecoration: "none" }}>
            Sign up free
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
