# PRD: 30-Day Product Bets

## Summary

Ship three linked improvements that make Ooddle feel less like a generic wellness chatbot and more like a daily health operating system:

1. Evidence-traced daily micro-actions.
2. India-first food and routine onboarding.
3. Apple Health / Health Connect import with manual fallback and freshness warnings.

The 30-day release should remain wellness-only. It must not diagnose, treat, prescribe, or suggest medication changes.

## Problem

Ooddle already has onboarding, daily five-pillar actions, progress tracking, and a routed AI chat. The current product still has three credibility gaps:

- Daily actions are personalized by simple goal tags, but users cannot see why an action was selected.
- Onboarding captures broad diet and sleep preferences, but not enough India-relevant context to tailor metabolic actions.
- The app cannot distinguish self-reported context from fresh wearable or manual health signals.

## Goals

- Increase daily action completion by making each action feel specific and justified.
- Improve metabolic relevance for Indian users without building a full calorie tracker.
- Prepare the data model for wearable imports and future agent memory.

## Non-Goals

- No diagnosis, disease management, medication adjustment, or supplement commerce.
- No paid subscriptions or Stripe in this release.
- No full food database, barcode scanner, CGM integration, or calorie estimation.
- No production database requirement. This PRD includes localStorage-compatible schema changes and future backend table equivalents.

## Success Metrics

| Metric | Target |
|---|---:|
| Onboarding completion rate | +15 percent relative |
| Day-1 micro-action completion | 60 percent of onboarded users complete at least 1 action |
| Explanation engagement | 40 percent of users expand at least 1 "why this" panel |
| Manual signal logging | 30 percent of onboarded users add at least 1 manual signal |
| Data freshness comprehension | 90 percent of stale imported/manual signals display warning state in QA |

## Release Scope

### Must Have

- Add evidence and rationale metadata to all generated daily micro-actions.
- Show "Why this today" on each dashboard action card.
- Extend onboarding with India food/routine fields.
- Add manual health signal capture for steps, sleep duration, mood, energy, protein, and water.
- Add health data connection state and data freshness surfaces.
- Feed the enriched profile and recent signals into the AI chat request.

### Should Have

- Lightweight "source quality" labels: profile, manual, wearable, estimate, evidence.
- Regenerate daily actions after onboarding changes and after new day rollover.
- Track analytics events through a local no-op wrapper ready for PostHog later.

### Could Have

- Smart defaults for protein targets based on goal and diet preference.
- Export debug JSON for QA.

## Feature 1: Evidence-Traced Daily Micro-Actions

### User Problem

Users do not trust generic wellness advice. Each micro-action needs to explain why Ooddle chose it and what signal or evidence it used.

### Functional Requirements

- Each daily micro-action must include:
  - `rationale`: one short plain-language reason.
  - `signals`: zero to three user signals used to pick it.
  - `evidence`: one to two evidence references or evidence categories.
  - `confidence`: `low`, `medium`, or `high`.
  - `safetyNote`: optional, used especially for supplements and fasting.
- Dashboard action cards must show the action title and description by default.
- Users can expand a card to view "Why this today".
- If the action is selected without meaningful user data, the explanation must say it is a starter recommendation.
- The AI chat should receive today’s actions and explanations as context when users ask about plans or progress.

### User Stories

#### Story 1.1: See Why An Action Was Recommended

**As a** wellness user, **I want** to expand a micro-action and see why Ooddle picked it, **so that** I can decide whether to trust and complete it.

**Acceptance Criteria**

- Given I am on the dashboard, when today’s micro-actions load, then every action card has a visible "Why this" affordance.
- Given I tap "Why this", when the panel opens, then I see rationale, signals, evidence, confidence, and safety note if present.
- Given an action was selected only from default starter logic, when I open "Why this", then the signal section says "Starter recommendation based on your selected goals" or equivalent.
- Given a supplement or fasting action has a safety note, when I open "Why this", then the safety note is visually separate from the rationale.

**Definition of Done**

- [ ] All five daily action cards support expanded rationale.
- [ ] Works on mobile and desktop without layout shift.
- [ ] At least one unit test covers action explanation generation.
- [ ] QA verifies no action renders with empty rationale.
- [ ] Copy avoids medical claims and medication advice.

