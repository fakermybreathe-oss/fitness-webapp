import type { BodyData, Equipment, TrainingLog } from '../types';
import { equipmentDatabase } from '../data/equipment';

// Constants for BMI thresholds
export const BMI_THRESHOLDS = {
  CARDIO: 25,
  STRENGTH: 22,
} as const;

// BMI category boundaries
export const BMI_CATEGORIES = {
  UNDERWEIGHT: 18.5,
  NORMAL: 24,
  OVERWEIGHT: 28,
} as const;

// Maximum equipment recommendations
export const MAX_EQUIPMENT_RECOMMENDATIONS = 6;

// Experience level exercise filters
export const EXPERIENCE_FILTERS: Record<string, string[]> = {
  beginner: ['beginner', 'intermediate'],
  intermediate: ['beginner', 'intermediate'],
  advanced: ['beginner', 'intermediate', 'advanced'],
};

// Goal labels for display
export const GOAL_LABELS: Record<string, string> = {
  'weight-loss': '减脂',
  'muscle-gain': '增肌',
  'body-shaping': '塑形',
};

export const calculateBMI = (height: number, weight: number): number => {
  const heightInMeters = height / 100;
  return weight / (heightInMeters * heightInMeters);
};

export const getBMICategory = (bmi: number): string => {
  if (bmi < BMI_CATEGORIES.UNDERWEIGHT) return '偏瘦';
  if (bmi < BMI_CATEGORIES.NORMAL) return '正常';
  if (bmi < BMI_CATEGORIES.OVERWEIGHT) return '偏胖';
  return '肥胖';
};

// Enhanced recommendation with scoring system
export interface RecommendationScore {
  equipment: Equipment;
  score: number;
  reasons: string[];
}

export const calculateRecommendationScore = (
  equipment: Equipment,
  bodyData: BodyData,
  trainingHistory: TrainingLog[] = []
): RecommendationScore => {
  let score = 0;
  const reasons: string[] = [];

  // 1. Goal match (40% weight)
  const goalMatch = equipment.recommendedFor.includes(bodyData.goal);
  if (goalMatch) {
    score += 40;
    reasons.push(`适合${GOAL_LABELS[bodyData.goal]}目标`);
  }

  // 2. BMI optimization (20% weight)
  const bmi = calculateBMI(bodyData.height, bodyData.weight);
  if (bmi > 28 && equipment.category === 'cardio') {
    score += 20;
    reasons.push('高BMI优先有氧运动');
  } else if (bmi < 20 && equipment.category === 'strength') {
    score += 20;
    reasons.push('低BMI优先力量训练');
  } else if (bmi >= 20 && bmi <= 25) {
    // Normal BMI - no restriction
    score += 10;
  }

  // 3. Experience level (15% weight)
  const allowedDifficulties = EXPERIENCE_FILTERS[bodyData.experience] || EXPERIENCE_FILTERS.intermediate;
  const expMatch = allowedDifficulties.includes(equipment.difficulty);
  if (expMatch) {
    score += 15;
    reasons.push(`适合${bodyData.experience}水平`);
  }

  // 4. Muscle group diversity (15% weight)
  const uniqueMuscles = equipment.targetMuscles.length;
  const diversityScore = Math.min(15, uniqueMuscles * 5);
  score += diversityScore;

  // 5. Training history freshness (10% weight)
  const recentLogs = trainingHistory.slice(-7);
  const recentlyUsed = recentLogs.some(log =>
    log.exercises.some(ex => ex.exerciseId === equipment.id)
  );
  if (!recentlyUsed) {
    score += 10;
    reasons.push('新增器材推荐');
  }

  return { equipment, score, reasons };
};

export const recommendEquipmentEnhanced = (
  bodyData: BodyData,
  trainingHistory: TrainingLog[] = []
): RecommendationScore[] => {
  const scored = equipmentDatabase.map(eq =>
    calculateRecommendationScore(eq, bodyData, trainingHistory)
  );

  return scored
    .filter(s => s.score > 30)
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_EQUIPMENT_RECOMMENDATIONS);
};

export const recommendEquipment = (bodyData: BodyData): Equipment[] => {
  const bmi = calculateBMI(bodyData.height, bodyData.weight);
  const { goal, experience } = bodyData;

  let filtered = equipmentDatabase.filter((eq) => {
    if (goal === 'weight-loss') {
      return eq.recommendedFor.includes('weight-loss');
    }
    if (goal === 'muscle-gain') {
      return eq.recommendedFor.includes('muscle-gain');
    }
    return eq.recommendedFor.includes('body-shaping');
  });

  if (bmi > BMI_THRESHOLDS.CARDIO) {
    filtered = filtered.filter((eq) => eq.category === 'cardio');
  } else if (bmi < BMI_THRESHOLDS.STRENGTH) {
    filtered = filtered.filter((eq) => eq.category === 'strength');
  }

  const allowedDifficulties = EXPERIENCE_FILTERS[experience] || EXPERIENCE_FILTERS.intermediate;
  filtered = filtered.filter((eq) => allowedDifficulties.includes(eq.difficulty));

  return filtered.slice(0, MAX_EQUIPMENT_RECOMMENDATIONS);
};

export const getEquipmentByCategory = (category: string): Equipment[] => {
  return equipmentDatabase.filter((eq) => eq.category === category);
};

export const getEquipmentById = (id: string): Equipment | undefined => {
  return equipmentDatabase.find((eq) => eq.id === id);
};

export const muscleGroupImages: Record<string, string> = {
  '胸部': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
  '背部': 'https://images.unsplash.com/photo-1603287681836-b174ce5074c2?w=800&q=80',
  '腿部': 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=800&q=80',
  '肩膀': 'https://images.unsplash.com/photo-1532029837206-abbe2b22f6b5?w=800&q=80',
  '手臂': 'https://images.unsplash.com/photo-1581009146145-b5ef050c149a?w=800&q=80',
  '核心': 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?w=800&q=80',
  '全身': 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80',
  '有氧': 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=800&q=80',
  '臀部': 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&q=80',
  '柔韧性': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
  '平衡': 'https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=800&q=80',
};
