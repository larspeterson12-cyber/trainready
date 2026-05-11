-- TrainReady - Seed Data for Supabase/PostgreSQL
-- Generated from seed-data.ts

-- ============================================================
-- MUSCLE GROUPS (10)
-- ============================================================

INSERT INTO muscle_groups (name, display_name, category, decay_rate, display_order) VALUES
  ('chest', 'Borst', 'large', 0.038, 1),
  ('back', 'Rug', 'large', 0.038, 2),
  ('shoulders', 'Schouders', 'medium', 0.040, 3),
  ('biceps', 'Biceps', 'small', 0.045, 4),
  ('triceps', 'Triceps', 'small', 0.045, 5),
  ('quadriceps', 'Quadriceps', 'large', 0.035, 6),
  ('hamstrings', 'Hamstrings', 'large', 0.035, 7),
  ('glutes', 'Bilspieren', 'large', 0.035, 8),
  ('calves', 'Kuiten', 'small', 0.045, 9),
  ('core', 'Core', 'medium', 0.040, 10);

-- ============================================================
-- EXERCISES (64)
-- ============================================================

-- ------------------------------------------------------------
-- CHEST EXERCISES
-- ------------------------------------------------------------

-- Bench Press Variations
INSERT INTO exercises (name, category, equipment, is_custom, created_by) VALUES
  ('Bench Press', 'compound', 'barbell', FALSE, NULL),
  ('Incline Bench Press', 'compound', 'barbell', FALSE, NULL),
  ('Decline Bench Press', 'compound', 'barbell', FALSE, NULL),
  ('Dumbbell Bench Press', 'compound', 'dumbbell', FALSE, NULL),
  ('Incline Dumbbell Bench Press', 'compound', 'dumbbell', FALSE, NULL),
  ('Machine Chest Press', 'compound', 'machine', FALSE, NULL);

-- Flyes
INSERT INTO exercises (name, category, equipment, is_custom, created_by) VALUES
  ('Dumbbell Fly', 'isolation', 'dumbbell', FALSE, NULL),
  ('Cable Fly', 'isolation', 'cable', FALSE, NULL),
  ('Pec Deck', 'isolation', 'machine', FALSE, NULL);

-- Dips
INSERT INTO exercises (name, category, equipment, is_custom, created_by) VALUES
  ('Dips (Chest)', 'compound', 'bodyweight', FALSE, NULL);

-- ------------------------------------------------------------
-- BACK EXERCISES
-- ------------------------------------------------------------

-- Rows
INSERT INTO exercises (name, category, equipment, is_custom, created_by) VALUES
  ('Barbell Row', 'compound', 'barbell', FALSE, NULL),
  ('Dumbbell Row', 'compound', 'dumbbell', FALSE, NULL),
  ('Seated Cable Row', 'compound', 'cable', FALSE, NULL),
  ('T-Bar Row', 'compound', 'barbell', FALSE, NULL),
  ('Machine Row', 'compound', 'machine', FALSE, NULL);

-- Pulldowns & Pull-ups
INSERT INTO exercises (name, category, equipment, is_custom, created_by) VALUES
  ('Lat Pulldown', 'compound', 'cable', FALSE, NULL),
  ('Pull-Up', 'compound', 'bodyweight', FALSE, NULL),
  ('Chin-Up', 'compound', 'bodyweight', FALSE, NULL);

-- Deadlift Variations
INSERT INTO exercises (name, category, equipment, is_custom, created_by) VALUES
  ('Deadlift', 'compound', 'barbell', FALSE, NULL),
  ('Romanian Deadlift', 'compound', 'barbell', FALSE, NULL),
  ('Sumo Deadlift', 'compound', 'barbell', FALSE, NULL);

-- Back Isolation
INSERT INTO exercises (name, category, equipment, is_custom, created_by) VALUES
  ('Straight-Arm Pulldown', 'isolation', 'cable', FALSE, NULL);

-- ------------------------------------------------------------
-- SHOULDER EXERCISES
-- ------------------------------------------------------------

