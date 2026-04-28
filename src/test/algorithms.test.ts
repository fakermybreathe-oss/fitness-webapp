import { describe, it, expect } from 'vitest';
import {
  calculateBMI,
  getBMICategory,
  recommendEquipment,
  calculateRecommendationScore,
  recommendEquipmentEnhanced,
  BMI_THRESHOLDS,
  BMI_CATEGORIES,
} from '../utils/recommendations';
import {
  generateWeeklyPlan,
  adjustPlanIntensity,
  TRAINING_FREQUENCY,
} from '../data/workoutPlans';
import {
  estimateCalories,
  estimateWorkoutDuration,
  estimateWorkoutCalories,
  adjustDurationForGoal,
  getCaloriesPerMuscleGroup,
  getMETValue,
} from '../utils/calorieEstimation';
import type { BodyData, TrainingLog, PlanFeedback, Equipment } from '../types';

describe('Recommendation Algorithm', () => {
  describe('calculateBMI', () => {
    it('should calculate BMI correctly', () => {
      const bmi = calculateBMI(170, 70);
      expect(bmi).toBeCloseTo(24.22, 1);
    });

    it('should handle edge case of zero height', () => {
      const bmi = calculateBMI(0, 70);
      expect(bmi).toBe(Infinity);
    });
  });

  describe('getBMICategory', () => {
    it('should return 偏瘦 for BMI < 18.5', () => {
      expect(getBMICategory(18)).toBe('偏瘦');
    });

    it('should return 正常 for BMI 18.5-24', () => {
      expect(getBMICategory(20)).toBe('正常');
      expect(getBMICategory(23.9)).toBe('正常');
    });

    it('should return 偏胖 for BMI 24-28', () => {
      expect(getBMICategory(25)).toBe('偏胖');
      expect(getBMICategory(27)).toBe('偏胖');
    });

    it('should return 肥胖 for BMI >= 28', () => {
      expect(getBMICategory(28)).toBe('肥胖');
      expect(getBMICategory(35)).toBe('肥胖');
    });
  });

  describe('BMI Thresholds', () => {
    it('should have correct threshold values', () => {
      expect(BMI_THRESHOLDS.CARDIO).toBe(25);
      expect(BMI_THRESHOLDS.STRENGTH).toBe(22);
    });

    it('should have correct BMI categories', () => {
      expect(BMI_CATEGORIES.UNDERWEIGHT).toBe(18.5);
      expect(BMI_CATEGORIES.NORMAL).toBe(24);
      expect(BMI_CATEGORIES.OVERWEIGHT).toBe(28);
    });
  });

  describe('recommendEquipment (legacy)', () => {
    const mockBodyData: BodyData = {
      height: 170,
      weight: 70,
      age: 25,
      gender: 'male',
      goal: 'muscle-gain',
      experience: 'beginner',
    };

    it('should filter equipment by goal', () => {
      const recommendations = recommendEquipment(mockBodyData);
      expect(recommendations.length).toBeGreaterThan(0);
      expect(recommendations.length).toBeLessThanOrEqual(6);
    });

    it('should filter cardio for high BMI', () => {
      const highBmiData: BodyData = {
        ...mockBodyData,
        height: 170,
        weight: 100, // BMI ~34.6
      };
      const recommendations = recommendEquipment(highBmiData);
      recommendations.forEach(eq => {
        expect(eq.category).toBe('cardio');
      });
    });

    it('should filter strength for low BMI', () => {
      const lowBmiData: BodyData = {
        ...mockBodyData,
        height: 180,
        weight: 55, // BMI ~17
      };
      const recommendations = recommendEquipment(lowBmiData);
      recommendations.forEach(eq => {
        expect(eq.category).toBe('strength');
      });
    });

    it('should filter by experience level', () => {
      const beginnerData: BodyData = {
        ...mockBodyData,
        experience: 'beginner',
      };
      const recommendations = recommendEquipment(beginnerData);
      recommendations.forEach(eq => {
        expect(['beginner', 'intermediate']).toContain(eq.difficulty);
      });
    });
  });

  describe('calculateRecommendationScore', () => {
    const mockBodyData: BodyData = {
      height: 170,
      weight: 70,
      age: 25,
      gender: 'male',
      goal: 'muscle-gain',
      experience: 'beginner',
    };

    it('should return valid recommendation score object', () => {
      const testEquipment: Equipment = { id: 'barbell', name: 'Barbell', nameEn: 'Barbell', category: 'strength', targetMuscles: ['chest'], difficulty: 'beginner', imageUrl: '', usage: [], tips: [], recommendedFor: ['muscle-gain'] };
      const result = calculateRecommendationScore(
        testEquipment,
        mockBodyData,
        []
      );

      expect(result).toHaveProperty('equipment');
      expect(result).toHaveProperty('score');
      expect(result).toHaveProperty('reasons');
      expect(typeof result.score).toBe('number');
      expect(Array.isArray(result.reasons)).toBe(true);
    });

    it('should award 40 points for goal match', () => {
      const testEquipment: Equipment = { id: 'barbell', name: 'Barbell', nameEn: 'Barbell', category: 'strength', targetMuscles: ['chest'], difficulty: 'beginner', imageUrl: '', usage: [], tips: [], recommendedFor: ['muscle-gain'] };
      const result = calculateRecommendationScore(
        testEquipment,
        mockBodyData,
        []
      );

      expect(result.score).toBeGreaterThanOrEqual(40);
    });

    it('should increase score for matching experience level', () => {
      const testEquipment: Equipment = { id: 'dumbbells', name: 'Dumbbells', nameEn: 'Dumbbells', category: 'strength', targetMuscles: ['chest'], difficulty: 'beginner', imageUrl: '', usage: [], tips: [], recommendedFor: ['muscle-gain'] };
      const result = calculateRecommendationScore(
        testEquipment,
        { ...mockBodyData, experience: 'beginner' },
        []
      );

      expect(result.score).toBeGreaterThanOrEqual(15);
    });

    it('should add freshness bonus for unused equipment', () => {
      const mockEquipment: Equipment = { id: 'new-equipment', name: 'New', nameEn: 'New', category: 'strength', targetMuscles: ['chest'], difficulty: 'beginner', imageUrl: '', usage: [], tips: [], recommendedFor: ['muscle-gain'] };
      const history: TrainingLog[] = [
        {
          id: 'tl-1',
          userId: 'user-1',
          date: '2024-01-15',
          planId: 'plan-1',
          dayIndex: 0,
          exercises: [{ exerciseId: 'barbell', name: 'Test', setsCompleted: 3, repsPerSet: [10], actualRest: 60, completed: true, skipped: false }],
          duration: 45,
          caloriesBurned: 200,
          completed: true,
        },
      ];

      // Equipment not in history should get bonus
      const result1 = calculateRecommendationScore(mockEquipment, mockBodyData, history);

      // Equipment in history should not get bonus
      const result2 = calculateRecommendationScore(
        { ...mockEquipment, id: 'barbell' },
        mockBodyData,
        history
      );

      expect(result1.score).toBeGreaterThan(result2.score);
    });
  });

  describe('recommendEquipmentEnhanced', () => {
    const mockBodyData: BodyData = {
      height: 170,
      weight: 70,
      age: 25,
      gender: 'male',
      goal: 'muscle-gain',
      experience: 'beginner',
    };

    it('should return sorted recommendations by score', () => {
      const results = recommendEquipmentEnhanced(mockBodyData);

      for (let i = 1; i < results.length; i++) {
        expect(results[i - 1].score).toBeGreaterThanOrEqual(results[i].score);
      }
    });

    it('should filter out low-scoring equipment', () => {
      const results = recommendEquipmentEnhanced(mockBodyData);

      results.forEach(r => {
        expect(r.score).toBeGreaterThan(30);
      });
    });

    it('should respect max recommendations limit', () => {
      const results = recommendEquipmentEnhanced(mockBodyData);

      expect(results.length).toBeLessThanOrEqual(6);
    });

    it('should include reasons in recommendations', () => {
      const results = recommendEquipmentEnhanced(mockBodyData);

      results.forEach(r => {
        expect(r.reasons.length).toBeGreaterThan(0);
      });
    });
  });
});

