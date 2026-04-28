import type { Equipment } from '../../types';
import { cardioEquipment } from './cardio';
import { strengthEquipment } from './strength';
import { flexibilityEquipment } from './flexibility';

// Re-export individual category equipment
export { cardioEquipment } from './cardio';
export { strengthEquipment } from './strength';
export { flexibilityEquipment } from './flexibility';

// Combined equipment database
export const equipmentDatabase: Equipment[] = [
  ...cardioEquipment,
  ...strengthEquipment,
  ...flexibilityEquipment,
];
