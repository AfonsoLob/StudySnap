// src/components/StudyView.js
import React from 'react';
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
  setCurrentView,
  handleDifficultyRating,
  studyProgress
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

  const onDifficultyRating = async (difficulty) => {
    if (currentCard && handleDifficultyRating) {
      await handleDifficultyRating(currentCard.id, difficulty);
    }
    nextCard();
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Study Header */}
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Study Session</h2>
        <button
          onClick={() => setCurrentView('home')}
          className="btn btn-end"
        >
          End Session
        </button>
      </div>

      {/* Study Card */}
      <StudyCard
        card={currentCard}
        isFlipped={isFlipped}
        onFlip={flipCard}
        darkMode={darkMode}
        pageNumber={currentCardIndex + 1}
        totalPages={flashcards.length}
        studyProgress={studyProgress}
      />

      {/* Study Controls */}
      <StudyControls
        isFlipped={isFlipped}
        onPrevious={prevCard}
        onNext={nextCard}
        onFlip={flipCard}
        onDifficultyRating={onDifficultyRating}
        darkMode={darkMode}
      />
    </div>
  );
};

export default StudyView;