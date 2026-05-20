"use client";

import { useState, KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronDown, AlertTriangle, ExternalLink, Info } from "lucide-react";
import type { MicroAction, Pillar } from "@/lib/constants";
import type {
  ConfidenceLevel,
  EvidenceReference,
  RecommendationSignal,
} from "@/lib/evidence";

interface MicroActionCardProps {
  action: MicroAction;
  pillar: Pillar;
  onToggle: () => void;
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

function confidenceStyle(c: ConfidenceLevel) {
  // Wellness colors — never alarming. Low = neutral, medium = amber, high = pillar green.
  if (c === "high") {
    return { bg: "rgba(16, 185, 129, 0.12)", color: "rgba(6, 95, 70, 1)", label: "High confidence" };
  }
  if (c === "medium") {
    return { bg: "rgba(245, 158, 11, 0.12)", color: "rgba(120, 53, 15, 1)", label: "Medium confidence" };
  }
  return { bg: "var(--surface-1, rgba(0,0,0,0.04))", color: "var(--text-tertiary)", label: "Low confidence" };
}

function sourceLabel(sourceType: EvidenceReference["sourceType"]): string {
  switch (sourceType) {
    case "expert":
      return "Expert";
    case "guideline":
      return "Guideline";
    case "study":
      return "Study";
    case "ooddle_rule":
      return "Ooddle heuristic";
    case "starter":
      return "Starter";
    default:
      return "Source";
  }
}

function isStarterExplanation(signals: RecommendationSignal[], evidence: EvidenceReference[]) {
  return (
    signals.length === 0 &&
    evidence.some((e) => e.sourceType === "starter")
  );
}

export function MicroActionCard({ action, pillar, onToggle }: MicroActionCardProps) {
  const [expanded, setExpanded] = useState(false);
  const Icon = pillar.icon;
  const exp = action.explanation;
  const conf = confidenceStyle(exp.confidence);
  const starter = isStarterExplanation(exp.signals, exp.evidence);

  function handleCardActivate() {
    onToggle();
  }

  function handleCardKey(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onToggle();
    }
  }

