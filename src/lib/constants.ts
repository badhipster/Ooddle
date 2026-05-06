import { Flame, Brain, Dumbbell, Moon, Pill, LucideIcon } from "lucide-react";

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
}

/* ──────────────────────────────────────────────────────────
   Micro-Action Library — tagged with goals for personalization.
   The dashboard pulls from here based on user's onboarding answers.
   ────────────────────────────────────────────────────────── */

interface MicroActionTemplate extends Omit<MicroAction, "id" | "completed"> {
  goalTags: string[]; // matches ONBOARDING_GOALS ids
  fitnessLevels?: ("beginner" | "intermediate" | "advanced")[];
}

export const MICRO_ACTION_LIBRARY: MicroActionTemplate[] = [
  // ── METABOLIC ──
  {
    pillarId: "metabolic",
    title: "Drink Warm Lemon Water",
    description: "Start your day with warm water + fresh lemon to kickstart digestion and hydration.",
    duration: "2 min",
    difficulty: "easy",
    goalTags: ["energy", "weight", "gut"],
  },
  {
    pillarId: "metabolic",
    title: "10-Min Post-Meal Walk",
    description: "Walk for 10 min after lunch to reduce blood sugar spikes by up to 30%.",
    duration: "10 min",
    difficulty: "easy",
    goalTags: ["energy", "weight"],
  },
  {
    pillarId: "metabolic",
    title: "Protein-First Breakfast",
    description: "Eat 30g of protein within 1 hour of waking to stabilize blood sugar all day.",
    duration: "5 min",
    difficulty: "easy",
    goalTags: ["energy", "weight", "fitness"],
  },
  {
    pillarId: "metabolic",
    title: "16-Hour Overnight Fast",
    description: "Stop eating 3 hours before bed; break the fast at noon for metabolic flexibility.",
    duration: "—",
    difficulty: "medium",
    goalTags: ["weight", "longevity", "energy"],
  },

  // ── MOVEMENT ──
  {
    pillarId: "movement",
    title: "5-Minute Morning Stretch",
    description: "Gentle full-body stretching to wake up muscles and improve circulation.",
    duration: "5 min",
    difficulty: "easy",
    goalTags: ["energy", "fitness"],
    fitnessLevels: ["beginner", "intermediate", "advanced"],
  },
  {
    pillarId: "movement",
    title: "8,000 Step Goal",
    description: "Hit 8K steps today. Light cardio improves mood, glucose control, and cardiovascular health.",
    duration: "Throughout day",
    difficulty: "easy",
    goalTags: ["fitness", "energy", "weight"],
    fitnessLevels: ["beginner", "intermediate"],
  },
  {
    pillarId: "movement",
    title: "Zone-2 Cardio (30 min)",
    description: "Steady cardio at 60-70% max HR builds aerobic base. You should be able to hold a conversation.",
    duration: "30 min",
    difficulty: "medium",
    goalTags: ["fitness", "longevity"],
    fitnessLevels: ["intermediate", "advanced"],
  },
  {
    pillarId: "movement",
    title: "Strength Training (3 sets)",
    description: "Squat, push, pull. 3 sets each. Compound moves drive the most adaptation.",
    duration: "20 min",
    difficulty: "hard",
    goalTags: ["fitness", "longevity", "weight"],
    fitnessLevels: ["intermediate", "advanced"],
  },

  // ── COGNITION ──
  {
    pillarId: "cognition",
    title: "Gratitude Journaling",
    description: "Write 3 things you're grateful for to boost serotonin and positive focus.",
    duration: "3 min",
    difficulty: "easy",
    goalTags: ["stress", "focus"],
  },
  {
    pillarId: "cognition",
    title: "5-Min Box Breathing",
    description: "4 sec inhale, 4 hold, 4 exhale, 4 hold. Calms the nervous system fast.",
    duration: "5 min",
    difficulty: "easy",
    goalTags: ["stress", "focus", "sleep"],
  },
  {
    pillarId: "cognition",
    title: "90-Min Deep Work Block",
    description: "One uninterrupted focus block. Phone in another room. Single tab. One task.",
    duration: "90 min",
    difficulty: "medium",
    goalTags: ["focus"],
  },
  {
    pillarId: "cognition",
    title: "Phone-Free First Hour",
    description: "Don't touch your phone for the first hour after waking. Sets the tone for the day.",
    duration: "60 min",
    difficulty: "medium",
    goalTags: ["focus", "stress"],
  },

  // ── RECOVERY ──
  {
    pillarId: "recovery",
    title: "Cold Water Face Splash",
    description: "Splash cold water on your face to activate the vagus nerve and reduce morning cortisol.",
    duration: "1 min",
    difficulty: "easy",
    goalTags: ["energy", "stress"],
  },
  {
    pillarId: "recovery",
    title: "No Screens 1 Hour Before Bed",
    description: "Blue light suppresses melatonin. Replace screens with reading, journaling, or stretching.",
    duration: "60 min",
    difficulty: "medium",
    goalTags: ["sleep", "energy"],
  },
  {
    pillarId: "recovery",
    title: "10-Min Morning Sunlight",
    description: "Within 30 min of waking, get direct sunlight in your eyes to anchor your circadian rhythm.",
    duration: "10 min",
    difficulty: "easy",
    goalTags: ["sleep", "energy", "stress"],
  },
  {
    pillarId: "recovery",
    title: "Cool the Bedroom (65-68°F)",
    description: "Lower your bedroom temp tonight for deeper sleep. Even 2-3°F makes a difference.",
    duration: "1 min",
    difficulty: "easy",
    goalTags: ["sleep"],
  },

  // ── SUPPLEMENTS ──
  {
    pillarId: "supplements",
    title: "Morning Vitamin D3 + K2",
    description: "Take D3 with a fat-containing meal. K2 directs calcium to bones, not arteries.",
    duration: "1 min",
    difficulty: "easy",
    goalTags: ["longevity", "energy"],
  },
  {
    pillarId: "supplements",
    title: "Magnesium Glycinate (Evening)",
    description: "200-400mg before bed for relaxation, sleep quality, and muscle recovery.",
    duration: "1 min",
    difficulty: "easy",
    goalTags: ["sleep", "stress", "fitness"],
  },
  {
    pillarId: "supplements",
    title: "Omega-3 (EPA/DHA)",
    description: "Take with a meal. Look for 500mg+ EPA and 250mg+ DHA. Reduces inflammation.",
    duration: "1 min",
    difficulty: "easy",
    goalTags: ["longevity", "focus"],
  },
];