describe('Calorie Estimation', () => {
  describe('estimateCalories', () => {
    it('should estimate calories based on MET and duration', () => {
      const calories = estimateCalories('barbell', 30, 70);
      expect(calories).toBeGreaterThan(0);
    });

    it('should use different MET values for different equipment', () => {
      const cardioCalories = estimateCalories('jump-rope', 30, 70);
      const strengthCalories = estimateCalories('barbell', 30, 70);

      // Jumping rope has higher MET
      expect(cardioCalories).toBeGreaterThan(strengthCalories);
    });

    it('should scale with body weight', () => {
      const lighterCal = estimateCalories('barbell', 30, 50);
      const heavierCal = estimateCalories('barbell', 30, 100);

      expect(heavierCal).toBeGreaterThan(lighterCal);
    });
  });

  describe('estimateWorkoutDuration', () => {
    it('should calculate duration based on exercise count', () => {
      const duration = estimateWorkoutDuration(4);
      expect(duration).toBe(32); // 4 exercises * 8 minutes
    });

    it('should return 0 for no exercises', () => {
      const duration = estimateWorkoutDuration(0);
      expect(duration).toBe(0);
    });
  });

  describe('getMETValue', () => {
    it('should return specific MET for known equipment', () => {
      const jumpRopeMet = getMETValue('jump-rope');
      expect(jumpRopeMet).toBe(12);
    });

    it('should return default MET for unknown equipment', () => {
      const unknownMet = getMETValue('unknown-equipment');
      expect(unknownMet).toBe(5); // default-strength
    });
  });

  describe('estimateWorkoutCalories', () => {
    it('should sum calories for multiple exercises', () => {
      const exercises = [
        { equipment: 'barbell', durationMinutes: 20 },
        { equipment: 'dumbbells', durationMinutes: 15 },
      ];
      const result = estimateWorkoutCalories(exercises, 70);
      expect(result).toBeGreaterThan(0);
    });

    it('should return 0 for empty exercise list', () => {
      expect(estimateWorkoutCalories([], 70)).toBe(0);
    });
  });

  describe('adjustDurationForGoal', () => {
    it('should increase duration by 20% for weight-loss', () => {
      expect(adjustDurationForGoal(60, 'weight-loss')).toBe(72);
    });

    it('should keep duration for muscle-gain', () => {
      expect(adjustDurationForGoal(60, 'muscle-gain')).toBe(60);
    });

    it('should increase duration by 10% for body-shaping', () => {
      expect(adjustDurationForGoal(60, 'body-shaping')).toBe(66);
    });
  });

  describe('getCaloriesPerMuscleGroup', () => {
    it('should group calories by muscle', () => {
      const exercises = [
        { targetMuscle: 'chest', equipment: 'bench-press', durationMinutes: 15 },
        { targetMuscle: 'chest', equipment: 'chest-fly', durationMinutes: 10 },
        { targetMuscle: 'back', equipment: 'lat-pull-down', durationMinutes: 15 },
      ];
      const result = getCaloriesPerMuscleGroup(exercises, 70);
      expect(result.chest).toBeGreaterThan(0);
      expect(result.back).toBeGreaterThan(0);
      expect(result.chest).toBeGreaterThan(result.back);
    });

    it('should return empty object for no exercises', () => {
      expect(Object.keys(getCaloriesPerMuscleGroup([], 70)).length).toBe(0);
    });
  });
});