**Estimate**: 3 story points  
**Dependencies**: constants library, dashboard UI, store schema  
**Priority**: P0

#### Story 1.2: Generate Evidence Metadata For Actions

**As a** product system, **I want** action templates to carry evidence metadata, **so that** generated actions can be explained consistently.

**Acceptance Criteria**

- Given the micro-action library is loaded, when actions are generated, then each action has `rationale`, `signals`, `evidence`, and `confidence`.
- Given a generated action references a user signal, when the source signal is unavailable, then the generator omits that signal instead of fabricating one.
- Given a user has a goal such as weight, sleep, stress, fitness, gut, energy, focus, or longevity, when actions are generated, then at least three of five actions reference a matching goal or profile field.

**Definition of Done**

- [ ] Micro-action templates include evidence metadata.
- [ ] `generateTodayActions` or its replacement returns typed enriched actions.
- [ ] TypeScript catches missing required explanation fields.
- [ ] Existing completion and progress behavior still works.

**Estimate**: 5 story points  
**Dependencies**: store schema, constants  
**Priority**: P0

#### Story 1.3: Include Action Context In AI Chat

**As a** user, **I want** Ooddle chat to understand my current daily actions, **so that** follow-up advice matches my plan.

**Acceptance Criteria**

- Given I ask "why this action" or "what should I do first", when the chat request is sent, then the payload includes today’s actions and completion state.
- Given the assistant responds, then it may reference today’s action titles and pillars.
- Given no actions exist, then the chat route handles the missing context without error.

**Definition of Done**

- [ ] Client chat payload includes compact `dailyPlanContext`.
- [ ] API route type accepts `dailyPlanContext`.
- [ ] System prompt includes only recent, relevant action context.
- [ ] Streaming behavior is unchanged.

**Estimate**: 3 story points  
**Dependencies**: chat client, API route  
**Priority**: P1

## Feature 2: India-First Food And Routine Onboarding

### User Problem

Indian users often eat home-cooked meals, mixed plates, late dinners, tea/snack windows, and vegetarian or mixed dietary patterns. Current onboarding only captures generic dietary preference and sleep pattern.

### Functional Requirements

- Add onboarding fields:
  - `locale`: default `IN`.
  - `primaryCuisine`: multi-select.
  - `commonMeals`: multi-select for roti, rice, dal, sabzi, dosa/idli, poha/upma, eggs, paneer/tofu, chicken/fish, curd, tea/coffee, snacks.
  - `mealPattern`: early dinner, late dinner, irregular meals, frequent snacking, fasting window.
  - `workSchedule`: desk job, hybrid, shift work, student, field work.
  - `proteinPreference`: veg, egg, dairy, chicken/fish, vegan.
  - `constraints`: optional chips for travel, eating out, family meals, budget, digestion, cravings.
- The flow must not ask for weight, disease status, medication, or lab data in this release.
- The action selector must use these fields to improve metabolic and routine-based actions.

### User Stories

#### Story 2.1: Capture Indian Food Context During Onboarding

**As an** India-based user, **I want** onboarding to understand my common meals, **so that** Ooddle does not give generic Western diet advice.

**Acceptance Criteria**

- Given I reach the diet step, when I select dietary preference, then I can also select common meal staples.
- Given I select vegetarian or vegan preference, when protein suggestions are generated, then the app prioritizes paneer, tofu, dal, curd, soy, nuts, or other compatible options.
- Given I select chicken/fish or eggs, when protein suggestions are generated, then those options may appear.
- Given I skip optional meal staples, when I continue, then onboarding still completes.

**Definition of Done**

- [ ] Onboarding has a food-context step or expanded diet step.
- [ ] Selected fields persist in `UserProfile`.
- [ ] Dashboard action generation can read these fields.
- [ ] Mobile layout remains usable with long option labels.

**Estimate**: 5 story points  
**Dependencies**: onboarding UI, profile schema, action selector  
**Priority**: P0

#### Story 2.2: Capture Daily Routine Constraints

**As a** busy professional, **I want** Ooddle to know my work and meal rhythm, **so that** actions fit my day.

**Acceptance Criteria**

