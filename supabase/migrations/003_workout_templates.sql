-- Workout templates
CREATE TABLE workout_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  workout_type TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Exercises within a template
CREATE TABLE workout_template_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES workout_templates(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL DEFAULT 0
);

-- Default sets per template exercise
CREATE TABLE workout_template_sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_exercise_id UUID NOT NULL REFERENCES workout_template_exercises(id) ON DELETE CASCADE,
  set_number INTEGER NOT NULL,
  default_weight_kg NUMERIC(6,2) DEFAULT 0,
  default_reps INTEGER DEFAULT 10
);

-- RLS
ALTER TABLE workout_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_template_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_template_sets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own templates"
  ON workout_templates FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users manage own template exercises"
  ON workout_template_exercises FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM workout_templates wt
      WHERE wt.id = template_id AND wt.user_id = auth.uid()
    )
  );

CREATE POLICY "Users manage own template sets"
  ON workout_template_sets FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM workout_template_exercises wte
      JOIN workout_templates wt ON wt.id = wte.template_id
      WHERE wte.id = template_exercise_id AND wt.user_id = auth.uid()
    )
  );