describe('Workout Plans', () => {
  describe('generateWeeklyPlan', () => {
    it('should generate a 7-day plan with training days matching frequency', () => {
      const plan = generateWeeklyPlan({
        height: 170, weight: 70, age: 25, gender: 'male', goal: 'muscle-gain', experience: 'beginner', frequency: 3
      } as any);

      expect(plan.days.length).toBe(7);
      const workoutDays = plan.days.filter(d => d.exercises.length > 0);
      expect(workoutDays.length).toBe(3);
    });

    it('should set correct day names', () => {
      const plan = generateWeeklyPlan({
        height: 170, weight: 70, age: 25, gender: 'male', goal: 'muscle-gain', experience: 'beginner', frequency: 3
      } as any);

      expect(plan.days[0].dayName).toBe('周一');
      expect(plan.days[1].dayName).toBe('周二');
    });

    it('should have rest day focus when no exercises', () => {
      const plan = generateWeeklyPlan({
        height: 170, weight: 70, age: 25, gender: 'male', goal: 'muscle-gain', experience: 'beginner', frequency: 3
      } as any);

      const restDay = plan.days.find(d => d.exercises.length === 0);
      expect(restDay?.focus).toBe('休息日');
    });
  });

  describe('adjustPlanIntensity', () => {
    it('should not adjust plan with less than 3 feedbacks', () => {
      const plan = generateWeeklyPlan({
        height: 170, weight: 70, age: 25, gender: 'male', goal: 'muscle-gain', experience: 'beginner', frequency: 3
      } as any);
      
      const initialSets = plan.days[0].exercises[0].sets;

      const feedbacks: PlanFeedback[] = [
        { id: 'f1', userId: 'u1', planId: plan.id, date: '2024-01-01', difficultyRating: 'too_easy' },
      ];

      const adjusted = adjustPlanIntensity(plan, feedbacks);
      expect(adjusted.days[0].exercises[0].sets).toBe(initialSets);
    });

    it('should increase intensity when feedback is too_easy', () => {
      const initialParams = { sets: 3, reps: '8-12', rest: 90 };
      const feedbacks: PlanFeedback[] = [
        { id: 'f1', userId: 'u1', planId: 'p1', date: '2024-01-01', difficultyRating: 'too_easy' },
        { id: 'f2', userId: 'u1', planId: 'p1', date: '2024-01-02', difficultyRating: 'too_easy' },
        { id: 'f3', userId: 'u1', planId: 'p1', date: '2024-01-03', difficultyRating: 'too_easy' },
      ];

      const adjusted = adjustPlanIntensity(initialParams, feedbacks);
      expect(adjusted.sets).toBeGreaterThan(3);
    });

    it('should decrease intensity when feedback is too_hard', () => {
      const initialParams = { sets: 3, reps: '8-12', rest: 90 };
      const feedbacks: PlanFeedback[] = [
        { id: 'f1', userId: 'u1', planId: 'p1', date: '2024-01-01', difficultyRating: 'too_hard' },
        { id: 'f2', userId: 'u1', planId: 'p1', date: '2024-01-02', difficultyRating: 'too_hard' },
        { id: 'f3', userId: 'u1', planId: 'p1', date: '2024-01-03', difficultyRating: 'too_hard' },
      ];

      const adjusted = adjustPlanIntensity(initialParams, feedbacks);
      expect(adjusted.sets).toBeLessThan(3);
    });
  });

  describe('TRAINING_FREQUENCY constant', () => {
    it('should have correct values for all experience levels', () => {
      expect(TRAINING_FREQUENCY.beginner).toBe(3);
      expect(TRAINING_FREQUENCY.intermediate).toBe(4);
      expect(TRAINING_FREQUENCY.advanced).toBe(5);
    });
  });
});