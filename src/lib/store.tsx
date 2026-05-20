"use client";

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from "react";
import {
  MicroAction,
  PillarId,
  DEFAULT_MICRO_ACTIONS,
  selectPersonalizedActions,
  EnrichedTemplate,
} from "./constants";
import {
  EVIDENCE_CATALOG,
  Locale,
  SignalSourceType,
} from "./evidence";

/* ── Schema version ── */
export const CURRENT_SCHEMA_VERSION = 2;

/* ── Types ── */
export interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
  goals: string[];
  fitnessLevel: string;
  dietaryPreference: string;
  sleepPattern: string;
  onboardingCompleted: boolean;
  createdAt: string;

  // India-first onboarding fields (Week 3 surfaces these in the UI).
  locale?: Locale;
  primaryCuisine?: string[];
  commonMeals?: string[];
  mealPattern?: string[];
  workSchedule?: string;
  proteinPreference?: string[];
  constraints?: string[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  pillar?: PillarId;
}

export interface DayProgress {
  date: string;
  actions: MicroAction[];
  completedCount: number;
}

export type HealthSignalType =
  | "steps"
  | "sleep_duration"
  | "bedtime"
  | "wake_time"
  | "mood"
  | "energy"
  | "water_glasses"
  | "protein_servings";

export interface HealthSignal {
  id: string;
  userId?: string;
  type: HealthSignalType;
  value: string | number;
  unit?: string;
  sourceType: SignalSourceType;
  sourceId?: string;
  observedAt: string;
  createdAt: string;
  notes?: string;
}

export type HealthDataSourceType = "manual" | "apple_health" | "health_connect";
export type HealthDataSourceStatus =
  | "available"
  | "connected"
  | "not_available"
  | "coming_soon"
  | "error";

export interface HealthDataSource {
  id: string;
  type: HealthDataSourceType;
  status: HealthDataSourceStatus;
  lastSyncedAt?: string;
  permissions?: string[];
  errorMessage?: string;
}

export interface AppState {
  isAuthenticated: boolean;
  user: UserProfile | null;
  todayActions: MicroAction[];
  chatMessages: ChatMessage[];
  streak: number;
  weeklyProgress: DayProgress[];
  totalCompleted: number;
  healthSignals: HealthSignal[];
  healthDataSources: HealthDataSource[];
  schemaVersion: number;
}

type Action =
  | { type: "LOGIN"; payload: { name: string; email: string } }
  | { type: "LOGOUT" }
  | { type: "COMPLETE_ONBOARDING"; payload: Partial<UserProfile> }
  | { type: "TOGGLE_ACTION"; payload: string }
  | { type: "ADD_CHAT_MESSAGE"; payload: ChatMessage }
  | { type: "UPDATE_CHAT_MESSAGE"; payload: { id: string; content?: string; pillar?: PillarId } }
  | { type: "ADD_HEALTH_SIGNAL"; payload: HealthSignal }
  | { type: "SET_STATE"; payload: AppState };

/* ── Helpers ── */
function generateId() {
  return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
}

function getTodayStr() {
  return new Date().toISOString().split("T")[0];
}

function enrichedToMicroAction(t: EnrichedTemplate): MicroAction {
  return {
    ...t,
    id: generateId(),
    completed: false,
  };
}

function generateTodayActions(user?: UserProfile | null): MicroAction[] {
  const personalized: EnrichedTemplate[] =
    user && (user.goals.length > 0 || user.fitnessLevel)
      ? selectPersonalizedActions(user.goals, user.fitnessLevel)
      : DEFAULT_MICRO_ACTIONS;

  return personalized.map(enrichedToMicroAction);
}

function calculateStreak(progress: DayProgress[]): number {
  if (progress.length === 0) return 0;
  let streak = 0;
  const sorted = [...progress].sort((a, b) => b.date.localeCompare(a.date));
  for (const day of sorted) {
    if (day.completedCount > 0) streak++;
    else break;
  }
  return streak;
}

const DEFAULT_HEALTH_SOURCES: HealthDataSource[] = [
  { id: "manual", type: "manual", status: "available" },
  { id: "apple_health", type: "apple_health", status: "coming_soon" },
  { id: "health_connect", type: "health_connect", status: "coming_soon" },
];

/* ──────────────────────────────────────────────────────────
   Migration. Treat any saved state without a schemaVersion as v1.
   v1 -> v2 adds healthSignals, healthDataSources, optional profile
   fields, and rehydrates micro-actions with a starter explanation
   when they were saved before evidence metadata existed.
   ────────────────────────────────────────────────────────── */

