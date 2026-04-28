import type { Equipment } from '../../types';

export const flexibilityEquipment: Equipment[] = [
  {
    id: 'stretching-bar',
    name: '拉伸架',
    nameEn: 'Stretching Bar',
    category: 'flexibility',
    targetMuscles: ['肩膀', '背部', '腿部', '髋部'],
    difficulty: 'beginner',
    imageUrl: '/images/equipment/stretching_bar_clean.svg',
    sets: 3,
    reps: 1,
    duration: 'Total session: 5-10 minutes',
    usage: [
      '1. 面向拉伸架站立，双脚与肩同宽。',
      '2. 双手握住横杆，掌心向前。',
      '3. 向后移动创造张力，保持手臂伸直，背部平坦。',
      '4. 从髋部缓慢前倾，直到感到腿后侧或背部拉伸。',
      '5. 保持姿势指定时间，深呼吸。'
    ],
    tips: [
      '确保架子稳定，在非滑表面使用。',
      '避免弹跳或猛拉动作以防止受伤；保持平稳拉伸。',
      '调整站姿或握位以针对不同肌肉群，如小腿或肩膀。'
    ],
    recommendedFor: ['weight-loss', 'muscle-gain', 'body-shaping'],
  },
  {
    id: 'balance-ball',
    name: '平衡球',
    nameEn: 'Balance Ball',
    category: 'flexibility',
    targetMuscles: ['核心', '平衡', '背部'],
    difficulty: 'beginner',
    imageUrl: '/images/equipment/balance_ball_clean.svg',
    sets: 3,
    reps: 10,
    duration: '20 minutes',
    usage: [
      '1. 将平衡球放在平坦、无滑表面。',
      '2. 坐在球上，双脚平放地面，膝盖呈90度角。',
      '3. 收紧核心以保持平衡和稳定。',
      '4. 执行坐姿抬腿或骨盆倾斜等练习以提高协调性。',
      '5. 逐渐进阶到平板支撑或球上深蹲等高级动作。'
    ],
    tips: [
      '从基础练习开始建立信心，避免受伤。',
      '保持球适当充气以获得最佳支撑和稳定性。',
      '在宽敞空间使用球，防止跌倒并确保安全。'
    ],
    recommendedFor: ['body-shaping', 'muscle-gain'],
  },
];