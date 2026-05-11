-- TrainReady - Extra oefeningen (~50 nieuw, boven op de 64 uit seed.sql)
-- Voer uit in Supabase SQL Editor

-- ============================================================
-- CHEST
-- ============================================================

INSERT INTO exercises (name, category, equipment, is_custom, created_by) VALUES
  ('Decline Dumbbell Press', 'compound', 'dumbbell', FALSE, NULL),
  ('Low Cable Fly', 'isolation', 'cable', FALSE, NULL),
  ('Incline Cable Fly', 'isolation', 'cable', FALSE, NULL),
  ('Landmine Press', 'compound', 'barbell', FALSE, NULL),
  ('Push-Up (Wide Grip)', 'compound', 'bodyweight', FALSE, NULL);

INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, involvement, weight) VALUES
  ((SELECT id FROM exercises WHERE name = 'Decline Dumbbell Press' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'chest'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'Decline Dumbbell Press' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'triceps'), 'secondary', 0.5),
  ((SELECT id FROM exercises WHERE name = 'Low Cable Fly' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'chest'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'Incline Cable Fly' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'chest'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'Landmine Press' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'chest'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'Landmine Press' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'shoulders'), 'secondary', 0.5),
  ((SELECT id FROM exercises WHERE name = 'Landmine Press' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'triceps'), 'secondary', 0.5),
  ((SELECT id FROM exercises WHERE name = 'Push-Up (Wide Grip)' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'chest'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'Push-Up (Wide Grip)' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'shoulders'), 'secondary', 0.5),
  ((SELECT id FROM exercises WHERE name = 'Push-Up (Wide Grip)' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'triceps'), 'secondary', 0.5);

-- ============================================================
-- BACK
-- ============================================================

INSERT INTO exercises (name, category, equipment, is_custom, created_by) VALUES
  ('Chest-Supported Row', 'compound', 'dumbbell', FALSE, NULL),
  ('Pendlay Row', 'compound', 'barbell', FALSE, NULL),
  ('Single Arm Cable Row', 'compound', 'cable', FALSE, NULL),
  ('Rack Pull', 'compound', 'barbell', FALSE, NULL),
  ('Inverted Row', 'compound', 'bodyweight', FALSE, NULL),
  ('Wide Grip Pull-Up', 'compound', 'bodyweight', FALSE, NULL),
  ('Neutral Grip Pull-Up', 'compound', 'bodyweight', FALSE, NULL),
  ('Wide Grip Lat Pulldown', 'compound', 'cable', FALSE, NULL);

INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, involvement, weight) VALUES
  ((SELECT id FROM exercises WHERE name = 'Chest-Supported Row' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'back'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'Chest-Supported Row' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'biceps'), 'secondary', 0.5),
  ((SELECT id FROM exercises WHERE name = 'Pendlay Row' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'back'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'Pendlay Row' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'biceps'), 'secondary', 0.5),
  ((SELECT id FROM exercises WHERE name = 'Pendlay Row' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'core'), 'secondary', 0.5),
  ((SELECT id FROM exercises WHERE name = 'Single Arm Cable Row' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'back'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'Single Arm Cable Row' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'biceps'), 'secondary', 0.5),
  ((SELECT id FROM exercises WHERE name = 'Rack Pull' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'back'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'Rack Pull' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'hamstrings'), 'secondary', 0.5),
  ((SELECT id FROM exercises WHERE name = 'Rack Pull' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'glutes'), 'secondary', 0.5),
  ((SELECT id FROM exercises WHERE name = 'Inverted Row' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'back'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'Inverted Row' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'biceps'), 'secondary', 0.5),
  ((SELECT id FROM exercises WHERE name = 'Wide Grip Pull-Up' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'back'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'Wide Grip Pull-Up' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'biceps'), 'secondary', 0.5),
  ((SELECT id FROM exercises WHERE name = 'Neutral Grip Pull-Up' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'back'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'Neutral Grip Pull-Up' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'biceps'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'Wide Grip Lat Pulldown' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'back'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'Wide Grip Lat Pulldown' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'biceps'), 'secondary', 0.5);

-- ============================================================
-- SHOULDERS
-- ============================================================

INSERT INTO exercises (name, category, equipment, is_custom, created_by) VALUES
  ('Dumbbell Front Raise', 'isolation', 'dumbbell', FALSE, NULL),
  ('Cable Front Raise', 'isolation', 'cable', FALSE, NULL),
  ('Rear Delt Fly', 'isolation', 'dumbbell', FALSE, NULL),
  ('Cable Rear Delt Fly', 'isolation', 'cable', FALSE, NULL),
  ('Upright Row', 'compound', 'barbell', FALSE, NULL),
  ('Landmine Lateral Raise', 'isolation', 'barbell', FALSE, NULL);

INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, involvement, weight) VALUES
  ((SELECT id FROM exercises WHERE name = 'Dumbbell Front Raise' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'shoulders'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'Cable Front Raise' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'shoulders'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'Rear Delt Fly' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'shoulders'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'Rear Delt Fly' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'back'), 'secondary', 0.5),
  ((SELECT id FROM exercises WHERE name = 'Cable Rear Delt Fly' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'shoulders'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'Cable Rear Delt Fly' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'back'), 'secondary', 0.5),
  ((SELECT id FROM exercises WHERE name = 'Upright Row' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'shoulders'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'Upright Row' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'biceps'), 'secondary', 0.5),
  ((SELECT id FROM exercises WHERE name = 'Landmine Lateral Raise' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'shoulders'), 'primary', 1.0);

-- ============================================================
-- BICEPS
-- ============================================================

INSERT INTO exercises (name, category, equipment, is_custom, created_by) VALUES
  ('EZ Bar Curl', 'isolation', 'barbell', FALSE, NULL),
  ('Concentration Curl', 'isolation', 'dumbbell', FALSE, NULL),
  ('Spider Curl', 'isolation', 'dumbbell', FALSE, NULL),
  ('Rope Hammer Curl', 'isolation', 'cable', FALSE, NULL),
  ('Machine Curl', 'isolation', 'machine', FALSE, NULL),
  ('Reverse Curl', 'isolation', 'barbell', FALSE, NULL);

INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, involvement, weight) VALUES
  ((SELECT id FROM exercises WHERE name = 'EZ Bar Curl' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'biceps'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'Concentration Curl' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'biceps'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'Spider Curl' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'biceps'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'Rope Hammer Curl' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'biceps'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'Machine Curl' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'biceps'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'Reverse Curl' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'biceps'), 'primary', 1.0);

-- ============================================================
-- TRICEPS
-- ============================================================

INSERT INTO exercises (name, category, equipment, is_custom, created_by) VALUES
  ('Rope Pushdown', 'isolation', 'cable', FALSE, NULL),
  ('Single Arm Pushdown', 'isolation', 'cable', FALSE, NULL),
  ('Single Arm Overhead Extension', 'isolation', 'dumbbell', FALSE, NULL),
  ('Tricep Kickback', 'isolation', 'dumbbell', FALSE, NULL),
  ('Diamond Push-Up', 'compound', 'bodyweight', FALSE, NULL),
  ('JM Press', 'compound', 'barbell', FALSE, NULL);

INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, involvement, weight) VALUES
  ((SELECT id FROM exercises WHERE name = 'Rope Pushdown' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'triceps'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'Single Arm Pushdown' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'triceps'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'Single Arm Overhead Extension' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'triceps'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'Tricep Kickback' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'triceps'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'Diamond Push-Up' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'triceps'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'Diamond Push-Up' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'chest'), 'secondary', 0.5),
  ((SELECT id FROM exercises WHERE name = 'JM Press' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'triceps'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'JM Press' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'chest'), 'secondary', 0.5);

-- ============================================================
-- QUADRICEPS
-- ============================================================

INSERT INTO exercises (name, category, equipment, is_custom, created_by) VALUES
  ('Step-Up', 'compound', 'dumbbell', FALSE, NULL),
  ('Reverse Lunge', 'compound', 'dumbbell', FALSE, NULL),
  ('Smith Machine Squat', 'compound', 'machine', FALSE, NULL),
  ('Sissy Squat', 'isolation', 'bodyweight', FALSE, NULL),
  ('Leg Press (Close Stance)', 'compound', 'machine', FALSE, NULL),
  ('Landmine Squat', 'compound', 'barbell', FALSE, NULL);

INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, involvement, weight) VALUES
  ((SELECT id FROM exercises WHERE name = 'Step-Up' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'quadriceps'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'Step-Up' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'glutes'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'Step-Up' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'hamstrings'), 'secondary', 0.5),
  ((SELECT id FROM exercises WHERE name = 'Reverse Lunge' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'quadriceps'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'Reverse Lunge' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'glutes'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'Reverse Lunge' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'hamstrings'), 'secondary', 0.5),
  ((SELECT id FROM exercises WHERE name = 'Smith Machine Squat' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'quadriceps'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'Smith Machine Squat' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'glutes'), 'secondary', 0.5),
  ((SELECT id FROM exercises WHERE name = 'Smith Machine Squat' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'hamstrings'), 'secondary', 0.5),
  ((SELECT id FROM exercises WHERE name = 'Sissy Squat' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'quadriceps'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'Leg Press (Close Stance)' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'quadriceps'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'Landmine Squat' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'quadriceps'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'Landmine Squat' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'glutes'), 'secondary', 0.5);

-- ============================================================
-- HAMSTRINGS
-- ============================================================

INSERT INTO exercises (name, category, equipment, is_custom, created_by) VALUES
  ('Stiff Leg Deadlift', 'compound', 'barbell', FALSE, NULL),
  ('Single Leg Romanian Deadlift', 'compound', 'dumbbell', FALSE, NULL),
  ('Glute Ham Raise', 'isolation', 'machine', FALSE, NULL),
  ('Swiss Ball Leg Curl', 'isolation', 'other', FALSE, NULL);

INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, involvement, weight) VALUES
  ((SELECT id FROM exercises WHERE name = 'Stiff Leg Deadlift' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'hamstrings'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'Stiff Leg Deadlift' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'glutes'), 'secondary', 0.5),
  ((SELECT id FROM exercises WHERE name = 'Stiff Leg Deadlift' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'back'), 'secondary', 0.5),
  ((SELECT id FROM exercises WHERE name = 'Single Leg Romanian Deadlift' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'hamstrings'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'Single Leg Romanian Deadlift' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'glutes'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'Glute Ham Raise' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'hamstrings'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'Glute Ham Raise' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'glutes'), 'secondary', 0.5),
  ((SELECT id FROM exercises WHERE name = 'Swiss Ball Leg Curl' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'hamstrings'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'Swiss Ball Leg Curl' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'glutes'), 'secondary', 0.5);

-- ============================================================
-- GLUTES
-- ============================================================

INSERT INTO exercises (name, category, equipment, is_custom, created_by) VALUES
  ('Cable Kickback', 'isolation', 'cable', FALSE, NULL),
  ('Single Leg Hip Thrust', 'compound', 'bodyweight', FALSE, NULL),
  ('Donkey Kick', 'isolation', 'bodyweight', FALSE, NULL),
  ('Sumo Squat', 'compound', 'dumbbell', FALSE, NULL),
  ('Abductor Machine', 'isolation', 'machine', FALSE, NULL);

INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, involvement, weight) VALUES
  ((SELECT id FROM exercises WHERE name = 'Cable Kickback' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'glutes'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'Cable Kickback' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'hamstrings'), 'secondary', 0.5),
  ((SELECT id FROM exercises WHERE name = 'Single Leg Hip Thrust' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'glutes'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'Single Leg Hip Thrust' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'hamstrings'), 'secondary', 0.5),
  ((SELECT id FROM exercises WHERE name = 'Donkey Kick' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'glutes'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'Sumo Squat' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'glutes'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'Sumo Squat' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'quadriceps'), 'secondary', 0.5),
  ((SELECT id FROM exercises WHERE name = 'Sumo Squat' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'hamstrings'), 'secondary', 0.5),
  ((SELECT id FROM exercises WHERE name = 'Abductor Machine' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'glutes'), 'primary', 1.0);

-- ============================================================
-- CALVES
-- ============================================================

INSERT INTO exercises (name, category, equipment, is_custom, created_by) VALUES
  ('Donkey Calf Raise', 'isolation', 'machine', FALSE, NULL),
  ('Single Leg Calf Raise', 'isolation', 'bodyweight', FALSE, NULL),
  ('Leg Press Calf Raise', 'isolation', 'machine', FALSE, NULL),
  ('Tibialis Raise', 'isolation', 'bodyweight', FALSE, NULL);

INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, involvement, weight) VALUES
  ((SELECT id FROM exercises WHERE name = 'Donkey Calf Raise' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'calves'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'Single Leg Calf Raise' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'calves'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'Leg Press Calf Raise' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'calves'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'Tibialis Raise' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'calves'), 'primary', 1.0);

-- ============================================================
-- CORE
-- ============================================================

INSERT INTO exercises (name, category, equipment, is_custom, created_by) VALUES
  ('Crunch', 'isolation', 'bodyweight', FALSE, NULL),
  ('Sit-Up', 'isolation', 'bodyweight', FALSE, NULL),
  ('Decline Sit-Up', 'isolation', 'bodyweight', FALSE, NULL),
  ('Bicycle Crunch', 'isolation', 'bodyweight', FALSE, NULL),
  ('Russian Twist', 'isolation', 'bodyweight', FALSE, NULL),
  ('Pallof Press', 'isolation', 'cable', FALSE, NULL),
  ('Side Plank', 'isolation', 'bodyweight', FALSE, NULL),
  ('Dead Bug', 'isolation', 'bodyweight', FALSE, NULL),
  ('Dragon Flag', 'isolation', 'bodyweight', FALSE, NULL),
  ('L-Sit', 'isolation', 'bodyweight', FALSE, NULL),
  ('Toes-to-Bar', 'isolation', 'bodyweight', FALSE, NULL),
  ('Windmill', 'compound', 'dumbbell', FALSE, NULL);

INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, involvement, weight) VALUES
  ((SELECT id FROM exercises WHERE name = 'Crunch' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'core'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'Sit-Up' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'core'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'Decline Sit-Up' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'core'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'Bicycle Crunch' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'core'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'Russian Twist' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'core'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'Pallof Press' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'core'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'Side Plank' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'core'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'Dead Bug' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'core'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'Dragon Flag' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'core'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'L-Sit' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'core'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'Toes-to-Bar' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'core'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'Toes-to-Bar' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'back'), 'secondary', 0.5),
  ((SELECT id FROM exercises WHERE name = 'Windmill' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'core'), 'primary', 1.0),
  ((SELECT id FROM exercises WHERE name = 'Windmill' AND is_custom = FALSE), (SELECT id FROM muscle_groups WHERE name = 'shoulders'), 'secondary', 0.5);
