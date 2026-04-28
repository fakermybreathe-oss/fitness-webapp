import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../hooks/useAuth';
import { TrendingDown, TrendingUp, Calendar, Trophy, Target, Scale, History } from 'lucide-react';

const Progress: React.FC = () => {
  const { state } = useApp();
  const { weightHistory, trainingLogs, bodyData } = state;

  const currentWeight = bodyData?.weight || 0;
  const initialWeight = weightHistory.length > 0 ? weightHistory[0].weight : currentWeight;
  const totalChange = currentWeight - initialWeight;

  // 简易折线图计算逻辑
  const renderWeightChart = () => {
    if (weightHistory.length < 2) {
      return (
        <div className="h-40 flex items-center justify-center border-2 border-dashed border-slate-100 rounded-[2rem] text-slate-400 font-bold text-xs uppercase tracking-widest">
          需要更多数据点来生成曲线
        </div>
      );
    }

    const padding = 20;
    const width = 300;
    const height = 120;
    const data = weightHistory.slice(-7); // 只显示最近7次
    const minWeight = Math.min(...data.map(d => d.weight)) - 1;
    const maxWeight = Math.max(...data.map(d => d.weight)) + 1;
    const range = maxWeight - minWeight;

    const points = data.map((d, i) => ({
      x: padding + (i * (width - padding * 2)) / (data.length - 1),
      y: height - padding - ((d.weight - minWeight) * (height - padding * 2)) / range
    }));

    const pathD = `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`;

    return (
      <div className="relative h-40 w-full mt-4 bg-slate-50 rounded-[2rem] p-4 border border-slate-100 overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
          <defs>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Fill Area */}
          <path
            d={`${pathD} L ${points[points.length - 1].x},${height} L ${points[0].x},${height} Z`}
            fill="url(#lineGradient)"
          />
          {/* Main Line */}
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            d={pathD}
            fill="none"
            stroke="#0EA5E9"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Data Points */}
          {points.map((p, i) => (
            <motion.circle
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1 + i * 0.1 }}
              cx={p.x}
              cy={p.y}
              r="4"
              fill="white"
              stroke="#0EA5E9"
              strokeWidth="2"
            />
          ))}
        </svg>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-8 pb-10">
      <div className="space-y-1">
        <h1 className="text-3xl font-display font-bold text-slate-900">进度统计</h1>
        <p className="text-slate-500 font-medium">见证您的每一步蜕变</p>
      </div>

      {/* Weight Progress Section */}
      <section className="glass-panel rounded-[2.5rem] p-6 bg-white border border-slate-100 shadow-sm">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500">
              <Scale size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">体重趋势</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">最近 7 次记录</p>
            </div>
          </div>
          
          <div className={`px-3 py-1 rounded-full flex items-center gap-1.5 ${
            totalChange <= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
          }`}>
            {totalChange <= 0 ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
            <span className="text-xs font-black">{Math.abs(totalChange).toFixed(1)} KG</span>
          </div>
        </div>

        {renderWeightChart()}
        
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
            <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">初始体重</span>
            <span className="text-xl font-black text-slate-900">{initialWeight} <span className="text-[10px] text-slate-400">KG</span></span>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
            <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">当前体重</span>
            <span className="text-xl font-black text-slate-900">{currentWeight} <span className="text-[10px] text-slate-400">KG</span></span>
          </div>
        </div>
      </section>

      {/* Activity Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div
          whileHover={{ y: -5 }}
          className="glass-panel rounded-[2rem] p-6 bg-white border border-slate-100 shadow-sm"
        >
          <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-500 mb-4">
            <Trophy size={20} />
          </div>
          <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">累计打卡</h4>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-slate-900">{trainingLogs.length}</span>
            <span className="text-xs font-bold text-slate-400 uppercase">天</span>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="glass-panel rounded-[2rem] p-6 bg-white border border-slate-100 shadow-sm"
        >
          <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500 mb-4">
            <Target size={20} />
          </div>
          <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">目标达成</h4>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-slate-900">85</span>
            <span className="text-xs font-bold text-slate-400 uppercase">%</span>
          </div>
        </motion.div>
      </div>

      {/* Recent History List */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 px-2">
          <History size={18} className="text-slate-400" />
          <h3 className="text-lg font-bold text-slate-900">历史记录</h3>
        </div>
        
        <div className="space-y-3">
          {trainingLogs.slice(0, 5).map((log, index) => (
            <div key={index} className="glass-panel rounded-3xl p-5 bg-white border border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400">
                  <Calendar size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{new Date(log.date).toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' })}</h4>
                  <p className="text-xs text-slate-400 font-medium">完成训练 · {log.duration} 分钟</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-black text-brand-primary">+{log.caloriesBurned}</span>
                <p className="text-[10px] font-bold text-slate-300 uppercase">KCAL</p>
              </div>
            </div>
          ))}
          
          {trainingLogs.length === 0 && (
            <div className="text-center py-10">
              <p className="text-slate-400 font-medium">暂无历史记录，开始您的第一次训练吧！</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Progress;