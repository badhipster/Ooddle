"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Check, Sparkles } from "lucide-react";
import { useStore } from "@/lib/store";
import {
  ONBOARDING_GOALS,
  FITNESS_LEVELS,
  DIETARY_PREFERENCES,
  SLEEP_PATTERNS,
  COMMON_MEALS,
  MEAL_PATTERNS,
  WORK_SCHEDULES,
  PROTEIN_PREFERENCES,
  PILLAR_LIST,
} from "@/lib/constants";

const STEPS = ["Welcome", "Goals", "Fitness", "Diet", "Routine", "Sleep", "Ready"];

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
};

export default function OnboardingPage() {
  const router = useRouter();
  const { completeOnboarding } = useStore();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);

  const [goals, setGoals] = useState<string[]>([]);
  const [fitnessLevel, setFitnessLevel] = useState("");
  const [diet, setDiet] = useState("");
  const [sleep, setSleep] = useState("");

  // Routine step state — all optional. India-first context.
  const [commonMeals, setCommonMeals] = useState<string[]>([]);
  const [mealPattern, setMealPattern] = useState<string[]>([]);
  const [workSchedule, setWorkSchedule] = useState("");
  const [proteinPreference, setProteinPreference] = useState<string[]>([]);

  const toggleInList = (
    list: string[],
    setter: (v: string[]) => void,
    id: string
  ) => {
    setter(list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);
  };

  const next = () => {
    setDirection(1);
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };
  const prev = () => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0));
  };

  const toggleGoal = (id: string) => {
    setGoals((prev) => (prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]));
  };

  const finish = () => {
    completeOnboarding({
      goals,
      fitnessLevel,
      dietaryPreference: diet,
      sleepPattern: sleep,
      locale: "IN",
      commonMeals,
      mealPattern,
      workSchedule: workSchedule || undefined,
      proteinPreference,
    });
    router.push("/dashboard");
  };

  const canProceed = () => {
    if (step === 0) return true;
    if (step === 1) return goals.length > 0;
    if (step === 2) return fitnessLevel !== "";
    if (step === 3) return diet !== "";
    if (step === 4) return true; // Routine — all optional
    if (step === 5) return sleep !== "";
    return true;
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div className="gradient-mesh" style={{ position: "absolute", inset: 0, zIndex: 0 }} />

      {/* Progress bar */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          padding: "16px 24px",
        }}
      >
        <div style={{ maxWidth: 500, margin: "0 auto" }}>
          <div style={{ display: "flex", gap: 6 }}>
            {STEPS.map((_, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: 4,
                  borderRadius: 2,
                  background: i <= step ? "var(--ooddle-primary)" : "var(--border-light)",
                  transition: "background 0.3s",
                }}
              />
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 8, fontSize: 12, color: "var(--text-tertiary)" }}>
            Step {step + 1} of {STEPS.length}
          </div>
        </div>
      </div>

      {/* Step content */}
      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 520 }}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            style={{
              background: "var(--surface-0)",
              borderRadius: "var(--radius-xl)",
              padding: "40px 36px",
              boxShadow: "var(--shadow-xl)",
              border: "1px solid var(--border-light)",
            }}
          >
            {step === 0 && (
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: "var(--radius-lg)",
                    background: "linear-gradient(135deg, var(--ooddle-primary), var(--pillar-cognition))",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 24px",
                  }}
                >
                  <Sparkles size={28} color="white" />
                </div>
                <h1
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 28,
                    fontWeight: 800,
                    marginBottom: 12,
                  }}
                >
                  Let&apos;s personalize your experience
                </h1>
                <p style={{ fontSize: 15, color: "var(--text-secondary)", marginBottom: 24, lineHeight: 1.7 }}>
                  A few quick questions so Ooddle can create your personalized wellness plan across all 5 pillars.
                </p>
                <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                  {PILLAR_LIST.map((p) => {
                    const Icon = p.icon;
                    return (
                      <div
                        key={p.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          padding: "6px 14px",
                          borderRadius: "var(--radius-full)",
                          backgroundColor: p.bgColor,
                          fontSize: 12,
                          fontWeight: 600,
                          color: p.darkColor,
                        }}
                      >
                        <Icon size={14} style={{ color: p.color }} />
                        {p.name}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 1 && (
              <div>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 800, marginBottom: 8 }}>
                  What are your health goals?
                </h2>
                <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 24 }}>
                  Select all that matter to you. This helps Ooddle prioritize your daily actions.
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {ONBOARDING_GOALS.map((goal) => (
                    <button
                      key={goal.id}
                      onClick={() => toggleGoal(goal.id)}
                      style={{
                        padding: "14px 16px",
                        borderRadius: "var(--radius-md)",
                        border: `2px solid ${goals.includes(goal.id) ? "var(--ooddle-primary)" : "var(--border-light)"}`,
                        background: goals.includes(goal.id) ? "var(--pillar-movement-bg)" : "var(--surface-1)",
                        cursor: "pointer",
                        textAlign: "left",
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        fontSize: 14,
                        fontWeight: 600,
                        color: "var(--text-primary)",
                        transition: "all 0.2s",
                      }}
                    >
                      <span style={{ fontSize: 20 }}>{goal.emoji}</span>
                      {goal.label}
                      {goals.includes(goal.id) && (
                        <Check size={16} style={{ marginLeft: "auto", color: "var(--ooddle-primary)" }} />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 800, marginBottom: 8 }}>
                  Your fitness level
                </h2>
                <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 24 }}>
                  This helps calibrate the difficulty of your daily micro-actions.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {FITNESS_LEVELS.map((level) => (
                    <button
                      key={level.id}
                      onClick={() => setFitnessLevel(level.id)}
                      style={{
                        padding: "16px 20px",
                        borderRadius: "var(--radius-md)",
                        border: `2px solid ${fitnessLevel === level.id ? "var(--ooddle-primary)" : "var(--border-light)"}`,
                        background: fitnessLevel === level.id ? "var(--pillar-movement-bg)" : "var(--surface-1)",
                        cursor: "pointer",
                        textAlign: "left",
                        transition: "all 0.2s",
                      }}
                    >
                      <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>
                        {level.label}
                      </div>
                      <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>{level.description}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 800, marginBottom: 8 }}>
                  Dietary preference
                </h2>
                <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 24 }}>
                  Ooddle will tailor nutrition advice to your eating style.
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {DIETARY_PREFERENCES.map((pref) => (
                    <button
                      key={pref.id}
                      onClick={() => setDiet(pref.id)}
                      style={{
                        padding: "14px 16px",
                        borderRadius: "var(--radius-md)",
                        border: `2px solid ${diet === pref.id ? "var(--ooddle-primary)" : "var(--border-light)"}`,
                        background: diet === pref.id ? "var(--pillar-movement-bg)" : "var(--surface-1)",
                        cursor: "pointer",
                        textAlign: "left",
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        fontSize: 14,
                        fontWeight: 600,
                        color: "var(--text-primary)",
                        transition: "all 0.2s",
                      }}
                    >
                      <span style={{ fontSize: 20 }}>{pref.emoji}</span>
                      {pref.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 4 && (
              <div>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 800, marginBottom: 8 }}>
                  Your daily routine
                </h2>
                <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 20 }}>
                  Tell Ooddle a bit about your day. All optional. The more we know, the more your plan fits real life.
                </p>

                {/* Common meals */}
                <div style={{ marginBottom: 20 }}>
                  <h3 style={{ fontSize: 13, fontWeight: 700, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>
                    Meals you often eat
                  </h3>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {COMMON_MEALS.map((m) => {
                      const selected = commonMeals.includes(m.id);
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => toggleInList(commonMeals, setCommonMeals, m.id)}
                          style={{
                            padding: "8px 14px",
                            borderRadius: "var(--radius-full)",
                            border: `1.5px solid ${selected ? "var(--ooddle-primary)" : "var(--border-light)"}`,
                            background: selected ? "var(--pillar-movement-bg)" : "var(--surface-1)",
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            fontSize: 13,
                            fontWeight: 600,
                            color: "var(--text-primary)",
                            transition: "all 0.15s",
                          }}
                        >
                          <span style={{ fontSize: 14 }}>{m.emoji}</span>
                          {m.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Meal pattern */}
                <div style={{ marginBottom: 20 }}>
                  <h3 style={{ fontSize: 13, fontWeight: 700, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>
                    Your meal rhythm
                  </h3>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {MEAL_PATTERNS.map((p) => {
                      const selected = mealPattern.includes(p.id);
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => toggleInList(mealPattern, setMealPattern, p.id)}
                          style={{
                            padding: "8px 14px",
                            borderRadius: "var(--radius-full)",
                            border: `1.5px solid ${selected ? "var(--ooddle-primary)" : "var(--border-light)"}`,
                            background: selected ? "var(--pillar-movement-bg)" : "var(--surface-1)",
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            fontSize: 13,
                            fontWeight: 600,
                            color: "var(--text-primary)",
                            transition: "all 0.15s",
                          }}
                        >
                          <span style={{ fontSize: 14 }}>{p.emoji}</span>
                          {p.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Work schedule */}
                <div style={{ marginBottom: 20 }}>
                  <h3 style={{ fontSize: 13, fontWeight: 700, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>
                    Your typical day
                  </h3>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {WORK_SCHEDULES.map((w) => {
                      const selected = workSchedule === w.id;
                      return (
                        <button
                          key={w.id}
                          type="button"
                          onClick={() => setWorkSchedule(selected ? "" : w.id)}
                          style={{
                            padding: "8px 14px",
                            borderRadius: "var(--radius-full)",
                            border: `1.5px solid ${selected ? "var(--ooddle-primary)" : "var(--border-light)"}`,
                            background: selected ? "var(--pillar-movement-bg)" : "var(--surface-1)",
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            fontSize: 13,
                            fontWeight: 600,
                            color: "var(--text-primary)",
                            transition: "all 0.15s",
                          }}
                          title={w.description}
                        >
                          <span style={{ fontSize: 14 }}>{w.emoji}</span>
                          {w.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Protein preference */}
                <div>
                  <h3 style={{ fontSize: 13, fontWeight: 700, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>
                    Protein you eat
                  </h3>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {PROTEIN_PREFERENCES.map((p) => {
                      const selected = proteinPreference.includes(p.id);
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => toggleInList(proteinPreference, setProteinPreference, p.id)}
                          style={{
                            padding: "8px 14px",
                            borderRadius: "var(--radius-full)",
                            border: `1.5px solid ${selected ? "var(--ooddle-primary)" : "var(--border-light)"}`,
                            background: selected ? "var(--pillar-movement-bg)" : "var(--surface-1)",
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            fontSize: 13,
                            fontWeight: 600,
                            color: "var(--text-primary)",
                            transition: "all 0.15s",
                          }}
                        >
                          <span style={{ fontSize: 14 }}>{p.emoji}</span>
                          {p.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {step === 5 && (
              <div>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 800, marginBottom: 8 }}>
                  Sleep pattern
                </h2>
                <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 24 }}>
                  Recovery is key. Let Ooddle optimize your rest schedule.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {SLEEP_PATTERNS.map((pattern) => (
                    <button
                      key={pattern.id}
                      onClick={() => setSleep(pattern.id)}
                      style={{
                        padding: "16px 20px",
                        borderRadius: "var(--radius-md)",
                        border: `2px solid ${sleep === pattern.id ? "var(--ooddle-primary)" : "var(--border-light)"}`,
                        background: sleep === pattern.id ? "var(--pillar-movement-bg)" : "var(--surface-1)",
                        cursor: "pointer",
                        textAlign: "left",
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        transition: "all 0.2s",
                      }}
                    >
                      <span style={{ fontSize: 24 }}>{pattern.emoji}</span>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", marginBottom: 2 }}>
                          {pattern.label}
                        </div>
                        <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>{pattern.description}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 6 && (
              <div style={{ textAlign: "center" }}>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, var(--ooddle-primary), var(--ooddle-primary-dark))",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 24px",
                    boxShadow: "var(--shadow-glow)",
                  }}
                >
                  <Check size={32} color="white" strokeWidth={3} />
                </motion.div>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 800, marginBottom: 12 }}>
                  You&apos;re all set! 🎉
                </h2>
                <p style={{ fontSize: 15, color: "var(--text-secondary)", marginBottom: 8, lineHeight: 1.7 }}>
                  Ooddle has created a personalized wellness plan based on your preferences. Your 5 daily micro-actions are ready!
                </p>
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    justifyContent: "center",
                    marginTop: 20,
                    marginBottom: 8,
                    flexWrap: "wrap",
                  }}
                >
                  {goals.map((g) => {
                    const goal = ONBOARDING_GOALS.find((og) => og.id === g);
                    return goal ? (
                      <span
                        key={g}
                        style={{
                          padding: "4px 12px",
                          borderRadius: "var(--radius-full)",
                          background: "var(--pillar-movement-bg)",
                          fontSize: 12,
                          fontWeight: 600,
                          color: "var(--ooddle-primary-dark)",
                        }}
                      >
                        {goal.emoji} {goal.label}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation buttons */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 20,
            gap: 12,
          }}
        >
          {step > 0 ? (
            <button
              onClick={prev}
              style={{
                padding: "12px 24px",
                borderRadius: "var(--radius-full)",
                border: "1px solid var(--border-light)",
                background: "var(--surface-0)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 14,
                fontWeight: 600,
                color: "var(--text-secondary)",
              }}
            >
              <ArrowLeft size={16} /> Back
            </button>
          ) : (
            <div />
          )}

          {step < STEPS.length - 1 ? (
            <button
              onClick={next}
              disabled={!canProceed()}
              style={{
                padding: "12px 28px",
                borderRadius: "var(--radius-full)",
                background: canProceed()
                  ? "linear-gradient(135deg, var(--ooddle-primary), var(--ooddle-primary-dark))"
                  : "var(--border-light)",
                color: canProceed() ? "white" : "var(--text-tertiary)",
                fontWeight: 700,
                fontSize: 14,
                border: "none",
                cursor: canProceed() ? "pointer" : "not-allowed",
                display: "flex",
                alignItems: "center",
                gap: 8,
                boxShadow: canProceed() ? "var(--shadow-md)" : "none",
              }}
            >
              Continue <ArrowRight size={16} />
            </button>
          ) : (
            <button
              onClick={finish}
              style={{
                padding: "12px 28px",
                borderRadius: "var(--radius-full)",
                background: "linear-gradient(135deg, var(--ooddle-primary), var(--ooddle-primary-dark))",
                color: "white",
                fontWeight: 700,
                fontSize: 14,
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
                boxShadow: "var(--shadow-md), 0 0 20px rgba(16, 185, 129, 0.3)",
              }}
            >
              Go to Dashboard <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
