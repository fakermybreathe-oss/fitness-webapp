import type { Equipment } from '../../types';

export const cardioEquipment: Equipment[] = [
  {
    id: 'rowing-machine',
    name: '划船机',
    nameEn: 'Rowing Machine',
    category: 'cardio',
    targetMuscles: ['背部', '腿部', '核心', '手臂'],
    difficulty: 'intermediate',
    imageUrl: '/images/equipment/rowing_machine_clean.svg',
    sets: 3,
    reps: 12,
    duration: '20-30 minutes',
    usage: [
      '1. 调整座椅和脚踏板至合适位置，确保膝盖微屈，背部挺直。',
      '2. 双手握住手柄，肩部放松，手臂伸直，准备开始。',
      '3. 用腿部力量推动脚踏板，同时保持背部稳定，手臂自然弯曲。',
      '4. 当腿部完全伸展时，用手臂和背部力量将手柄拉向胸部。',
      '5. 缓慢控制返回起始位置，重复动作，保持呼吸节奏。'
    ],
    tips: [
      '1. 保持核心收紧，避免弓背或过度后仰，以保护脊柱。',
      '2. 动作应流畅连贯，避免突然发力，减少关节压力。',
      '3. 根据个人体能调整阻力和速度，循序渐进增加强度。'
    ],
    recommendedFor: ['weight-loss', 'muscle-gain', 'body-shaping'],
  },
  {
    id: 'spin-bike',
    name: '动感单车',
    nameEn: 'Spin Bike',
    category: 'cardio',
    targetMuscles: ['腿部', '臀部', '核心'],
    difficulty: 'beginner',
    imageUrl: '/images/equipment/spin_bike_clean.svg',
    sets: 3,
    reps: 25,
    duration: '45-60 minutes',
    usage: [
      '1. 调节座椅高度使脚踩到踏板最低点时膝盖微屈',
      '2. 设置车把高度，确保上半身自然前倾且抓握舒适',
      '3. 开始 5 分钟的中速骑行热身',
      '4. 逐渐增加阻力，保持具有挑战性的训练强度',
      '5. 结合间歇训练：在 30 秒高强度冲刺与 60 秒低强度恢复间切换',
      '6. 训练结束前进行 5 分钟低阻力放松骑行'
    ],
    tips: [
      '保持背部挺直，避免耸肩以防止劳损',
      '专注于大腿前侧和后侧肌群的均匀发力',
      '保持水分补充并监测心率，确保在目标区间内'
    ],
    recommendedFor: ['weight-loss', 'body-shaping'],
  },
  {
    id: 'stair-climber',
    name: '踏步机',
    nameEn: 'Stair Climber',
    category: 'cardio',
    targetMuscles: ['腿部', '臀部', '核心'],
    difficulty: 'beginner',
    imageUrl: '/images/equipment/stair_climber_clean.svg',
    sets: 3,
    reps: 20,
    duration: '45-60 minutes',
    usage: [
      '1. 双脚平稳踩在踏板上，双脚等宽',
      '2. 扶住扶手以保持平衡和支撑',
      '3. 开始平稳、受控的踏步动作，模拟爬楼梯',
      '4. 保持上半身直立且略微前倾',
      '5. 逐渐增加阻力以提高训练强度'
    ],
    tips: [
      '从低阻力开始，专注于动作规范以避免受伤',
      '全程收紧核心，以增强稳定性和热量消耗',
      '监测心率以确保处于最佳心肺训练水平'
    ],
    recommendedFor: ['weight-loss', 'body-shaping'],
  },
  {
    id: 'jump-rope',
    name: '跳绳',
    nameEn: 'Jump Rope',
    category: 'cardio',
    targetMuscles: ['全身', '腿部', '核心'],
    difficulty: 'beginner',
    imageUrl: '/images/equipment/jump_rope_clean.svg',
    sets: 3,
    reps: 50,
    duration: '10 min',
    usage: [
      '1. 选择合适长度的跳绳，双脚并拢站立，双手握住手柄',
      '2. 将跳绳置于身后，手腕发力向前摆动跳绳',
      '3. 当跳绳接近脚前时，双脚轻轻跳起，让跳绳从脚下通过',
      '4. 保持身体直立，核心收紧，落地时用前脚掌缓冲',
      '5. 重复跳跃动作，保持节奏均匀，逐渐增加速度或变化跳法'
    ],
    tips: [
      '确保跳绳长度合适，站立时手柄应达到腋下高度',
      '保持手腕为主要发力点，避免过度使用手臂或肩膀',
      '选择平坦、有弹性的地面进行训练，以减少关节冲击'
    ],
    recommendedFor: ['weight-loss', 'body-shaping'],
  },
];