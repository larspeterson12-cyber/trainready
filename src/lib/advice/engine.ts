import type {
  MuscleGroupName,
  PreferredSplit,
  TrainingGoal,
  TrainingAdvice,
  TrainingAdviceIntensity,
  RecoveryScore,
  WorkoutType,
  Workout,
} from '@/types/database';
import {
  SPLIT_MUSCLE_GROUPS,
  WORKOUT_TYPE_LABELS,
  getWeeklySplitTargets,
} from '@/lib/recovery/constants';

// ============================================================
// Training Advice Engine V1
// ============================================================

interface AdviceInput {
  recoveryScores: RecoveryScore[];
  preferredSplit: PreferredSplit;
  trainingGoal: TrainingGoal;
  trainingDaysPerWeek: number;
  avgSessionMinutes: number;
  availableMinutes: number;
  recentWorkouts: Pick<Workout, 'date' | 'workout_type'>[]; // last 14 days
}

/**
 * Calculate readiness score for a split option.
 *
 * Weighted average of recovery scores for the muscle groups in the split.
 * Primary muscles weight = 2.0, secondary = 1.0.
 */
function calculateReadinessScore(
  splitType: Exclude<WorkoutType, 'custom'>,
  recoveryScores: RecoveryScore[]
): number {
  const muscles = SPLIT_MUSCLE_GROUPS[splitType];
  if (!muscles) return 0;

  const recoveryMap = new Map(
    recoveryScores.map((rs) => [rs.muscleGroupName, rs.score])
  );

  let weightedSum = 0;
  let totalWeight = 0;

  for (const mg of muscles.primary) {
    const score = recoveryMap.get(mg) ?? 100;
    weightedSum += 2.0 * score;
    totalWeight += 2.0;
  }

  for (const mg of muscles.secondary) {
    const score = recoveryMap.get(mg) ?? 100;
    weightedSum += 1.0 * score;
    totalWeight += 1.0;
  }

  return totalWeight > 0 ? weightedSum / totalWeight : 0;
}

/**
 * Get available split options based on preferred split.
 */
function getSplitOptions(
  preferredSplit: PreferredSplit
): Exclude<WorkoutType, 'custom'>[] {
  switch (preferredSplit) {
    case 'ppl':
      return ['push', 'pull', 'legs'];
    case 'upper_lower':
      return ['upper', 'lower'];
    case 'full_body':
      return ['full_body'];
    case 'custom':
      return ['push', 'pull', 'legs', 'upper', 'lower', 'full_body'];
  }
}

/**
 * Count consecutive training days (including today if already trained).
 */
