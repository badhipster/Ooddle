import { Flame, Brain, Dumbbell, Moon, Pill, LucideIcon } from "lucide-react";
import {
  ConfidenceLevel,
  EvidenceReference,
  MicroActionExplanation,
  RecommendationSignal,
  getEvidence,
} from "./evidence";

export type PillarId = "metabolic" | "movement" | "cognition" | "recovery" | "supplements";

export interface Pillar {
  id: PillarId;
  name: string;
  description: string;
  icon: LucideIcon;
  color: string;
  lightColor: string;
  bgColor: string;
  darkColor: string;
  emoji: string;
}

export const PILLARS: Record<PillarId, Pillar> = {
  metabolic: {
    id: "metabolic",
    name: "Metabolic Health",
    description: "Optimize your metabolism, nutrition, and energy levels",
    icon: Flame,
    color: "var(--pillar-metabolic)",
    lightColor: "var(--pillar-metabolic-light)",
    bgColor: "var(--pillar-metabolic-bg)",
    darkColor: "var(--pillar-metabolic-dark)",
    emoji: "🔥",
  },
  movement: {
    id: "movement",
    name: "Movement",
    description: "Build strength, flexibility, and cardiovascular fitness",
    icon: Dumbbell,
    color: "var(--pillar-movement)",
    lightColor: "var(--pillar-movement-light)",
    bgColor: "var(--pillar-movement-bg)",
    darkColor: "var(--pillar-movement-dark)",
    emoji: "💪",
  },
  cognition: {
    id: "cognition",
    name: "Cognition & Emotion",
    description: "Enhance mental clarity, focus, and emotional balance",
    icon: Brain,
    color: "var(--pillar-cognition)",
    lightColor: "var(--pillar-cognition-light)",
    bgColor: "var(--pillar-cognition-bg)",
    darkColor: "var(--pillar-cognition-dark)",
    emoji: "🧠",
  },
  recovery: {
    id: "recovery",
    name: "Recovery",
    description: "Improve sleep quality and active recovery practices",
    icon: Moon,
    color: "var(--pillar-recovery)",
    lightColor: "var(--pillar-recovery-light)",
    bgColor: "var(--pillar-recovery-bg)",
    darkColor: "var(--pillar-recovery-dark)",
    emoji: "🌙",
  },
  supplements: {
    id: "supplements",
    name: "Supplements & Longevity",
    description: "Strategic supplementation for optimal health span",
    icon: Pill,
    color: "var(--pillar-supplements)",
    lightColor: "var(--pillar-supplements-light)",
    bgColor: "var(--pillar-supplements-bg)",
    darkColor: "var(--pillar-supplements-dark)",
    emoji: "💊",
  },
};

export const PILLAR_LIST = Object.values(PILLARS);

export interface MicroAction {
  id: string;
  pillarId: PillarId;
  title: string;
  description: string;
  duration: string;
  difficulty: "easy" | "medium" | "hard";
  completed: boolean;
  /**
   * Why this action was recommended. Required at the type level so we never
   * render an action without a rationale, but generators fall back to a
   * "starter" explanation when no real signal exists.
   */
  explanation: MicroActionExplanation;
}

/* ──────────────────────────────────────────────────────────
   Micro-Action Library — tagged with goals + evidence metadata.
   The dashboard pulls from here based on the user's onboarding answers
   and the template's evidence keys generate the "Why this today" panel.
   ────────────────────────────────────────────────────────── */

