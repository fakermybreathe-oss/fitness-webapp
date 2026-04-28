import { Link } from 'react-router-dom';
import type { BodyData } from '../../types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { ChevronRight } from 'lucide-react';

interface BodyDataDisplayProps {
  bodyData: BodyData;
}

export const BodyDataDisplay: React.FC<BodyDataDisplayProps> = ({ bodyData }) => {
  return (
    <Card className="p-6 mb-8">
      <h2 className="text-xl font-bold text-gray-800 mb-4">身体数据</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div>
          <p className="text-sm text-gray-500 mb-1">身高</p>
          <p className="text-lg font-semibold text-gray-800">{bodyData.height} cm</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-1">体重</p>
          <p className="text-lg font-semibold text-gray-800">{bodyData.weight} kg</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-1">年龄</p>
          <p className="text-lg font-semibold text-gray-800">{bodyData.age} 岁</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-1">性别</p>
          <p className="text-lg font-semibold text-gray-800">{bodyData.gender === 'male' ? '男' : '女'}</p>
        </div>
      </div>
      <Link to="/body-data" className="inline-block mt-4">
        <Button variant="outline" size="sm">
          修改数据 <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </Link>
    </Card>
  );
};