function starterExplanationFor(pillarId: PillarId) {
  const starter = EVIDENCE_CATALOG.starter_baseline;
  return {
    rationale:
      "Starter recommendation based on your selected goals. As Ooddle learns more about your routine, this will get more specific.",
    signals: [],
    evidence: starter ? [starter] : [],
    confidence: "low" as const,
    pillarHintId: pillarId, // unused at runtime, kept so future inspectors can see origin
  };
}

function rehydrateMicroAction(raw: unknown): MicroAction | null {
  if (!raw || typeof raw !== "object") return null;
  const a = raw as Partial<MicroAction> & Record<string, unknown>;
  if (!a.id || !a.pillarId || !a.title || !a.description || !a.duration || !a.difficulty) {
    return null;
  }
  const pillarId = a.pillarId as PillarId;
  const explanation = a.explanation && typeof a.explanation === "object"
    ? (a.explanation as MicroAction["explanation"])
    : (() => {
        const { pillarHintId: _hint, ...rest } = starterExplanationFor(pillarId);
        void _hint;
        return rest;
      })();
  return {
    id: String(a.id),
    pillarId,
    title: String(a.title),
    description: String(a.description),
    duration: String(a.duration),
    difficulty: a.difficulty as MicroAction["difficulty"],
    completed: Boolean(a.completed),
    explanation,
  };
}

function migrateState(stored: unknown): AppState | null {
  if (!stored || typeof stored !== "object") return null;
  const s = stored as Partial<AppState> & Record<string, unknown>;
  const version = typeof s.schemaVersion === "number" ? s.schemaVersion : 1;

  // v1 -> v2: add new arrays, rehydrate actions, leave existing fields.
  const todayActions = Array.isArray(s.todayActions)
    ? (s.todayActions.map(rehydrateMicroAction).filter(Boolean) as MicroAction[])
    : [];

  const weeklyProgress: DayProgress[] = Array.isArray(s.weeklyProgress)
    ? (s.weeklyProgress as unknown[]).map((entry) => {
        const d = (entry ?? {}) as Record<string, unknown>;
        return {
          date: String(d.date ?? ""),
          actions: Array.isArray(d.actions)
            ? (d.actions.map(rehydrateMicroAction).filter(Boolean) as MicroAction[])
            : [],
          completedCount: Number(d.completedCount ?? 0),
        };
      })
    : [];

  const migrated: AppState = {
    isAuthenticated: Boolean(s.isAuthenticated),
    user: (s.user as UserProfile | null | undefined) ?? null,
    todayActions,
    chatMessages: Array.isArray(s.chatMessages) ? (s.chatMessages as ChatMessage[]) : [],
    streak: Number(s.streak ?? 0),
    weeklyProgress,
    totalCompleted: Number(s.totalCompleted ?? 0),
    healthSignals: Array.isArray(s.healthSignals) ? (s.healthSignals as HealthSignal[]) : [],
    healthDataSources: Array.isArray(s.healthDataSources) && s.healthDataSources.length > 0
      ? (s.healthDataSources as HealthDataSource[])
      : DEFAULT_HEALTH_SOURCES,
    schemaVersion: CURRENT_SCHEMA_VERSION,
  };

  // Quiet log so QA can confirm migrations are firing in the wild.
  if (typeof console !== "undefined" && version < CURRENT_SCHEMA_VERSION) {
    console.info(`[ooddle] migrated state from v${version} to v${CURRENT_SCHEMA_VERSION}`);
  }

  return migrated;
}

/* ── Initial State ── */
const initialState: AppState = {
  isAuthenticated: false,
  user: null,
  todayActions: generateTodayActions(),
  chatMessages: [],
  streak: 0,
  weeklyProgress: [],
  totalCompleted: 0,
  healthSignals: [],
  healthDataSources: DEFAULT_HEALTH_SOURCES,
  schemaVersion: CURRENT_SCHEMA_VERSION,
};

