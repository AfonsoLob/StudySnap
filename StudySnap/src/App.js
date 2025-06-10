// src/App.js
import React, { useState } from 'react';
import Header from './components/Header';
import HomeView from './components/HomeView';
import CreateView from './components/CreateView';
import StudyView from './components/StudyView';
import EditView from './components/EditView';

const App = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [currentView, setCurrentView] = useState('home'); // 'home', 'create', 'study', 'edit'
  const [flashcards, setFlashcards] = useState([
    { id: 1, front: 'What is React?', back: 'A JavaScript library for building user interfaces', category: 'Programming' },
    { id: 2, front: 'What does CSS stand for?', back: 'Cascading Style Sheets', category: 'Web Development' },
    { id: 3, front: 'What is the capital of France?', back: 'Paris', category: 'Geography' }
  ]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [newCard, setNewCard] = useState({ front: '', back: '', category: '' });

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Add new flashcard
  const addFlashcard = () => {
    if (newCard.front.trim() && newCard.back.trim()) {
      const card = {
        id: Date.now(),
        front: newCard.front.trim(),
        back: newCard.back.trim(),
        category: newCard.category.trim() || 'General'
      };
      setFlashcards([...flashcards, card]);
      setNewCard({ front: '', back: '', category: '' });
      setCurrentView('home');
    }
  };

  // Update existing flashcard
  const updateFlashcard = (updatedCard) => {
    setFlashcards(flashcards.map(card => 
      card.id === updatedCard.id ? updatedCard : card
    ));
    setEditingCard(null);
    setCurrentView('home');
  };

  // Delete flashcard
  const deleteFlashcard = (id) => {
    setFlashcards(flashcards.filter(card => card.id !== id));
  };

  // Start studying
  const startStudying = () => {
    if (flashcards.length > 0) {
      setCurrentCardIndex(0);
      setIsFlipped(false);
      setCurrentView('study');
    }
  };

  // Navigation functions
  const nextCard = () => {
    setCurrentCardIndex((prev) => (prev + 1) % flashcards.length);
    setIsFlipped(false);
  };

  const prevCard = () => {
    setCurrentCardIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
    setIsFlipped(false);
  };

  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };

  // Edit card
  const editCard = (card) => {
    setEditingCard(card);
    setCurrentView('edit');
  };

  // Common props to pass down
  const commonProps = {
    darkMode,
    flashcards,
    setCurrentView,
    deleteFlashcard,
    editCard,
    startStudying
  };

  const studyProps = {
    ...commonProps,
    currentCardIndex,
    isFlipped,
    nextCard,
    prevCard,
    flipCard,
    setCurrentView
  };

  const createProps = {
    darkMode,
    newCard,
    setNewCard,
    addFlashcard,
    setCurrentView
  };

  const editProps = {
    darkMode,
    editingCard,
    setEditingCard,
    updateFlashcard,
    setCurrentView
  };

  const themeClasses = darkMode 
    ? 'bg-gray-800 text-gray-100' 
    : 'bg-gray-50 text-gray-900';

  return (
    <div className={`min-h-screen transition-colors ${themeClasses}`}>
      <Header 
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        setCurrentView={setCurrentView}
      />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {currentView === 'home' && <HomeView {...commonProps} />}
        {currentView === 'create' && <CreateView {...createProps} />}
        {currentView === 'study' && <StudyView {...studyProps} />}
        {currentView === 'edit' && <EditView {...editProps} />}
      </main>
    </div>
  );
};

export default App;