interface MicroActionTemplate
  extends Omit<MicroAction, "id" | "completed" | "explanation"> {
  goalTags: string[]; // matches ONBOARDING_GOALS ids
  fitnessLevels?: ("beginner" | "intermediate" | "advanced")[];
  /** Stable evidence keys from EVIDENCE_CATALOG, 1 or 2 per action. */
  evidenceKeys: string[];
  /** Signal labels that the rationale references when matching signals exist. */
  signalHints?: string[];
  /** Default confidence when the action is selected from real preferences. */
  baseConfidence: ConfidenceLevel;
  /** Optional safety note. Required for supplements + fasting style actions. */
  safetyNote?: string;

  // India-first routine tags. All optional; templates without these stay
  // selectable for every user, India or not.
  /** Common Indian meal staples the action references. e.g. ["roti","dal"]. */
  mealTags?: string[];
  /** Meal pattern tags. e.g. ["late_dinner","frequent_snacking"]. */
  mealPatternTags?: string[];
  /** Work schedule tags. e.g. ["desk_job","shift_work"]. */
  workScheduleTags?: string[];
  /** Compatible protein preferences. If set, action is filtered out for
   *  users whose proteinPreference does not overlap. e.g. ["veg","dairy"]. */
  proteinPreferenceTags?: string[];
}