-- Overhead Press
INSERT INTO exercises (name, category, equipment, is_custom, created_by) VALUES
  ('Overhead Press', 'compound', 'barbell', FALSE, NULL),
  ('Dumbbell Shoulder Press', 'compound', 'dumbbell', FALSE, NULL),
  ('Arnold Press', 'compound', 'dumbbell', FALSE, NULL),
  ('Machine Shoulder Press', 'compound', 'machine', FALSE, NULL);

-- Lateral Raises
INSERT INTO exercises (name, category, equipment, is_custom, created_by) VALUES
  ('Lateral Raise', 'isolation', 'dumbbell', FALSE, NULL),
  ('Cable Lateral Raise', 'isolation', 'cable', FALSE, NULL);

-- Rear Delts
INSERT INTO exercises (name, category, equipment, is_custom, created_by) VALUES
  ('Face Pull', 'isolation', 'cable', FALSE, NULL),
  ('Reverse Pec Deck', 'isolation', 'machine', FALSE, NULL);

-- ------------------------------------------------------------
-- ARM EXERCISES - BICEPS
-- ------------------------------------------------------------

INSERT INTO exercises (name, category, equipment, is_custom, created_by) VALUES
  ('Barbell Curl', 'isolation', 'barbell', FALSE, NULL),
  ('Dumbbell Curl', 'isolation', 'dumbbell', FALSE, NULL),
  ('Hammer Curl', 'isolation', 'dumbbell', FALSE, NULL),
  ('Incline Dumbbell Curl', 'isolation', 'dumbbell', FALSE, NULL),
  ('Preacher Curl', 'isolation', 'barbell', FALSE, NULL),
  ('Cable Curl', 'isolation', 'cable', FALSE, NULL);

-- ------------------------------------------------------------
-- ARM EXERCISES - TRICEPS
-- ------------------------------------------------------------

INSERT INTO exercises (name, category, equipment, is_custom, created_by) VALUES
  ('Tricep Pushdown', 'isolation', 'cable', FALSE, NULL),
  ('Overhead Tricep Extension', 'isolation', 'cable', FALSE, NULL),
  ('Skull Crusher', 'isolation', 'barbell', FALSE, NULL),
  ('Tricep Dips', 'compound', 'bodyweight', FALSE, NULL),
  ('Close-Grip Bench Press', 'compound', 'barbell', FALSE, NULL);

-- ------------------------------------------------------------
-- LEG EXERCISES - QUADRICEPS
-- ------------------------------------------------------------

INSERT INTO exercises (name, category, equipment, is_custom, created_by) VALUES
  ('Back Squat', 'compound', 'barbell', FALSE, NULL),
  ('Front Squat', 'compound', 'barbell', FALSE, NULL),
  ('Leg Press', 'compound', 'machine', FALSE, NULL),
  ('Hack Squat', 'compound', 'machine', FALSE, NULL),
  ('Leg Extension', 'isolation', 'machine', FALSE, NULL),
  ('Walking Lunge', 'compound', 'dumbbell', FALSE, NULL),
  ('Bulgarian Split Squat', 'compound', 'dumbbell', FALSE, NULL),
  ('Goblet Squat', 'compound', 'dumbbell', FALSE, NULL);

-- ------------------------------------------------------------
-- LEG EXERCISES - HAMSTRINGS
-- ------------------------------------------------------------

INSERT INTO exercises (name, category, equipment, is_custom, created_by) VALUES
  ('Lying Leg Curl', 'isolation', 'machine', FALSE, NULL),
  ('Seated Leg Curl', 'isolation', 'machine', FALSE, NULL),
  ('Nordic Hamstring Curl', 'isolation', 'bodyweight', FALSE, NULL),
  ('Good Morning', 'compound', 'barbell', FALSE, NULL);

-- ------------------------------------------------------------
-- GLUTE EXERCISES
-- ------------------------------------------------------------

INSERT INTO exercises (name, category, equipment, is_custom, created_by) VALUES
  ('Hip Thrust', 'compound', 'barbell', FALSE, NULL),
  ('Glute Bridge', 'compound', 'bodyweight', FALSE, NULL),
  ('Cable Pull-Through', 'compound', 'cable', FALSE, NULL);

