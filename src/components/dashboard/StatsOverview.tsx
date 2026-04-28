import type { BodyData, WeeklyPlan } from '../../types';
import { User, Target, TrendingUp, Dumbbell } from 'lucide-react';
import Card from '../ui/Card';

interface StatsOverviewProps {
  bodyData: BodyData;
  weeklyPlan: WeeklyPlan | null;
  recommendedCount: number;
  bmi: number;
  bmiCategory: string;
}

const goalLabels = {
  'weight-loss': '减脂',
  'muscle-gain': '增肌',
  'body-shaping': '塑形',
};

export const StatsOverview: React.FC<StatsOverviewProps> = ({
  bodyData,
  weeklyPlan,
  recommendedCount,
  bmi,
  bmiCategory,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <Card className="p-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <p className="text-sm text-gray-500">BMI</p>
            <p className="text-xl font-bold text-gray-800">{bmi.toFixed(1)}</p>
          </div>
        </div>
        <p className="text-sm text-gray-400 mt-2">{bmiCategory}</p>
      </Card>

      <Card className="p-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <Target className="w-6 h-6 text-green-500" />
          </div>
          <div>
            <p className="text-sm text-gray-500">健身目标</p>
            <p className="text-xl font-bold text-gray-800">{goalLabels[bodyData.goal]}</p>
          </div>
        </div>
      </Card>

      <Card className="p-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-orange-500" />
          </div>
          <div>
            <p className="text-sm text-gray-500">训练频率</p>
            <p className="text-xl font-bold text-gray-800">{weeklyPlan?.frequency || 0}天/周</p>
          </div>
        </div>
      </Card>

      <Card className="p-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
            <Dumbbell className="w-6 h-6 text-purple-500" />
          </div>
          <div>
            <p className="text-sm text-gray-500">推荐器材</p>
            <p className="text-xl font-bold text-gray-800">{recommendedCount}个</p>
          </div>
        </div>
      </Card>
    </div>
  );
};
