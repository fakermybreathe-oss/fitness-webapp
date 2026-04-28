import React, { useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { TrainingLog } from '../../types';

interface TrainingCalendarProps {
  trainingLogs: TrainingLog[];
  onDateClick?: (date: string) => void;
}

interface DayData {
  date: string;
  completed: boolean;
  level: 0 | 1 | 2 | 3; // 0: no training, 1-3: intensity level
}

export const TrainingCalendar: React.FC<TrainingCalendarProps> = ({ trainingLogs, onDateClick }) => {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());

  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);

    // Day of week for first day (0 = Sunday)
    const startDayOfWeek = firstDay.getDay();

    // Create a map of dates with training data
    const trainingMap = new Map<string, TrainingLog>();
    trainingLogs.forEach(log => {
      trainingMap.set(log.date, log);
    });

    const days: (DayData | null)[] = [];

    // Add empty cells for days before the first day of month
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const log = trainingMap.get(dateStr);

      days.push({
        date: dateStr,
        completed: log?.completed || false,
        level: log?.completed ? 2 : 0, // Simplified: just check if completed
      });
    }

    return days;
  }, [currentMonth, trainingLogs]);

  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

  const navigateMonth = (direction: number) => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const getLevelColor = (level: 0 | 1 | 2 | 3) => {
    switch (level) {
      case 0: return 'bg-gray-100';
      case 1: return 'bg-blue-200';
      case 2: return 'bg-blue-400';
      case 3: return 'bg-blue-600';
      default: return 'bg-gray-100';
    }
  };

  const completedDays = trainingLogs.filter(log => log.completed).length;
  const totalDays = calendarDays.filter(d => d !== null).length;
  const completionRate = totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-900">训练日历</h3>
          <p className="text-sm text-gray-500">{completionRate}% 完成率</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateMonth(-1)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft size={18} className="text-gray-600" />
          </button>
          <span className="text-sm font-medium text-gray-900 min-w-[100px] text-center">
            {currentMonth.getFullYear()}年{currentMonth.getMonth() + 1}月
          </span>
          <button
            onClick={() => navigateMonth(1)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ChevronRight size={18} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Week day headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map(day => (
          <div key={day} className="text-center text-xs text-gray-400 font-medium py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => (
          <div key={index} className="aspect-square">
            {day ? (
              <button
                onClick={() => onDateClick?.(day.date)}
                className={`w-full h-full rounded-lg flex items-center justify-center
                  text-sm font-medium transition-all hover:scale-105
                  ${day.completed ? 'bg-blue-500 text-white' : getLevelColor(day.level)}
                  ${day.date === new Date().toISOString().split('T')[0] ? 'ring-2 ring-blue-300' : ''}
                `}
              >
                {parseInt(day.date.split('-')[2])}
              </button>
            ) : (
              <div className="w-full h-full" />
            )}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-blue-500" />
          <span className="text-xs text-gray-500">已完成</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-gray-100" />
          <span className="text-xs text-gray-500">未训练</span>
        </div>
      </div>
    </div>
  );
};

export default TrainingCalendar;