-- ------------------------------------------------------------
-- CALF EXERCISES
-- ------------------------------------------------------------

INSERT INTO exercises (name, category, equipment, is_custom, created_by) VALUES
  ('Standing Calf Raise', 'isolation', 'machine', FALSE, NULL),
  ('Seated Calf Raise', 'isolation', 'machine', FALSE, NULL);

-- ------------------------------------------------------------
-- CORE EXERCISES
-- ------------------------------------------------------------

INSERT INTO exercises (name, category, equipment, is_custom, created_by) VALUES
  ('Plank', 'isolation', 'bodyweight', FALSE, NULL),
  ('Ab Wheel Rollout', 'isolation', 'other', FALSE, NULL),
  ('Cable Crunch', 'isolation', 'cable', FALSE, NULL),
  ('Hanging Leg Raise', 'isolation', 'bodyweight', FALSE, NULL);

-- ------------------------------------------------------------
-- COMPOUND FULL-BODY EXERCISES
-- ------------------------------------------------------------

INSERT INTO exercises (name, category, equipment, is_custom, created_by) VALUES
  ('Clean & Press', 'compound', 'barbell', FALSE, NULL),
  ('Push-Up', 'compound', 'bodyweight', FALSE, NULL);

-- ============================================================
-- EXERCISE <-> MUSCLE GROUP MAPPINGS
-- ============================================================

-- ------------------------------------------------------------
-- CHEST EXERCISES - Mappings
-- ------------------------------------------------------------

-- Bench Press
INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, involvement, weight) VALUES
  ((SELECT id FROM exercises WHERE name = 'Bench Press' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'chest'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'Bench Press' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'shoulders'), 'secondary', 0.5),
  ((SELECT id FROM exercises WHERE name = 'Bench Press' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'triceps'), 'secondary', 0.5);

-- Incline Bench Press
INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, involvement, weight) VALUES
  ((SELECT id FROM exercises WHERE name = 'Incline Bench Press' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'chest'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'Incline Bench Press' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'shoulders'), 'secondary', 0.5),
  ((SELECT id FROM exercises WHERE name = 'Incline Bench Press' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'triceps'), 'secondary', 0.5);

-- Decline Bench Press
INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, involvement, weight) VALUES
  ((SELECT id FROM exercises WHERE name = 'Decline Bench Press' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'chest'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'Decline Bench Press' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'triceps'), 'secondary', 0.5);

-- Dumbbell Bench Press
INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, involvement, weight) VALUES
  ((SELECT id FROM exercises WHERE name = 'Dumbbell Bench Press' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'chest'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'Dumbbell Bench Press' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'shoulders'), 'secondary', 0.5),
  ((SELECT id FROM exercises WHERE name = 'Dumbbell Bench Press' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'triceps'), 'secondary', 0.5);

-- Incline Dumbbell Bench Press
INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, involvement, weight) VALUES
  ((SELECT id FROM exercises WHERE name = 'Incline Dumbbell Bench Press' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'chest'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'Incline Dumbbell Bench Press' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'shoulders'), 'secondary', 0.5),
  ((SELECT id FROM exercises WHERE name = 'Incline Dumbbell Bench Press' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'triceps'), 'secondary', 0.5);

-- Machine Chest Press
INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, involvement, weight) VALUES
  ((SELECT id FROM exercises WHERE name = 'Machine Chest Press' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'chest'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'Machine Chest Press' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'shoulders'), 'secondary', 0.5),
  ((SELECT id FROM exercises WHERE name = 'Machine Chest Press' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'triceps'), 'secondary', 0.5);

-- Dumbbell Fly
INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, involvement, weight) VALUES
  ((SELECT id FROM exercises WHERE name = 'Dumbbell Fly' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'chest'), 'primary', 1.0);

-- Cable Fly
INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, involvement, weight) VALUES
  ((SELECT id FROM exercises WHERE name = 'Cable Fly' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'chest'), 'primary', 1.0);

