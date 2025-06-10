// src/components/Header.js
import React from 'react';
import { BookOpen, Sun, Moon } from 'lucide-react';

const Header = ({ darkMode, toggleDarkMode, setCurrentView }) => {
  const cardBgClasses = darkMode ? 'bg-gray-700' : 'bg-white';

  return (
    <header className={`${cardBgClasses} border-b ${darkMode ? 'border-gray-600' : 'border-gray-200'} shadow-sm`}>
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div 
            onClick={() => setCurrentView('home')}
            className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold">StudySnap</h1>
          </div>
          
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'}`}
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;