/* ── Reducer ── */
function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "LOGIN": {
      const user: UserProfile = {
        name: action.payload.name,
        email: action.payload.email,
        goals: [],
        fitnessLevel: "",
        dietaryPreference: "",
        sleepPattern: "",
        onboardingCompleted: false,
        createdAt: new Date().toISOString(),
        locale: "IN",
      };
      return { ...state, isAuthenticated: true, user };
    }

    case "LOGOUT":
      return {
        ...initialState,
        todayActions: generateTodayActions(),
      };

    case "COMPLETE_ONBOARDING": {
      if (!state.user) return state;
      const updatedUser = { ...state.user, ...action.payload, onboardingCompleted: true };
      // Regenerate today's actions based on the user's new preferences
      return {
        ...state,
        user: updatedUser,
        todayActions: generateTodayActions(updatedUser),
      };
    }

    case "TOGGLE_ACTION": {
      const todayActions = state.todayActions.map((a) =>
        a.id === action.payload ? { ...a, completed: !a.completed } : a
      );
      const completedCount = todayActions.filter((a) => a.completed).length;
      const today = getTodayStr();

      const existing = state.weeklyProgress.findIndex((d) => d.date === today);
      const dayProg: DayProgress = { date: today, actions: todayActions, completedCount };
      const weeklyProgress =
        existing >= 0
          ? state.weeklyProgress.map((d, i) => (i === existing ? dayProg : d))
          : [...state.weeklyProgress, dayProg];

      return {
        ...state,
        todayActions,
        weeklyProgress,
        streak: calculateStreak(weeklyProgress),
        totalCompleted: weeklyProgress.reduce((s, d) => s + d.completedCount, 0),
      };
    }

    case "ADD_CHAT_MESSAGE":
      return { ...state, chatMessages: [...state.chatMessages, action.payload] };

    case "UPDATE_CHAT_MESSAGE": {
      const { id, content, pillar } = action.payload;
      return {
        ...state,
        chatMessages: state.chatMessages.map((m) =>
          m.id === id
            ? {
                ...m,
                content: content !== undefined ? content : m.content,
                pillar: pillar !== undefined ? pillar : m.pillar,
              }
            : m
        ),
      };
    }

    case "ADD_HEALTH_SIGNAL":
      return {
        ...state,
        healthSignals: [...state.healthSignals, action.payload],
      };

    case "SET_STATE":
      return action.payload;

    default:
      return state;
  }
}

/* ── Context ── */
interface StoreContextValue {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  login: (name: string, email: string) => void;
  logout: () => void;
  completeOnboarding: (data: Partial<UserProfile>) => void;
  toggleAction: (id: string) => void;
  addChatMessage: (msg: ChatMessage) => void;
  updateChatMessage: (id: string, updates: { content?: string; pillar?: PillarId }) => void;
  addHealthSignal: (signal: Omit<HealthSignal, "id" | "createdAt">) => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

const STORAGE_KEY = "ooddle_state";

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [hydrated, setHydrated] = React.useState(false);

  // Hydrate from localStorage with schema migration
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as unknown;
        const migrated = migrateState(parsed);
        if (migrated) {
          // Regenerate today's actions if it's a new day, using user prefs.
          const today = getTodayStr();
          const todayProg = migrated.weeklyProgress.find((d) => d.date === today);
          if (todayProg) {
            migrated.todayActions = todayProg.actions;
          } else if (migrated.todayActions.length === 0) {
            migrated.todayActions = generateTodayActions(migrated.user);
          }
          dispatch({ type: "SET_STATE", payload: migrated });
        }
      }
    } catch {
      // ignore parse errors — caller falls back to initialState
    }
    setHydrated(true);
  }, []);

  // Persist to localStorage
  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, hydrated]);

  const value: StoreContextValue = {
    state,
    dispatch,
    login: (name, email) => dispatch({ type: "LOGIN", payload: { name, email } }),
    logout: () => {
      localStorage.removeItem(STORAGE_KEY);
      dispatch({ type: "LOGOUT" });
    },
    completeOnboarding: (data) => dispatch({ type: "COMPLETE_ONBOARDING", payload: data }),
    toggleAction: (id) => dispatch({ type: "TOGGLE_ACTION", payload: id }),
    addChatMessage: (msg) => dispatch({ type: "ADD_CHAT_MESSAGE", payload: msg }),
    updateChatMessage: (id, updates) =>
      dispatch({ type: "UPDATE_CHAT_MESSAGE", payload: { id, ...updates } }),
    addHealthSignal: (signal) =>
      dispatch({
        type: "ADD_HEALTH_SIGNAL",
        payload: {
          ...signal,
          id: generateId(),
          createdAt: new Date().toISOString(),
        },
      }),
  };

  if (!hydrated) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "var(--surface-0)" }}>
        <div className="animate-pulse-ring" style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--ooddle-primary)" }} />
      </div>
    );
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