-- Pec Deck
INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, involvement, weight) VALUES
  ((SELECT id FROM exercises WHERE name = 'Pec Deck' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'chest'), 'primary', 1.0);

-- Dips (Chest)
INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, involvement, weight) VALUES
  ((SELECT id FROM exercises WHERE name = 'Dips (Chest)' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'chest'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'Dips (Chest)' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'triceps'), 'secondary', 0.5),
  ((SELECT id FROM exercises WHERE name = 'Dips (Chest)' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'shoulders'), 'secondary', 0.5);

-- ------------------------------------------------------------
-- BACK EXERCISES - Mappings
-- ------------------------------------------------------------

-- Barbell Row
INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, involvement, weight) VALUES
  ((SELECT id FROM exercises WHERE name = 'Barbell Row' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'back'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'Barbell Row' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'biceps'), 'secondary', 0.5),
  ((SELECT id FROM exercises WHERE name = 'Barbell Row' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'core'), 'secondary', 0.5);

-- Dumbbell Row
INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, involvement, weight) VALUES
  ((SELECT id FROM exercises WHERE name = 'Dumbbell Row' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'back'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'Dumbbell Row' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'biceps'), 'secondary', 0.5);

-- Seated Cable Row
INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, involvement, weight) VALUES
  ((SELECT id FROM exercises WHERE name = 'Seated Cable Row' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'back'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'Seated Cable Row' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'biceps'), 'secondary', 0.5);

-- T-Bar Row
INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, involvement, weight) VALUES
  ((SELECT id FROM exercises WHERE name = 'T-Bar Row' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'back'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'T-Bar Row' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'biceps'), 'secondary', 0.5),
  ((SELECT id FROM exercises WHERE name = 'T-Bar Row' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'core'), 'secondary', 0.5);

-- Machine Row
INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, involvement, weight) VALUES
  ((SELECT id FROM exercises WHERE name = 'Machine Row' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'back'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'Machine Row' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'biceps'), 'secondary', 0.5);

-- Lat Pulldown
INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, involvement, weight) VALUES
  ((SELECT id FROM exercises WHERE name = 'Lat Pulldown' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'back'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'Lat Pulldown' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'biceps'), 'secondary', 0.5);

-- Pull-Up
INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, involvement, weight) VALUES
  ((SELECT id FROM exercises WHERE name = 'Pull-Up' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'back'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'Pull-Up' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'biceps'), 'secondary', 0.5),
  ((SELECT id FROM exercises WHERE name = 'Pull-Up' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'core'), 'secondary', 0.5);

-- Chin-Up
INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, involvement, weight) VALUES
  ((SELECT id FROM exercises WHERE name = 'Chin-Up' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'back'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'Chin-Up' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'biceps'), 'primary', 1.0);

-- Deadlift
INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, involvement, weight) VALUES
  ((SELECT id FROM exercises WHERE name = 'Deadlift' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'back'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'Deadlift' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'hamstrings'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'Deadlift' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'glutes'), 'secondary', 0.5),
  ((SELECT id FROM exercises WHERE name = 'Deadlift' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'core'), 'secondary', 0.5);

-- Romanian Deadlift
INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, involvement, weight) VALUES
  ((SELECT id FROM exercises WHERE name = 'Romanian Deadlift' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'hamstrings'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'Romanian Deadlift' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'glutes'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'Romanian Deadlift' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'back'), 'secondary', 0.5);

-- Sumo Deadlift
INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, involvement, weight) VALUES
  ((SELECT id FROM exercises WHERE name = 'Sumo Deadlift' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'quadriceps'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'Sumo Deadlift' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'glutes'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'Sumo Deadlift' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'hamstrings'), 'secondary', 0.5),
  ((SELECT id FROM exercises WHERE name = 'Sumo Deadlift' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'back'), 'secondary', 0.5),
  ((SELECT id FROM exercises WHERE name = 'Sumo Deadlift' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'core'), 'secondary', 0.5);