export const MICRO_ACTION_LIBRARY: MicroActionTemplate[] = [
  // ── METABOLIC ──
  {
    pillarId: "metabolic",
    title: "Drink Warm Lemon Water",
    description:
      "Start your day with warm water plus fresh lemon to support hydration and a gentle morning routine.",
    duration: "2 min",
    difficulty: "easy",
    goalTags: ["energy", "weight", "gut"],
    evidenceKeys: ["hydration_morning"],
    signalHints: ["morning routine"],
    baseConfidence: "low",
  },
  {
    pillarId: "metabolic",
    title: "10-Min Post-Meal Walk",
    description:
      "Walk for 10 minutes after a main meal to support steadier energy through the afternoon.",
    duration: "10 min",
    difficulty: "easy",
    goalTags: ["energy", "weight"],
    evidenceKeys: ["postmeal_walk_glucose"],
    signalHints: ["meal timing", "step count"],
    baseConfidence: "high",
  },
  {
    pillarId: "metabolic",
    title: "Protein-First Breakfast",
    description:
      "Aim for a protein-forward first meal within 1 to 2 hours of waking to support steadier appetite.",
    duration: "5 min",
    difficulty: "easy",
    goalTags: ["energy", "weight", "fitness"],
    evidenceKeys: ["protein_first_breakfast", "icmr_protein_rda_in"],
    signalHints: ["protein servings", "meal timing"],
    baseConfidence: "medium",
  },
  {
    pillarId: "metabolic",
    title: "Earlier, Lighter Dinner",
    description:
      "Try finishing dinner 2 to 3 hours before bed and keep portions lighter to support overnight recovery.",
    duration: "—",
    difficulty: "medium",
    goalTags: ["weight", "longevity", "energy", "sleep"],
    evidenceKeys: ["meal_timing_late_dinner"],
    signalHints: ["meal pattern", "bedtime"],
    baseConfidence: "medium",
    safetyNote:
      "Skip if you are pregnant, have a history of disordered eating, or your clinician has asked you to eat at specific times.",
  },

  // ── MOVEMENT ──
  {
    pillarId: "movement",
    title: "5-Minute Morning Stretch",
    description:
      "Gentle full-body stretching to wake up muscles and improve circulation.",
    duration: "5 min",
    difficulty: "easy",
    goalTags: ["energy", "fitness"],
    fitnessLevels: ["beginner", "intermediate", "advanced"],
    evidenceKeys: ["desk_break_mobility"],
    signalHints: ["work schedule"],
    baseConfidence: "medium",
  },
  {
    pillarId: "movement",
    title: "8,000 Step Goal",
    description:
      "Aim for around 8,000 steps today. Light cardio supports mood, glucose control, and cardiovascular wellness.",
    duration: "Throughout day",
    difficulty: "easy",
    goalTags: ["fitness", "energy", "weight"],
    fitnessLevels: ["beginner", "intermediate"],
    evidenceKeys: ["daily_step_target"],
    signalHints: ["step count"],
    baseConfidence: "high",
  },
  {
    pillarId: "movement",
    title: "Zone-2 Cardio (30 min)",
    description:
      "Steady cardio at a conversational pace (around 60 to 70 percent max HR) builds aerobic base.",
    duration: "30 min",
    difficulty: "medium",
    goalTags: ["fitness", "longevity"],
    fitnessLevels: ["intermediate", "advanced"],
    evidenceKeys: ["zone2_aerobic_base"],
    signalHints: ["fitness level"],
    baseConfidence: "high",
  },
  {
    pillarId: "movement",
    title: "Strength Training (3 sets)",
    description:
      "Squat, push, pull. 3 sets each. Compound moves drive the most adaptation per minute.",
    duration: "20 min",
    difficulty: "hard",
    goalTags: ["fitness", "longevity", "weight"],
    fitnessLevels: ["intermediate", "advanced"],
    evidenceKeys: ["resistance_training_longevity"],
    signalHints: ["fitness level"],
    baseConfidence: "high",
  },

  // ── COGNITION ──
  {
    pillarId: "cognition",
    title: "Gratitude Journaling",
    description:
      "Write 3 things you are grateful for to support positive affect and a calmer baseline.",
    duration: "3 min",
    difficulty: "easy",
    goalTags: ["stress", "focus"],
    evidenceKeys: ["gratitude_affect"],
    signalHints: ["mood"],
    baseConfidence: "medium",
  },
  {
    pillarId: "cognition",
    title: "5-Min Box Breathing",
    description:
      "4 sec inhale, 4 hold, 4 exhale, 4 hold. A simple paced breathing pattern that calms the nervous system.",
    duration: "5 min",
    difficulty: "easy",
    goalTags: ["stress", "focus", "sleep"],
    evidenceKeys: ["box_breathing_vagal"],
    signalHints: ["mood", "stress level"],
    baseConfidence: "high",
  },
  {
    pillarId: "cognition",
    title: "90-Min Deep Work Block",
    description:
      "One uninterrupted focus block. Phone in another room. Single tab. One task.",
    duration: "90 min",
    difficulty: "medium",
    goalTags: ["focus"],
    evidenceKeys: ["ultradian_focus_block"],
    signalHints: ["work schedule"],
    baseConfidence: "medium",
  },
  {
    pillarId: "cognition",
    title: "Phone-Free First Hour",
    description:
      "Avoid your phone for the first hour after waking. Sets the tone for attention quality.",
    duration: "60 min",
    difficulty: "medium",
    goalTags: ["focus", "stress"],
    evidenceKeys: ["phone_free_morning"],
    signalHints: ["morning routine"],
    baseConfidence: "low",
  },

  // ── RECOVERY ──
  {
    pillarId: "recovery",
    title: "Cold Water Face Splash",
    description:
      "Splash cold water on your face as a brief morning alerting cue.",
    duration: "1 min",
    difficulty: "easy",
    goalTags: ["energy", "stress"],
    evidenceKeys: ["cold_face_alerting"],
    signalHints: ["energy level"],
    baseConfidence: "low",
  },
  {
    pillarId: "recovery",
    title: "No Screens 1 Hour Before Bed",
    description:
      "Replace screens with reading, journaling, or stretching to protect evening melatonin.",
    duration: "60 min",
    difficulty: "medium",
    goalTags: ["sleep", "energy"],
    evidenceKeys: ["no_screens_before_bed"],
    signalHints: ["bedtime", "sleep duration"],
    baseConfidence: "medium",
  },
  {
    pillarId: "recovery",
    title: "10-Min Morning Sunlight",
    description:
      "Within 30 minutes of waking, get direct outdoor sunlight to anchor your circadian rhythm.",
    duration: "10 min",
    difficulty: "easy",
    goalTags: ["sleep", "energy", "stress"],
    evidenceKeys: ["morning_sunlight_circadian"],
    signalHints: ["wake time", "morning routine"],
    baseConfidence: "high",
  },
  {
    pillarId: "recovery",
    title: "Cool the Bedroom (18 to 20°C)",
    description:
      "Lower your bedroom temp tonight for deeper sleep. Even 1 to 2°C cooler can make a difference.",
    duration: "1 min",
    difficulty: "easy",
    goalTags: ["sleep"],
    evidenceKeys: ["cool_bedroom_sleep"],
    signalHints: ["sleep duration"],
    baseConfidence: "medium",
  },

  // ── SUPPLEMENTS ──
  {
    pillarId: "supplements",
    title: "Morning Vitamin D3 + K2",
    description:
      "Take D3 with a meal that contains fat. K2 supports calcium going to bones rather than soft tissue.",
    duration: "1 min",
    difficulty: "easy",
    goalTags: ["longevity", "energy"],
    evidenceKeys: ["vit_d3_with_fat", "supplement_safety_general"],
    signalHints: ["supplement routine"],
    baseConfidence: "medium",
    safetyNote:
      "Check with a clinician if pregnant, managing a condition, or taking medications.",
  },
  {
    pillarId: "supplements",
    title: "Magnesium Glycinate (Evening)",
    description:
      "200 to 400 mg magnesium glycinate in the evening to support relaxation and sleep quality.",
    duration: "1 min",
    difficulty: "easy",
    goalTags: ["sleep", "stress", "fitness"],
    evidenceKeys: ["magnesium_glycinate_evening", "supplement_safety_general"],
    signalHints: ["sleep duration", "mood"],
    baseConfidence: "medium",
    safetyNote:
      "Check with a clinician if pregnant, managing a condition, or taking medications.",
  },
  {
    pillarId: "supplements",
    title: "Omega-3 (EPA/DHA)",
    description:
      "Take with a meal. Look for at least 500 mg EPA and 250 mg DHA per serving.",
    duration: "1 min",
    difficulty: "easy",
    goalTags: ["longevity", "focus"],
    evidenceKeys: ["omega3_epa_dha", "supplement_safety_general"],
    signalHints: ["meal timing"],
    baseConfidence: "medium",
    safetyNote:
      "Check with a clinician if pregnant, managing a condition, or taking medications.",
  },

  /* ── India-relevant additions (metabolic, movement, recovery) ── */

  // METABOLIC
  {
    pillarId: "metabolic",
    title: "Add a Curd or Dahi Side",
    description:
      "Add a small bowl of curd or dahi to one meal today for an easy protein boost and gut support.",
    duration: "1 min",
    difficulty: "easy",
    goalTags: ["weight", "gut", "energy"],
    evidenceKeys: ["icmr_protein_rda_in", "protein_first_breakfast"],
    signalHints: ["common meals", "protein servings"],
    baseConfidence: "medium",
    mealTags: ["roti", "rice", "dal", "sabzi"],
    proteinPreferenceTags: ["veg", "dairy", "egg", "chicken_fish"],
  },
  {
    pillarId: "metabolic",
    title: "Swap One Roti for a Dal Bowl",
    description:
      "Replace one roti with a generous serving of dal today to push protein and fiber up without changing the meal.",
    duration: "2 min",
    difficulty: "easy",
    goalTags: ["weight", "gut", "energy"],
    evidenceKeys: ["icmr_protein_rda_in", "protein_first_breakfast"],
    signalHints: ["common meals", "protein servings"],
    baseConfidence: "medium",
    mealTags: ["roti", "dal"],
    proteinPreferenceTags: ["veg", "vegan", "dairy", "egg", "chicken_fish"],
  },
  {
    pillarId: "metabolic",
    title: "Sabzi-First Plate",
    description:
      "Fill half your plate with sabzi or salad first, then add roti or rice. Slows the meal and helps satiety.",
    duration: "1 min",
    difficulty: "easy",
    goalTags: ["weight", "gut"],
    evidenceKeys: ["postmeal_walk_glucose"],
    signalHints: ["common meals"],
    baseConfidence: "low",
    mealTags: ["sabzi", "roti", "rice"],
  },
  {
    pillarId: "metabolic",
    title: "Water Before Every Chai",
    description:
      "Drink a glass of water before each tea or coffee today. Easy hydration anchor that fits an Indian routine.",
    duration: "1 min",
    difficulty: "easy",
    goalTags: ["energy"],
    evidenceKeys: ["hydration_morning"],
    signalHints: ["common meals"],
    baseConfidence: "low",
    mealTags: ["tea_coffee"],
  },
  {
    pillarId: "metabolic",
    title: "Pre-Lunch Protein Hit",
    description:
      "Have 15 to 20 g of protein (eggs, paneer, sprouts, or whey) about an hour before lunch to steady appetite.",
    duration: "5 min",
    difficulty: "easy",
    goalTags: ["weight", "energy", "fitness"],
    evidenceKeys: ["protein_first_breakfast", "icmr_protein_rda_in"],
    signalHints: ["protein servings", "meal pattern"],
    baseConfidence: "medium",
    mealPatternTags: ["frequent_snacking", "irregular_meals"],
  },

  // MOVEMENT
  {
    pillarId: "movement",
    title: "10-Minute Post-Dinner Walk",
    description:
      "Walk for 10 minutes after dinner. Especially helpful when dinner runs later than 9 pm.",
    duration: "10 min",
    difficulty: "easy",
    goalTags: ["weight", "sleep", "energy"],
    evidenceKeys: ["postmeal_walk_glucose"],
    signalHints: ["meal pattern", "bedtime"],
    baseConfidence: "high",
    mealPatternTags: ["late_dinner", "irregular_meals"],
  },
  {
    pillarId: "movement",
    title: "Desk Stretch Every Hour",
    description:
      "Stand up, roll shoulders, and stretch hips for 60 seconds every hour you are at the desk.",
    duration: "1 min/hr",
    difficulty: "easy",
    goalTags: ["energy", "fitness"],
    evidenceKeys: ["desk_break_mobility"],
    signalHints: ["work schedule"],
    baseConfidence: "high",
    workScheduleTags: ["desk_job", "hybrid", "student"],
  },
  {
    pillarId: "movement",
    title: "Stairs Over Lift",
    description:
      "Take the stairs at least twice today. Adds easy NEAT without any extra time.",
    duration: "2 min",
    difficulty: "easy",
    goalTags: ["fitness", "weight", "energy"],
    evidenceKeys: ["daily_step_target"],
    signalHints: ["work schedule"],
    baseConfidence: "medium",
    workScheduleTags: ["desk_job", "hybrid"],
  },

  // RECOVERY
  {
    pillarId: "recovery",
    title: "Lighter Dinner, Earlier",
    description:
      "Aim for a smaller dinner finished 2 to 3 hours before bed today. Supports deeper overnight recovery.",
    duration: "—",
    difficulty: "medium",
    goalTags: ["sleep", "weight", "energy"],
    evidenceKeys: ["meal_timing_late_dinner"],
    signalHints: ["meal pattern", "bedtime"],
    baseConfidence: "medium",
    mealPatternTags: ["late_dinner", "irregular_meals"],
    safetyNote:
      "Skip if you are pregnant, have a history of disordered eating, or your clinician has asked you to eat at specific times.",
  },
  {
    pillarId: "recovery",
    title: "Chai Cutoff at 4 PM",
    description:
      "Skip caffeine, including chai and coffee, after 4 pm tonight. Protects evening sleep onset.",
    duration: "—",
    difficulty: "easy",
    goalTags: ["sleep", "energy"],
    evidenceKeys: ["no_screens_before_bed"],
    signalHints: ["common meals", "bedtime"],
    baseConfidence: "medium",
    mealTags: ["tea_coffee"],
  },
  {
    pillarId: "recovery",
    title: "Pre-Bed Wind-Down (No Phone)",
    description:
      "Phone away 30 minutes before bed. Pick reading, stretching, or a quiet routine instead.",
    duration: "30 min",
    difficulty: "medium",
    goalTags: ["sleep", "stress", "focus"],
    evidenceKeys: ["no_screens_before_bed", "phone_free_morning"],
    signalHints: ["work schedule", "bedtime"],
    baseConfidence: "medium",
    workScheduleTags: ["shift_work", "desk_job", "hybrid"],
  },
];

