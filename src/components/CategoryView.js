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
  setShowAIModal,
  categoryStats
}) => {
  // Filter flashcards for this category
  const categoryCards = flashcards.filter(card => card.category === selectedCategory);
  const stats = categoryStats[selectedCategory] || { totalCards: 0, mastery: 0, streak: 0 };
  const { totalCards, mastery, streak } = stats;

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