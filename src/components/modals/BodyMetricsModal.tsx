import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scale, X, Save, TrendingDown, TrendingUp, Minus, Plus } from 'lucide-react';
import { useApp } from '../../hooks/useAuth';
import { calculateBMI } from '../../utils/recommendations';

interface BodyMetricsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BodyMetricsModal: React.FC<BodyMetricsModalProps> = ({ isOpen, onClose }) => {
  const { state, addWeightRecord } = useApp();
  const currentWeight = state.bodyData?.weight || 70;
  const [weight, setWeight] = useState(currentWeight);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // 模拟网络延迟以提供物理反馈
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const bmi = state.bodyData ? calculateBMI(weight, state.bodyData.height) : 0;
    
    addWeightRecord({
      id: Date.now().toString(),
      userId: state.user?.id || '',
      weight,
      date: new Date().toISOString(),
      bmi
    });
    
    setIsSaving(false);
    onClose();
  };

  const weightDiff = weight - currentWeight;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-white rounded-t-[2.5rem] sm:rounded-[2.5rem] p-8 shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-primary/10 rounded-xl flex items-center justify-center text-brand-primary">
                  <Scale size={20} />
                </div>
                <h2 className="text-xl font-bold text-slate-900">今日身体记录</h2>
              </div>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Weight Input */}
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">当前体重 (KG)</span>
                <div className="flex items-center justify-center gap-6">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setWeight(prev => Math.max(30, +(prev - 0.1).toFixed(1)))}
                    className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100"
                  >
                    <Minus size={20} />
                  </motion.button>
                  
                  <div className="text-6xl font-display font-black text-slate-900 tabular-nums">
                    {weight.toFixed(1)}
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setWeight(prev => Math.min(250, +(prev + 0.1).toFixed(1)))}
                    className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100"
                  >
                    <Plus size={20} />
                  </motion.button>
                </div>
              </div>

              {/* Slider for quick adjustment */}
              <input
                type="range"
                min={weight - 5}
                max={weight + 5}
                step={0.1}
                value={weight}
                onChange={(e) => setWeight(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-brand-primary"
              />

              {/* Status Info */}
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100/50">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">对比上次</span>
                  <div className="flex items-center gap-2">
                    {weightDiff === 0 ? (
                      <span className="text-sm font-bold text-slate-500">无变化</span>
                    ) : weightDiff > 0 ? (
                      <>
                        <TrendingUp size={16} className="text-rose-500" />
                        <span className="text-sm font-bold text-rose-500">+{weightDiff.toFixed(1)} kg</span>
                      </>
                    ) : (
                      <>
                        <TrendingDown size={16} className="text-emerald-500" />
                        <span className="text-sm font-bold text-emerald-500">{weightDiff.toFixed(1)} kg</span>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100/50">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">预计 BMI</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">
                      {state.bodyData ? calculateBMI(weight, state.bodyData.height).toFixed(1) : '--'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isSaving}
                onClick={handleSave}
                className="w-full h-16 bg-brand-primary text-white rounded-3xl font-bold flex items-center justify-center gap-3 shadow-xl shadow-brand-primary/20 disabled:opacity-70 transition-all mt-4"
              >
                {isSaving ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Save size={20} />
                    保存记录
                  </>
                )}
              </motion.button>
            </div>

            {/* Decorative background element */}
            <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-brand-primary/5 rounded-full blur-3xl pointer-events-none" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BodyMetricsModal;
