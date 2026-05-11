-- ============================================================
-- TrainReady MVP - Initial Database Schema
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- ENUM TYPES
-- ============================================================

CREATE TYPE training_goal AS ENUM ('muscle_building', 'strength', 'cut', 'maintenance');
CREATE TYPE training_level AS ENUM ('beginner', 'intermediate', 'advanced');
CREATE TYPE preferred_split AS ENUM ('ppl', 'upper_lower', 'full_body', 'custom');
CREATE TYPE gym_preference AS ENUM ('gym', 'home', 'both');
CREATE TYPE muscle_category AS ENUM ('small', 'medium', 'large');
CREATE TYPE exercise_category AS ENUM ('compound', 'isolation');
CREATE TYPE equipment_type AS ENUM ('barbell', 'dumbbell', 'machine', 'cable', 'bodyweight', 'other');
CREATE TYPE muscle_involvement AS ENUM ('primary', 'secondary');

-- ============================================================
-- PROFILES
-- ============================================================

CREATE TABLE profiles (
  id                      UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name            TEXT NOT NULL,
  training_goal           training_goal NOT NULL DEFAULT 'muscle_building',
  training_level          training_level NOT NULL DEFAULT 'intermediate',
  preferred_split         preferred_split NOT NULL DEFAULT 'ppl',
  training_days_per_week  INT NOT NULL DEFAULT 4 CHECK (training_days_per_week BETWEEN 1 AND 7),
  avg_session_minutes     INT NOT NULL DEFAULT 60 CHECK (avg_session_minutes BETWEEN 15 AND 180),
  age                     INT CHECK (age BETWEEN 14 AND 100),
  weight_kg               DECIMAL(5,1) CHECK (weight_kg BETWEEN 30 AND 300),
  height_cm               INT CHECK (height_cm BETWEEN 100 AND 250),
  gym_preference          gym_preference DEFAULT 'gym',
  onboarding_completed    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- MUSCLE GROUPS
-- ============================================================

CREATE TABLE muscle_groups (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL UNIQUE,
  display_name    TEXT NOT NULL,
  category        muscle_category NOT NULL,
  decay_rate      DECIMAL(6,4) NOT NULL,
  display_order   INT NOT NULL
);

-- ============================================================
-- EXERCISES
-- ============================================================

CREATE TABLE exercises (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  category        exercise_category NOT NULL,
  equipment       equipment_type,
  is_custom       BOOLEAN NOT NULL DEFAULT FALSE,
  created_by      UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_exercise_per_user UNIQUE (name, created_by)
);

-- ============================================================
-- EXERCISE <-> MUSCLE GROUP MAPPING
-- ============================================================

CREATE TABLE exercise_muscle_groups (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exercise_id     UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  muscle_group_id UUID NOT NULL REFERENCES muscle_groups(id) ON DELETE CASCADE,
  involvement     muscle_involvement NOT NULL,
  weight          DECIMAL(3,2) NOT NULL DEFAULT 1.0 CHECK (weight BETWEEN 0.1 AND 1.0),
  UNIQUE(exercise_id, muscle_group_id)
);

-- ============================================================
-- WORKOUTS
-- ============================================================

CREATE TABLE workouts (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date              DATE NOT NULL DEFAULT CURRENT_DATE,
  workout_type      TEXT NOT NULL,  -- 'push', 'pull', 'legs', 'upper', 'lower', 'full_body', 'custom'
  duration_minutes  INT CHECK (duration_minutes BETWEEN 1 AND 300),
  session_rpe       INT CHECK (session_rpe BETWEEN 1 AND 10),
  notes             TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- WORKOUT EXERCISES
-- ============================================================

CREATE TABLE workout_exercises (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_id      UUID NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
  exercise_id     UUID NOT NULL REFERENCES exercises(id),
  order_index     INT NOT NULL DEFAULT 0,
  notes           TEXT
);

-- ============================================================
-- WORKOUT SETS
-- ============================================================

CREATE TABLE workout_sets (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_exercise_id   UUID NOT NULL REFERENCES workout_exercises(id) ON DELETE CASCADE,
  set_number            INT NOT NULL CHECK (set_number >= 1),
  reps                  INT NOT NULL CHECK (reps >= 0),
  weight_kg             DECIMAL(6,2) NOT NULL CHECK (weight_kg >= 0),
  rir                   INT CHECK (rir BETWEEN 0 AND 10),
  completed             BOOLEAN NOT NULL DEFAULT TRUE,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- MUSCLE FATIGUE LOGS
-- ============================================================

CREATE TABLE muscle_fatigue_logs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  muscle_group_id UUID NOT NULL REFERENCES muscle_groups(id),
  workout_id      UUID NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
  fatigue_points  DECIMAL(5,2) NOT NULL CHECK (fatigue_points >= 0),
  logged_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX idx_workouts_user_date ON workouts(user_id, date DESC);
CREATE INDEX idx_workouts_user_created ON workouts(user_id, created_at DESC);
CREATE INDEX idx_workout_exercises_workout ON workout_exercises(workout_id);
CREATE INDEX idx_workout_sets_exercise ON workout_sets(workout_exercise_id);
CREATE INDEX idx_fatigue_user_muscle_time ON muscle_fatigue_logs(user_id, muscle_group_id, logged_at DESC);
CREATE INDEX idx_exercises_custom ON exercises(created_by) WHERE is_custom = TRUE;
CREATE INDEX idx_exercise_muscle_groups_exercise ON exercise_muscle_groups(exercise_id);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE muscle_fatigue_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;

-- Profiles: users can only access their own
CREATE POLICY profiles_select ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY profiles_insert ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY profiles_update ON profiles FOR UPDATE USING (auth.uid() = id);

-- Workouts: users can only access their own
CREATE POLICY workouts_select ON workouts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY workouts_insert ON workouts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY workouts_update ON workouts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY workouts_delete ON workouts FOR DELETE USING (auth.uid() = user_id);

-- Workout exercises: access through workout ownership
CREATE POLICY workout_exercises_select ON workout_exercises FOR SELECT
  USING (EXISTS (SELECT 1 FROM workouts WHERE workouts.id = workout_exercises.workout_id AND workouts.user_id = auth.uid()));
CREATE POLICY workout_exercises_insert ON workout_exercises FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM workouts WHERE workouts.id = workout_exercises.workout_id AND workouts.user_id = auth.uid()));
CREATE POLICY workout_exercises_update ON workout_exercises FOR UPDATE
  USING (EXISTS (SELECT 1 FROM workouts WHERE workouts.id = workout_exercises.workout_id AND workouts.user_id = auth.uid()));
CREATE POLICY workout_exercises_delete ON workout_exercises FOR DELETE
  USING (EXISTS (SELECT 1 FROM workouts WHERE workouts.id = workout_exercises.workout_id AND workouts.user_id = auth.uid()));

-- Workout sets: access through workout exercise -> workout ownership
CREATE POLICY workout_sets_select ON workout_sets FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM workout_exercises we
    JOIN workouts w ON w.id = we.workout_id
    WHERE we.id = workout_sets.workout_exercise_id AND w.user_id = auth.uid()
  ));
