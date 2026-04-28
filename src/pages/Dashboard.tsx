import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../hooks/useAuth';
import { Activity, Flame, Timer, TrendingUp, Calendar, ArrowRight, CheckCircle2, Dumbbell, Star } from 'lucide-react';
import { recommendEquipmentEnhanced } from '../utils/recommendations';
import GoalSwitcher from '../components/profile/GoalSwitcher';
import BodyMetricsModal from '../components/modals/BodyMetricsModal';
import { Scale } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { state } = useApp();
  const { user, bodyData, weeklyPlan, trainingLogs } = state;

  // 今日打卡状态判断
  const today = new Date().toISOString().split('T')[0];

  // 智能器材推荐：基于身体数据和训练历史
  const equipmentRecommendations = useMemo(() => {
    if (!bodyData) return [];
    return recommendEquipmentEnhanced(bodyData, trainingLogs);
  }, [bodyData, trainingLogs]);
  const todayLog = trainingLogs.find(log => log.date === today && log.completed);
  const hasCheckedInToday = !!todayLog;

  const [isMetricsModalOpen, setIsMetricsModalOpen] = React.useState(false);

  // 计算今日是否已记录体重
  const todayWeightRecord = state.weightHistory.find(record => record.date.startsWith(today));
  const currentWeight = state.bodyData?.weight || 0;

  return (
    <div className="flex flex-col gap-8 pb-10">
      {/* Header */}
      <section className="flex justify-between items-end">
        <div className="space-y-1">
          <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest">早上好,</p>
          <h1 data-testid="dashboard-username" className="text-3xl font-display font-bold text-slate-900">{user?.name || user?.username}</h1>
          <div className="mt-2">
            <GoalSwitcher compact />
          </div>
        </div>
        <Link
          data-testid="calendar-icon"
          to="/checkin"
          className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary hover:bg-brand-primary/20 transition-colors cursor-pointer"
        >
          <Calendar size={20} />
        </Link>
      </section>

      {/* Main Stats Grid */}
      <section className="grid grid-cols-2 gap-4">
        <StatCard 
          icon={<Flame className="text-orange-500" />} 
          label="消耗热量" 
          value="450" 
          unit="kcal" 
          color="bg-orange-50"
          delay={0.1}
        />
        <StatCard 
          icon={<Timer className="text-brand-primary" />} 
          label="训练时长" 
          value="45" 
          unit="min" 
          color="bg-sky-50"
          delay={0.2}
        />
      </section>

      {/* Body Weight Entry Card */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        onClick={() => setIsMetricsModalOpen(true)}
        className="glass-panel rounded-[2.5rem] p-6 bg-white border border-slate-100 flex items-center justify-between cursor-pointer hover:shadow-xl transition-all active:scale-[0.98]"
      >
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-500 shadow-inner">
            <Scale size={24} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-0.5">身体数据</h3>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-slate-900">{currentWeight.toFixed(1)}</span>
              <span className="text-xs font-bold text-slate-400 uppercase">KG</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-1">
          {todayWeightRecord ? (
            <span className="px-3 py-1.5 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-xl uppercase tracking-tighter flex items-center gap-1.5">
              <CheckCircle2 size={12} />
              今日已记录
            </span>
          ) : (
            <span className="px-3 py-1.5 bg-brand-primary text-white text-[10px] font-black rounded-xl uppercase tracking-tighter shadow-lg shadow-brand-primary/20">
              立即记入
            </span>
          )}
          <span className="text-[9px] font-bold text-slate-300 uppercase">
            保持数据更新以优化计划
          </span>
        </div>
      </motion.section>

      <BodyMetricsModal 
        isOpen={isMetricsModalOpen} 
        onClose={() => setIsMetricsModalOpen(false)} 
      />

      <section className="grid grid-cols-2 gap-4">
        <StatCard 
          icon={<Activity className="text-emerald-500" />} 
          label="心率波动" 
          value="120" 
          unit="bpm" 
          color="bg-emerald-50"
          delay={0.3}
        />
        <StatCard 
          icon={<TrendingUp className="text-rose-500" />} 
          label="今日步数" 
          value="8.4" 
          unit="k" 
          color="bg-rose-50"
          delay={0.4}
        />
      </section>

      {/* Recommended Plan Preview */}
      <section className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
           <h2 className="text-lg font-bold text-slate-900">今日训练</h2>
           <div className="flex items-center gap-2">
             {hasCheckedInToday ? (
               <div className="flex items-center gap-1 text-green-600">
                 <CheckCircle2 size={14} />
                 <span className="text-xs font-medium">已打卡</span>
               </div>
             ) : (
               <Link to="/checkin" className="text-xs font-bold text-orange-500 flex items-center gap-1 hover:text-orange-600 transition-colors">
                 打卡 <ArrowRight size={14} />
               </Link>
             )}
           </div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-panel rounded-[2.5rem] p-6 flex flex-col gap-4 relative overflow-hidden"
        >
          <div className="relative z-10 space-y-2">
            <h3 className="text-xl font-bold text-slate-900">
              {weeklyPlan?.days[0]?.focus || '核心力量训练'}
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              针对腰腹核心力量的强化训练，包含平板支撑、俄罗斯转体等高效动作。
            </p>
          </div>
          <div className="flex gap-4 z-10">
            <div className="px-4 py-2 rounded-full bg-slate-100 text-[10px] font-bold text-slate-600 uppercase">30 分钟</div>
            <div className="px-4 py-2 rounded-full bg-slate-100 text-[10px] font-bold text-slate-600 uppercase">中等强度</div>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/10 rounded-full -mr-10 -mt-10 blur-2xl" />
        </motion.div>
      </section>

      {/* Smart Equipment Recommendations */}
      {equipmentRecommendations.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Dumbbell size={18} className="text-brand-primary" />
              <h2 className="text-sm font-black uppercase tracking-widest text-slate-900">推荐器材</h2>
            </div>
            <Link to="/equipment" className="text-xs font-bold text-brand-primary flex items-center gap-1 hover:underline">
              查看全部 <ArrowRight size={12} />
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
            {equipmentRecommendations.map((rec) => (
              <Link
                key={rec.equipment.id}
                to="/equipment"
                className="flex-shrink-0 w-32 bg-white rounded-[1.5rem] p-4 flex flex-col items-center gap-3 shadow-sm border border-slate-100 hover:shadow-md transition-all"
              >
                <div className="w-16 h-16 bg-white flex items-center justify-center">
                  <img
                    src={rec.equipment.imageUrl}
                    alt={rec.equipment.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold text-slate-900">{rec.equipment.name}</p>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <Star size={10} className="text-amber-400 fill-amber-400" />
                    <span className="text-[9px] font-bold text-slate-400">{rec.score}</span>
                  </div>
                  {rec.reasons.length > 0 && (
                    <p className="text-[8px] text-slate-400 mt-0.5 truncate max-w-full">{rec.reasons[0]}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Body Data Summary */}
      <section className="glass-panel rounded-[2.5rem] p-6 flex items-center justify-between">
         <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">当前 BMI</p>
            <p className="text-2xl font-display font-bold text-slate-900">
              {bodyData ? (bodyData.weight / Math.pow(bodyData.height / 100, 2)).toFixed(1) : '22.5'}
            </p>
         </div>
         <div className="h-10 w-px bg-slate-100" />
         <div className="space-y-1 text-right">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">体重</p>
            <p className="text-2xl font-display font-bold text-slate-900">
              {bodyData?.weight || '--'} <span className="text-sm font-body">kg</span>
            </p>
         </div>
      </section>
    </div>
  );
};

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit: string;
  color: string;
  delay: number;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, unit, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay }}
    className={`${color} rounded-[2rem] p-5 flex flex-col gap-3 shadow-subtle`}
  >
    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
      {icon}
    </div>
    <div className="space-y-1">
      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{label}</p>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-display font-bold text-slate-900">{value}</span>
        <span className="text-[10px] font-bold text-slate-400">{unit}</span>
      </div>
    </div>
  </motion.div>
);

export default Dashboard;
