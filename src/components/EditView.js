// src/components/EditView.js
import React, { useState, useEffect } from 'react';
import CardForm from './CardForm';

const EditView = ({ darkMode, editingCard, setEditingCard, updateFlashcard, setCurrentView, categories }) => {
  const [card, setCard] = useState({ front: '', back: '', category: '' });

  useEffect(() => {
    if (editingCard) {
      setCard({
        front: editingCard.front,
        back: editingCard.back,
        category: editingCard.category
      });
    }
  }, [editingCard]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (card.front.trim() && card.back.trim()) {
      updateFlashcard({
        ...editingCard,
        front: card.front.trim(),
        back: card.back.trim(),
        category: card.category.trim() || 'General'
      });
    }
  };

  const handleCancel = () => {
    setEditingCard(null);
    setCurrentView('home');
  };

  if (!editingCard) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <CardForm
        title="Edit Flashcard"
        card={card}
        setCard={setCard}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        submitText="Update Card"
        darkMode={darkMode}
        categories={categories}
        selectedCategory={card.category}
      />
    </div>
  );
};

export default EditView;