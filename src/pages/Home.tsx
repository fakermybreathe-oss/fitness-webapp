import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Trophy, Zap, Users, ClipboardList } from 'lucide-react';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-10 pb-12">
      {/* Hero Section */}
      <section className="flex flex-col gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <span className="inline-block px-3 py-1 text-[10px] font-bold tracking-[0.2em] text-brand-primary uppercase glass-panel rounded-full">
            Beyond Limits
          </span>
          <h1 className="text-5xl font-display font-bold tracking-tight leading-[0.9] text-slate-900">
            重塑你的<br />
            <span className="text-brand-primary">完美身形</span>
          </h1>
          <p className="text-slate-500 text-lg leading-relaxed max-w-[280px]">
            专为追求极致的你设计的 AI 健身助理，让每一滴汗水都有迹可循。
          </p>
        </motion.div>

        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ delay: 0.4 }}
           className="relative h-[400px] rounded-[2.5rem] overflow-hidden shadow-premium"
        >
          <img 
            src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop" 
            alt="Fitness" 
            className="w-full h-full object-cover grayscale-[0.2] contrast-[1.1]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
          <div className="absolute bottom-8 left-8 right-8">
             <div className="flex items-center gap-3 glass-panel rounded-2xl p-4">
                <div className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center text-white">
                   <Trophy size={20} />
                </div>
                <div>
                   <p className="text-white text-xs font-bold">本周冠军</p>
                   <p className="text-white/70 text-[10px]">累计完成 12 次高强度训练</p>
                </div>
             </div>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-3 gap-4">
         {[
           { label: '用户', value: '12k+', icon: <Users size={14} /> },
           { label: '计划', value: '450+', icon: <ClipboardList size={14} /> },
           { label: '评分', value: '4.9', icon: <Zap size={14} /> },
         ].map((stat, i) => (
           <motion.div 
             key={i}
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.6 + (i * 0.1) }}
             className="glass-panel rounded-3xl p-4 flex flex-col items-center gap-1"
           >
             <div className="text-brand-primary">{stat.icon}</div>
             <p className="text-sm font-bold text-slate-900">{stat.value}</p>
             <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{stat.label}</p>
           </motion.div>
         ))}
      </section>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex flex-col gap-4"
      >
        <button
          onClick={() => navigate('/register')}
          className="w-full h-16 bg-slate-900 text-white rounded-3xl font-bold text-lg flex items-center justify-center gap-2 shadow-2xl hover:bg-slate-800 transition-colors group"
        >
          开启旅程
          <ArrowRight className="transition-transform group-hover:translate-x-1" />
        </button>
        <button
          onClick={() => navigate('/login')}
          className="w-full h-16 glass-panel text-slate-900 rounded-3xl font-bold text-lg hover:bg-white transition-colors"
        >
          返回登录
        </button>
      </motion.div>
    </div>
  );
};

export default Home;
