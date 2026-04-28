import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { BodyData, FitnessGoal, Gender, Difficulty } from '../../types';
import { useApp } from '../../hooks/useAuth';
import { Ruler, Weight, Sparkles } from 'lucide-react';

const BodyDataForm: React.FC = () => {
  const navigate = useNavigate();
  const { state, completeInitialSetup } = useApp();
  const [formData, setFormData] = useState<BodyData>({
    height: state.bodyData?.height || 170,
    weight: state.bodyData?.weight || 65,
    age: state.bodyData?.age || 25,
    gender: state.bodyData?.gender || 'male',
    goal: state.bodyData?.goal || 'body-shaping',
    experience: state.bodyData?.experience || 'beginner',
  });

  const validate = () => {
    if (!formData.height || formData.height < 100 || formData.height > 250) return false;
    if (!formData.weight || formData.weight < 30 || formData.weight > 200) return false;
    if (!formData.age || formData.age < 10 || formData.age > 100) return false;
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    completeInitialSetup(formData);
    navigate('/dashboard');
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="space-y-2">
        <h1 className="text-4xl font-display font-bold tracking-tight text-slate-900">
          身体 <br />
          <span className="text-brand-primary">指标扫描</span>
        </h1>
        <p className="text-slate-500 font-medium">定制您的 AI 专属训练蓝图</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        {/* Numeric Inputs */}
        <div className="grid grid-cols-2 gap-4">
           <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-2">身高 (cm)</label>
              <div className="relative">
                 <Ruler className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                 <input 
                    type="number" 
                    className="w-full h-14 pl-12 pr-4 glass-panel rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all font-bold text-lg"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: Number(e.target.value) })}
                 />
              </div>
           </div>
           <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-2">体重 (kg)</label>
              <div className="relative">
                 <Weight className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                 <input 
                    type="number" 
                    className="w-full h-14 pl-12 pr-4 glass-panel rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all font-bold text-lg"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
                 />
              </div>
           </div>
        </div>

        {/* Gender Selection */}
        <div className="space-y-3">
           <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-2">性别</label>
           <div className="flex gap-4">
              {(['male', 'female'] as Gender[]).map((g) => (
                 <button
                    key={g}
                    type="button"
                    onClick={() => setFormData({ ...formData, gender: g })}
                    className={`flex-1 h-14 rounded-2xl font-bold transition-all border-2 ${
                       formData.gender === g ? 'border-brand-primary bg-sky-50 text-brand-primary' : 'border-transparent glass-panel text-slate-400'
                    }`}
                 >
                    {g === 'male' ? '男' : '女'}
                 </button>
              ))}
           </div>
        </div>

        {/* Goal Selection */}
        <div className="space-y-3">
           <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-2">健身目标</label>
           <div className="grid grid-cols-3 gap-3">
              {(['weight-loss', 'muscle-gain', 'body-shaping'] as FitnessGoal[]).map((g) => (
                 <button
                    key={g}
                    type="button"
                    onClick={() => setFormData({ ...formData, goal: g })}
                    className={`h-14 rounded-2xl font-bold text-xs transition-all border-2 ${
                       formData.goal === g ? 'border-brand-primary bg-sky-50 text-brand-primary' : 'border-transparent glass-panel text-slate-400'
                    }`}
                 >
                    {g === 'weight-loss' ? '减脂' : g === 'muscle-gain' ? '增肌' : '塑形'}
                 </button>
              ))}
           </div>
        </div>

        {/* Experience Level */}
        <div className="space-y-3">
           <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-2">训练背景</label>
           <div className="flex gap-3">
              {(['beginner', 'intermediate', 'advanced'] as Difficulty[]).map((exp) => (
                 <button
                    key={exp}
                    type="button"
                    onClick={() => setFormData({ ...formData, experience: exp })}
                    className={`flex-1 h-14 rounded-2xl font-bold text-[10px] uppercase tracking-widest transition-all border-2 ${
                       formData.experience === exp ? 'border-brand-primary bg-sky-50 text-brand-primary' : 'border-transparent glass-panel text-slate-400'
                    }`}
                 >
                    {exp === 'beginner' ? '初学' : exp === 'intermediate' ? '进阶' : '专业'}
                 </button>
              ))}
           </div>
        </div>

        <button
          type="submit"
          className="w-full h-16 bg-slate-900 text-white rounded-[2.5rem] font-bold text-lg flex items-center justify-center gap-3 shadow-2xl hover:bg-slate-800 transition-all active:scale-95 mt-4 group"
        >
          生成智能计划
          <Sparkles size={20} className="text-brand-primary transition-transform group-hover:rotate-12" />
        </button>
      </form>
    </div>
  );
};

export default BodyDataForm;
