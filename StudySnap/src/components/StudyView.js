// src/components/StudyView.js
import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import StudyCard from './StudyCard';
import StudyControls from './StudyControls';

const StudyView = ({ 
  darkMode, 
  flashcards, 
  currentCardIndex, 
  isFlipped, 
  nextCard, 
  prevCard, 
  flipCard, 
  setCurrentView 
}) => {
  if (flashcards.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-lg mb-4">No flashcards to study!</p>
        <button
          onClick={() => setCurrentView('home')}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Go Home
        </button>
      </div>
    );
  }

  const currentCard = flashcards[currentCardIndex];

  const handleDifficultyRating = (difficulty) => {
    // TODO: Implement spaced repetition logic
    console.log(`Rated card ${currentCard.id} as ${difficulty}`);
    nextCard();
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Study Header */}
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Study Session</h2>
        <div className={`px-3 py-1 rounded-full text-sm ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
          {currentCardIndex + 1} / {flashcards.length}
        </div>
      </div>

      {/* Study Card */}
      <StudyCard
        card={currentCard}
        isFlipped={isFlipped}
        onFlip={flipCard}
        darkMode={darkMode}
      />

      {/* Study Controls */}
      <StudyControls
        isFlipped={isFlipped}
        onPrevious={prevCard}
        onNext={nextCard}
        onFlip={flipCard}
        onDifficultyRating={handleDifficultyRating}
        onEndSession={() => setCurrentView('home')}
        darkMode={darkMode}
      />
    </div>
  );
};

export default StudyView;