- Given I reach the routine step, when I select work schedule and meal pattern, then the values are saved to my profile.
- Given I select shift work, when recovery actions are generated, then they avoid assuming a standard morning sunlight schedule unless phrased as "after waking".
- Given I select late dinner, when metabolic or recovery actions are generated, then Ooddle may recommend an earlier light dinner, post-dinner walk, or wind-down routine.
- Given I select desk job, when movement actions are generated, then Ooddle may recommend desk mobility or walking breaks.

**Definition of Done**

- [ ] Routine fields exist in onboarding.
- [ ] At least five action templates use routine tags.
- [ ] Generated rationale references routine constraints when used.
- [ ] Profile page displays saved routine fields.

**Estimate**: 3 story points  
**Dependencies**: onboarding, profile page, constants  
**Priority**: P0

#### Story 2.3: Generate India-Relevant Starter Actions

**As an** onboarded user, **I want** my first daily plan to reflect Indian meals and routines, **so that** the product feels made for me immediately.

**Acceptance Criteria**

- Given I select roti, rice, dal, and late dinner, when my dashboard first loads, then at least one metabolic action references a relevant meal or timing habit.
- Given I select vegetarian protein preference, when a protein action appears, then it does not recommend meat.
- Given no India-specific fields are selected, when actions generate, then current generic actions still work.

**Definition of Done**

- [ ] Selector supports cuisine, meal, protein, and routine tags.
- [ ] No incompatible dietary recommendations appear in QA sample profiles.
- [ ] At least 10 India-relevant action templates exist across metabolic, movement, and recovery.

**Estimate**: 5 story points  
**Dependencies**: constants, action selector  
**Priority**: P1

## Feature 3: Health Import, Manual Fallback, And Freshness Warnings

### User Problem

Users want personalization from wearable and health data, but integrations can be unavailable, stale, or unreliable. Ooddle needs a trustable data-state layer before deeper personalization.

### Functional Requirements

- Add health data source state for:
  - Apple Health: supported on iOS only, mocked or future-ready in web MVP.
  - Health Connect: supported on Android only, mocked or future-ready in web MVP.
  - Manual entry: available to all users.
- Add manual signal capture:
  - steps.
  - sleep duration.
  - bedtime.
  - wake time.
  - mood.
  - energy.
  - water glasses.
  - protein servings.
- Add freshness states:
  - `fresh`: updated within 24 hours.
  - `aging`: 24 to 72 hours.
  - `stale`: older than 72 hours.
  - `missing`: no value.
- Dashboard and chat must not silently use stale data. If stale data influences a recommendation, the rationale must say so.

### User Stories

#### Story 3.1: Log Manual Health Signals

**As a** user without a connected wearable, **I want** to manually log simple health signals, **so that** Ooddle can personalize without requiring hardware.

**Acceptance Criteria**

- Given I open the dashboard, when I tap "Log signal", then I can add steps, sleep duration, mood, energy, water, and protein servings.
- Given I save a signal, then it appears in today’s signal summary.
- Given I enter invalid values, such as negative steps or 30 hours of sleep, then the app blocks save and shows inline validation.
- Given I log a new signal, when actions regenerate or the next day starts, then the signal can be used in rationale.

**Definition of Done**

- [ ] Manual signal entry exists.
- [ ] Validation exists for every numeric field.
- [ ] Signals persist in localStorage.
- [ ] Rationale generator can consume recent signals.

**Estimate**: 5 story points  
**Dependencies**: store schema, dashboard UI  
**Priority**: P0

#### Story 3.2: Show Data Source And Freshness

**As a** user, **I want** to know whether Ooddle is using fresh, stale, or missing data, **so that** I understand how confident recommendations are.

**Acceptance Criteria**

- Given a signal was updated today, when I view it, then it shows fresh state.
- Given a signal is older than 24 hours and newer than 72 hours, then it shows aging state.
- Given a signal is older than 72 hours, then it shows stale state and is not used as high-confidence evidence.
- Given no signal exists, then it shows missing state.
- Given an action uses stale or missing data, when I open "Why this", then confidence is lowered or the explanation says data is missing.

**Definition of Done**

