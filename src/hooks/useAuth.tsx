import { createContext, useContext, useReducer, useEffect } from 'react';
import type { AppState, AppAction, User, BodyData, FitnessGoal, WeeklyPlan, Equipment, WeightRecord, TrainingLog, ReminderSettings, Badge } from '../types';
import logger from '../utils/logger';
import { STORAGE_KEYS } from '../constants';
import { recommendEquipment } from '../utils/recommendations';
import { generateWeeklyPlan } from '../data/workoutPlans';

const initialState: AppState = {
  user: null,
  bodyData: null,
  weeklyPlan: null,
  recommendedEquipment: [],
  weightHistory: [],
  trainingLogs: [],
  reminders: [],
  badges: [],
};

const loadState = (): AppState => {
  try {
    const user = localStorage.getItem(STORAGE_KEYS.user);
    const bodyData = localStorage.getItem(STORAGE_KEYS.bodyData);
    const weeklyPlan = localStorage.getItem(STORAGE_KEYS.weeklyPlan);
    const recommendedEquipment = localStorage.getItem(STORAGE_KEYS.recommendedEquipment);
    const weightHistory = localStorage.getItem(STORAGE_KEYS.weightHistory);
    const trainingLogs = localStorage.getItem(STORAGE_KEYS.trainingLogs);
    const reminders = localStorage.getItem(STORAGE_KEYS.reminders);
    const badges = localStorage.getItem(STORAGE_KEYS.badges);

    return {
      user: user ? JSON.parse(user) : null,
      bodyData: bodyData ? JSON.parse(bodyData) : null,
      weeklyPlan: weeklyPlan ? JSON.parse(weeklyPlan) : null,
      recommendedEquipment: recommendedEquipment ? JSON.parse(recommendedEquipment) : [],
      weightHistory: weightHistory ? JSON.parse(weightHistory) : [],
      trainingLogs: trainingLogs ? JSON.parse(trainingLogs) : [],
      reminders: reminders ? JSON.parse(reminders) : [],
      badges: badges ? JSON.parse(badges) : [],
    };
  } catch (error) {
    logger.error('Failed to load state from localStorage', error);
    return initialState;
  }
};

// STORAGE_KEYS 已迁移至 src/constants.ts

