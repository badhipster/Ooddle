"use client";

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from "react";
import { MicroAction, PillarId, DEFAULT_MICRO_ACTIONS } from "./constants";

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

export interface AppState {
  isAuthenticated: boolean;
  user: UserProfile | null;
  todayActions: MicroAction[];
  chatMessages: ChatMessage[];
  streak: number;
  weeklyProgress: DayProgress[];
  totalCompleted: number;
}

type Action =
  | { type: "LOGIN"; payload: { name: string; email: string } }
  | { type: "LOGOUT" }
  | { type: "COMPLETE_ONBOARDING"; payload: Partial<UserProfile> }
  | { type: "TOGGLE_ACTION"; payload: string }
  | { type: "ADD_CHAT_MESSAGE"; payload: ChatMessage }
  | { type: "SET_STATE"; payload: AppState };

/* ── Helpers ── */
function generateId() {
  return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
}

function getTodayStr() {
  return new Date().toISOString().split("T")[0];
}

function generateTodayActions(): MicroAction[] {
  return DEFAULT_MICRO_ACTIONS.map((a) => ({
    ...a,
    id: generateId(),
    completed: false,
  }));
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

/* ── Initial State ── */
const initialState: AppState = {
  isAuthenticated: false,
  user: null,
  todayActions: generateTodayActions(),
  chatMessages: [],
  streak: 0,
  weeklyProgress: [],
  totalCompleted: 0,
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
      };
      return { ...state, isAuthenticated: true, user };
    }

    case "LOGOUT":
      return { ...initialState, todayActions: generateTodayActions() };

    case "COMPLETE_ONBOARDING":
      if (!state.user) return state;
      return {
        ...state,
        user: { ...state.user, ...action.payload, onboardingCompleted: true },
      };

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
}

const StoreContext = createContext<StoreContextValue | null>(null);

const STORAGE_KEY = "ooddle_state";

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [hydrated, setHydrated] = React.useState(false);

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as AppState;
        // Regenerate today's actions if it's a new day
        const today = getTodayStr();
        const todayProg = parsed.weeklyProgress.find((d) => d.date === today);
        if (todayProg) {
          parsed.todayActions = todayProg.actions;
        } else {
          parsed.todayActions = generateTodayActions();
        }
        dispatch({ type: "SET_STATE", payload: parsed });
      }
    } catch {
      // ignore parse errors
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