- [ ] Freshness helper is unit tested.
- [ ] UI renders source and freshness labels.
- [ ] Explanation generation respects freshness state.
- [ ] Chat prompt excludes stale raw values unless needed with warning language.

**Estimate**: 3 story points  
**Dependencies**: signal model, dashboard UI, prompt builder  
**Priority**: P0

#### Story 3.3: Add Future-Ready Connection Settings

**As a** mobile-forward user, **I want** to see Apple Health and Health Connect readiness, **so that** I know Ooddle is built for my health data even before native mobile ships.

**Acceptance Criteria**

- Given I open Profile or Settings, when I view Health Data, then I see Manual Entry, Apple Health, and Health Connect source cards.
- Given I am in the web app, when I tap Apple Health or Health Connect, then I see a clear "coming with mobile" or "not available on web" state.
- Given a future native build marks a source connected, when the source card renders, then it can show connected, last sync, and permission scopes.

**Definition of Done**

- [ ] `HealthDataSource` schema exists.
- [ ] Settings/Profile has source cards.
- [ ] No fake sync claims are shown.
- [ ] Source cards are accessible by keyboard.

**Estimate**: 3 story points  
**Dependencies**: profile/settings UI  
**Priority**: P1

## Schema Changes

Current persistence is `AppState` in localStorage via `src/lib/store.tsx`. These types can be added now without a backend. If Supabase or another database is added later, the table equivalents are listed below.

### TypeScript State Schema

```ts
export type Locale = "IN" | "US" | "GLOBAL";
export type SignalSourceType = "manual" | "apple_health" | "health_connect" | "wearable" | "estimate";
export type FreshnessStatus = "fresh" | "aging" | "stale" | "missing";
export type ConfidenceLevel = "low" | "medium" | "high";

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

  locale?: Locale;
  primaryCuisine?: string[];
  commonMeals?: string[];
  mealPattern?: string[];
  workSchedule?: string;
  proteinPreference?: string[];
  constraints?: string[];
}

export interface EvidenceReference {
  id: string;
  label: string;
  sourceType: "expert" | "guideline" | "study" | "ooddle_rule" | "starter";
  url?: string;
  summary: string;
}

export interface RecommendationSignal {
  id: string;
  label: string;
  value?: string | number;
  unit?: string;
  sourceType: SignalSourceType;
  freshness: FreshnessStatus;
  observedAt?: string;
}

export interface MicroActionExplanation {
  rationale: string;
  signals: RecommendationSignal[];
  evidence: EvidenceReference[];
  confidence: ConfidenceLevel;
  safetyNote?: string;
}

export interface MicroAction {
  id: string;
  pillarId: PillarId;
  title: string;
  description: string;
  duration: string;
  difficulty: "easy" | "medium" | "hard";
  completed: boolean;
  explanation: MicroActionExplanation;
}

export interface HealthSignal {
  id: string;
  userId?: string;
  type:
    | "steps"
    | "sleep_duration"
    | "bedtime"
    | "wake_time"
    | "mood"
    | "energy"
    | "water_glasses"
    | "protein_servings";
  value: string | number;
  unit?: string;
  sourceType: SignalSourceType;
  sourceId?: string;
  observedAt: string;
  createdAt: string;
  notes?: string;
}

export interface HealthDataSource {
  id: string;
  type: "manual" | "apple_health" | "health_connect";
  status: "available" | "connected" | "not_available" | "coming_soon" | "error";
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
```

### Local Storage Migration

- Add `schemaVersion: 2`.
- If stored state has no `schemaVersion`, treat it as version 1.
- Version 1 to 2 migration:
  - Add empty `healthSignals`.
  - Add default `healthDataSources` with manual available, Apple Health coming soon, Health Connect coming soon.
  - Add empty optional profile fields.
  - Rehydrate existing micro-actions by generating default starter explanations if missing.

### Future Backend Tables

