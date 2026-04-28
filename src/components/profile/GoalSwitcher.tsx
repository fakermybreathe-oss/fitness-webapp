import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import type { FitnessGoal } from '../../types';
import { useApp } from '../../hooks/useAuth';
import { GOAL_LABELS, GOAL_ICONS } from '../../constants';
import { RefreshCw, X, AlertTriangle } from 'lucide-react';

interface GoalSwitcherProps {
  /** 紧凑模式：仅显示当前目标标签（用于 Dashboard 顶部） */
  compact?: boolean;
}

const GOALS: FitnessGoal[] = ['weight-loss', 'muscle-gain', 'body-shaping'];

/** 目标描述文案，帮助用户理解每个目标的训练策略 */
const GOAL_DESCRIPTIONS: Record<FitnessGoal, string> = {
  'weight-loss': '高频有氧 + 间歇训练，侧重燃脂',
  'muscle-gain': '大重量力量训练，侧重肌肉增长',
  'body-shaping': '混合训练，兼顾线条与体能',
};

const GoalSwitcher: React.FC<GoalSwitcherProps> = ({ compact = false }) => {
  const { state, updateGoal } = useApp();
  const navigate = useNavigate();
  const currentGoal = state.bodyData?.goal || 'body-shaping';
  const [showModal, setShowModal] = useState(false);
  const [pendingGoal, setPendingGoal] = useState<FitnessGoal | null>(null);

  const handleSelectGoal = (goal: FitnessGoal) => {
    if (goal === currentGoal) return;
    setPendingGoal(goal);
  };

  const handleConfirm = () => {
    if (!pendingGoal) return;
    
    // 如果没有身体数据，无法直接 updateGoal (因为需要数据生成计划)
    // 此时引导去 BodyDataForm
    if (!state.bodyData) {
      navigate('/body-data');
      return;
    }

    updateGoal(pendingGoal);
    setPendingGoal(null);
    setShowModal(false);
  };

  // 紧凑模式：点击标签打开切换弹窗
  if (compact) {
    return (
      <>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-bold transition-all hover:bg-brand-primary/20 active:scale-95"
        >
          <span>{GOAL_ICONS[currentGoal]}</span>
          <span>{GOAL_LABELS[currentGoal]}</span>
          <RefreshCw size={10} />
        </button>

        <AnimatePresence>
          {showModal && (
            <GoalModal
              currentGoal={currentGoal}
              pendingGoal={pendingGoal}
              onSelect={handleSelectGoal}
              onConfirm={handleConfirm}
              onClose={() => { setShowModal(false); setPendingGoal(null); }}
            />
          )}
        </AnimatePresence>
      </>
    );
  }

  // 完整模式：直接展示目标卡片（用于 Settings）
  return (
    <>
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-3">
          {GOALS.map((goal) => (
            <button
              key={goal}
              onClick={() => handleSelectGoal(goal)}
              className={`relative flex flex-col items-center gap-2 p-4 rounded-2xl font-bold text-sm transition-all border-2 ${
                currentGoal === goal
                  ? 'border-brand-primary bg-sky-50 text-brand-primary shadow-sm'
                  : 'border-transparent bg-gray-50 text-slate-400 hover:bg-gray-100'
              }`}
            >
              <span className="text-2xl">{GOAL_ICONS[goal]}</span>
              <span className="text-xs">{GOAL_LABELS[goal]}</span>
              {currentGoal === goal && (
                <motion.div
                  layoutId="goal-active"
                  className="absolute -top-1 -right-1 w-4 h-4 bg-brand-primary rounded-full flex items-center justify-center"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                >
                  <span className="text-white text-[8px]">✓</span>
                </motion.div>
              )}
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-400 text-center">
          {GOAL_DESCRIPTIONS[currentGoal]}
        </p>
      </div>

      <AnimatePresence>
        {pendingGoal && (
          <GoalModal
            currentGoal={currentGoal}
            pendingGoal={pendingGoal}
            onSelect={handleSelectGoal}
            onConfirm={handleConfirm}
            onClose={() => setPendingGoal(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

/** 目标切换确认弹窗 */
interface GoalModalProps {
  currentGoal: FitnessGoal;
  pendingGoal: FitnessGoal | null;
  onSelect: (goal: FitnessGoal) => void;
  onConfirm: () => void;
  onClose: () => void;
}

const GoalModal: React.FC<GoalModalProps> = ({
  currentGoal,
  pendingGoal,
  onSelect,
  onConfirm,
  onClose,
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-6"
    onClick={onClose}
  >
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 400 }}
      className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-bold text-slate-900">切换健身目标</h3>
        <button
          onClick={onClose}
          className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X size={18} className="text-slate-400" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-5">
        {GOALS.map((goal) => (
          <button
            key={goal}
            onClick={() => onSelect(goal)}
            className={`flex flex-col items-center gap-2 p-4 rounded-2xl font-bold text-sm transition-all border-2 ${
              (pendingGoal || currentGoal) === goal
                ? 'border-brand-primary bg-sky-50 text-brand-primary'
                : 'border-transparent bg-gray-50 text-slate-400 hover:bg-gray-100'
            }`}
          >
            <span className="text-2xl">{GOAL_ICONS[goal]}</span>
            <span className="text-xs">{GOAL_LABELS[goal]}</span>
          </button>
        ))}
      </div>

      {pendingGoal && pendingGoal !== currentGoal && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 mb-5 flex items-start gap-2">
          <AlertTriangle size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-amber-700 leading-relaxed">
            切换目标将<strong>重新生成训练计划</strong>和推荐器材。已有的训练记录不会丢失。
          </p>
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 py-3 rounded-2xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors"
        >
          取消
        </button>
        <button
          onClick={onConfirm}
          disabled={!pendingGoal || pendingGoal === currentGoal}
          className="flex-1 py-3 rounded-2xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
        >
          确认切换
        </button>
      </div>
    </motion.div>
  </motion.div>
);

export default GoalSwitcher;
