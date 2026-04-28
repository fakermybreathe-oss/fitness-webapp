import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Clock, Flame } from 'lucide-react';
import type { Exercise, ExerciseCompletion } from '../../types';

interface ExerciseCompletionListProps {
  exercises: Exercise[];
  onComplete: (completions: ExerciseCompletion[]) => void;
  onCancel: () => void;
}

export const ExerciseCompletionList: React.FC<ExerciseCompletionListProps> = ({
  exercises,
  onComplete,
  onCancel
}) => {
  const [completions, setCompletions] = useState<ExerciseCompletion[]>(
    exercises.map(ex => ({
      exerciseId: ex.id,
      name: ex.name,
      setsCompleted: ex.sets,
      repsPerSet: Array(ex.sets).fill(ex.reps),
      actualRest: ex.rest,
      completed: false,
      skipped: false,
    }))
  );

  const toggleComplete = (index: number) => {
    setCompletions(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        completed: !updated[index].completed,
        skipped: false,
      };
      return updated;
    });
  };

  const toggleSkip = (index: number) => {
    setCompletions(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        completed: false,
        skipped: !updated[index].skipped,
      };
      return updated;
    });
  };

  const handleSubmit = () => {
    const finalCompletions = completions.map(c => ({
      ...c,
      completed: c.completed && !c.skipped,
    }));

    onComplete(finalCompletions);
  };

  const completedCount = completions.filter(c => c.completed).length;
  const progress = (completedCount / completions.length) * 100;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-900">训练完成</h3>
          <p className="text-sm text-gray-500">{completedCount}/{completions.length} 已完成</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock size={16} />
          <span>预计 45 分钟</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-gray-100 rounded-full mb-6 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
        />
      </div>

      {/* Exercise List */}
      <div className="space-y-3">
        {exercises.map((exercise, index) => {
          const completion = completions[index];
          return (
            <motion.div
              key={exercise.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-xl border-2 transition-all ${
                completion.completed
                  ? 'border-green-200 bg-green-50'
                  : completion.skipped
                  ? 'border-gray-200 bg-gray-50 opacity-60'
                  : 'border-gray-100 bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{exercise.name}</h4>
                  <p className="text-sm text-gray-500">
                    {exercise.sets} 组 × {exercise.reps} 次 · 休息 {exercise.rest}s
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    目标肌群: {exercise.targetMuscle}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleSkip(index)}
                    className={`p-2 rounded-full transition-colors ${
                      completion.skipped
                        ? 'bg-gray-300 text-gray-600'
                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                    }`}
                    title="跳过"
                  >
                    <X size={18} />
                  </button>
                  <button
                    onClick={() => toggleComplete(index)}
                    className={`p-3 rounded-full transition-all ${
                      completion.completed
                        ? 'bg-green-500 text-white shadow-lg shadow-green-200'
                        : 'bg-gray-100 text-gray-400 hover:bg-green-100 hover:text-green-600'
                    }`}
                  >
                    <Check size={20} />
                  </button>
                </div>
              </div>

              {/* Sets progress */}
              <div className="flex items-center gap-1 mt-3">
                {Array.from({ length: exercise.sets }).map((_, setIndex) => (
                  <div
                    key={setIndex}
                    className={`h-1.5 flex-1 rounded-full transition-colors ${
                      setIndex < completion.setsCompleted && completion.completed
                        ? 'bg-green-500'
                        : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-6 p-4 bg-gray-50 rounded-xl">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Flame size={18} className="text-orange-500" />
            <span className="text-gray-600">预计消耗</span>
          </div>
          <span className="font-semibold text-gray-900">~200 千卡</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-6">
        <button
          onClick={onCancel}
          className="flex-1 px-4 py-3 rounded-xl border border-gray-200
            text-gray-600 font-medium hover:bg-gray-50
            transition-colors"
        >
          取消
        </button>
        <button
          onClick={handleSubmit}
          disabled={completedCount === 0}
          className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
            completedCount > 0
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          <Check size={18} />
          完成训练
        </button>
      </div>
    </div>
  );
};

export default ExerciseCompletionList;