/* ──────────────────────────────────────────────────────────
   Selectors. Always return MicroAction-shaped templates with a
   populated explanation block. Existing call sites that only
   read title/description keep working unchanged.
   ────────────────────────────────────────────────────────── */

export type EnrichedTemplate = Omit<MicroAction, "id" | "completed">;

interface PersonalizationContext {
  goals?: string[];
  fitnessLevel?: string;
  commonMeals?: string[];
  mealPattern?: string[];
  workSchedule?: string;
  proteinPreference?: string[];
}

function overlap(a?: string[], b?: string[]): string[] {
  if (!a?.length || !b?.length) return [];
  return a.filter((x) => b.includes(x));
}

function buildExplanation(
  template: MicroActionTemplate,
  ctx: PersonalizationContext,
  isStarter: boolean
): MicroActionExplanation {
  const evidence: EvidenceReference[] = isStarter
    ? getEvidence("starter_baseline", ...template.evidenceKeys.slice(0, 1))
    : getEvidence(...template.evidenceKeys.slice(0, 2));

  const signals: RecommendationSignal[] = isStarter
    ? []
    : (template.signalHints || []).slice(0, 3).map((label, idx) => ({
        id: `${template.pillarId}-hint-${idx}`,
        label,
        sourceType: "estimate" as const,
        freshness: "missing" as const,
      }));

  const matchedGoals =
    ctx.goals?.filter((g) => template.goalTags.includes(g)) ?? [];
  const matchedMeals = overlap(ctx.commonMeals, template.mealTags);
  const matchedPattern = overlap(ctx.mealPattern, template.mealPatternTags);
  const matchedWork =
    ctx.workSchedule && template.workScheduleTags?.includes(ctx.workSchedule)
      ? ctx.workSchedule
      : null;

  let rationale: string;
  if (isStarter) {
    rationale =
      "Starter recommendation based on your selected goals. As Ooddle learns more about your routine, this will get more specific.";
  } else if (matchedPattern.length > 0) {
    const patternText = matchedPattern[0].replace(/_/g, " ");
    rationale = `Picked because you mentioned ${patternText}. Small, low-friction adjustment that fits your meal pattern.`;
  } else if (matchedMeals.length > 0) {
    const mealText = matchedMeals.slice(0, 2).join(" and ").replace(/_/g, " ");
    rationale = `Tailored to your ${mealText} routine. Easy add-on without changing what you already eat.`;
  } else if (matchedWork) {
    const workText = matchedWork.replace(/_/g, " ");
    rationale = `Designed for a ${workText} day. Fits between calls and meetings.`;
  } else if (matchedGoals.length > 0) {
    const goalText = matchedGoals.slice(0, 2).join(" and ");
    rationale = `Picked for your ${goalText} goal. Pairs well with your current routine.`;
  } else if (ctx.fitnessLevel) {
    rationale = `Matched to your ${ctx.fitnessLevel} fitness level.`;
  } else {
    rationale = "A reliable daily action across most routines.";
  }

  const confidence: ConfidenceLevel = isStarter ? "low" : template.baseConfidence;

  return {
    rationale,
    signals,
    evidence,
    confidence,
    ...(template.safetyNote ? { safetyNote: template.safetyNote } : {}),
  };
}

