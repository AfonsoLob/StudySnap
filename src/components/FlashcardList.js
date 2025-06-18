// src/components/FlashcardList.js
import React from 'react';
import { BookOpen, Edit3, Trash2 } from 'lucide-react';

const FlashcardList = ({
  flashcards,
  darkMode,
  onEdit,
  onDelete,
  onCreate,
  onStudy,
  onAI
}) => {
  const cardBgClasses = darkMode ? 'bg-gray-700' : 'bg-white';

  return (
    <div className={`glass-list rounded-2xl shadow-lg`}>
      <div className="p-6 border-b border-gray-200 dark:border-gray-600">
        <div className="section-title-row">
          <h2 className="section-title">Your Flashcards</h2>
          <div className="section-actions">
            <button
              onClick={onCreate}
              className="btn btn-primary outline outline-1 outline-white/30"
            >
              + Create Card
            </button>
            <button
              onClick={onStudy}
              disabled={flashcards.length === 0}
              className="btn btn-study"
            >
              Start Studying
            </button>
            <button
              onClick={onAI}
              className="btn btn-accent"
            >
              ✨ AI
            </button>
          </div>
        </div>
      </div>
      <div className="p-6">
        {flashcards.length === 0 ? (
          <div className="text-center py-8">
            <BookOpen className={`w-16 h-16 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
            <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>No flashcards yet</p>
            <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Create your first flashcard to get started!</p>
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
};

const FlashcardItem = ({ card, darkMode, onEdit, onDelete }) => {
  return (
    <div className={`glass-list hover:translate-y-[-1px] p-4 rounded-xl shadow-md hover:shadow-xl transition-shadow`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <p className="font-medium mb-1">{card.front}</p>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{card.category}</p>
        </div>
        <div className="flex space-x-2 ml-4">
          <button
            onClick={onEdit}
            className={`p-2 text-gray-500 hover:text-indigo-500 transition-colors rounded-lg ${darkMode ? "hover:bg-gray-600" : "hover:bg-gray-100"}`}
            title="Edit card"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className={`p-2 text-gray-500 hover:text-indigo-500 transition-colors rounded-lg ${darkMode ? "hover:bg-gray-600" : "hover:bg-gray-100"}`}
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