// src/components/StatsCard.js
import React from 'react';

const StatsCard = ({ icon: Icon, value, label, color, darkMode }) => {
  const cardBgClasses = darkMode ? 'bg-gray-700' : 'bg-white';
  
  return (
    <div className={`${cardBgClasses} p-6 rounded-xl border ${darkMode ? 'border-gray-600' : 'border-gray-200'} shadow-sm hover:shadow-md transition-shadow`}>
      <div className="flex items-center space-x-3">
        <Icon className={`w-8 h-8 ${color}`} />
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{label}</p>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;