function templateToEnriched(
  template: MicroActionTemplate,
  ctx: PersonalizationContext,
  isStarter: boolean
): EnrichedTemplate {
  return {
    pillarId: template.pillarId,
    title: template.title,
    description: template.description,
    duration: template.duration,
    difficulty: template.difficulty,
    explanation: buildExplanation(template, ctx, isStarter),
  };
}

// Default 5 actions (one per pillar, easiest variant) — used as a cold-start fallback.
export const DEFAULT_MICRO_ACTIONS: EnrichedTemplate[] = (() => {
  const seen = new Set<string>();
  return MICRO_ACTION_LIBRARY.filter((a) => a.difficulty === "easy")
    .filter((a) => {
      if (seen.has(a.pillarId)) return false;
      seen.add(a.pillarId);
      return true;
    })
    .map((tpl) => templateToEnriched(tpl, {}, true));
})();

/**
 * Selects 5 personalized micro-actions (one per pillar) based on the user's
 * onboarding answers, each carrying an explanation block. Falls back to
 * defaults when no preferences are set.
 *
 * Scoring:
 *   +2 per matching goal tag
 *   +3 for fitness-level match, -5 for fitness-level mismatch
 *   +2 per matching meal staple (e.g. user picked "roti", template tags include "roti")
 *   +3 for matching meal pattern (e.g. "late_dinner")
 *   +2 for matching work schedule
 *   -10 for protein preference incompatibility (e.g. chicken/fish template, vegan user)
 *   +1 baseline for easy actions when no preferences exist
 */
export function selectPersonalizedActions(
  goals: string[] = [],
  fitnessLevel: string = "",
  routine: {
    commonMeals?: string[];
    mealPattern?: string[];
    workSchedule?: string;
    proteinPreference?: string[];
  } = {}
): EnrichedTemplate[] {
  const result: EnrichedTemplate[] = [];
  const pillarIds: PillarId[] = [
    "metabolic",
    "movement",
    "cognition",
    "recovery",
    "supplements",
  ];
  const {
    commonMeals = [],
    mealPattern = [],
    workSchedule = "",
    proteinPreference = [],
  } = routine;

  const ctx: PersonalizationContext = {
    goals,
    fitnessLevel,
    commonMeals,
    mealPattern,
    workSchedule,
    proteinPreference,
  };
  const hasPrefs =
    goals.length > 0 ||
    Boolean(fitnessLevel) ||
    commonMeals.length > 0 ||
    mealPattern.length > 0 ||
    Boolean(workSchedule) ||
    proteinPreference.length > 0;

  for (const pillar of pillarIds) {
    const candidates = MICRO_ACTION_LIBRARY.filter((a) => a.pillarId === pillar);
    const scored = candidates.map((a) => {
      let score = 0;
      if (goals.length > 0) {
        score += a.goalTags.filter((t) => goals.includes(t)).length * 2;
      }
      if (fitnessLevel && a.fitnessLevels) {
        if (a.fitnessLevels.includes(fitnessLevel as "beginner" | "intermediate" | "advanced")) {
          score += 3;
        } else {
          score -= 5;
        }
      }
      if (a.mealTags?.length && commonMeals.length) {
        score += a.mealTags.filter((t) => commonMeals.includes(t)).length * 2;
      }
      if (a.mealPatternTags?.length && mealPattern.length) {
        score += a.mealPatternTags.filter((t) => mealPattern.includes(t)).length * 3;
      }
      if (a.workScheduleTags?.length && workSchedule) {
        if (a.workScheduleTags.includes(workSchedule)) score += 2;
      }
      // Protein incompatibility — reject vegan from chicken/fish-only actions.
      if (a.proteinPreferenceTags?.length && proteinPreference.length) {
        const compatible = a.proteinPreferenceTags.some((t) =>
          proteinPreference.includes(t)
        );
        if (!compatible) score -= 10;
      }
      if (goals.length === 0 && a.difficulty === "easy") score += 1;
      return { action: a, score };
    });

    scored.sort((x, y) => y.score - x.score);
    const picked = scored[0];
    if (picked && picked.score > -10) {
      result.push(templateToEnriched(picked.action, ctx, !hasPrefs));
    }
  }

  return result;
}