-- Straight-Arm Pulldown
INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, involvement, weight) VALUES
  ((SELECT id FROM exercises WHERE name = 'Straight-Arm Pulldown' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'back'), 'primary', 1.0);

-- ------------------------------------------------------------
-- SHOULDER EXERCISES - Mappings
-- ------------------------------------------------------------

-- Overhead Press
INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, involvement, weight) VALUES
  ((SELECT id FROM exercises WHERE name = 'Overhead Press' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'shoulders'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'Overhead Press' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'triceps'), 'secondary', 0.5),
  ((SELECT id FROM exercises WHERE name = 'Overhead Press' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'core'), 'secondary', 0.5);

-- Dumbbell Shoulder Press
INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, involvement, weight) VALUES
  ((SELECT id FROM exercises WHERE name = 'Dumbbell Shoulder Press' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'shoulders'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'Dumbbell Shoulder Press' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'triceps'), 'secondary', 0.5);

-- Arnold Press
INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, involvement, weight) VALUES
  ((SELECT id FROM exercises WHERE name = 'Arnold Press' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'shoulders'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'Arnold Press' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'triceps'), 'secondary', 0.5);

-- Machine Shoulder Press
INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, involvement, weight) VALUES
  ((SELECT id FROM exercises WHERE name = 'Machine Shoulder Press' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'shoulders'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'Machine Shoulder Press' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'triceps'), 'secondary', 0.5);

-- Lateral Raise
INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, involvement, weight) VALUES
  ((SELECT id FROM exercises WHERE name = 'Lateral Raise' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'shoulders'), 'primary', 1.0);

-- Cable Lateral Raise
INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, involvement, weight) VALUES
  ((SELECT id FROM exercises WHERE name = 'Cable Lateral Raise' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'shoulders'), 'primary', 1.0);

-- Face Pull
INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, involvement, weight) VALUES
  ((SELECT id FROM exercises WHERE name = 'Face Pull' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'shoulders'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'Face Pull' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'back'), 'secondary', 0.5);

-- Reverse Pec Deck
INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, involvement, weight) VALUES
  ((SELECT id FROM exercises WHERE name = 'Reverse Pec Deck' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'shoulders'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'Reverse Pec Deck' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'back'), 'secondary', 0.5);

-- ------------------------------------------------------------
-- BICEPS EXERCISES - Mappings
-- ------------------------------------------------------------

-- Barbell Curl
INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, involvement, weight) VALUES
  ((SELECT id FROM exercises WHERE name = 'Barbell Curl' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'biceps'), 'primary', 1.0);

-- Dumbbell Curl
INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, involvement, weight) VALUES
  ((SELECT id FROM exercises WHERE name = 'Dumbbell Curl' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'biceps'), 'primary', 1.0);

-- Hammer Curl
INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, involvement, weight) VALUES
  ((SELECT id FROM exercises WHERE name = 'Hammer Curl' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'biceps'), 'primary', 1.0);

-- Incline Dumbbell Curl
INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, involvement, weight) VALUES
  ((SELECT id FROM exercises WHERE name = 'Incline Dumbbell Curl' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'biceps'), 'primary', 1.0);

-- Preacher Curl
INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, involvement, weight) VALUES
  ((SELECT id FROM exercises WHERE name = 'Preacher Curl' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'biceps'), 'primary', 1.0);

-- Cable Curl
INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, involvement, weight) VALUES
  ((SELECT id FROM exercises WHERE name = 'Cable Curl' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'biceps'), 'primary', 1.0);

-- ------------------------------------------------------------
-- TRICEPS EXERCISES - Mappings
-- ------------------------------------------------------------

-- Tricep Pushdown
INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, involvement, weight) VALUES
  ((SELECT id FROM exercises WHERE name = 'Tricep Pushdown' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'triceps'), 'primary', 1.0);

-- Overhead Tricep Extension
INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, involvement, weight) VALUES
  ((SELECT id FROM exercises WHERE name = 'Overhead Tricep Extension' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'triceps'), 'primary', 1.0);

