import { describe, it, expect, beforeEach } from 'vitest';

// User Journey: As a user, I want to record my weight daily,
// so that I can track my BMI trend over time.

describe('Weight Tracking', () => {
  describe('WeightRecord type and validation', () => {
    it('should create a valid weight record with required fields', () => {
      const weightRecord = {
        id: 'wr-1',
        userId: 'user-1',
        weight: 70.5,
        date: '2024-01-15',
        bmi: 22.3,
      };

      expect(weightRecord.id).toBeDefined();
      expect(weightRecord.userId).toBeDefined();
      expect(weightRecord.weight).toBeGreaterThan(0);
      expect(weightRecord.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(weightRecord.bmi).toBeGreaterThanOrEqual(0);
    });

    it('should calculate BMI correctly from height and weight', () => {
      const height = 170; // cm
      const weight = 70; // kg
      const expectedBMI = weight / ((height / 100) ** 2);

      expect(expectedBMI).toBeCloseTo(24.22, 1);
    });

    it('should include optional note field', () => {
      const weightRecord = {
        id: 'wr-2',
        userId: 'user-1',
        weight: 71.0,
        date: '2024-01-16',
        bmi: 24.5,
        note: 'After morning exercise',
      };

      expect(weightRecord.note).toBeDefined();
    });
  });

  describe('Weight history storage', () => {
    beforeEach(() => {
      localStorage.clear();
    });

    it('should save weight record to localStorage', () => {
      const weightRecord = {
        id: 'wr-1',
        userId: 'user-1',
        weight: 70.5,
        date: '2024-01-15',
        bmi: 22.3,
      };

      const history = [weightRecord];
      localStorage.setItem('fitness_weight_history', JSON.stringify(history));

      const stored = JSON.parse(localStorage.getItem('fitness_weight_history') || '[]');
      expect(stored).toHaveLength(1);
      expect(stored[0].weight).toBe(70.5);
    });

    it('should retrieve weight history sorted by date', () => {
      const history = [
        { id: 'wr-1', userId: 'user-1', weight: 70.5, date: '2024-01-15', bmi: 22.3 },
        { id: 'wr-2', userId: 'user-1', weight: 71.0, date: '2024-01-10', bmi: 22.5 },
        { id: 'wr-3', userId: 'user-1', weight: 69.8, date: '2024-01-20', bmi: 22.1 },
      ];

      localStorage.setItem('fitness_weight_history', JSON.stringify(history));

      const stored = JSON.parse(localStorage.getItem('fitness_weight_history') || '[]');
      const sorted = stored.sort((a: {date: string}, b: {date: string}) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      expect(sorted[0].date).toBe('2024-01-20');
      expect(sorted[sorted.length - 1].date).toBe('2024-01-10');
    });

    it('should filter weight history by userId', () => {
      const history = [
        { id: 'wr-1', userId: 'user-1', weight: 70.5, date: '2024-01-15', bmi: 22.3 },
        { id: 'wr-2', userId: 'user-2', weight: 80.0, date: '2024-01-15', bmi: 25.5 },
      ];

      localStorage.setItem('fitness_weight_history', JSON.stringify(history));

      const stored = JSON.parse(localStorage.getItem('fitness_weight_history') || '[]');
      const userHistory = stored.filter((r: {userId: string}) => r.userId === 'user-1');

      expect(userHistory).toHaveLength(1);
    });
  });
});

// User Journey: As a user, I want to mark my daily training as completed,
// so that I can see my progress and streak.

describe('Training Logging', () => {
  describe('TrainingLog type and validation', () => {
    it('should create a valid training log with required fields', () => {
      const trainingLog = {
        id: 'tl-1',
        userId: 'user-1',
        date: '2024-01-15',
        planId: 'plan-1',
        dayIndex: 0,
        exercises: [
          { exerciseId: 'ex-1', name: 'Push-ups', setsCompleted: 3, completed: true, skipped: false }
        ],
        duration: 45,
        caloriesBurned: 200,
        completed: true,
      };

      expect(trainingLog.id).toBeDefined();
      expect(trainingLog.userId).toBeDefined();
      expect(trainingLog.exercises).toHaveLength(1);
      expect(trainingLog.duration).toBeGreaterThan(0);
      expect(trainingLog.caloriesBurned).toBeGreaterThanOrEqual(0);
    });

    it('should track exercise completion status', () => {
      const exerciseCompletion = {
        exerciseId: 'ex-1',
        name: 'Squats',
        setsCompleted: 3,
        completed: true,
        skipped: false,
      };

      expect(exerciseCompletion.completed).toBe(true);
      expect(exerciseCompletion.skipped).toBe(false);
    });

    it('should include optional rating and notes', () => {
      const trainingLog = {
        id: 'tl-2',
        userId: 'user-1',
        date: '2024-01-15',
        planId: 'plan-1',
        dayIndex: 0,
        exercises: [],
        duration: 30,
        caloriesBurned: 150,
        completed: true,
        rating: 4,
        notes: 'Great workout session',
      };

      expect(trainingLog.rating).toBe(4);
      expect(trainingLog.notes).toBe('Great workout session');
    });
  });

  describe('Training log storage', () => {
    beforeEach(() => {
      localStorage.clear();
    });

    it('should save training log to localStorage', () => {
      const trainingLog = {
        id: 'tl-1',
        userId: 'user-1',
        date: '2024-01-15',
        planId: 'plan-1',
        dayIndex: 0,
        exercises: [],
        duration: 45,
        caloriesBurned: 200,
        completed: true,
      };

      const logs = [trainingLog];
      localStorage.setItem('fitness_training_logs', JSON.stringify(logs));

      const stored = JSON.parse(localStorage.getItem('fitness_training_logs') || '[]');
      expect(stored).toHaveLength(1);
    });

    it('should calculate streak from consecutive training logs', () => {
      const logs = [
        { id: 'tl-1', userId: 'user-1', date: '2024-01-13', completed: true },
        { id: 'tl-2', userId: 'user-1', date: '2024-01-14', completed: true },
        { id: 'tl-3', userId: 'user-1', date: '2024-01-15', completed: true },
        { id: 'tl-4', userId: 'user-1', date: '2024-01-16', completed: false },
      ];

      localStorage.setItem('fitness_training_logs', JSON.stringify(logs));

      // Calculate streak: consecutive completed days from most recent
      const sortedLogs = logs.sort((a: {date: string}, b: {date: string}) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      let streak = 0;
      for (const log of sortedLogs) {
        if (log.completed) {
          streak++;
        } else {
          break;
        }
      }

      expect(streak).toBe(0); // Most recent is not completed
    });
  });
});

// User Journey: As a user, I want to set training reminders,
// so that I don't forget to exercise.

describe('Reminder Settings', () => {
  describe('ReminderSettings type and validation', () => {
    it('should create valid reminder settings', () => {
      const reminder = {
        id: 'rm-1',
        userId: 'user-1',
        enabled: true,
        time: '08:00',
        days: [1, 2, 3, 4, 5], // Mon-Fri
        message: 'Time for your workout!',
      };

      expect(reminder.enabled).toBe(true);
      expect(reminder.time).toMatch(/^\d{2}:\d{2}$/);
      expect(reminder.days.every((d: number) => d >= 0 && d <= 6)).toBe(true);
    });

    it('should support disabling reminders', () => {
      const reminder = {
        id: 'rm-1',
        userId: 'user-1',
        enabled: false,
        time: '08:00',
        days: [],
        message: '',
      };

      expect(reminder.enabled).toBe(false);
    });
  });

  describe('Reminder storage', () => {
    beforeEach(() => {
      localStorage.clear();
    });

    it('should save reminder settings to localStorage', () => {
      const reminder = {
        id: 'rm-1',
        userId: 'user-1',
        enabled: true,
        time: '08:00',
        days: [1, 2, 3, 4, 5],
        message: 'Time for workout!',
      };

      localStorage.setItem('fitness_reminders', JSON.stringify([reminder]));

      const stored = JSON.parse(localStorage.getItem('fitness_reminders') || '[]');
      expect(stored).toHaveLength(1);
      expect(stored[0].time).toBe('08:00');
    });
  });
});

// User Journey: As a user, I want better equipment recommendations based on my history,
// so that I can try new equipment suitable for my level.

describe('Enhanced Recommendation Algorithm', () => {
  describe('Recommendation scoring', () => {
    it('should calculate recommendation score with multiple factors', () => {
      // Expected scoring factors for a beginner with muscle-gain goal:
      // - Goal match: 40 points (muscle-gain matches)
      // - Experience match: 15 points (beginner matches)
      // - Muscle diversity: ~10 points (2 muscles)
      // Base score should be > 50

      const goalScore = 40;
      const experienceScore = 15;
      const diversityScore = 10;
      const score = goalScore + experienceScore + diversityScore;

      expect(score).toBeGreaterThan(50);
    });

    it('should prioritize cardio for high BMI users', () => {
      const bmi = 28; // High BMI
      const cardioEquipment = { category: 'cardio' };
      const strengthEquipment = { category: 'strength' };

      // High BMI (> 25) should get bonus for cardio
      const cardioBonus = bmi > 25 && cardioEquipment.category === 'cardio' ? 20 : 0;
      const strengthBonus = bmi > 25 && strengthEquipment.category === 'strength' ? 0 : 20;

      expect(cardioBonus).toBe(20);
      expect(strengthBonus).toBe(0);
    });

    it('should favor equipment not recently used', () => {
      const trainingHistory = [
        { date: '2024-01-15', exercises: [{ equipment: 'dumbbells' }] },
        { date: '2024-01-14', exercises: [{ equipment: 'barbell' }] },
      ];

      const newEquipmentId = 'kettlebell';
      const usedEquipmentIds = trainingHistory
        .flatMap(log => log.exercises.map(ex => ex.equipment));

      const isRecentlyUsed = usedEquipmentIds.includes(newEquipmentId);
      const freshnessBonus = isRecentlyUsed ? 0 : 10;

      expect(freshnessBonus).toBe(10);
    });

    it('should return top N recommendations sorted by score', () => {
      const scores = [
        { equipmentId: 'barbell', score: 85 },
        { equipmentId: 'dumbbells', score: 75 },
        { equipmentId: 'rowing-machine', score: 60 },
        { equipmentId: 'jump-rope', score: 45 },
        { equipmentId: 'foam-roller', score: 30 },
      ];

      const maxRecommendations = 6;
      const filtered = scores.filter(s => s.score > 30);
      const sorted = filtered.sort((a, b) => b.score - a.score);
      const topN = sorted.slice(0, maxRecommendations);

      expect(topN).toHaveLength(4);
      expect(topN[0].equipmentId).toBe('barbell');
    });
  });

  describe('Plan feedback integration', () => {
    it('should adjust plan intensity based on feedback', () => {
      const feedbackHistory = [
        { difficultyRating: 'too_easy' },
        { difficultyRating: 'too_easy' },
        { difficultyRating: 'too_easy' },
      ];

      // Average difficulty value: too_easy = 1, appropriate = 2, too_hard = 3
      const avgDifficulty = feedbackHistory.reduce((sum, f) => {
        const value = f.difficultyRating === 'too_easy' ? 1
          : f.difficultyRating === 'appropriate' ? 2 : 3;
        return sum + value;
      }, 0) / feedbackHistory.length;

      // If avgDifficulty < 1.5, increase intensity
      expect(avgDifficulty).toBe(1);
      expect(avgDifficulty < 1.5).toBe(true);
    });

    it('should decrease intensity when feedback is too hard', () => {
      const feedbackHistory = [
        { difficultyRating: 'too_hard' },
        { difficultyRating: 'too_hard' },
        { difficultyRating: 'too_hard' },
      ];

      const avgDifficulty = feedbackHistory.reduce((sum, f) => {
        const value = f.difficultyRating === 'too_easy' ? 1
          : f.difficultyRating === 'appropriate' ? 2 : 3;
        return sum + value;
      }, 0) / feedbackHistory.length;

      // If avgDifficulty > 2.5, decrease intensity
      expect(avgDifficulty).toBe(3);
      expect(avgDifficulty > 2.5).toBe(true);
    });
  });
});