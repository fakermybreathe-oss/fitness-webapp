import { Link } from 'react-router-dom';
import type { Equipment } from '../../types';
import EquipmentCard from '../equipment/EquipmentCard';
import { ChevronRight } from 'lucide-react';

interface EquipmentPreviewProps {
  equipment: Equipment[];
  onSelect: (equipment: Equipment) => void;
}

export const EquipmentPreview: React.FC<EquipmentPreviewProps> = ({ equipment, onSelect }) => {
  if (equipment.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">推荐器材</h2>
        <Link to="/equipment" className="text-blue-500 hover:text-blue-600 text-sm font-medium">
          查看全部 <ChevronRight className="w-4 h-4 inline" />
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {equipment.slice(0, 3).map((eq) => (
          <EquipmentCard
            key={eq.id}
            equipment={eq}
            onClick={() => onSelect(eq)}
          />
        ))}
      </div>
    </div>
  );
};