-- Skull Crusher
INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, involvement, weight) VALUES
  ((SELECT id FROM exercises WHERE name = 'Skull Crusher' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'triceps'), 'primary', 1.0);

-- Tricep Dips
INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, involvement, weight) VALUES
  ((SELECT id FROM exercises WHERE name = 'Tricep Dips' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'triceps'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'Tricep Dips' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'chest'), 'secondary', 0.5),
  ((SELECT id FROM exercises WHERE name = 'Tricep Dips' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'shoulders'), 'secondary', 0.5);

-- Close-Grip Bench Press
INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, involvement, weight) VALUES
  ((SELECT id FROM exercises WHERE name = 'Close-Grip Bench Press' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'triceps'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'Close-Grip Bench Press' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'chest'), 'secondary', 0.5),
  ((SELECT id FROM exercises WHERE name = 'Close-Grip Bench Press' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'shoulders'), 'secondary', 0.5);

-- ------------------------------------------------------------
-- QUADRICEPS EXERCISES - Mappings
-- ------------------------------------------------------------

-- Back Squat
INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, involvement, weight) VALUES
  ((SELECT id FROM exercises WHERE name = 'Back Squat' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'quadriceps'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'Back Squat' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'glutes'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'Back Squat' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'hamstrings'), 'secondary', 0.5),
  ((SELECT id FROM exercises WHERE name = 'Back Squat' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'core'), 'secondary', 0.5);

-- Front Squat
INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, involvement, weight) VALUES
  ((SELECT id FROM exercises WHERE name = 'Front Squat' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'quadriceps'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'Front Squat' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'glutes'), 'secondary', 0.5),
  ((SELECT id FROM exercises WHERE name = 'Front Squat' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'core'), 'secondary', 0.5);

-- Leg Press
INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, involvement, weight) VALUES
  ((SELECT id FROM exercises WHERE name = 'Leg Press' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'quadriceps'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'Leg Press' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'glutes'), 'secondary', 0.5),
  ((SELECT id FROM exercises WHERE name = 'Leg Press' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'hamstrings'), 'secondary', 0.5);

-- Hack Squat
INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, involvement, weight) VALUES
  ((SELECT id FROM exercises WHERE name = 'Hack Squat' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'quadriceps'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'Hack Squat' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'glutes'), 'secondary', 0.5);

-- Leg Extension
INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, involvement, weight) VALUES
  ((SELECT id FROM exercises WHERE name = 'Leg Extension' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'quadriceps'), 'primary', 1.0);

-- Walking Lunge
INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, involvement, weight) VALUES
  ((SELECT id FROM exercises WHERE name = 'Walking Lunge' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'quadriceps'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'Walking Lunge' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'glutes'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'Walking Lunge' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'hamstrings'), 'secondary', 0.5),
  ((SELECT id FROM exercises WHERE name = 'Walking Lunge' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'core'), 'secondary', 0.5);

-- Bulgarian Split Squat
INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, involvement, weight) VALUES
  ((SELECT id FROM exercises WHERE name = 'Bulgarian Split Squat' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'quadriceps'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'Bulgarian Split Squat' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'glutes'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'Bulgarian Split Squat' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'hamstrings'), 'secondary', 0.5);

-- Goblet Squat
INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, involvement, weight) VALUES
  ((SELECT id FROM exercises WHERE name = 'Goblet Squat' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'quadriceps'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'Goblet Squat' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'glutes'), 'secondary', 0.5),
  ((SELECT id FROM exercises WHERE name = 'Goblet Squat' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'core'), 'secondary', 0.5);

-- ------------------------------------------------------------
-- HAMSTRING EXERCISES - Mappings
-- ------------------------------------------------------------

-- Lying Leg Curl
INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, involvement, weight) VALUES
  ((SELECT id FROM exercises WHERE name = 'Lying Leg Curl' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'hamstrings'), 'primary', 1.0);

-- Seated Leg Curl
INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, involvement, weight) VALUES
  ((SELECT id FROM exercises WHERE name = 'Seated Leg Curl' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'hamstrings'), 'primary', 1.0);

