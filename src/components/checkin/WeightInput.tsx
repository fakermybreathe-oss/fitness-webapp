import React, { useState } from 'react';
import { Scale, Calendar, Plus } from 'lucide-react';
import type { WeightRecord } from '../../types';

interface WeightInputProps {
  userId: string;
  onSave: (record: WeightRecord) => void;
  onCancel: () => void;
}

export const WeightInput: React.FC<WeightInputProps> = ({ userId, onSave, onCancel }) => {
  const [weight, setWeight] = useState('');
  const [note, setNote] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const weightValue = parseFloat(weight);
    if (isNaN(weightValue) || weightValue <= 0) {
      return;
    }

    // For BMI calculation, we need height from bodyData
    // For now, set a default or calculate with stored height
    const heightStr = localStorage.getItem('fitness_body_data');
    const height = heightStr ? JSON.parse(heightStr).height : 170;
    const bmi = weightValue / Math.pow(height / 100, 2);

    const record: WeightRecord = {
      id: `wr-${Date.now()}`,
      userId,
      weight: weightValue,
      date: new Date().toISOString().split('T')[0],
      bmi: Math.round(bmi * 10) / 10,
      note: note.trim() || undefined,
    };

    onSave(record);
    setWeight('');
    setNote('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-5 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
          <Scale size={20} className="text-blue-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">记录体重</h3>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            <Calendar size={14} />
            {new Date().toLocaleDateString('zh-CN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            体重 (kg)
          </label>
          <input
            type="number"
            step="0.1"
            min="30"
            max="200"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="例如：70.5"
            className="w-full px-4 py-3 rounded-xl border border-gray-200
              focus:border-blue-500 focus:ring-2 focus:ring-blue-100
              transition-all outline-none text-lg"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            备注 (可选)
          </label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="例如：早饭后测量"
            className="w-full px-4 py-3 rounded-xl border border-gray-200
              focus:border-blue-500 focus:ring-2 focus:ring-blue-100
              transition-all outline-none"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200
              text-gray-600 font-medium hover:bg-gray-50
              transition-colors"
          >
            取消
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-3 rounded-xl bg-blue-500
              text-white font-medium hover:bg-blue-600
              transition-colors flex items-center justify-center gap-2"
          >
            <Plus size={18} />
            记录
          </button>
        </div>
      </div>
    </form>
  );
};

export default WeightInput;