CREATE POLICY workout_sets_insert ON workout_sets FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM workout_exercises we
    JOIN workouts w ON w.id = we.workout_id
    WHERE we.id = workout_sets.workout_exercise_id AND w.user_id = auth.uid()
  ));
CREATE POLICY workout_sets_update ON workout_sets FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM workout_exercises we
    JOIN workouts w ON w.id = we.workout_id
    WHERE we.id = workout_sets.workout_exercise_id AND w.user_id = auth.uid()
  ));
CREATE POLICY workout_sets_delete ON workout_sets FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM workout_exercises we
    JOIN workouts w ON w.id = we.workout_id
    WHERE we.id = workout_sets.workout_exercise_id AND w.user_id = auth.uid()
  ));

-- Muscle fatigue logs: users can only access their own
CREATE POLICY fatigue_logs_select ON muscle_fatigue_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY fatigue_logs_insert ON muscle_fatigue_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Exercises: everyone can see default exercises, users see their own custom ones
CREATE POLICY exercises_select_default ON exercises FOR SELECT USING (is_custom = FALSE);
CREATE POLICY exercises_select_custom ON exercises FOR SELECT USING (is_custom = TRUE AND created_by = auth.uid());
CREATE POLICY exercises_insert ON exercises FOR INSERT WITH CHECK (is_custom = TRUE AND created_by = auth.uid());
CREATE POLICY exercises_update ON exercises FOR UPDATE USING (is_custom = TRUE AND created_by = auth.uid());
CREATE POLICY exercises_delete ON exercises FOR DELETE USING (is_custom = TRUE AND created_by = auth.uid());

-- Muscle groups & exercise_muscle_groups: read-only for everyone
ALTER TABLE muscle_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_muscle_groups ENABLE ROW LEVEL SECURITY;
CREATE POLICY muscle_groups_select ON muscle_groups FOR SELECT USING (TRUE);
CREATE POLICY exercise_muscle_groups_select ON exercise_muscle_groups FOR SELECT USING (TRUE);

-- Allow users to add muscle group mappings for their custom exercises
CREATE POLICY exercise_muscle_groups_insert ON exercise_muscle_groups FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM exercises WHERE exercises.id = exercise_muscle_groups.exercise_id AND exercises.created_by = auth.uid()));

-- ============================================================
-- FUNCTION: Auto-create profile on signup
-- ============================================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