-- Nordic Hamstring Curl
INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, involvement, weight) VALUES
  ((SELECT id FROM exercises WHERE name = 'Nordic Hamstring Curl' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'hamstrings'), 'primary', 1.0);

-- Good Morning
INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, involvement, weight) VALUES
  ((SELECT id FROM exercises WHERE name = 'Good Morning' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'hamstrings'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'Good Morning' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'glutes'), 'secondary', 0.5),
  ((SELECT id FROM exercises WHERE name = 'Good Morning' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'back'), 'secondary', 0.5);

-- ------------------------------------------------------------
-- GLUTE EXERCISES - Mappings
-- ------------------------------------------------------------

-- Hip Thrust
INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, involvement, weight) VALUES
  ((SELECT id FROM exercises WHERE name = 'Hip Thrust' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'glutes'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'Hip Thrust' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'hamstrings'), 'secondary', 0.5);

-- Glute Bridge
INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, involvement, weight) VALUES
  ((SELECT id FROM exercises WHERE name = 'Glute Bridge' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'glutes'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'Glute Bridge' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'hamstrings'), 'secondary', 0.5);

-- Cable Pull-Through
INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, involvement, weight) VALUES
  ((SELECT id FROM exercises WHERE name = 'Cable Pull-Through' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'glutes'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'Cable Pull-Through' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'hamstrings'), 'secondary', 0.5);

-- ------------------------------------------------------------
-- CALF EXERCISES - Mappings
-- ------------------------------------------------------------

-- Standing Calf Raise
INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, involvement, weight) VALUES
  ((SELECT id FROM exercises WHERE name = 'Standing Calf Raise' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'calves'), 'primary', 1.0);

-- Seated Calf Raise
INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, involvement, weight) VALUES
  ((SELECT id FROM exercises WHERE name = 'Seated Calf Raise' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'calves'), 'primary', 1.0);

-- ------------------------------------------------------------
-- CORE EXERCISES - Mappings
-- ------------------------------------------------------------

-- Plank
INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, involvement, weight) VALUES
  ((SELECT id FROM exercises WHERE name = 'Plank' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'core'), 'primary', 1.0);

-- Ab Wheel Rollout
INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, involvement, weight) VALUES
  ((SELECT id FROM exercises WHERE name = 'Ab Wheel Rollout' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'core'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'Ab Wheel Rollout' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'shoulders'), 'secondary', 0.5);

-- Cable Crunch
INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, involvement, weight) VALUES
  ((SELECT id FROM exercises WHERE name = 'Cable Crunch' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'core'), 'primary', 1.0);

-- Hanging Leg Raise
INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, involvement, weight) VALUES
  ((SELECT id FROM exercises WHERE name = 'Hanging Leg Raise' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'core'), 'primary', 1.0);

-- ------------------------------------------------------------
-- COMPOUND FULL-BODY EXERCISES - Mappings
-- ------------------------------------------------------------

-- Clean & Press
INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, involvement, weight) VALUES
  ((SELECT id FROM exercises WHERE name = 'Clean & Press' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'shoulders'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'Clean & Press' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'quadriceps'), 'secondary', 0.5),
  ((SELECT id FROM exercises WHERE name = 'Clean & Press' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'glutes'), 'secondary', 0.5),
  ((SELECT id FROM exercises WHERE name = 'Clean & Press' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'back'), 'secondary', 0.5),
  ((SELECT id FROM exercises WHERE name = 'Clean & Press' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'triceps'), 'secondary', 0.5),
  ((SELECT id FROM exercises WHERE name = 'Clean & Press' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'core'), 'secondary', 0.5);

-- Push-Up
INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, involvement, weight) VALUES
  ((SELECT id FROM exercises WHERE name = 'Push-Up' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'chest'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'Push-Up' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'shoulders'), 'secondary', 0.5),
  ((SELECT id FROM exercises WHERE name = 'Push-Up' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'triceps'), 'secondary', 0.5),
  ((SELECT id FROM exercises WHERE name = 'Push-Up' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'core'), 'secondary', 0.5);