export const ONBOARDING_GOALS = [
  { id: "energy", label: "Boost Energy", emoji: "⚡" },
  { id: "weight", label: "Manage Weight", emoji: "⚖️" },
  { id: "sleep", label: "Better Sleep", emoji: "😴" },
  { id: "focus", label: "Sharpen Focus", emoji: "🎯" },
  { id: "stress", label: "Reduce Stress", emoji: "🧘" },
  { id: "fitness", label: "Build Fitness", emoji: "🏋️" },
  { id: "longevity", label: "Longevity", emoji: "🧬" },
  { id: "gut", label: "Gut Health", emoji: "🦠" },
];

export const FITNESS_LEVELS = [
  { id: "beginner", label: "Beginner", description: "Just starting out or returning after a long break" },
  { id: "intermediate", label: "Intermediate", description: "Exercise regularly, comfortable with moderate activity" },
  { id: "advanced", label: "Advanced", description: "Consistent training, pushing for performance gains" },
];

export const DIETARY_PREFERENCES = [
  { id: "omnivore", label: "Omnivore", emoji: "🥩" },
  { id: "vegetarian", label: "Vegetarian", emoji: "🥗" },
  { id: "vegan", label: "Vegan", emoji: "🌱" },
  { id: "keto", label: "Keto/Low Carb", emoji: "🥑" },
  { id: "paleo", label: "Paleo", emoji: "🍖" },
  { id: "mediterranean", label: "Mediterranean", emoji: "🫒" },
];

