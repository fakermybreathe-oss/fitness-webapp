import React from 'react';
import type { WeeklyPlan, DailyWorkout } from '../../types';
import Card from '../ui/Card';
import { Calendar, Clock } from 'lucide-react';

interface WeeklyPlanProps {
  plan: WeeklyPlan;
  onDayClick: (day: DailyWorkout) => void;
}

const WeeklyPlanComponent: React.FC<WeeklyPlanProps> = ({ plan, onDayClick }) => {
  const goalLabels = {
    'weight-loss': '减脂',
    'muscle-gain': '增肌',
    'body-shaping': '塑形',
  };

  const muscleIcons: Record<string, string> = {
    '胸部': '💪',
    '背部': '🏋️',
    '腿部': '🦵',
    '肩膀': '🤷',
    '手臂': '💪',
    '核心': '🔥',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">每周训练计划</h2>
          <p className="text-gray-500 mt-1">目标：{goalLabels[plan.goal]} | 每周{plan.frequency}天</p>
        </div>
        <div className="flex items-center gap-2 text-gray-500">
          <Calendar size={18} />
          <span>{plan.days.length}天/周</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {plan.days.map((day) => (
          <Card
            key={day.day}
            hoverable
            onClick={() => onDayClick(day)}
            className="p-5"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-xl">{muscleIcons[day.focus] || '💪'}</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">{day.dayName}</h3>
                <p className="text-sm text-gray-500">第{day.day}天</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full font-medium">
                {day.focus}
              </span>
              <span className="text-gray-400 flex items-center gap-1">
                <Clock size={14} />
                {day.exercises.length}个动作
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default WeeklyPlanComponent;