const saveState = (state: AppState) => {
  try {
    if (state.user) {
      localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(state.user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.user);
    }

    if (state.bodyData) {
      localStorage.setItem(STORAGE_KEYS.bodyData, JSON.stringify(state.bodyData));
    } else {
      localStorage.removeItem(STORAGE_KEYS.bodyData);
    }

    if (state.weeklyPlan) {
      localStorage.setItem(STORAGE_KEYS.weeklyPlan, JSON.stringify(state.weeklyPlan));
    } else {
      localStorage.removeItem(STORAGE_KEYS.weeklyPlan);
    }

    if (state.recommendedEquipment && state.recommendedEquipment.length > 0) {
      localStorage.setItem(STORAGE_KEYS.recommendedEquipment, JSON.stringify(state.recommendedEquipment));
    } else {
      localStorage.removeItem(STORAGE_KEYS.recommendedEquipment);
    }

    if (state.weightHistory && state.weightHistory.length > 0) {
      localStorage.setItem(STORAGE_KEYS.weightHistory, JSON.stringify(state.weightHistory));
    } else {
      localStorage.removeItem(STORAGE_KEYS.weightHistory);
    }

    if (state.trainingLogs && state.trainingLogs.length > 0) {
      localStorage.setItem(STORAGE_KEYS.trainingLogs, JSON.stringify(state.trainingLogs));
    } else {
      localStorage.removeItem(STORAGE_KEYS.trainingLogs);
    }

    if (state.reminders && state.reminders.length > 0) {
      localStorage.setItem(STORAGE_KEYS.reminders, JSON.stringify(state.reminders));
    } else {
      localStorage.removeItem(STORAGE_KEYS.reminders);
    }

    if (state.badges && state.badges.length > 0) {
      localStorage.setItem(STORAGE_KEYS.badges, JSON.stringify(state.badges));
    } else {
      localStorage.removeItem(STORAGE_KEYS.badges);
    }
  } catch (error) {
    logger.error('Failed to save state to localStorage', error);
  }
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_BODY_DATA':
      return { ...state, bodyData: action.payload };
    case 'SET_WEEKLY_PLAN':
      return { ...state, weeklyPlan: action.payload };
    case 'SET_RECOMMENDED_EQUIPMENT':
      return { ...state, recommendedEquipment: action.payload };
    case 'SET_WEIGHT_HISTORY':
      return { ...state, weightHistory: action.payload };
    case 'ADD_WEIGHT_RECORD':
      return { ...state, weightHistory: [...state.weightHistory, action.payload] };
    case 'SET_TRAINING_LOGS':
      return { ...state, trainingLogs: action.payload };
    case 'ADD_TRAINING_LOG':
      return { ...state, trainingLogs: [...state.trainingLogs, action.payload] };
    case 'SET_REMINDERS':
      return { ...state, reminders: action.payload };
    case 'SET_BADGES':
      return { ...state, badges: action.payload };
    case 'ADD_BADGE':
      return { ...state, badges: [...state.badges, action.payload] };
    case 'UPDATE_GOAL': {
      // 更新 bodyData 中的目标字段
      const updatedBodyData = state.bodyData
        ? { ...state.bodyData, goal: action.payload }
        : null;
      return { ...state, bodyData: updatedBodyData };
    }
    case 'LOGOUT':
      // Clear all user-specific localStorage keys
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      return initialState;
    default:
      return state;
  }
};

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  login: (user: User) => void;
  logout: () => void;
  saveBodyData: (data: BodyData) => void;
  saveWeeklyPlan: (plan: WeeklyPlan) => void;
  saveRecommendedEquipment: (equipment: Equipment[]) => void;
  addWeightRecord: (record: WeightRecord) => void;
  addTrainingLog: (log: TrainingLog) => void;
  saveReminders: (reminders: ReminderSettings[]) => void;
  addBadge: (badge: Badge) => void;
  updateGoal: (goal: FitnessGoal) => void;
  exportUserData: () => string;
  importUserData: (data: string) => void;
  completeInitialSetup: (data: BodyData) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState, loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const login = (user: User) => {
    dispatch({ type: 'SET_USER', payload: user });
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const saveBodyData = (data: BodyData) => {
    dispatch({ type: 'SET_BODY_DATA', payload: data });
  };

  const saveWeeklyPlan = (plan: WeeklyPlan) => {
    dispatch({ type: 'SET_WEEKLY_PLAN', payload: plan });
  };

  const saveRecommendedEquipment = (equipment: Equipment[]) => {
    dispatch({ type: 'SET_RECOMMENDED_EQUIPMENT', payload: equipment });
  };

  const addWeightRecord = (record: WeightRecord) => {
    dispatch({ type: 'ADD_WEIGHT_RECORD', payload: record });
    
    // 如果有身体数据，同步更新最新的体重值
    if (state.bodyData) {
      const updatedBodyData = { ...state.bodyData, weight: record.weight };
      dispatch({ type: 'SET_BODY_DATA', payload: updatedBodyData });
      
      // 体重变化后，重新计算推荐器材（可选：不强制重新生成计划，除非目标变了）
      const equipment = recommendEquipment(updatedBodyData);
      dispatch({ type: 'SET_RECOMMENDED_EQUIPMENT', payload: equipment });
    }
  };

  const addTrainingLog = (log: TrainingLog) => {
    dispatch({ type: 'ADD_TRAINING_LOG', payload: log });
  };

  const saveReminders = (reminders: ReminderSettings[]) => {
    dispatch({ type: 'SET_REMINDERS', payload: reminders });
  };

  const addBadge = (badge: Badge) => {
    dispatch({ type: 'ADD_BADGE', payload: badge });
  };

  const exportUserData = (): string => {
    const userData = {
      user: state.user,
      bodyData: state.bodyData,
      weeklyPlan: state.weeklyPlan,
      weightHistory: state.weightHistory,
      trainingLogs: state.trainingLogs,
      reminders: state.reminders,
      badges: state.badges,
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(userData, null, 2);
  };

  const importUserData = (data: string) => {
    try {
      const parsed = JSON.parse(data);
      if (parsed.user) dispatch({ type: 'SET_USER', payload: parsed.user });
      if (parsed.bodyData) dispatch({ type: 'SET_BODY_DATA', payload: parsed.bodyData });
      if (parsed.weeklyPlan) dispatch({ type: 'SET_WEEKLY_PLAN', payload: parsed.weeklyPlan });
      if (parsed.weightHistory) dispatch({ type: 'SET_WEIGHT_HISTORY', payload: parsed.weightHistory });
      if (parsed.trainingLogs) dispatch({ type: 'SET_TRAINING_LOGS', payload: parsed.trainingLogs });
      if (parsed.reminders) dispatch({ type: 'SET_REMINDERS', payload: parsed.reminders });
      if (parsed.badges) dispatch({ type: 'SET_BADGES', payload: parsed.badges });
    } catch (error) {
      logger.error('Failed to import user data', error);
    }
  };

  const updateGoal = (goal: FitnessGoal) => {
    // 1. 先更新目标
    const newBodyData = state.bodyData
      ? { ...state.bodyData, goal }
      : null;

    if (newBodyData) {
      dispatch({ type: 'SET_BODY_DATA', payload: newBodyData });
      dispatch({ type: 'UPDATE_GOAL', payload: goal });

      // 2. 立即基于新目标生成内容
      const equipment = recommendEquipment(newBodyData);
      dispatch({ type: 'SET_RECOMMENDED_EQUIPMENT', payload: equipment });

      const plan = generateWeeklyPlan(newBodyData);
      plan.userId = state.user?.id || '';
      dispatch({ type: 'SET_WEEKLY_PLAN', payload: plan });
      
      logger.info(`Goal updated to ${goal}, plan regenerated.`);
    }
  };

  const completeInitialSetup = (data: BodyData) => {
    // 一次性完成所有初始化工作
    dispatch({ type: 'SET_BODY_DATA', payload: data });
    
    const equipment = recommendEquipment(data);
    dispatch({ type: 'SET_RECOMMENDED_EQUIPMENT', payload: equipment });
    
    const plan = generateWeeklyPlan(data);
    plan.userId = state.user?.id || '';
    dispatch({ type: 'SET_WEEKLY_PLAN', payload: plan });
    
    // 手动触发一次保存确保万无一失
    localStorage.setItem(STORAGE_KEYS.bodyData, JSON.stringify(data));
    localStorage.setItem(STORAGE_KEYS.weeklyPlan, JSON.stringify(plan));
  };

  return (
    <AppContext.Provider
      value={{
        state,
        dispatch,
        login,
        logout,
        saveBodyData,
        saveWeeklyPlan,
        saveRecommendedEquipment,
        addWeightRecord,
        addTrainingLog,
        saveReminders,
        addBadge,
        updateGoal,
        completeInitialSetup,
        exportUserData,
        importUserData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
