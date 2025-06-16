import React from 'react';
import FlashcardList from './FlashcardList';

const CategoryView = ({ 
  darkMode,
  selectedCategory,
  setSelectedCategory,
  flashcards,
  setCurrentView,
  deleteFlashcard,
  editCard,
  startStudying,
  showAIModal,
  setShowAIModal
}) => {
  // Filter flashcards for this category
  const categoryCards = flashcards.filter(card => card.category === selectedCategory);
  const totalCards = categoryCards.length;
  const mastery = Math.round((categoryCards.filter(card => card.mastery >= 4).length / totalCards) * 100) || 0;
  const streak = categoryCards.reduce((max, card) => Math.max(max, card.streak || 0), 0);

  return (
    <div>
      <button
        onClick={() => setCurrentView('home')}
        className="back-btn"
      >
        ← Back to Categories
      </button>
      <div className="page-header">
        <h1 className="page-title">{selectedCategory}</h1>
      </div>
      <div className="stats-bar">
        <div className="stat-item">
          <div className="stat-number">{totalCards}</div>
          <div className="stat-label">Total Cards</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">{mastery}%</div>
          <div className="stat-label">Mastery</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">{streak}</div>
          <div className="stat-label">Study Streak</div>
        </div>
      </div>
      <div className="section-container">
        <FlashcardList
          flashcards={categoryCards}
          darkMode={darkMode}
          onEdit={editCard}
          onDelete={deleteFlashcard}
          onCreate={() => setCurrentView('create')}
          onStudy={startStudying}
          onAI={() => setShowAIModal(true)}
          showAIModal={showAIModal}
          setShowAIModal={setShowAIModal}
          categoryName={selectedCategory}
        />
      </div>
    </div>
  );
};

export default CategoryView; 