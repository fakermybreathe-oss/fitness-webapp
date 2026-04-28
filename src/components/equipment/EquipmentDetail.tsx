import React from 'react';
import type { Equipment } from '../../types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { X } from 'lucide-react';

interface EquipmentDetailProps {
  equipment: Equipment;
  onClose: () => void;
}

const EquipmentDetail: React.FC<EquipmentDetailProps> = ({ equipment, onClose }) => {
  const categoryLabels = {
    cardio: '有氧器材',
    strength: '力量器材',
    flexibility: '柔韧器材',
  };

  const difficultyLabels = {
    beginner: '初级',
    intermediate: '中级',
    advanced: '高级',
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="relative h-80 bg-white flex items-center justify-center">
          <img
            src={equipment.imageUrl}
            alt={equipment.name}
            className="w-full h-full object-contain transition-all duration-500"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
          >
            <X size={20} />
          </button>
          <div className="absolute bottom-4 left-4 flex gap-2">
            <span className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm font-medium">
              {categoryLabels[equipment.category]}
            </span>
            <span className="px-3 py-1 bg-orange-500 text-white rounded-full text-sm font-medium">
              {difficultyLabels[equipment.difficulty]}
            </span>
          </div>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">{equipment.name}</h2>
          <p className="text-gray-500 mb-4">{equipment.nameEn}</p>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">锻炼部位</h3>
            <div className="flex flex-wrap gap-2">
              {equipment.targetMuscles.map((muscle) => (
                <span
                  key={muscle}
                  className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium"
                >
                  {muscle}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">使用方法</h3>
            <ol className="space-y-2">
              {equipment.usage.map((step, index) => (
                <li key={index} className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <span className="text-gray-600 leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-3">小贴士</h3>
            <ul className="space-y-2">
              {equipment.tips.map((tip, index) => (
                <li key={index} className="flex gap-3 items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center text-sm">
                    !
                  </span>
                  <span className="text-gray-600 leading-relaxed">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="p-4 border-t border-gray-100">
          <Button onClick={onClose} className="w-full">
            关闭
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default EquipmentDetail;
