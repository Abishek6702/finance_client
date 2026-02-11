import React from 'react';
import { MoveUpRight, MoveDownRight } from 'lucide-react';

const StatCard = ({ title, value, trend, trendValue, isIncrease }) => {
  return (
    <div className="flex flex-col p-6 flex-1 border-r last:border-r-0 border-gray-100">
      <span className="text-gray-800 text-sm font-medium mb-4">{title}</span>
      <h2 className="text-3xl font-bold text-gray-900 mb-4">{value}</h2>
      
      <div className={`flex items-center text-[11px] font-semibold ${isIncrease ? 'text-emerald-500' : 'text-red-500'}`}>
        {isIncrease ? <MoveUpRight className="w-3 h-3 mr-1" /> : <MoveDownRight className="w-3 h-3 mr-1" />}
        <span>{trendValue}%</span>
        <span className="text-gray-400 font-normal ml-1">{trend}</span>
      </div>
    </div>
  );
};

export default StatCard;