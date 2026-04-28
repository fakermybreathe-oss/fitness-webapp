import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { useApp } from '../hooks/useAuth';
import { CheckCircle2, Clock, Flame, Calendar, X, Trophy } from 'lucide-react';
import ExerciseCompletionList from '../components/checkin/ExerciseCompletionList';
import { estimateCalories, estimateWorkoutDuration } from '../utils/calorieEstimation';
import type { TrainingLog, ExerciseCompletion } from '../types';

const CheckInPage: React.FC = () => {
  const { date } = useParams();
  const { state, addTrainingLog } = useApp();
  const { weeklyPlan, bodyData, user } = state;

  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const [isTraining, setIsTraining] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showQuickCheckIn, setShowQuickCheckIn] = useState(false);

  // Get today's exercises from weekly plan
  const selectedDay = useMemo(() => {
    if (!weeklyPlan || !weeklyPlan.days[selectedDayIndex]) return null;
    return weeklyPlan.days[selectedDayIndex];
  }, [weeklyPlan, selectedDayIndex]);

  const handleStartTraining = () => {
    setIsTraining(true);
  };

  // 快速打卡功能
  const handleQuickCheckIn = () => {
    if (!user || !weeklyPlan) return;

    const today = new Date().toISOString().split('T')[0];
    const todayIndex = new Date().getDay(); // 0-6, 0 is Sunday

    // 找到对应训练日 (周一=0格式)
    const dayIndex = todayIndex === 0 ? 6 : todayIndex - 1;

    const log: TrainingLog = {
      id: `tl-${Date.now()}`,
      userId: user.id,
      date: today,
      planId: weeklyPlan.id,
      dayIndex: dayIndex,
      exercises: [],
      duration: 0,
      caloriesBurned: 0,
      completed: true,
      notes: '快速打卡',
    };

    addTrainingLog(log);
    setShowQuickCheckIn(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleCompleteTraining = (completions: ExerciseCompletion[]) => {
    if (!user || !weeklyPlan || !selectedDay) return;

    const weight = bodyData?.weight || 70;
    const duration = estimateWorkoutDuration(selectedDay.exercises.length);
    const calories = completions.reduce((total, c) => {
      if (!c.completed) return total;
      return total + estimateCalories(c.exerciseId, 4, weight); // 4 min per exercise
    }, 0);

    const log: TrainingLog = {
      id: `tl-${Date.now()}`,
      userId: user.id,
      date: date || new Date().toISOString().split('T')[0],
      planId: weeklyPlan.id,
      dayIndex: selectedDayIndex,
      exercises: completions,
      duration,
      caloriesBurned: calories,
      completed: completions.some(c => c.completed),
    };

    addTrainingLog(log);
    setIsTraining(false);
    setShowSuccess(true);

    // Auto hide success message after 3 seconds
    setTimeout(() => setShowSuccess(false), 3000);
  };

  if (!weeklyPlan) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">还没有训练计划</p>
          <p className="text-sm text-gray-400 mt-1">请先创建训练计划</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-6">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <CheckCircle2 size={24} />
          训练打卡
        </h1>
        <p className="text-orange-100 text-sm mt-1 flex items-center gap-1">
          <Calendar size={14} />
          {date ? new Date(date).toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }) : new Date().toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </div>

      <div className="px-4 py-4">
        {/* Quick Check-in Card */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 shadow-sm mb-4 border border-green-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">快速打卡</h3>
              <p className="text-sm text-gray-500">已完成训练？一键标记</p>
            </div>
            <button
              data-testid="quick-checkin-btn"
              onClick={() => setShowQuickCheckIn(true)}
              className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center gap-1"
            >
              <CheckCircle2 size={18} />
              快速打卡
            </button>
          </div>
        </div>

        {/* Day Selection */}
        <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
          <h3 className="font-semibold text-gray-900 mb-1">详细训练打卡</h3>
          <p className="text-sm text-gray-500 mb-3">按步骤完成训练项目</p>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {weeklyPlan.days.map((day, index) => (
              <button
                key={index}
                onClick={() => setSelectedDayIndex(index)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedDayIndex === index
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {day.dayName}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Day Preview */}
        {selectedDay && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-4 shadow-sm mb-4"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-semibold text-gray-900">{selectedDay.dayName}</h3>
                <p className="text-sm text-gray-500">重点: {selectedDay.focus}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Clock size={16} />
                  <span>{estimateWorkoutDuration(selectedDay.exercises.length)} 分钟</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {selectedDay.exercises.slice(0, 3).map((ex, index) => (
                <div key={ex.id} className="flex items-center gap-2 text-sm">
                  <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium">
                    {index + 1}
                  </div>
                  <span className="text-gray-700">{ex.name}</span>
                  <span className="text-gray-400">({ex.sets}×{ex.reps})</span>
                </div>
              ))}
              {selectedDay.exercises.length > 3 && (
                <p className="text-xs text-gray-400 pl-8">
                  还有 {selectedDay.exercises.length - 3} 个练习...
                </p>
              )}
            </div>

            <button
              onClick={handleStartTraining}
              className="w-full mt-4 px-4 py-3 rounded-xl bg-orange-500
                text-white font-medium hover:bg-orange-600
                transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle2 size={20} />
              开始训练
            </button>
          </motion.div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Flame size={18} className="text-orange-500" />
              <span className="text-sm text-gray-500">预计消耗</span>
            </div>
            <p className="text-xl font-bold text-gray-900">
              {selectedDay ? estimateWorkoutDuration(selectedDay.exercises.length) * 5 : 0}
            </p>
            <p className="text-xs text-gray-400">千卡</p>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Trophy size={18} className="text-blue-500" />
              <span className="text-sm text-gray-500">训练项目</span>
            </div>
            <p className="text-xl font-bold text-gray-900">
              {selectedDay?.exercises.length || 0}
            </p>
            <p className="text-xs text-gray-400">项</p>
          </div>
        </div>
      </div>

      {/* Training Modal */}
      <AnimatePresence>
        {isTraining && selectedDay && (
          <motion.div
            key="training-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-end z-50"
            onClick={() => setIsTraining(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full bg-gray-50 rounded-t-3xl p-4 max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg text-gray-900">
                  {selectedDay.dayName} · {selectedDay.focus}
                </h3>
                <button
                  onClick={() => setIsTraining(false)}
                  className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>

              <ExerciseCompletionList
                exercises={selectedDay.exercises}
                onComplete={handleCompleteTraining}
                onCancel={() => setIsTraining(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Check-in Confirmation Modal */}
      <AnimatePresence>
        {showQuickCheckIn && (
          <motion.div
            key="quick-checkin-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-sm mx-4 shadow-xl"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={32} className="text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">确认打卡</h3>
                <p className="text-gray-500 mb-6">标记今日训练完成?</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowQuickCheckIn(false)}
                    className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleQuickCheckIn}
                    className="flex-1 py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors"
                  >
                    确认打卡
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Message - Enhanced */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            key="success-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="bg-white rounded-2xl p-6 text-center max-w-sm mx-4 shadow-xl"
            >
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                >
                  <CheckCircle2 size={40} className="text-green-500" />
                </motion.div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">打卡成功!</h3>
              <p className="text-gray-500">今日训练已记录，继续保持!</p>
              <button
                onClick={() => setShowSuccess(false)}
                className="mt-4 px-6 py-2 bg-green-500 text-white rounded-full font-medium hover:bg-green-600 transition-colors"
              >
                完成
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CheckInPage;