```sql
create table user_profiles (
  id uuid primary key,
  email text unique not null,
  name text not null,
  goals text[] not null default '{}',
  fitness_level text,
  dietary_preference text,
  sleep_pattern text,
  locale text default 'IN',
  primary_cuisine text[] default '{}',
  common_meals text[] default '{}',
  meal_pattern text[] default '{}',
  work_schedule text,
  protein_preference text[] default '{}',
  constraints text[] default '{}',
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table health_data_sources (
  id uuid primary key,
  user_id uuid not null references user_profiles(id) on delete cascade,
  type text not null,
  status text not null,
  last_synced_at timestamptz,
  permissions text[] default '{}',
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table health_signals (
  id uuid primary key,
  user_id uuid not null references user_profiles(id) on delete cascade,
  type text not null,
  value_text text,
  value_number numeric,
  unit text,
  source_type text not null,
  source_id uuid references health_data_sources(id),
  observed_at timestamptz not null,
  created_at timestamptz not null default now(),
  notes text
);

create table daily_micro_actions (
  id uuid primary key,
  user_id uuid not null references user_profiles(id) on delete cascade,
  date date not null,
  pillar_id text not null,
  title text not null,
  description text not null,
  duration text,
  difficulty text not null,
  completed boolean not null default false,
  completed_at timestamptz,
  rationale text not null,
  confidence text not null,
  safety_note text,
  created_at timestamptz not null default now()
);

create table micro_action_signals (
  id uuid primary key,
  micro_action_id uuid not null references daily_micro_actions(id) on delete cascade,
  health_signal_id uuid references health_signals(id),
  label text not null,
  value_text text,
  value_number numeric,
  unit text,
  source_type text not null,
  freshness text not null,
  observed_at timestamptz
);

create table evidence_references (
  id uuid primary key,
  key text unique not null,
  label text not null,
  source_type text not null,
  url text,
  summary text not null,
  created_at timestamptz not null default now()
);

create table micro_action_evidence (
  micro_action_id uuid not null references daily_micro_actions(id) on delete cascade,
  evidence_reference_id uuid not null references evidence_references(id),
  primary key (micro_action_id, evidence_reference_id)
);
```

## API And Prompt Changes

### `/api/chat` Request

```ts
interface ChatRequest {
  message: string;
  history?: ChatHistoryItem[];
  userProfile?: UserProfile | null;
  dailyPlanContext?: {
    date: string;
    actions: Array<{
      pillarId: PillarId;
      title: string;
      completed: boolean;
      rationale: string;
      confidence: ConfidenceLevel;
    }>;
  };
  recentSignals?: Array<{
    type: HealthSignal["type"];
    value: string | number;
    unit?: string;
    sourceType: SignalSourceType;
    freshness: FreshnessStatus;
    observedAt: string;
  }>;
}
```

### Prompt Rules

- Use recent signals only if `fresh` or `aging`.
- If using stale context, explicitly say it may be outdated.
- Never infer diagnosis from signals.
- Never recommend medication changes.
- Supplement actions must include "check with a clinician if pregnant, managing a condition, or taking medications" or shorter equivalent.

## Analytics Events

| Event | Properties |
|---|---|
| `onboarding_food_context_saved` | locale, dietaryPreference, commonMealsCount, proteinPreferenceCount |
| `onboarding_routine_saved` | mealPatternCount, workSchedule, constraintsCount |
| `micro_action_why_expanded` | pillarId, confidence, signalCount |
| `manual_signal_logged` | signalType, sourceType |
| `health_source_card_viewed` | sourceType, status |
| `chat_sent_with_plan_context` | actionCount, signalCount |

## Compliance And Safety Requirements

- All copy must use wellness language: support, guide, suggest, track, reflect.
- Avoid medical language: diagnose, treat, cure, reverse disease, manage condition.
- Add a short disclaimer near health data settings: "Ooddle is for general wellness and education, not medical advice."
- Do not collect medical diagnoses, medications, lab values, pregnancy status, or disease history in this release.
- Do not use health data for ads or targeting.

## Engineering Handoff Checklist

- [ ] User stories have Given/When/Then acceptance criteria.
- [ ] Store schema and migration are implemented before UI reads new fields.
- [ ] Dashboard action cards support rationale expansion.
- [ ] Onboarding saves India food and routine fields.
- [ ] Manual signal logging validates values.
- [ ] Freshness helper has tests.
- [ ] Chat request includes compact plan and signal context.
- [ ] QA tests old localStorage migration.
- [ ] QA tests mobile dashboard and onboarding.
- [ ] Safety copy reviewed before release.

