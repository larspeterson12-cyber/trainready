import type {
  MuscleGroupName,
  MuscleFatigueLog,
  MuscleGroup,
  RecoveryScore,
} from '@/types/database';
import {
  FATIGUE_SCALE_FACTOR,
  FATIGUE_LOOKBACK_DAYS,
  RECOVERY_THRESHOLDS,
  DECAY_RATES,
} from './constants';

// ============================================================
// Recovery Engine V1
// ============================================================

/**
 * Calculate remaining fatigue from a single fatigue log entry.
 *
 * Uses exponential decay: remaining = initial × e^(-k × hours)
 */
export function calculateRemainingFatigue(
  initialFatigue: number,
  hoursElapsed: number,
  decayRate: number
): number {
  if (hoursElapsed < 0) return initialFatigue;
  return initialFatigue * Math.exp(-decayRate * hoursElapsed);
}

/**
 * Calculate fatigue points for a muscle group from a workout.
 *
 * fatigue = sets × muscleWeight × rpeFactor
 *
 * @param sets - Number of sets performed on exercises targeting this muscle
 * @param muscleWeight - 1.0 for primary, 0.5 for secondary involvement
 * @param sessionRpe - Session RPE (1-10)
 */
export function calculateFatiguePoints(
  sets: number,
  muscleWeight: number,
  sessionRpe: number
): number {
  const rpeFactor = sessionRpe / 10;
  return sets * muscleWeight * rpeFactor;
}

/**
 * Calculate the current recovery score for a single muscle group.
 *
 * Sums remaining fatigue from all recent workouts and converts to 0-100 score.
 *
 * @param fatigueLogs - All fatigue logs for this muscle group (within lookback period)
 * @param decayRate - Exponential decay rate for this muscle group
 * @param now - Current timestamp (defaults to Date.now())
 */
export function calculateMuscleRecovery(
  fatigueLogs: MuscleFatigueLog[],
  decayRate: number,
  now: number = Date.now()
): { score: number; lastTrainedAt: string | null } {
  if (fatigueLogs.length === 0) {
    return { score: 100, lastTrainedAt: null };
  }

  // Filter to lookback period
  const cutoff = now - FATIGUE_LOOKBACK_DAYS * 24 * 60 * 60 * 1000;
  const relevantLogs = fatigueLogs.filter(
    (log) => new Date(log.logged_at).getTime() >= cutoff
  );

  if (relevantLogs.length === 0) {
    return { score: 100, lastTrainedAt: fatigueLogs[0]?.logged_at ?? null };
  }

  // Sum remaining fatigue from all recent workouts
  let totalRemainingFatigue = 0;
  for (const log of relevantLogs) {
    const logTime = new Date(log.logged_at).getTime();
    const hoursElapsed = (now - logTime) / (1000 * 60 * 60);
    totalRemainingFatigue += calculateRemainingFatigue(
      log.fatigue_points,
      hoursElapsed,
      decayRate
    );
  }

  // Convert to 0-100 score
  const score = Math.max(0, Math.min(100, 100 - totalRemainingFatigue * FATIGUE_SCALE_FACTOR));

  // Find most recent training
  const lastTrainedAt = relevantLogs.reduce(
    (latest, log) => (log.logged_at > latest ? log.logged_at : latest),
    relevantLogs[0].logged_at
  );

  return { score: Math.round(score), lastTrainedAt };
}

/**
 * Get recovery status label from score.
 */
export function getRecoveryStatus(
  score: number
): 'recovered' | 'partial' | 'fatigued' {
  if (score >= RECOVERY_THRESHOLDS.RECOVERED) return 'recovered';
  if (score >= RECOVERY_THRESHOLDS.PARTIAL) return 'partial';
  return 'fatigued';
}

/**
 * Calculate recovery scores for all muscle groups.
 *
 * @param muscleGroups - All muscle groups from the database
 * @param fatigueLogs - All fatigue logs for the user (within lookback period)
 * @param now - Current timestamp
 */
export function calculateAllRecoveryScores(
  muscleGroups: MuscleGroup[],
  fatigueLogs: MuscleFatigueLog[],
  now: number = Date.now()
): RecoveryScore[] {
  return muscleGroups
    .sort((a, b) => a.display_order - b.display_order)
    .map((mg) => {
      const logsForMuscle = fatigueLogs.filter(
        (log) => log.muscle_group_id === mg.id
      );

      const { score, lastTrainedAt } = calculateMuscleRecovery(
        logsForMuscle,
        mg.decay_rate,
        now
      );

      return {
        muscleGroupId: mg.id,
        muscleGroupName: mg.name,
        displayName: mg.display_name,
        score,
        status: getRecoveryStatus(score),
        lastTrainedAt,
      };
    });
}

/**
 * Calculate fatigue points per muscle group for a completed workout.
 *
 * Used when saving a workout to create muscle_fatigue_log entries.
 *
 * @param exerciseSets - Array of { exerciseId, sets, muscleGroups }
 * @param sessionRpe - Overall session RPE (1-10)
 */
export function calculateWorkoutFatigue(
  exerciseSets: {
    exerciseId: string;
    setCount: number;
    muscleGroups: {
      muscleGroupId: string;
      muscleGroupName: MuscleGroupName;
      weight: number;
    }[];
  }[],
  sessionRpe: number
): Map<string, { muscleGroupId: string; fatiguePoints: number }> {
  const fatigueMap = new Map<
    string,
    { muscleGroupId: string; fatiguePoints: number }
  >();

  for (const exercise of exerciseSets) {
    for (const mg of exercise.muscleGroups) {
      const fatigue = calculateFatiguePoints(
        exercise.setCount,
        mg.weight,
        sessionRpe
      );

      const existing = fatigueMap.get(mg.muscleGroupId);
      if (existing) {
        existing.fatiguePoints += fatigue;
      } else {
        fatigueMap.set(mg.muscleGroupId, {
          muscleGroupId: mg.muscleGroupId,
          fatiguePoints: fatigue,
        });
      }
    }
  }

  return fatigueMap;
}
