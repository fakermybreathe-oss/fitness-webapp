import React from 'react';
import type { Equipment } from '../../types';
import Card from '../ui/Card';

interface EquipmentCardProps {
  equipment: Equipment;
  onClick: () => void;
}

const EquipmentCard: React.FC<EquipmentCardProps> = ({ equipment, onClick }) => {
  const categoryColors = {
    cardio: 'bg-green-100 text-green-700',
    strength: 'bg-red-100 text-red-700',
    flexibility: 'bg-purple-100 text-purple-700',
  };

  const difficultyLabels = {
    beginner: '初级',
    intermediate: '中级',
    advanced: '高级',
  };

  return (
    <Card hoverable onClick={onClick} className="overflow-hidden">
      <div className="h-56 bg-white flex items-center justify-center p-4">
        <img
          src={equipment.imageUrl}
          alt={equipment.name}
          className="w-full h-full object-contain transition-all duration-300"
          loading="lazy"
        />
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className={`px-2 py-0.5 rounded text-xs font-medium ${categoryColors[equipment.category]}`}>
            {equipment.category === 'cardio' ? '有氧' : equipment.category === 'strength' ? '力量' : '柔韧'}
          </span>
          <span className="text-xs text-gray-400">
            {difficultyLabels[equipment.difficulty]}
          </span>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-1">{equipment.name}</h3>
        <p className="text-sm text-gray-500">{equipment.nameEn}</p>
        <div className="mt-3 flex flex-wrap gap-1">
          {equipment.targetMuscles.slice(0, 3).map((muscle) => (
            <span
              key={muscle}
              className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs"
            >
              {muscle}
            </span>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default EquipmentCard;
