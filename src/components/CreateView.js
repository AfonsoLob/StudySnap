// src/components/CreateView.js
import React from 'react';
import CardForm from './CardForm';

const CreateView = ({ darkMode, newCard, setNewCard, addFlashcard, setCurrentView, categories, selectedCategory }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    addFlashcard();
  };

  const handleCancel = () => {
    setNewCard({ front: '', back: '', category: '' });
    setCurrentView(selectedCategory ? 'category' : 'home');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <CardForm
        title="Create New Flashcard"
        card={newCard}
        setCard={setNewCard}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        submitText="Create Card"
        darkMode={darkMode}
        categories={categories}
        selectedCategory={selectedCategory}
      />
    </div>
  );
};

export default CreateView;