function getConsecutiveTrainingDays(
  workouts: Pick<Workout, 'date'>[]
): number {
  if (workouts.length === 0) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const uniqueDates = [
    ...new Set(workouts.map((w) => w.date.split('T')[0])),
  ].sort((a, b) => b.localeCompare(a));

  let consecutive = 0;
  const checkDate = new Date(today);

  for (const dateStr of uniqueDates) {
    const d = new Date(dateStr + 'T00:00:00');
    d.setHours(0, 0, 0, 0);

    if (d.getTime() === checkDate.getTime()) {
      consecutive++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else if (d.getTime() === checkDate.getTime() - 86400000) {
      // Yesterday — allow one gap
      consecutive++;
      checkDate.setDate(checkDate.getDate() - 2);
    } else {
      break;
    }
  }

  return consecutive;
}

/**
 * Get max consecutive training days based on weekly frequency.
 */
function getMaxConsecutiveDays(daysPerWeek: number): number {
  if (daysPerWeek <= 3) return 2;
  if (daysPerWeek <= 4) return 3;
  if (daysPerWeek <= 5) return 4;
  return 5;
}

/**
 * Count how many times each split was done this week (Mon-Sun).
 */
function getWeeklySplitCounts(
  workouts: Pick<Workout, 'date' | 'workout_type'>[]
): Record<string, number> {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0=Sun
  const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const monday = new Date(today);
  monday.setDate(today.getDate() - mondayOffset);
  monday.setHours(0, 0, 0, 0);

  const counts: Record<string, number> = {};
  for (const w of workouts) {
    const wDate = new Date(w.date);
    if (wDate >= monday) {
      counts[w.workout_type] = (counts[w.workout_type] || 0) + 1;
    }
  }
  return counts;
}

/**
 * Get minimum recovery threshold based on training goal.
 */
function getMinRecoveryThreshold(goal: TrainingGoal): number {
  switch (goal) {
    case 'muscle_building':
    case 'strength':
      return 55;
    case 'cut':
      return 40;
    case 'maintenance':
      return 60;
  }
}

/**
 * Determine intensity based on readiness and goal.
 */
function determineIntensity(
  readiness: number,
  goal: TrainingGoal
): TrainingAdviceIntensity {
  if (goal === 'cut') return readiness >= 65 ? 'normal' : 'light';
  if (goal === 'maintenance') return 'normal';

  // muscle_building or strength
  if (readiness >= 75) return 'heavy';
  if (readiness >= 55) return 'normal';
  return 'light';
}

/**
 * Determine exercise count and duration based on available time.
 */
function getSessionParameters(availableMinutes: number): {
  exerciseCount: number;
  intensity: TrainingAdviceIntensity | null;
  tooShort: boolean;
} {
  if (availableMinutes < 30)
    return { exerciseCount: 0, intensity: null, tooShort: true };
  if (availableMinutes <= 45)
    return { exerciseCount: 4, intensity: 'normal', tooShort: false };
  if (availableMinutes <= 75)
    return { exerciseCount: 6, intensity: null, tooShort: false }; // null = use goal-based
  return { exerciseCount: 8, intensity: null, tooShort: false };
}

/**
 * Generate the training advice.
 */
export function generateAdvice(input: AdviceInput): TrainingAdvice {
  const {
    recoveryScores,
    preferredSplit,
    trainingGoal,
    trainingDaysPerWeek,
    availableMinutes,
    recentWorkouts,
  } = input;

  // Edge case: too little time
  const sessionParams = getSessionParameters(availableMinutes);
  if (sessionParams.tooShort) {
    return {
      recommendedSplit: 'rest',
      splitDisplayName: 'Rust / Mobiliteit',
      reason: `Met ${availableMinutes} minuten is een effectieve training lastig. Doe lichte mobiliteit of stretching.`,
      intensity: 'light',
      estimatedDuration: availableMinutes,
      suggestedExerciseCount: 0,
      isRestDay: true,
      restReason: 'Te weinig beschikbare tijd voor een volledige sessie.',
      readinessScore: 0,
    };
  }

  // Edge case: no workout history
  if (recentWorkouts.length === 0) {
    const splitOptions = getSplitOptions(preferredSplit);
    const firstSplit = splitOptions[0];
    return {
      recommendedSplit: firstSplit,
      splitDisplayName: WORKOUT_TYPE_LABELS[firstSplit],
      reason: `Welkom! Start met ${WORKOUT_TYPE_LABELS[firstSplit]} — na een paar trainingen wordt het advies persoonlijker.`,
      intensity: 'normal',
      estimatedDuration: Math.min(availableMinutes, input.avgSessionMinutes),
      suggestedExerciseCount: sessionParams.exerciseCount,
      isRestDay: false,
      readinessScore: 100,
    };
  }

  // Check consecutive days
  const consecutiveDays = getConsecutiveTrainingDays(recentWorkouts);
  const maxConsecutive = getMaxConsecutiveDays(trainingDaysPerWeek);

  if (consecutiveDays >= maxConsecutive) {
    return {
      recommendedSplit: 'rest',
      splitDisplayName: 'Rustdag',
      reason: `Je hebt ${consecutiveDays} dagen op rij getraind. Een rustdag helpt je herstel en prestaties.`,
      intensity: 'light',
      estimatedDuration: 0,
      suggestedExerciseCount: 0,
      isRestDay: true,
      restReason: `${consecutiveDays} opeenvolgende trainingsdagen bereikt (max ${maxConsecutive}).`,
      readinessScore: 0,
    };
  }

  // Calculate readiness per split option
  const splitOptions = getSplitOptions(preferredSplit);
  const weeklyCounts = getWeeklySplitCounts(recentWorkouts);
  const weeklyTargets = getWeeklySplitTargets(
    preferredSplit === 'custom' ? 'ppl' : preferredSplit,
    trainingDaysPerWeek
  );

  const lastWorkout = recentWorkouts[0];
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  const scored = splitOptions.map((split) => {
    let score = calculateReadinessScore(split, recoveryScores);

    // Penalty: same split yesterday
    if (lastWorkout && lastWorkout.date.startsWith(yesterdayStr) && lastWorkout.workout_type === split) {
      score -= 25;
    }

    // Penalty: same split 2 days ago
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    const twoDaysAgoStr = twoDaysAgo.toISOString().split('T')[0];
    const trainedTwoDaysAgo = recentWorkouts.some(
      (w) => w.date.startsWith(twoDaysAgoStr) && w.workout_type === split
    );
    if (trainedTwoDaysAgo && !(lastWorkout?.date.startsWith(yesterdayStr) && lastWorkout?.workout_type === split)) {
      score -= 10;
    }

    // Penalty: weekly frequency met or exceeded
    const weekCount = weeklyCounts[split] || 0;
    const target = weeklyTargets[split] || 1;
    if (weekCount >= target) score -= 30;
    if (weekCount > target) score -= 20; // additional -20 for exceeding

    return { split, score, rawReadiness: calculateReadinessScore(split, recoveryScores) };
  });

  // Sort by adjusted score
  scored.sort((a, b) => b.score - a.score);

  const best = scored[0];
  const alternative = scored.length > 1 ? scored[1] : null;

  // Rest threshold: if best score < 45
  const minThreshold = getMinRecoveryThreshold(trainingGoal);
  if (best.score < 45 || best.rawReadiness < minThreshold) {
    return {
      recommendedSplit: 'rest',
      splitDisplayName: 'Rustdag',
      reason: 'Geen spiergroep is voldoende hersteld voor een effectieve training. Neem rust.',
      intensity: 'light',
      estimatedDuration: 0,
      suggestedExerciseCount: 0,
      isRestDay: true,
      restReason: `Beste optie (${WORKOUT_TYPE_LABELS[best.split]}) scoort ${Math.round(best.score)} — onder de drempel van 45.`,
      alternativeSplit: best.split,
      alternativeReason: `Als je toch wilt trainen: ${WORKOUT_TYPE_LABELS[best.split]} op lage intensiteit.`,
      readinessScore: Math.round(best.score),
    };
  }

  // Determine intensity
  const goalIntensity = determineIntensity(best.rawReadiness, trainingGoal);
  const timeIntensity = sessionParams.intensity;
  const intensity = timeIntensity ?? goalIntensity;

  // Build reason
  const splitMuscles = SPLIT_MUSCLE_GROUPS[best.split];
  const primaryNames = splitMuscles.primary
    .map((mg) => recoveryScores.find((rs) => rs.muscleGroupName === mg)?.displayName ?? mg)
    .join(' en ');

  let reason = `${primaryNames} ${best.rawReadiness >= 70 ? 'zijn goed hersteld' : 'zijn voldoende hersteld voor een sessie'}.`;

  if (alternative && best.score - alternative.score < 10) {
    reason += ` ${WORKOUT_TYPE_LABELS[alternative.split]} is ook een goede optie.`;
  }

  if (availableMinutes < input.avgSessionMinutes) {
    reason += ` Verkorte sessie vanwege ${availableMinutes} minuten beschikbaar.`;
  }

  return {
    recommendedSplit: best.split,
    splitDisplayName: WORKOUT_TYPE_LABELS[best.split],
    reason,
    intensity,
    estimatedDuration: Math.min(availableMinutes, input.avgSessionMinutes),
    suggestedExerciseCount: sessionParams.exerciseCount,
    alternativeSplit: alternative?.split,
    alternativeReason: alternative
      ? `${WORKOUT_TYPE_LABELS[alternative.split]} (gereedheid: ${Math.round(alternative.rawReadiness)}%)`
      : undefined,
    isRestDay: false,
    readinessScore: Math.round(best.rawReadiness),
  };
}
