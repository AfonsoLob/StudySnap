// src/components/FlashcardList.js
import React from 'react';
import { BookOpen, Edit3, Trash2 } from 'lucide-react';

const FlashcardList = ({ flashcards, darkMode, onEdit, onDelete }) => {
  const cardBgClasses = darkMode ? 'bg-gray-700' : 'bg-white';

  if (flashcards.length === 0) {
    return (
      <div className={`${cardBgClasses} rounded-xl border ${darkMode ? 'border-gray-600' : 'border-gray-200'} shadow-sm`}>
        <div className="p-6 border-b border-gray-200 dark:border-gray-600">
          <h2 className="text-xl font-semibold">Your Flashcards</h2>
        </div>
        
        <div className="p-6">
          <div className="text-center py-8">
            <BookOpen className={`w-16 h-16 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
            <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>No flashcards yet</p>
            <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Create your first flashcard to get started!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${cardBgClasses} rounded-xl border ${darkMode ? 'border-gray-600' : 'border-gray-200'} shadow-sm`}>
      <div className="p-6 border-b border-gray-200 dark:border-gray-600">
        <h2 className="text-xl font-semibold">Your Flashcards</h2>
      </div>
      
      <div className="p-6">
        <div className="space-y-3">
          {flashcards.map((card) => (
            <FlashcardItem
              key={card.id}
              card={card}
              darkMode={darkMode}
              onEdit={() => onEdit(card)}
              onDelete={() => onDelete(card.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const FlashcardItem = ({ card, darkMode, onEdit, onDelete }) => {
  return (
    <div className={`p-4 rounded-lg border ${darkMode ? 'border-gray-600 bg-gray-800' : 'border-gray-200 bg-gray-50'} hover:shadow-sm transition-shadow`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <p className="font-medium mb-1">{card.front}</p>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{card.category}</p>
        </div>
        <div className="flex space-x-2 ml-4">
          <button
            onClick={onEdit}
            className="p-2 text-gray-500 hover:text-indigo-500 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600"
            title="Edit card"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-gray-500 hover:text-red-500 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600"
            title="Delete card"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlashcardList;