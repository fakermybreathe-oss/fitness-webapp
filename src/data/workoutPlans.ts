import type { WeeklyPlan, DailyWorkout, WorkoutExercise, BodyData, FitnessGoal, PlanFeedback } from '../types';

/** 训练频率常量（按经验等级） */
export const TRAINING_FREQUENCY = {
  beginner: 3,
  intermediate: 4,
  advanced: 5,
};

/**
 * 核心动作池：按目标和肌群分类
 */
export const EXERCISE_POOL: Record<FitnessGoal, Record<string, string[]>> = {
  'weight-loss': {
    'warmup': ['开合跳', '原地小跑', '动态拉伸', '波比跳'],
    'chest': ['俯卧撑', '哑铃推胸', '绳索夹胸'],
    'back': ['辅助引体向上', '坐姿划船', '高位下拉'],
    'legs': ['徒手深蹲', '箭步蹲', '仰卧蹬腿'],
    'core': ['平板支撑', '卷腹', '俄罗斯转体', '死虫式'],
    'cardio': ['开合跳', '登山者', '高抬腿', '跳绳'],
  },
  'muscle-gain': {
    'warmup': ['动态拉伸', '轻重量器械热身', '肩袖旋转'],
    'chest': ['杠铃卧推', '上斜哑铃推胸', '双杠臂屈伸'],
    'back': ['引体向上', '杠铃划船', '硬拉', 'T杠划船'],
    'legs': ['杠铃深蹲', '保加利亚蹲', '腿举', '直腿硬拉'],
    'shoulders': ['杠铃推举', '哑铃侧平举', '面拉'],
    'arms': ['杠铃弯举', '仰卧臂屈伸', '锤式弯举'],
    'core': ['悬垂举腿', '负重卷腹'],
  },
  'body-shaping': {
    'warmup': ['泡沫轴滚动', '动态拉伸', '波比跳'],
    'chest': ['哑铃飞鸟', '上斜推胸', '俯卧撑'],
    'back': ['单臂哑铃划船', '高位下拉', '山羊挺身'],
    'legs': ['深蹲跳', '相扑深蹲', '臀桥'],
    'shoulders': ['哑铃前平举', '阿诺德推举'],
    'arms': ['绳索下压', '哑铃弯举'],
    'core': ['侧撑', 'V字卷腹', '平板支撑'],
  }
};

/**
 * 根据健身目标获取对应的训练参数
 */
const getGoalParameters = (goal: FitnessGoal) => {
  switch (goal) {
    case 'weight-loss':
      return { sets: 3, reps: '15-20', rest: 45 };
    case 'muscle-gain':
      return { sets: 4, reps: '8-12', rest: 90 };
    case 'body-shaping':
      return { sets: 3, reps: '12-15', rest: 60 };
    default:
      return { sets: 3, reps: '12', rest: 60 };
  }
};

/**
 * 训练拆分方案（根据训练频率决定每天练什么）
 */
const GET_SPLIT_PLAN = (frequency: number) => {
  if (frequency <= 3) {
    return Array(frequency).fill(['chest', 'back', 'legs', 'core']);
  } else if (frequency === 4) {
    return [['chest', 'back'], ['legs', 'core'], ['chest', 'shoulders'], ['legs', 'core']];
  } else {
    return [['chest', 'shoulders'], ['back', 'core'], ['legs'], ['arms', 'core'], ['cardio', 'core']];
  }
};

/**
 * 从数组中随机获取 N 个不重复元素
 */
function getRandomElements<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
}

/**
 * 根据反馈历史调整计划强度
 */
export const adjustPlanIntensity = (baseParams: any, feedbacks: PlanFeedback[]) => {
  if (!feedbacks || feedbacks.length < 3) return baseParams;
  
  const recentFeedbacks = feedbacks.slice(-3);
  // 计算平均主观疲劳感 (RPE)
  const effortSum = recentFeedbacks.reduce((acc, f) => {
    const ratingMap: Record<string, number> = { 'too_easy': 3, 'appropriate': 6, 'too_hard': 9 };
    return acc + (ratingMap[f.difficultyRating] || 6);
  }, 0) / 3;
  
  const newParams = { ...baseParams };
  
  if (effortSum > 8) {
    newParams.sets = Math.max(2, newParams.sets - 1);
    newParams.rest += 15;
  } else if (effortSum < 4) {
    newParams.sets += 1;
  }
  
  return newParams;
};

/**
 * 生成动态周计划
 */
export const generateWeeklyPlan = (bodyData: BodyData, feedbacks: PlanFeedback[] = []): WeeklyPlan => {
  const { goal, frequency = 3 } = bodyData;
  let params = getGoalParameters(goal);
  
  // 动态微调参数
  params = adjustPlanIntensity(params, feedbacks);
  
  const splitSchema = GET_SPLIT_PLAN(frequency);
  const days: DailyWorkout[] = [];
  const dayNames = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
  
  let workoutDayCounter = 0;

  for (let i = 0; i < 7; i++) {
    const isWorkoutDay = workoutDayCounter < frequency && (
      (frequency <= 3 && [0, 2, 4].includes(i)) ||
      (frequency === 4 && [0, 2, 4, 6].includes(i)) ||
      (frequency >= 5)
    );

    if (isWorkoutDay) {
      const muscleGroups = splitSchema[workoutDayCounter] || ['chest', 'back', 'legs'];
      const exercises: WorkoutExercise[] = [];
      
      // 1. 热身
      const warmupEx = getRandomElements(EXERCISE_POOL[goal]['warmup'] || ['动态拉伸'], 1)[0];
      exercises.push({
        id: `ex-warmup-${i}`,
        name: warmupEx,
        sets: 2,
        reps: '5-10分钟',
        rest: 30,
        muscle: '全身',
        instructions: '轻度活动关节，提高体温'
      });

      // 2. 主项
      muscleGroups.forEach((mg: string, mgIdx: number) => {
        const pool = EXERCISE_POOL[goal as FitnessGoal]?.[mg] || EXERCISE_POOL['body-shaping'][mg] || ['基础动作'];
        const selected = getRandomElements(pool, 2);
        
        selected.forEach((exName: string, exIdx: number) => {
          exercises.push({
            id: `ex-${i}-${mgIdx}-${exIdx}`,
            name: exName,
            sets: params.sets,
            reps: params.reps,
            rest: params.rest,
            muscle: mg,
            instructions: '控制动作节奏，感受肌肉发力'
          });
        });
      });

      // 3. 减脂加码
      if (goal === 'weight-loss') {
        const cardioEx = getRandomElements(EXERCISE_POOL[goal as FitnessGoal]?.['cardio'] || ['跳绳'], 1)[0];
        exercises.push({
          id: `ex-cardio-${i}`,
          name: cardioEx,
          sets: 1,
          reps: '15-20分钟',
          rest: 0,
          muscle: '全身',
          instructions: '保持心率在燃脂区间'
        });
      }

      days.push({
        id: `day-${i}`,
        day: i,
        dayName: dayNames[i],
        focus: muscleGroups.map((mg: string) => {
          const map: Record<string, string> = { chest: '胸部', back: '背部', legs: '腿部', core: '核心', shoulders: '肩部', arms: '手臂', cardio: '有氧' };
          return map[mg] || mg;
        }).join(' & '),
        exercises,
      });
      
      workoutDayCounter++;
    } else {
      days.push({
        day: i,
        dayName: dayNames[i],
        focus: '休息日',
        exercises: [],
      });
    }
  }

  return {
    id: Date.now().toString(),
    userId: '',
    goal,
    frequency,
    days,
    createdAt: new Date().toISOString(),
  };
};
