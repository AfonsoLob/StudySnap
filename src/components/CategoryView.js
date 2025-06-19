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
  // Helper function to safely get category name
  const getCategoryName = (category) => {
    if (!category) return '';
    return typeof category === 'string' ? category : category.name;
  };

  const categoryName = getCategoryName(selectedCategory);
  
  // Filter flashcards for this category
  const categoryCards = flashcards.filter(card => card.category === categoryName);
  const stats = categoryStats[categoryName] || { totalCards: 0, mastery: 0, streak: 0 };
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
        <h1 className="page-title">{categoryName}</h1>
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
          categoryName={categoryName}
        />
      </div>
    </div>
  );
};

export default CategoryView; 