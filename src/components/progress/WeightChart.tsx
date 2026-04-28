import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { WeightRecord } from '../../types';

interface WeightChartProps {
  records: WeightRecord[];
  goalWeight?: number;
}

export const WeightChart: React.FC<WeightChartProps> = ({ records, goalWeight }) => {
  const sortedRecords = useMemo(() => {
    return [...records].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [records]);

  const chartData = useMemo(() => {
    return sortedRecords.map(record => ({
      date: record.date,
      weight: record.weight,
      bmi: record.bmi,
    }));
  }, [sortedRecords]);

  const stats = useMemo(() => {
    if (records.length < 2) return null;

    const latest = records[records.length - 1];
    const previous = records[records.length - 2];
    const change = latest.weight - previous.weight;

    const first = records[0];
    const totalChange = latest.weight - first.weight;

    const min = Math.min(...records.map(r => r.weight));
    const max = Math.max(...records.map(r => r.weight));

    return {
      change: Math.round(change * 10) / 10,
      totalChange: Math.round(totalChange * 10) / 10,
      min: Math.round(min * 10) / 10,
      max: Math.round(max * 10) / 10,
      current: latest.weight,
    };
  }, [records]);

  if (records.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
        <p className="text-gray-500">暂无体重记录</p>
        <p className="text-sm text-gray-400 mt-1">开始记录你的体重变化吧</p>
      </div>
    );
  }

  const getTrendIcon = () => {
    if (!stats) return null;
    if (stats.change > 0) return <TrendingUp size={20} className="text-red-500" />;
    if (stats.change < 0) return <TrendingDown size={20} className="text-green-500" />;
    return <Minus size={20} className="text-gray-400" />;
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-900">体重趋势</h3>
          <p className="text-sm text-gray-500">{records.length} 条记录</p>
        </div>
        {stats && (
          <div className="flex items-center gap-2">
            {getTrendIcon()}
            <span className={`text-sm font-medium ${
              stats.change > 0 ? 'text-red-500' :
              stats.change < 0 ? 'text-green-500' : 'text-gray-500'
            }`}>
              {stats.change > 0 ? '+' : ''}{stats.change} kg
            </span>
          </div>
        )}
      </div>

      <div className="h-64 min-h-[200px] min-w-[300px]">
        <ResponsiveContainer width="100%" height="100%" minWidth={300} minHeight={200}>
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12, fill: '#94a3b8' }}
              tickFormatter={(value) => value.slice(5)}
            />
            <YAxis
              domain={['dataMin - 1', 'dataMax + 1']}
              tick={{ fontSize: 12, fill: '#94a3b8' }}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}
              formatter={(value) => [`${value} kg`, '体重']}
              labelFormatter={(label) => new Date(label as string).toLocaleDateString('zh-CN')}
            />
            {goalWeight && (
              <ReferenceLine
                y={goalWeight}
                stroke="#3B82F6"
                strokeDasharray="5 5"
                label={{ value: '目标', fill: '#3B82F6', fontSize: 12 }}
              />
            )}
            <Line
              type="monotone"
              dataKey="weight"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: '#2563EB' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {stats && (
        <div className="grid grid-cols-4 gap-2 mt-4 pt-4 border-t">
          <div className="text-center">
            <p className="text-xs text-gray-500">当前</p>
            <p className="font-semibold text-gray-900">{stats.current}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500">最低</p>
            <p className="font-semibold text-green-600">{stats.min}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500">最高</p>
            <p className="font-semibold text-red-600">{stats.max}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500">累计</p>
            <p className={`font-semibold ${stats.totalChange < 0 ? 'text-green-600' : stats.totalChange > 0 ? 'text-red-600' : 'text-gray-600'}`}>
              {stats.totalChange > 0 ? '+' : ''}{stats.totalChange}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeightChart;