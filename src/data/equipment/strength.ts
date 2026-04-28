import type { Equipment } from '../../types';

export const strengthEquipment: Equipment[] = [
  {
    id: 'barbell',
    name: '杠铃',
    nameEn: 'Barbell',
    category: 'strength',
    targetMuscles: ['背部', '腿部', '臀部', '核心'],
    difficulty: 'advanced',
    imageUrl: '/images/equipment/barbell_clean.svg',
    sets: 3,
    reps: 8,
    duration: '60 minutes',
    usage: [
      '1. 将杠铃从地面或支架上安全地抬起，保持背部挺直，膝盖微屈。',
      '2. 调整握距，通常与肩同宽，确保手掌朝前或朝后，取决于练习。',
      '3. 进行深蹲：将杠铃置于上背部，缓慢下蹲至大腿与地面平行，然后站起。',
      '4. 进行卧推：仰卧在长凳上，将杠铃从支架上取下，缓慢降低至胸部，然后推起。',
      '5. 进行硬拉：从地面拉起杠铃，保持背部中立，臀部驱动，直至站立。'
    ],
    tips: [
      '1. 始终使用适当的重量，避免过载导致受伤。',
      '2. 保持核心收紧，以稳定脊柱并提高力量输出。',
      '3. 训练前充分热身，并确保有保护者辅助进行大重量练习。'
    ],
    recommendedFor: ['muscle-gain'],
  },
  {
    id: 'dumbbells',
    name: '哑铃',
    nameEn: 'Dumbbells',
    category: 'strength',
    targetMuscles: ['手臂', '肩膀', '胸部', '背部'],
    difficulty: 'beginner',
    imageUrl: '/images/equipment/dumbbells_clean.svg',
    sets: 3,
    reps: 8,
    duration: '每个动作持续2-3秒，组间休息60-90秒',
    usage: [
      '选择合适重量的哑铃，确保能完成规定次数但最后几次有挑战性',
      '双脚与肩同宽站立，保持核心收紧，背部挺直',
      '双手各握一只哑铃，掌心相对，手臂自然下垂于身体两侧',
      '缓慢弯曲肘部，将哑铃向上举起至肩部高度，同时呼气',
      '在顶峰稍作停顿，感受肌肉收缩，然后缓慢下放哑铃至起始位置，同时吸气'
    ],
    tips: [
      '保持动作缓慢控制，避免利用惯性摆动哑铃',
      '确保手腕保持中立位置，避免过度弯曲或伸展',
      '训练前进行5-10分钟动态热身，如手臂环绕，以减少受伤风险'
    ],
    recommendedFor: ['muscle-gain', 'body-shaping'],
  },
  {
    id: 'bench-press',
    name: '卧推凳',
    nameEn: 'Bench Press',
    category: 'strength',
    targetMuscles: ['胸部', '肩膀', '三头肌'],
    difficulty: 'intermediate',
    imageUrl: '/images/equipment/bench_press_clean.svg',
    sets: 3,
    reps: 8,
    duration: '每组休息60-90秒',
    usage: [
      '1. 调整卧推凳至水平位置，确保稳定。',
      '2. 仰卧在凳上，双脚平放地面，背部紧贴凳面。',
      '3. 双手握住杠铃，与肩同宽或略宽，手掌向前。',
      '4. 缓慢下放杠铃至胸部，肘部略低于肩部。',
      '5. 推起杠铃至起始位置，保持手臂微屈。'
    ],
    tips: [
      '保持核心收紧，避免腰部拱起。',
      '控制动作速度，避免快速弹起或锁定肘关节。',
      '使用护腕或辅助工具以增加安全性。'
    ],
    recommendedFor: ['muscle-gain', 'body-shaping'],
  },
  {
    id: 'squat-rack',
    name: '深蹲架',
    nameEn: 'Squat Rack',
    category: 'strength',
    targetMuscles: ['腿部', '臀部', '核心', '背部'],
    difficulty: 'intermediate',
    imageUrl: '/images/equipment/squat_rack_clean.svg',
    sets: 3,
    reps: 8,
    duration: '每组合间休息60-90秒',
    usage: [
      '调整安全杆至合适高度，确保其位于胸部下方',
      '将杠铃置于深蹲架上，确保两端平衡',
      '站于杠铃下方，双手握杠，保持背部挺直',
      '深吸气，收紧核心，将杠铃扛起并后退一步',
      '缓慢下蹲至大腿与地面平行，保持膝盖不超过脚尖',
      '呼气并站起，重复动作，完成一组后安全放回杠铃'
    ],
    tips: [
      '保持背部挺直，避免弯腰以预防腰部受伤',
      '下蹲时控制速度，避免快速反弹以保护膝盖',
      '确保训练区域无障碍物，并使用安全杆以防意外'
    ],
    recommendedFor: ['muscle-gain', 'body-shaping'],
  },
  {
    id: 'pull-up-bar',
    name: '引体向上架',
    nameEn: 'Pull-up Bar',
    category: 'strength',
    targetMuscles: ['背部', '二头肌', '核心'],
    difficulty: 'intermediate',
    imageUrl: '/images/equipment/pull_up_bar_clean.svg',
    sets: 3,
    reps: 8,
    duration: '每组休息60-90秒',
    usage: [
      '1. 双手握住横杆，手掌朝前，与肩同宽或略宽。',
      '2. 身体悬垂，手臂伸直，核心收紧，保持身体稳定。',
      '3. 用背部和手臂力量向上拉，直到下巴超过横杆。',
      '4. 在最高点稍作停顿，感受背部肌肉收缩。',
      '5. 缓慢下降至起始位置，控制速度以避免受伤。'
    ],
    tips: [
      '1. 初学者可使用辅助带或弹力带减轻体重，逐步增加难度。',
      '2. 避免摆动身体或利用惯性，专注于肌肉孤立训练以提高效果。',
      '3. 训练前进行热身，如肩部旋转和手臂伸展，预防肩部受伤。'
    ],
    recommendedFor: ['muscle-gain', 'body-shaping'],
  },
  {
    id: 'dip-station',
    name: '双杠臂屈伸架',
    nameEn: 'Dip Station',
    category: 'strength',
    targetMuscles: ['胸部', '三头肌', '肩膀', '核心'],
    difficulty: 'intermediate',
    imageUrl: '/images/equipment/dip_station_clean.svg',
    sets: 4,
    reps: 12,
    duration: '每组休息60-90秒',
    usage: [
      '1. 调整双杠宽度至与肩同宽或略宽。',
      '2. 双手握住双杠，手臂伸直支撑身体，核心收紧。',
      '3. 缓慢弯曲肘部，降低身体直到上臂与地面平行。',
      '4. 感受胸部和三头肌的拉伸，然后用力推起回到起始位置。'
    ],
    tips: [
      '1. 保持身体略微前倾以侧重胸肌，或直立以侧重三头肌。',
      '2. 避免过度降低身体，以防肩关节受伤。'
    ],
    recommendedFor: ['muscle-gain', 'body-shaping'],
  },
  {
    id: 'leg-press',
    name: '腿举机',
    nameEn: 'Leg Press',
    category: 'strength',
    targetMuscles: ['腿部', '臀部'],
    difficulty: 'beginner',
    imageUrl: '/images/equipment/leg_press_clean.svg',
    sets: 3,
    reps: 10,
    duration: '每组休息60秒',
    usage: [
      '1. 坐在机器上，双脚平放于踏板，与肩同宽。',
      '2. 解锁安全锁，缓慢弯曲膝盖，让踏板降向身体。',
      '3. 用腿部力量将踏板推回起始位置，膝盖不要锁死。'
    ],
    tips: [
      '1. 背部紧贴靠背，避免腰部悬空。',
      '2. 保持膝盖与脚尖方向一致。'
    ],
    recommendedFor: ['muscle-gain', 'body-shaping'],
  },
  {
    id: 'cable-machine',
    name: '龙门架',
    nameEn: 'Cable Machine',
    category: 'strength',
    targetMuscles: ['背部', '胸部', '手臂', '核心'],
    difficulty: 'beginner',
    imageUrl: '/images/equipment/cable_machine_clean.svg',
    sets: 3,
    reps: 10,
    duration: '每组休息60-90秒',
    usage: [
      '1. 调整滑轮至适当高度，选择合适的手柄。',
      '2. 核心收紧，背部挺直，平稳拉动滑轮至目标位置。',
      '3. 有控制地返回起始位置，感受肌肉全程受力。'
    ],
    tips: [
      '1. 保持动作缓慢且受控，避免借力。',
      '2. 不同的滑轮高度和附件可以锻炼不同肌群。'
    ],
    recommendedFor: ['muscle-gain', 'body-shaping'],
  },
  {
    id: 'chest-fly',
    name: '蝴蝶机',
    nameEn: 'Chest Fly Machine',
    category: 'strength',
    targetMuscles: ['胸部', '肩部'],
    difficulty: 'beginner',
    imageUrl: '/images/equipment/chest_fly_clean.svg',
    sets: 3,
    reps: 10,
    duration: '每组休息60秒',
    usage: [
      '1. 调整座椅高度使手柄与胸部齐平，背部紧贴靠垫。',
      '2. 双手握住手柄，肘部微屈，缓慢向胸前合拢。',
      '3. 在顶峰收缩胸肌，然后缓慢回到起始位置。'
    ],
    tips: [
      '1. 全程保持核心收紧，不要用背部力量代偿。',
      '2. 避免手臂完全伸直，保护肘关节。'
    ],
    recommendedFor: ['muscle-gain', 'body-shaping'],
  },
  {
    id: 'lat-pull-down',
    name: '高位下拉机',
    nameEn: 'Lat Pulldown Machine',
    category: 'strength',
    targetMuscles: ['背部', '二头肌', '肩部'],
    difficulty: 'beginner',
    imageUrl: '/images/equipment/lat_pull_down_clean.svg',
    sets: 3,
    reps: 10,
    duration: '每组休息60-90秒',
    usage: [
      '1. 调整大腿固定垫，双手正握横杆，略宽于肩。',
      '2. 肩胛骨下沉，将横杆下拉至上胸部位置。',
      '3. 缓慢控制重量还原，感受背部肌肉拉伸。'
    ],
    tips: [
      '1. 专注于背部肌肉收缩，而非单纯用手臂发力。',
      '2. 下拉时避免身体过度向后摆动。'
    ],
    recommendedFor: ['muscle-gain', 'body-shaping'],
  },
  {
    id: 'smith-machine',
    name: '史密斯机',
    nameEn: 'Smith Machine',
    category: 'strength',
    targetMuscles: ['全身', '多部位'],
    difficulty: 'intermediate',
    imageUrl: '/images/equipment/smith_machine_clean.svg',
    sets: 3,
    reps: 8,
    duration: '30-45 minutes',
    usage: [
      '1. 锁定杠铃至合适高度，站立于杠铃下方。',
      '2. 解锁安全扣，执行深蹲、卧推等垂直轨迹动作。',
      '3. 动作结束通过旋转杠铃将其钩回安全锁。'
    ],
    tips: [
      '1. 利用固定轨道练习标准动力，非常适合进阶挑战。',
      '2. 始终确认安全销位置。'
    ],
    recommendedFor: ['muscle-gain', 'body-shaping'],
  },
  {
    id: 'kettlebell',
    name: '壶铃',
    nameEn: 'Kettlebell',
    category: 'strength',
    targetMuscles: ['全身', '臀部', '腿部', '核心'],
    difficulty: 'intermediate',
    imageUrl: '/images/equipment/kettlebell_clean.svg',
    sets: 3,
    reps: 12,
    duration: '20-30 minutes',
    usage: [
      '1. 双脚站宽，髋部驱动，将壶铃进行大幅度摆动（Swing）。',
      '2. 也可以利用壶铃进行深蹲、推举等自由重量训练。'
    ],
    tips: [
      '1. 核心全程收紧，利用髋部爆发力而非手臂。',
      '2. 初学者建议由教练指导摆动姿势。'
    ],
    recommendedFor: ['weight-loss', 'muscle-gain'],
  },
  {
    id: 'seated-row-machine',
    name: '坐姿划船机',
    nameEn: 'Seated Row Machine',
    category: 'strength',
    targetMuscles: ['背部', '手臂', '肩膀'],
    difficulty: 'intermediate',
    imageUrl: '/images/equipment/seated_row_clean.svg',
    sets: 3,
    reps: 12,
    duration: '每组休息60秒',
    usage: [
      '1. 坐在机器上，双脚踩稳踏板，双手握住手柄。',
      '2. 保持背部挺直，核心收紧，将手柄拉向腹部。',
      '3. 在顶峰收缩背部肌肉，然后缓慢放回起始位置。'
    ],
    tips: [
      '1. 专注于背部肌肉发力，避免用手臂拉扯。',
      '2. 保持肩胛骨后收，不要耸肩。',
      '3. 控制动作速度，避免快速回弹。'
    ],
    recommendedFor: ['muscle-gain', 'body-shaping'],
  },
  {
    id: 'leg-curl-machine',
    name: '腿弯举机',
    nameEn: 'Leg Curl Machine',
    category: 'strength',
    targetMuscles: ['腿后侧', '臀部'],
    difficulty: 'intermediate',
    imageUrl: '/images/equipment/leg_curl_clean.svg',
    sets: 3,
    reps: 12,
    duration: '每组休息60秒',
    usage: [
      '1. 调整机器，俯卧或坐姿，将腿垫置于脚踝后方。',
      '2. 收缩腿后侧肌肉，将重量向上弯举。',
      '3. 在顶峰停顿，然后缓慢放回起始位置。'
    ],
    tips: [
      '1. 保持髋部稳定，避免借力。',
      '2. 动作全程控制，避免快速下放。',
      '3. 注意调整重量，避免过度负荷。'
    ],
    recommendedFor: ['muscle-gain', 'body-shaping'],
  },
  {
    id: 'shoulder-press-machine',
    name: '肩推举机',
    nameEn: 'Shoulder Press Machine',
    category: 'strength',
    targetMuscles: ['肩膀', '三头肌'],
    difficulty: 'intermediate',
    imageUrl: '/images/equipment/shoulder_press_clean.svg',
    sets: 3,
    reps: 10,
    duration: '每组休息60秒',
    usage: [
      '1. 调整座椅高度，使手柄位于肩膀高度。',
      '2. 双手握住手柄，向上推举直至手臂伸直。',
      '3. 缓慢放回起始位置，保持肌肉张力。'
    ],
    tips: [
      '1. 保持核心稳定，避免腰部过度参与。',
      '2. 不要锁定肘关节，保持持续张力。',
      '3. 控制动作速度，专注于肩膀肌肉收缩。'
    ],
    recommendedFor: ['muscle-gain', 'body-shaping'],
  },
  {
    id: 'ab-wheel',
    name: '腹肌轮',
    nameEn: 'Ab Wheel Roller',
    category: 'strength',
    targetMuscles: ['核心', '腹部'],
    difficulty: 'advanced',
    imageUrl: '/images/equipment/ab_wheel_clean.svg',
    sets: 3,
    reps: 10,
    duration: '每组控制在30秒内',
    usage: [
      '1. 跪姿手握轮柄，缓慢向前推行至身体接近地面。',
      '2. 依靠腹肌力量回收至起始位置。'
    ],
    tips: [
      '1. 不要塌腰，核心张力不足时建议缩小运动半径。',
    ],
    recommendedFor: ['body-shaping'],
  },
  {
    id: 'chest-press-machine',
    name: '坐式推胸机',
    nameEn: 'Chest Press Machine',
    category: 'strength',
    targetMuscles: ['胸部', '三头肌', '肩膀'],
    difficulty: 'beginner',
    imageUrl: '/images/equipment/chest_press_clean.svg',
    sets: 3,
    reps: 12,
    duration: '每组休息60秒',
    usage: [
      '1. 调整座椅使把手处于胸部高度。',
      '2. 背部靠紧，向前推至手臂伸直。',
      '3. 缓慢放回，保持肌肉张力。'
    ],
    tips: [
      '1. 保持肩胛骨后收，专注于胸部发力。',
    ],
    recommendedFor: ['muscle-gain', 'body-shaping'],
  },
  // 新增机械器材
  {
    id: 'hack-squat-machine',
    name: '哈克深蹲机',
    nameEn: 'Hack Squat Machine',
    category: 'strength',
    targetMuscles: ['腿部', '臀部', '核心'],
    difficulty: 'intermediate',
    imageUrl: '/images/equipment/hack_squat_clean.svg',
    sets: 4,
    reps: 10,
    duration: '每组休息60秒',
    usage: [
      '1. 调整座椅和肩垫位置，确保背部紧贴靠垫。',
      '2. 双脚平放于踏板，与肩同宽，脚尖略微外展。',
      '3. 解锁安全锁，缓慢下蹲至大腿与地面平行。',
      '4. 用腿部力量推起踏板，回到起始位置。'
    ],
    tips: [
      '1. 保持背部紧贴靠垫，避免腰部受力。',
      '2. 下蹲时膝盖与脚尖方向一致。',
      '3. 控制动作速度，避免快速反弹。'
    ],
    recommendedFor: ['muscle-gain', 'body-shaping'],
  },
  {
    id: 'hip-thrust-machine',
    name: '臀桥机',
    nameEn: 'Hip Thrust Machine',
    category: 'strength',
    targetMuscles: ['臀部', '腿后侧', '核心'],
    difficulty: 'intermediate',
    imageUrl: '/images/equipment/hip_thrust_clean.svg',
    sets: 4,
    reps: 12,
    duration: '每组休息60秒',
    usage: [
      '1. 调整座椅和背垫，确保肩部靠紧。',
      '2. 双脚踩稳踏板，臀部悬空。',
      '3. 收缩臀部，向上推起重量至身体成直线。',
      '4. 在顶峰停顿收缩臀部，然后缓慢放下。'
    ],
    tips: [
      '1. 专注于臀部发力，避免腰部代偿。',
      '2. 保持核心收紧，保护脊柱。',
      '3. 动作全程控制，避免快速下放。'
    ],
    recommendedFor: ['muscle-gain', 'body-shaping'],
  },
  {
    id: 'calf-raise-machine',
    name: '提踵机',
    nameEn: 'Calf Raise Machine',
    category: 'strength',
    targetMuscles: ['小腿'],
    difficulty: 'beginner',
    imageUrl: '/images/equipment/calf_raise_clean.svg',
    sets: 4,
    reps: 15,
    duration: '每组休息45秒',
    usage: [
      '1. 调整座椅高度和肩垫位置。',
      '2. 双脚前半部分踩在踏板上，脚跟悬空。',
      '3. 收缩小腿肌肉，将脚跟向上抬起。',
      '4. 在顶峰停顿，然后缓慢放下脚跟。'
    ],
    tips: [
      '1. 动作全程控制，避免快速弹跳。',
      '2. 保持膝盖稳定，不要弯曲。',
      '3. 可调整脚尖方向来刺激小腿不同部位。'
    ],
    recommendedFor: ['muscle-gain', 'body-shaping'],
  },
  {
    id: 'ghd-machine',
    name: 'GHD机',
    nameEn: 'Glute Ham Developer',
    category: 'strength',
    targetMuscles: ['臀部', '腿后侧', '核心', '背部'],
    difficulty: 'advanced',
    imageUrl: '/images/equipment/ghd_clean.svg',
    sets: 3,
    reps: 8,
    duration: '每组休息60秒',
    usage: [
      '1. 调整脚踏板和腿垫位置，俯卧在机器上。',
      '2. 双脚固定在踏板，大腿靠在腿垫上。',
      '3. 从臀部开始，向上抬起身体直至水平。',
      '4. 可继续弯曲膝盖完成腿弯举动作。'
    ],
    tips: [
      '1. 保持核心收紧，保护脊柱。',
      '2. 动作缓慢控制，避免快速反弹。',
      '3. 初学者建议有教练指导。'
    ],
    recommendedFor: ['muscle-gain', 'body-shaping'],
  },
  {
    id: 't-bar-row',
    name: 'T型杠划船',
    nameEn: 'T-Bar Row',
    category: 'strength',
    targetMuscles: ['背部', '二头肌', '核心'],
    difficulty: 'intermediate',
    imageUrl: '/images/equipment/t_bar_row_clean.svg',
    sets: 4,
    reps: 10,
    duration: '每组休息60秒',
    usage: [
      '1. 站在T型杠上方，双脚与肩同宽。',
      '2. 双手握住杠铃手柄，保持背部挺直。',
      '3. 收缩背部肌肉，将杠铃拉向胸部。',
      '4. 在顶峰停顿，然后缓慢放下。'
    ],
    tips: [
      '1. 保持背部挺直，避免弓背。',
      '2. 专注于背部肌肉发力。',
      '3. 控制动作速度，避免借力。'
    ],
    recommendedFor: ['muscle-gain', 'body-shaping'],
  },
];