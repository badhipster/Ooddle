"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  MessageCircle,
  BarChart3,
  User,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { useState, useEffect } from "react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/chat", label: "Chat with Ooddle", icon: MessageCircle },
  { href: "/progress", label: "Progress", icon: BarChart3 },
  { href: "/profile", label: "Profile", icon: User },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { state, logout } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!state.isAuthenticated) {
      router.push("/login");
    }
  }, [state.isAuthenticated, router]);

  if (!state.isAuthenticated) return null;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--surface-1)" }}>
      {/* Desktop Sidebar */}
      <aside
        style={{
          width: 260,
          background: "var(--surface-0)",
          borderRight: "1px solid var(--border-light)",
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 40,
        }}
        className="sidebar-desktop"
      >
        {/* Logo */}
        <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid var(--border-light)" }}>
          <Link href="/dashboard" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
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
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: "var(--text-primary)" }}>
              Ooddle
            </span>
          </Link>
        </div>

        {/* Nav Items */}
        <nav style={{ flex: 1, padding: "12px 10px" }}>
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 14px",
                  borderRadius: "var(--radius-md)",
                  textDecoration: "none",
                  fontSize: 14,
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? "var(--ooddle-primary-dark)" : "var(--text-secondary)",
                  background: isActive ? "var(--pillar-movement-bg)" : "transparent",
                  marginBottom: 4,
                  transition: "all 0.2s",
                }}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User footer */}
        <div style={{ padding: "16px", borderTop: "1px solid var(--border-light)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "linear-gradient(135deg, var(--ooddle-primary), var(--pillar-cognition))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: 700,
                fontSize: 14,
              }}
            >
              {state.user?.name?.charAt(0) || "U"}
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>
                {state.user?.name || "User"}
              </div>
              <div style={{ fontSize: 12, color: "var(--text-tertiary)" }}>
                {state.user?.email}
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              logout();
              router.push("/");
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 12px",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border-light)",
              background: "transparent",
              cursor: "pointer",
              fontSize: 13,
              color: "var(--text-secondary)",
              width: "100%",
            }}
          >
            <LogOut size={14} /> Sign out
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div
        className="mobile-header"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          background: "var(--surface-0)",
          borderBottom: "1px solid var(--border-light)",
          padding: "12px 16px",
          display: "none",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link href="/dashboard" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "linear-gradient(135deg, var(--ooddle-primary), var(--pillar-cognition))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: 16,
            }}
          >
            O
          </div>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--text-primary)" }}>
            Ooddle
          </span>
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{ border: "none", background: "transparent", cursor: "pointer", padding: 4 }}
        >
          {mobileMenuOpen ? (
            <X size={24} style={{ color: "var(--text-primary)" }} />
          ) : (
            <Menu size={24} style={{ color: "var(--text-primary)" }} />
          )}
        </button>
      </div>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setMobileMenuOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 45,
            background: "rgba(0,0,0,0.4)",
            display: "none",
          }}
          className="mobile-overlay"
        />
      )}

      {mobileMenuOpen && (
        <motion.div
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          exit={{ x: -300 }}
          className="mobile-nav"
          style={{
            position: "fixed",
            top: 56,
            left: 0,
            bottom: 0,
            width: 260,
            background: "var(--surface-0)",
            zIndex: 46,
            padding: "12px 10px",
            borderRight: "1px solid var(--border-light)",
            display: "none",
            flexDirection: "column",
          }}
        >
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 14px",
                  borderRadius: "var(--radius-md)",
                  textDecoration: "none",
                  fontSize: 15,
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? "var(--ooddle-primary-dark)" : "var(--text-secondary)",
                  background: isActive ? "var(--pillar-movement-bg)" : "transparent",
                  marginBottom: 4,
                }}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </motion.div>
      )}

      {/* Main content */}
      <main style={{ flex: 1, marginLeft: 260, padding: "24px", minHeight: "100vh" }} className="main-content">
        {children}
      </main>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .sidebar-desktop { display: none !important; }
          .mobile-header { display: flex !important; }
          .mobile-overlay { display: block !important; }
          .mobile-nav { display: flex !important; }
          .main-content { margin-left: 0 !important; padding-top: 70px !important; }
        }
      `}</style>
    </div>
  );
}