  function stop(e: React.MouseEvent | React.KeyboardEvent) {
    e.stopPropagation();
  }

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={handleCardActivate}
      onKeyDown={handleCardKey}
      role="button"
      tabIndex={0}
      aria-pressed={action.completed}
      aria-label={`${action.title}. ${action.completed ? "Completed" : "Not completed"}. Tap to toggle.`}
      style={{
        background: "var(--surface-0)",
        borderRadius: "var(--radius-lg)",
        padding: "18px 20px",
        border: `1px solid ${action.completed ? pillar.color : "var(--border-light)"}`,
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        transition: "border-color 0.3s, background 0.3s",
        opacity: action.completed ? 0.85 : 1,
      }}
    >
      {/* Top row */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
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
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
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
              overflow: expanded ? "visible" : "hidden",
              textOverflow: expanded ? "clip" : "ellipsis",
              whiteSpace: expanded ? "normal" : "nowrap",
            }}
          >
            {action.description}
          </p>
          <div style={{ display: "flex", gap: 12, marginTop: 6, alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>⏱ {action.duration}</span>
            <span style={{ fontSize: 12, color: "var(--text-tertiary)", textTransform: "capitalize" }}>
              📊 {action.difficulty}
            </span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                padding: "2px 8px",
                borderRadius: "var(--radius-full)",
                background: conf.bg,
                color: conf.color,
              }}
              title={conf.label}
            >
              {conf.label}
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
          aria-hidden="true"
        >
          {action.completed && <Check size={16} color="white" strokeWidth={3} />}
        </div>
      </div>

      {/* Why this today affordance */}
      <button
        type="button"
        onClick={(e) => {
          stop(e);
          setExpanded((v) => !v);
        }}
        onKeyDown={stop}
        aria-expanded={expanded}
        aria-controls={`why-${action.id}`}
        style={{
          alignSelf: "flex-start",
          background: "transparent",
          border: "none",
          padding: "4px 0",
          marginLeft: 60, // align with content column past the icon
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          cursor: "pointer",
          color: pillar.darkColor,
          fontSize: 12,
          fontWeight: 600,
          fontFamily: "var(--font-display)",
        }}
      >
        <ChevronDown
          size={14}
          style={{
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
          }}
        />
        {expanded ? "Hide why this" : "Why this today"}
      </button>

      {/* Expanded explanation */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            id={`why-${action.id}`}
            key="why-panel"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            onClick={stop}
            style={{
              overflow: "hidden",
              borderTop: "1px solid var(--border-light)",
              paddingTop: 0,
            }}
          >
            <div
              style={{
                marginLeft: 60,
                marginTop: 12,
                display: "flex",
                flexDirection: "column",
                gap: 14,
                fontSize: 13,
                color: "var(--text-secondary)",
                lineHeight: 1.55,
              }}
            >
              {/* Rationale */}
              <section>
                <h4
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "var(--text-tertiary)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    marginBottom: 4,
                  }}
                >
                  Why this today
                </h4>
                <p style={{ color: "var(--text-primary)" }}>{exp.rationale}</p>
              </section>

              {/* Signals — only when not a starter */}
              {!starter && exp.signals.length > 0 && (
                <section>
                  <h4
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "var(--text-tertiary)",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      marginBottom: 6,
                    }}
                  >
                    Factors considered
                  </h4>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {exp.signals.map((s) => (
                      <li
                        key={s.id}
                        style={{
                          padding: "3px 10px",
                          borderRadius: "var(--radius-full)",
                          background: "var(--surface-1, rgba(0,0,0,0.04))",
                          color: "var(--text-secondary)",
                          fontSize: 12,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        {s.label}
                        {s.freshness === "stale" && (
                          <span style={{ color: "var(--text-tertiary)", fontSize: 11 }}>(stale)</span>
                        )}
                        {s.freshness === "missing" && (
                          <span style={{ color: "var(--text-tertiary)", fontSize: 11 }}>(no data yet)</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Evidence */}
              {exp.evidence.length > 0 && (
                <section>
                  <h4
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "var(--text-tertiary)",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      marginBottom: 6,
                    }}
                  >
                    Evidence
                  </h4>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                    {exp.evidence.map((e) => (
                      <li
                        key={e.id}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 8,
                          padding: "8px 10px",
                          borderRadius: "var(--radius-md)",
                          background: "var(--surface-1, rgba(0,0,0,0.03))",
                          border: "1px solid var(--border-light)",
                        }}
                      >
                        <Info size={14} style={{ color: pillar.color, flexShrink: 0, marginTop: 2 }} aria-hidden="true" />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                              flexWrap: "wrap",
                              marginBottom: 2,
                            }}
                          >
                            {e.url ? (
                              <a
                                href={e.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={stop}
                                onKeyDown={stop}
                                style={{
                                  color: "var(--text-primary)",
                                  fontWeight: 600,
                                  textDecoration: "none",
                                  fontSize: 13,
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: 4,
                                }}
                              >
                                {e.label}
                                <ExternalLink size={11} aria-hidden="true" />
                              </a>
                            ) : (
                              <span style={{ color: "var(--text-primary)", fontWeight: 600, fontSize: 13 }}>{e.label}</span>
                            )}
                            <span
                              style={{
                                fontSize: 10,
                                fontWeight: 700,
                                padding: "2px 6px",
                                borderRadius: "var(--radius-full)",
                                background: pillar.bgColor,
                                color: pillar.darkColor,
                                textTransform: "uppercase",
                                letterSpacing: "0.04em",
                              }}
                            >
                              {sourceLabel(e.sourceType)}
                            </span>
                          </div>
                          <p style={{ color: "var(--text-secondary)", fontSize: 12, margin: 0 }}>{e.summary}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Safety note — visually distinct */}
              {exp.safetyNote && (
                <section
                  role="note"
                  aria-label="Safety note"
                  style={{
                    display: "flex",
                    gap: 8,
                    padding: "10px 12px",
                    borderRadius: "var(--radius-md)",
                    background: "rgba(245, 158, 11, 0.08)",
                    border: "1px solid rgba(245, 158, 11, 0.25)",
                  }}
                >
                  <AlertTriangle size={16} style={{ color: "rgba(180, 83, 9, 1)", flexShrink: 0, marginTop: 1 }} aria-hidden="true" />
                  <div style={{ fontSize: 12, color: "rgba(120, 53, 15, 1)", lineHeight: 1.5 }}>
                    <strong style={{ display: "block", marginBottom: 2 }}>Safety note</strong>
                    {exp.safetyNote}
                  </div>
                </section>
              )}

              {/* Wellness disclaimer */}
              <p style={{ fontSize: 11, color: "var(--text-tertiary)", margin: 0 }}>
                Ooddle is for general wellness and education, not medical advice.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export { fadeUp };