export const SLEEP_PATTERNS = [
  { id: "early", label: "Early Bird", description: "Bed by 10pm, up at 6am", emoji: "🌅" },
  { id: "moderate", label: "Moderate", description: "Bed by 11-12pm, up at 7-8am", emoji: "☀️" },
  { id: "night", label: "Night Owl", description: "Bed after midnight, up late", emoji: "🦉" },
  { id: "irregular", label: "Irregular", description: "No consistent sleep schedule", emoji: "🔄" },
];

/* ──────────────────────────────────────────────────────────
   India-first routine constants. Ids stay in snake_case so
   they round-trip through localStorage and the SQL schema.
   Labels are display-only.
   ────────────────────────────────────────────────────────── */

export const COMMON_MEALS = [
  { id: "roti", label: "Roti / chapati", emoji: "🫓" },
  { id: "rice", label: "Rice", emoji: "🍚" },
  { id: "dal", label: "Dal", emoji: "🥣" },
  { id: "sabzi", label: "Sabzi", emoji: "🥗" },
  { id: "dosa_idli", label: "Dosa / idli", emoji: "🥞" },
  { id: "poha_upma", label: "Poha / upma", emoji: "🍲" },
  { id: "eggs", label: "Eggs", emoji: "🥚" },
  { id: "paneer_tofu", label: "Paneer / tofu", emoji: "🧀" },
  { id: "chicken_fish", label: "Chicken / fish", emoji: "🍗" },
  { id: "curd", label: "Curd / dahi", emoji: "🥛" },
  { id: "tea_coffee", label: "Tea / coffee", emoji: "☕" },
  { id: "snacks", label: "Snacks", emoji: "🍪" },
];

export const MEAL_PATTERNS = [
  { id: "early_dinner", label: "Early dinner (before 8 pm)", emoji: "🍽️" },
  { id: "late_dinner", label: "Late dinner (after 9 pm)", emoji: "🌙" },
  { id: "irregular_meals", label: "Irregular meal times", emoji: "🔄" },
  { id: "frequent_snacking", label: "Frequent snacking", emoji: "🍿" },
  { id: "fasting_window", label: "I keep a fasting window", emoji: "⏳" },
];

export const WORK_SCHEDULES = [
  { id: "desk_job", label: "Desk job", description: "Mostly seated, computer work", emoji: "💻" },
  { id: "hybrid", label: "Hybrid", description: "Mix of office and home days", emoji: "🏠" },
  { id: "shift_work", label: "Shift work", description: "Rotating or night shifts", emoji: "🌗" },
  { id: "student", label: "Student", description: "Classes, study blocks", emoji: "📚" },
  { id: "field_work", label: "Field work", description: "On the move, on your feet", emoji: "🚶" },
];

export const PROTEIN_PREFERENCES = [
  { id: "veg", label: "Vegetarian protein", emoji: "🥗" },
  { id: "vegan", label: "Vegan protein", emoji: "🌱" },
  { id: "dairy", label: "Dairy", emoji: "🥛" },
  { id: "egg", label: "Egg", emoji: "🥚" },
  { id: "chicken_fish", label: "Chicken / fish", emoji: "🍗" },
];
