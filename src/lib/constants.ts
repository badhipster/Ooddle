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

export const DEFAULT_MICRO_ACTIONS: Omit<MicroAction, "id" | "completed">[] = [
  {
    pillarId: "metabolic",
    title: "Drink Warm Lemon Water",
    description: "Start your day with a glass of warm water with fresh lemon to kickstart digestion and hydration.",
    duration: "2 min",
    difficulty: "easy",
  },
  {
    pillarId: "movement",
    title: "5-Minute Morning Stretch",
    description: "Gentle full-body stretching to wake up your muscles and improve circulation.",
    duration: "5 min",
    difficulty: "easy",
  },
  {
    pillarId: "cognition",
    title: "Gratitude Journaling",
    description: "Write 3 things you're grateful for to boost serotonin and positive focus.",
    duration: "3 min",
    difficulty: "easy",
  },
  {
    pillarId: "recovery",
    title: "Cold Water Face Splash",
    description: "Splash cold water on your face to activate vagus nerve and reduce morning cortisol.",
    duration: "1 min",
    difficulty: "easy",
  },
  {
    pillarId: "supplements",
    title: "Morning Vitamin D + K2",
    description: "Take your morning vitamin D3 with K2 with a fat-containing meal for optimal absorption.",
    duration: "1 min",
    difficulty: "easy",
  },
];

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