// Default 5 actions (one per pillar, easiest variant) — used as a cold-start fallback.
export const DEFAULT_MICRO_ACTIONS: Omit<MicroAction, "id" | "completed">[] = (() => {
  const seen = new Set<string>();
  return MICRO_ACTION_LIBRARY.filter((a) => a.difficulty === "easy")
    .filter((a) => {
      if (seen.has(a.pillarId)) return false;
      seen.add(a.pillarId);
      return true;
    })
    .map(({ goalTags: _g, fitnessLevels: _f, ...rest }) => {
      void _g;
      void _f;
      return rest;
    });
})();

/**
 * Selects 5 personalized micro-actions (one per pillar) based on the user's
 * onboarding answers. Falls back to defaults when no preferences are set.
 *
 * Scoring: +2 per matching goal tag, +3 for fitness-level match (-5 mismatch),
 * +1 baseline for easy actions when no preferences exist.
 */
export function selectPersonalizedActions(
  goals: string[] = [],
  fitnessLevel: string = ""
): Omit<MicroAction, "id" | "completed">[] {
  const result: Omit<MicroAction, "id" | "completed">[] = [];
  const pillarIds: PillarId[] = ["metabolic", "movement", "cognition", "recovery", "supplements"];

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
      if (goals.length === 0 && a.difficulty === "easy") score += 1;
      return { action: a, score };
    });

    scored.sort((x, y) => y.score - x.score);
    const picked = scored[0];
    if (picked) {
      const { goalTags: _g, fitnessLevels: _f, ...clean } = picked.action;
      void _g;
      void _f;
      result.push(clean);
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
