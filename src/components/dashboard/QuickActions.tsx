import { Link } from 'react-router-dom';
import Card from '../ui/Card';
import { User, Dumbbell, ChevronRight } from 'lucide-react';

export const QuickActions: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Link to="/body-data">
        <Card hoverable className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">更新身体数据</h3>
              <p className="text-sm text-gray-500">修改你的健身目标和数据</p>
            </div>
          </div>
          <ChevronRight className="text-gray-400" />
        </Card>
      </Link>

      <Link to="/equipment">
        <Card hoverable className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <Dumbbell className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">浏览健身器材</h3>
              <p className="text-sm text-gray-500">查看所有器材的使用方法</p>
            </div>
          </div>
          <ChevronRight className="text-gray-400" />
        </Card>
      </Link>
    </div>
  );
};
