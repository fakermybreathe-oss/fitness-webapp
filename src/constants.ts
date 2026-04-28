/**
 * 全局常量
 * 从 useAuth.tsx 抽离，避免 react-refresh/only-export-components 警告
 */

/** localStorage 存储键名映射 */
export const STORAGE_KEYS = {
  user: 'fitness_user',
  bodyData: 'fitness_body_data',
  weeklyPlan: 'fitness_plan',
  recommendedEquipment: 'fitness_equipment',
  weightHistory: 'fitness_weight_history',
  trainingLogs: 'fitness_training_logs',
  reminders: 'fitness_reminders',
  badges: 'fitness_badges',
  users: 'fitness_users',
} as const;

/** 健身目标中文标签映射 */
export const GOAL_LABELS = {
  'weight-loss': '减脂',
  'muscle-gain': '增肌',
  'body-shaping': '塑形',
} as const;

/** 健身目标图标映射 */
export const GOAL_ICONS = {
  'weight-loss': '🔥',
  'muscle-gain': '💪',
  'body-shaping': '✨',
} as const;
