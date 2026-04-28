/**
 * Calorie estimation utilities based on MET (Metabolic Equivalent of Task) values
 */

// MET values for different exercises (approximate values)
const MET_VALUES: Record<string, number> = {
  // Cardio
  'spin-bike': 7.5,      // Moderate cycling
  'rowing-machine': 8.0, // Rowing machine
  'stair-climber': 8.5,  // Stair climbing
  'jump-rope': 12.0,     // Jumping rope

  // Strength
  'barbell': 6.0,        // Barbell exercises
  'dumbbells': 5.0,      // Dumbbell exercises
  'bench-press': 6.0,    // Bench press
  'squat-rack': 6.0,     // Squats
  'leg-press': 5.5,      // Leg press
  'pull-up-bar': 6.0,   // Pull-ups
  'dip-station': 5.5,    // Dips
  'cable-machine': 4.5,  // Cable exercises
  'chest-fly': 4.0,      // Chest fly
  'lat-pull-down': 4.5,  // Lat pulldown
  'smith-machine': 5.0,  // Smith machine
  'kettlebell': 6.5,     // Kettlebell
  'resistance-band': 4.0, // Resistance band
  'battle-rope': 10.0,   // Battle ropes
  'ab-wheel': 5.0,       // Ab wheel

  // Flexibility
  'foam-roller': 2.5,    // Stretching/foam rolling
  'stretching-bar': 2.0, // Stretching
  'balance-ball': 3.5,   // Balance exercises

  // Default values
  'default-cardio': 7.0,
  'default-strength': 5.0,
};

/**
 * Estimate calories burned based on exercise type, duration, and body weight
 * Formula: Calories = MET × weight (kg) × duration (hours)
 */
export function estimateCalories(
  equipmentId: string,
  durationMinutes: number,
  weightKg: number
): number {
  const met = MET_VALUES[equipmentId] || MET_VALUES['default-strength'];
  const durationHours = durationMinutes / 60;
  return Math.round(met * weightKg * durationHours);
}

/**
 * Estimate calories for a complete workout session
 */
export function estimateWorkoutCalories(
  exercises: Array<{ equipment: string; durationMinutes: number }>,
  weightKg: number
): number {
  return exercises.reduce((total, ex) => {
    return total + estimateCalories(ex.equipment, ex.durationMinutes, weightKg);
  }, 0);
}

/**
 * Get MET value for an equipment type
 */
export function getMETValue(equipmentId: string): number {
  return MET_VALUES[equipmentId] || MET_VALUES['default-strength'];
}

/**
 * Estimate workout duration based on number of exercises
 */
export function estimateWorkoutDuration(
  exerciseCount: number
): number {
  // Assume 4 sets per exercise, 2 minutes per set including rest
  const timePerExercise = 4 * 2; // 8 minutes per exercise
  return exerciseCount * timePerExercise;
}

/**
 * Calculate suggested duration based on fitness goal
 */
export function adjustDurationForGoal(
  baseDuration: number,
  goal: 'weight-loss' | 'muscle-gain' | 'body-shaping'
): number {
  switch (goal) {
    case 'weight-loss':
      return Math.round(baseDuration * 1.2); // 20% longer for cardio
    case 'muscle-gain':
      return baseDuration; // Standard duration
    case 'body-shaping':
      return Math.round(baseDuration * 1.1); // 10% longer
    default:
      return baseDuration;
  }
}

/**
 * Get a summary of calories burned per muscle group
 */
export function getCaloriesPerMuscleGroup(
  exercises: Array<{ targetMuscle: string; equipment: string; durationMinutes: number }>,
  weightKg: number
): Record<string, number> {
  const result: Record<string, number> = {};

  exercises.forEach(ex => {
    const calories = estimateCalories(ex.equipment, ex.durationMinutes, weightKg);
    result[ex.targetMuscle] = (result[ex.targetMuscle] || 0) + calories;
  });

  return result;
}