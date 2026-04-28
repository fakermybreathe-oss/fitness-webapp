export type FitnessGoal = 'weight-loss' | 'muscle-gain' | 'body-shaping';
export type Gender = 'male' | 'female';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';
export type EquipmentCategory = 'cardio' | 'strength' | 'flexibility';
export type DifficultyRating = 'too_easy' | 'appropriate' | 'too_hard';

export interface User {
  id: string;
  username: string;
  name?: string;
  email: string;
  password: string;
  createdAt: string;
}

export interface BodyData {
  height: number;
  weight: number;
  age: number;
  gender: Gender;
  goal: FitnessGoal;
  experience: Difficulty;
  frequency?: number;
}

export interface WeightRecord {
  id: string;
  userId: string;
  weight: number;
  date: string;
  bmi: number;
  note?: string;
}

export interface ExerciseCompletion {
  exerciseId: string;
  name: string;
  setsCompleted: number;
  repsPerSet: number[];
  actualRest: number;
  completed: boolean;
  skipped: boolean;
}

export interface TrainingLog {
  id: string;
  userId: string;
  date: string;
  planId: string;
  dayIndex: number;
  exercises: ExerciseCompletion[];
  duration: number;
  caloriesBurned: number;
  completed: boolean;
  rating?: 1 | 2 | 3 | 4 | 5;
  notes?: string;
}

export interface ReminderSettings {
  id: string;
  userId: string;
  enabled: boolean;
  time: string;
  days: number[];
  message: string;
  soundEnabled: boolean;
}

export interface Badge {
  id: string;
  userId: string;
  type: 'streak_7' | 'streak_30' | 'weight_goal' | 'first_checkin' | 'complete_week';
  earnedAt: string;
  name: string;
  description: string;
}

export interface PlanFeedback {
  id: string;
  userId: string;
  planId: string;
  date: string;
  difficultyRating: DifficultyRating;
  energyLevel?: 1 | 2 | 3 | 4 | 5;
  sorenessLevel?: 1 | 2 | 3 | 4 | 5;
  suggestions?: string;
}

export interface DailyStats {
  date: string;
  userId: string;
  totalCalories: number;
  totalDuration: number;
  exercisesCompleted: number;
  completionRate: number;
  streakDay: number;
}

export interface Equipment {
  id: string;
  name: string;
  nameEn: string;
  category: EquipmentCategory;
  targetMuscles: string[];
  difficulty: Difficulty;
  imageUrl: string;
  image?: string;
  description?: string;
  usage: string[];
  tips: string[];
  recommendedFor: FitnessGoal[];
  sets?: number;
  reps?: number;
  duration?: string;
}

export interface WorkoutExercise {
  id: string;
  name: string;
  sets: number;
  reps: string | number;
  rest: number;
  completed?: boolean;
  muscle?: string;
  instructions?: string;
  equipment?: string;
  targetMuscle?: string;
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number | string;
  rest: number;
  equipment?: string;
  targetMuscle?: string;
  completed?: boolean;
  muscle?: string;
  instructions?: string;
}

export interface DailyWorkout {
  id?: string;
  day: number;
  dayName: string;
  focus: string;
  exercises: Exercise[];
}

export interface WeeklyPlan {
  id: string;
  userId: string;
  goal: FitnessGoal;
  frequency: number;
  days: DailyWorkout[];
  createdAt: string;
}

export interface AppState {
  user: User | null;
  bodyData: BodyData | null;
  weeklyPlan: WeeklyPlan | null;
  recommendedEquipment: Equipment[];
  weightHistory: WeightRecord[];
  trainingLogs: TrainingLog[];
  reminders: ReminderSettings[];
  badges: Badge[];
}

export type AppAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_BODY_DATA'; payload: BodyData }
  | { type: 'SET_WEEKLY_PLAN'; payload: WeeklyPlan }
  | { type: 'SET_RECOMMENDED_EQUIPMENT'; payload: Equipment[] }
  | { type: 'SET_WEIGHT_HISTORY'; payload: WeightRecord[] }
  | { type: 'ADD_WEIGHT_RECORD'; payload: WeightRecord }
  | { type: 'SET_TRAINING_LOGS'; payload: TrainingLog[] }
  | { type: 'ADD_TRAINING_LOG'; payload: TrainingLog }
  | { type: 'SET_REMINDERS'; payload: ReminderSettings[] }
  | { type: 'SET_BADGES'; payload: Badge[] }
  | { type: 'ADD_BADGE'; payload: Badge }
  | { type: 'UPDATE_GOAL'; payload: FitnessGoal }
  | { type: 'LOGOUT' };
