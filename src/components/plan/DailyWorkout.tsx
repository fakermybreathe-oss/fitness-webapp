import type { DailyWorkout } from '../../types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { X, Dumbbell, Repeat, Timer } from 'lucide-react';

interface DailyWorkoutProps {
  day: DailyWorkout;
  onClose: () => void;
}

const DailyWorkoutDetail: React.FC<DailyWorkoutProps> = ({ day, onClose }) => {
  const muscleColors: Record<string, string> = {
    '胸部': 'bg-red-100 text-red-600',
    '背部': 'bg-blue-100 text-blue-600',
    '腿部': 'bg-green-100 text-green-600',
    '肩膀': 'bg-yellow-100 text-yellow-600',
    '手臂': 'bg-purple-100 text-purple-600',
    '核心': 'bg-orange-100 text-orange-600',
    '全身': 'bg-indigo-100 text-indigo-600',
    '有氧': 'bg-pink-100 text-pink-600',
    '臀部': 'bg-rose-100 text-rose-600',
    '柔韧性': 'bg-cyan-100 text-cyan-600',
    '平衡': 'bg-teal-100 text-teal-600',
  };

  const equipmentIcons: Record<string, string> = {
    'jump-rope': '跳',
    'dumbbells': '🏋️',
    'rowing-machine': '🚣',
    'bench-press': '💪',
    'barbell': '🏋️',
    'cable-machine': '🔗',
    'spin-bike': '🚴',
    'kettlebell': '🎯',
    'balance-ball': '🏐',
    'leg-press': '🦵',
    'pull-up-bar': '🙆',
    'stair-climber': '🪜',
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{day.dayName}训练</h2>
            <p className="text-gray-500 mt-1">
              部位：{day.focus} | {day.exercises.length}个动作
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {day.exercises.map((exercise, index) => (
            <div
              key={exercise.id}
              className="bg-gray-50 rounded-xl p-4 border border-gray-100"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-xl">
                    {equipmentIcons[exercise.equipment || ''] || '🏋️'}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-gray-800">{exercise.name}</h4>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${muscleColors[exercise.targetMuscle || ''] || 'bg-gray-200 text-gray-600'}`}>
                      {exercise.targetMuscle || exercise.muscle || '全身'}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Repeat size={14} />
                      {exercise.sets}组
                    </span>
                    <span className="flex items-center gap-1">
                      <Dumbbell size={14} />
                      {exercise.reps}次
                    </span>
                    <span className="flex items-center gap-1">
                      <Timer size={14} />
                      休息{exercise.rest}秒
                    </span>
                  </div>
                </div>
                <span className="text-gray-400 font-medium">#{index + 1}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
            <span>预计总时长</span>
            <span className="font-medium text-gray-700">
              ~{Math.round(day.exercises.reduce((acc, ex) => {
                const repsCount = typeof ex.reps === 'number' ? ex.reps : parseInt(String(ex.reps).split('-')[0]) || 10;
                return acc + (ex.sets * repsCount * 3 + ex.sets * ex.rest) / 60;
              }, 10))}分钟
            </span>
          </div>
          <Button onClick={onClose} className="w-full">
            完成今日计划
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default DailyWorkoutDetail;
