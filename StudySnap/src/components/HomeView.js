// src/components/HomeView.js
import React from 'react';
import { Plus, BookOpen, CheckCircle, RotateCcw } from 'lucide-react';
import StatsCard from './StatsCard';
import FlashcardList from './FlashcardList';

const HomeView = ({ 
  darkMode, 
  flashcards, 
  setCurrentView, 
  deleteFlashcard, 
  editCard, 
  startStudying 
}) => {
  const cardBgClasses = darkMode ? 'bg-gray-700' : 'bg-white';

  // Calculate stats
  const totalCards = flashcards.length;
  const masteredCards = 0; // TODO: Implement mastery tracking
  const toReviewCards = flashcards.length; // TODO: Implement review tracking

  const stats = [
    {
      icon: BookOpen,
      value: totalCards,
      label: 'Total Cards',
      color: 'text-indigo-500'
    },
    {
      icon: CheckCircle,
      value: masteredCards,
      label: 'Mastered',
      color: 'text-green-500'
    },
    {
      icon: RotateCcw,
      value: toReviewCards,
      label: 'To Review',
      color: 'text-sky-500'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <StatsCard
            key={index}
            icon={stat.icon}
            value={stat.value}
            label={stat.label}
            color={stat.color}
            darkMode={darkMode}
          />
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => setCurrentView('create')}
          className="flex items-center justify-center space-x-2 bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Create New Card</span>
        </button>
        
        <button
          onClick={startStudying}
          disabled={flashcards.length === 0}
          className="flex items-center justify-center space-x-2 bg-sky-500 hover:bg-sky-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-medium transition-colors"
        >
          <BookOpen className="w-5 h-5" />
          <span>Start Studying</span>
        </button>
      </div>

      {/* Flashcards List */}
      <FlashcardList
        flashcards={flashcards}
        darkMode={darkMode}
        onEdit={editCard}
        onDelete={deleteFlashcard}
      />
    </div>
  );
};

export default HomeView;