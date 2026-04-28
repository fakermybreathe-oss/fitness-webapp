import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../hooks/useAuth';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Flame, 
  ChevronRight, 
  RefreshCw, 
  Target,
  Info
} from 'lucide-react';
import { GOAL_LABELS, GOAL_ICONS } from '../constants';
import { generateWeeklyPlan } from '../data/workoutPlans';

const Plan: React.FC = () => {
  const { state, saveWeeklyPlan } = useApp();
  const { weeklyPlan, bodyData, user } = state;

  const handleRefreshPlan = () => {
    if (bodyData) {
      const newPlan = generateWeeklyPlan(bodyData);
      newPlan.userId = user?.id || '';
      saveWeeklyPlan(newPlan);
    }
  };

  if (!weeklyPlan) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <Target size={32} className="text-slate-300" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">尚未生成计划</h2>
        <p className="text-slate-500 mb-6">完善您的身体数据以获取个性化训练方案</p>
      </div>
    );
  }

  const currentGoal = weeklyPlan.goal || 'body-shaping';

  return (
    <div className="flex flex-col gap-6 pb-24">
      {/* Header with Refresh */}
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-brand-primary/10 text-brand-primary text-[10px] font-black rounded-md uppercase tracking-wider">
              {GOAL_ICONS[currentGoal]} {GOAL_LABELS[currentGoal]}
            </span>
          </div>
          <h1 className="text-3xl font-display font-bold text-slate-900">每周计划</h1>
          <p className="text-slate-500 font-medium text-sm">动态生成的个性化方案</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.9, rotate: 180 }}
          onClick={handleRefreshPlan}
          className="w-12 h-12 bg-white glass-panel rounded-2xl flex items-center justify-center text-slate-900 shadow-sm border border-slate-100"
        >
          <RefreshCw size={20} />
        </motion.button>
      </div>

      {/* Plan Strategy Note */}
      <div className="bg-sky-50 border border-sky-100 rounded-3xl p-4 flex gap-3 items-start">
        <Info size={18} className="text-sky-500 mt-0.5 flex-shrink-0" />
        <div>
          <h4 className="text-sm font-bold text-sky-900">训练策略</h4>
          <p className="text-xs text-sky-700 leading-relaxed mt-1">
            您的目标是<span className="font-bold underline">{GOAL_LABELS[currentGoal]}</span>。
            系统已根据该目标自动调整了组数、次数和休息间隔，建议严格遵守建议参数以达到最佳效果。
          </p>
        </div>
      </div>

      {/* Days List */}
      <div className="flex flex-col gap-4">
        {weeklyPlan.days.map((day, index) => {
          const isRestDay = day.exercises.length === 0;
          
          return (
            <motion.div
              key={day.id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`glass-panel rounded-[2rem] p-5 transition-all bg-white relative overflow-hidden ${
                index === 0 ? 'ring-2 ring-brand-primary/20 shadow-xl' : 'opacity-90'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                  isRestDay 
                    ? 'bg-slate-50 text-slate-300' 
                    : index === 0 ? 'bg-brand-primary text-white shadow-lg' : 'bg-slate-100 text-slate-400'
                }`}>
                  {isRestDay ? <Circle size={20} /> : <CheckCircle2 size={20} />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {day.dayName}
                    </span>
                    {index === 0 && (
                      <span className="px-2 py-0.5 bg-brand-primary text-white text-[8px] font-black rounded-full uppercase tracking-tighter">
                        今日训练
                      </span>
                    )}
                  </div>
                  <h3 className={`text-lg font-bold truncate ${isRestDay ? 'text-slate-300' : 'text-slate-900'}`}>
                    {day.focus}
                  </h3>
                  
                  {!isRestDay && (
                    <div className="mt-3 space-y-2">
                      <div className="flex gap-3">
                         <div className="flex items-center gap-1">
                           <Clock size={12} className="text-slate-300" />
                           <span className="text-[10px] font-bold text-slate-400 uppercase">
                             {day.exercises.length * 8} MIN
                           </span>
                         </div>
                         <div className="flex items-center gap-1">
                           <Flame size={12} className="text-slate-300" />
                           <span className="text-[10px] font-bold text-slate-400 uppercase">
                             {day.exercises.length * 45} KCAL
                           </span>
                         </div>
                      </div>
                      
                      {/* Exercise Preview Tags */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {day.exercises.slice(0, 3).map((ex, i) => (
                          <span key={i} className="px-2 py-1 bg-slate-50 text-slate-500 text-[9px] font-bold rounded-lg border border-slate-100">
                            {ex.name}
                          </span>
                        ))}
                        {day.exercises.length > 3 && (
                          <span className="text-[9px] text-slate-300 font-bold self-center ml-1">
                            +{day.exercises.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {!isRestDay && (
                  <div className="self-center">
                    <ChevronRight className="text-slate-200" size={24} />
                  </div>
                )}
              </div>

              {/* Background accent for current day */}
              {index === 0 && !isRestDay && (
                <div className="absolute top-0 right-0 w-24 h-24 bg-brand-primary/5 rounded-full -mr-12 -mt-12 blur-2xl" />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Motivational Card */}
      <section className="bg-slate-950 rounded-[2.5rem] p-8 mt-4 text-white relative overflow-hidden shadow-2xl">
         <div className="relative z-10 space-y-4">
            <h2 className="text-2xl font-display font-bold leading-tight">坚持就是<br />胜利的关键</h2>
            <p className="text-slate-400 text-sm font-medium max-w-[200px]">
              计划只是开始，行动才是改变的唯一途径。
            </p>
         </div>
         <div className="absolute top-0 right-0 w-48 h-48 bg-brand-primary/20 rounded-full -mr-12 -mt-12 blur-3xl" />
         <Target className="absolute bottom-8 right-8 text-white/10" size={120} />
      </section>
    </div>
  );
};

export default Plan;
