# TrainReady

Slimme fitness webapp die krachtsporters helpt bepalen wat vandaag de slimste training is op basis van herstel per spiergroep, beschikbare tijd en trainingsdoel.

**Kernvraag:** "Wat is vandaag de slimste training voor mij?"
**Kernbelofte:** Train slimmer, niet alleen harder.
**Eigenaar:** Lars Peterson (solo developer, HBO Commerciële Economie student)
**Taal:** Nederlands in UI en communicatie, Engels in code.

## Tech Stack

- **Framework:** Next.js 14+ (App Router) met TypeScript
- **Styling:** Tailwind CSS + shadcn/ui (nog niet geïnitialiseerd via CLI)
- **Backend:** Supabase (PostgreSQL + Auth + RLS)
- **State:** TanStack Query (server state) + Zustand (client state)
- **Hosting:** Vercel
- **ORM:** Nog niet actief — queries gaan direct via Supabase client

## Projectstructuur

```
src/
├── app/
│   ├── (auth)/          # Login, register, onboarding
│   ├── (app)/           # Authenticated routes met bottom nav
│   │   ├── dashboard/   # Homescreen met advies + herstelgrid
│   │   ├── workout/new/ # Workout logger (3-stap flow)
│   │   ├── recovery/    # Herstel per spiergroep
│   │   └── profile/     # Gebruikersprofiel
│   └── page.tsx         # Root redirect
├── components/
│   ├── dashboard/       # Dashboard-specifieke componenten
│   ├── workout/         # Workout logger componenten
│   ├── recovery/        # Herstel visualisatie
│   ├── profile/         # Profiel componenten
│   └── shared/          # Bottom nav, gedeelde UI
├── lib/
│   ├── supabase/        # Client (browser), server, middleware
│   ├── recovery/        # Recovery engine + constants
│   └── advice/          # Trainingsadvies engine
├── actions/             # Server Actions (nog leeg)
├── hooks/               # Custom hooks (nog leeg)
├── stores/              # Zustand stores (nog leeg)
└── types/
    └── database.ts      # Alle TypeScript types

supabase/
├── migrations/
│   └── 001_initial_schema.sql  # Volledig schema met RLS
└── seed.sql                     # 10 spiergroepen + 64 oefeningen
```

## Database

8 tabellen: `profiles`, `muscle_groups`, `exercises`, `exercise_muscle_groups`, `workouts`, `workout_exercises`, `workout_sets`, `muscle_fatigue_logs`.

Row Level Security is actief op alle tabellen. Elke gebruiker ziet alleen eigen data. Standaard oefeningen (is_custom = false) zijn voor iedereen zichtbaar. Een trigger maakt automatisch een profiel aan bij registratie.

Schema staat in `supabase/migrations/001_initial_schema.sql`. Seed data in `supabase/seed.sql`.

## Recovery Engine (src/lib/recovery/engine.ts)

Het herstelmodel werkt met fatigue points en exponential decay:

1. **Bij workout opslaan:** fatigue_points = sets × muscle_weight × (session_rpe / 10)
   - muscle_weight: 1.0 (primary), 0.5 (secondary)
2. **Recovery berekening:** remaining = initial × e^(-decay_rate × hours_elapsed)
   - Decay rates: large muscles ~0.035-0.038, medium ~0.040, small ~0.045
3. **Score:** recovery_score = clamp(0, 100, 100 - remaining_fatigue × 10)
4. **Status:** 70-100 = hersteld (groen), 40-69 = gedeeltelijk (oranje), 0-39 = niet hersteld (rood)

Fatigue is cumulatief over meerdere sessies. Lookback period is 14 dagen.

## Advies Engine (src/lib/advice/engine.ts)

6-stap algoritme:
1. Bereken readiness per split (gewogen gemiddelde: primary × 2.0, secondary × 1.0)
2. Filter op gebruikers split-voorkeur (PPL / Upper-Lower / Full Body)
3. Rangschik met penalties: -25 voor zelfde split gisteren, -30 als weekdoel bereikt
4. Pas aan op beschikbare tijd (<30min = rust, 30-45 = verkort, 45-75 = normaal)
5. Pas aan op trainingsdoel (muscle_building: min recovery 55, cut: min 40)
6. Genereer advies in het Nederlands

Rustdag als: beste score < 45, of max consecutive days bereikt.

## Design System

Donker thema, mobile-first. Kleuren als CSS variabelen in globals.css:
- bg: #0a0a0f, surface: #13131a, card: #1c1c28
- accent: #6366f1 (indigo), green: #22c55e, orange: #f59e0b, red: #ef4444
- Font: Inter

## Wat al werkt

- Volledige auth flow (login/register/middleware/redirect)
- Onboarding (4 stappen: doel, niveau, split, frequentie)
- Dashboard met advieskaart, herstelgrid, laatste training
- Workout logger (type kiezen → oefeningen toevoegen → sets loggen → RPE → opslaan)
- Herstel overzicht met expandable details per spiergroep
- Profiel pagina
- Recovery engine (berekening + opslaan fatigue logs)
- Advies engine (volledige logica)
- Bottom navigation
- PWA manifest

## Wat nog gebouwd moet worden

### Prioriteit 1 (direct)
- [ ] Supabase project koppelen (.env.local invullen)
- [ ] `npx shadcn@latest init` draaien voor component library
- [ ] Testen of auth flow werkt end-to-end
- [ ] Testen of workout opslaan correct fatigue logs aanmaakt
- [ ] Profiel bewerken (nu read-only, moet editable worden)

### Prioriteit 2 (kort na werkend)
- [ ] Oefening progressie pagina (grafiek gewicht over tijd)
- [ ] Custom oefening toevoegen
- [ ] Workout history overzicht
- [ ] Beschikbare tijd slider op dashboard die advies live aanpast
- [ ] Loading states en error handling verbeteren
- [ ] Optimistic updates met TanStack Query

### Prioriteit 3 (later)
- [ ] Weekoverzicht volume per spiergroep
- [ ] Deload signalering
- [ ] Workout templates
- [ ] Google login
- [ ] PWA offline capabilities

## Conventies

- Server Components voor data fetching, Client Components voor interactie
- Server Actions in `src/actions/` voor mutaties (nog niet geïmplementeerd — nu direct Supabase client calls)
- Alle database types in `src/types/database.ts`
- Recovery/advice logica is puur functioneel (geen side effects, makkelijk testbaar)
- Nederlandse UI teksten, Engelse code/variabelen
- Geen medische claims — gebruik woorden als "indicatie", "inschatting", "suggestie"

## Referentiedocumenten

In de bovenliggende map staan:
- `STRATEGIE-MVP.md` — volledige productstrategie, user stories, roadmap
- `ADVIES-ENGINE.md` — gedetailleerd ontwerp advies-engine met voorbeeldscenario's
- `seed-data.ts` — TypeScript versie van de oefeningen database
- `wireframes.jsx` — interactieve React wireframes

## Setup instructies

```bash
# 1. Dependencies installeren
npm install

# 2. Supabase project aanmaken op supabase.com
# 3. .env.local aanmaken
cp .env.local.example .env.local
# Vul NEXT_PUBLIC_SUPABASE_URL en NEXT_PUBLIC_SUPABASE_ANON_KEY in

# 4. Database schema uitvoeren in Supabase SQL Editor
# Voer supabase/migrations/001_initial_schema.sql uit
# Voer supabase/seed.sql uit

# 5. Dev server starten
npm run dev
```
