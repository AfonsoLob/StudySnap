// src/App.js
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HomeView from './components/HomeView';
import CreateView from './components/CreateView';
import StudyView from './components/StudyView';
import EditView from './components/EditView';
import { auth, db } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import AuthForm from './components/AuthForm';
import {
  collection,
  addDoc,
  setDoc,
  getDocs,
  doc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  getDoc
} from 'firebase/firestore';

const App = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [currentView, setCurrentView] = useState('home'); // 'home', 'create', 'study', 'edit'
  const [categories, setCategories] = useState([]);
  const [flashcards, setFlashcards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [newCard, setNewCard] = useState({ front: '', back: '', category: '' });
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [user, setUser] = useState(null);
  const [apiKey, setApiKey] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  // Load categories, flashcards, and API key from Firestore when user logs in
  useEffect(() => {
    if (!user) return;
    // Categories
    const catRef = collection(db, 'users', user.uid, 'categories');
    const unsubCat = onSnapshot(catRef, (snap) => {
      setCategories(snap.docs.map(doc => doc.data().name));
    });
    // Flashcards
    const cardRef = collection(db, 'users', user.uid, 'flashcards');
    const unsubCards = onSnapshot(cardRef, (snap) => {
      setFlashcards(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    // API Key
    const fetchApiKey = async () => {
      const settingsRef = doc(db, 'users', user.uid, 'settings', 'ai');
      const snap = await getDoc(settingsRef);
      if (snap.exists()) {
        setApiKey(snap.data().apiKey || '');
      } else {
        setApiKey('');
      }
    };
    fetchApiKey();
    return () => { unsubCat(); unsubCards(); };
  }, [user]);

  if (!user) {
    return <AuthForm user={user} />;
  }

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Add new category (Firestore)
  const addCategory = async (name) => {
    if (name && !categories.includes(name)) {
      const catRef = collection(db, 'users', user.uid, 'categories');
      await addDoc(catRef, { name });
    }
  };

  // Delete a category and its cards (Firestore)
  const deleteCategory = async (name) => {
    // Delete category doc
    const catRef = collection(db, 'users', user.uid, 'categories');
    const q = query(catRef, where('name', '==', name));
    const snap = await getDocs(q);
    snap.forEach(async (docu) => {
      await deleteDoc(doc(db, 'users', user.uid, 'categories', docu.id));
    });
    // Delete all flashcards in this category
    const cardRef = collection(db, 'users', user.uid, 'flashcards');
    const q2 = query(cardRef, where('category', '==', name));
    const snap2 = await getDocs(q2);
    snap2.forEach(async (docu) => {
      await deleteDoc(doc(db, 'users', user.uid, 'flashcards', docu.id));
    });
    setSelectedCategory(null);
    setCurrentView('home');
  };

  // Add new flashcard (Firestore)
  const addFlashcard = async () => {
    if (newCard.front.trim() && newCard.back.trim()) {
      const card = {
        front: newCard.front.trim(),
        back: newCard.back.trim(),
        category: selectedCategory || newCard.category.trim() || 'General'
      };
      const cardRef = collection(db, 'users', user.uid, 'flashcards');
      await addDoc(cardRef, card);
      setNewCard({ front: '', back: '', category: '' });
      setCurrentView('category');
    }
  };

  // Update existing flashcard (Firestore)
  const updateFlashcard = async (updatedCard) => {
    const cardRef = doc(db, 'users', user.uid, 'flashcards', updatedCard.id);
    await setDoc(cardRef, updatedCard);
    setEditingCard(null);
    setCurrentView('home');
  };

  // Delete flashcard (Firestore)
  const deleteFlashcard = async (id) => {
    const cardRef = doc(db, 'users', user.uid, 'flashcards', id);
    await deleteDoc(cardRef);
  };

  // Start studying (by category)
  const startStudying = () => {
    const cards = flashcards.filter(card => card.category === selectedCategory);
    if (cards.length > 0) {
      setCurrentCardIndex(0);
      setIsFlipped(false);
      setCurrentView('study');
    }
  };

  // Navigation functions
  const nextCard = () => {
    const cards = flashcards.filter(card => card.category === selectedCategory);
    setCurrentCardIndex((prev) => (prev + 1) % cards.length);
    setIsFlipped(false);
  };

  const prevCard = () => {
    const cards = flashcards.filter(card => card.category === selectedCategory);
    setCurrentCardIndex((prev) => (prev - 1 + cards.length) % cards.length);
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

  // Save API key to Firestore
  const saveApiKey = async (key) => {
    if (!user) return;
    const settingsRef = doc(db, 'users', user.uid, 'settings', 'ai');
    await setDoc(settingsRef, { apiKey: key });
    setApiKey(key);
  };

  // Common props to pass down
  const commonProps = {
    darkMode,
    categories,
    selectedCategory,
    setSelectedCategory,
    flashcards,
    setCurrentView,
    deleteFlashcard,
    editCard,
    startStudying,
    addCategory,
    deleteCategory,
    apiKey,
    user
  };

  const studyProps = {
    ...commonProps,
    flashcards: flashcards.filter(card => card.category === selectedCategory),
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
    setCurrentView,
    categories,
    selectedCategory
  };

  const editProps = {
    darkMode,
    editingCard,
    setEditingCard,
    updateFlashcard,
    setCurrentView,
    categories
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
        user={user}
        onShowSettings={() => setShowSettings(true)}
      />

      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg max-w-md w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-2xl"
              onClick={() => setShowSettings(false)}
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-4">AI API Key</h2>
            <input
              type="text"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              placeholder="Paste your AI API key here"
              className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
            />
            <button
              className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium transition-colors"
              onClick={() => { saveApiKey(apiKey); setShowSettings(false); }}
            >
              Save API Key
            </button>
          </div>
        </div>
      )}

      <main className="max-w-6xl mx-auto px-4 py-8">
        {currentView === 'home' && <HomeView {...commonProps} />}
        {currentView === 'category' && selectedCategory && (
          <HomeView {...commonProps} selectedCategory={selectedCategory} />
        )}
        {currentView === 'create' && <CreateView {...createProps} />}
        {currentView === 'study' && <StudyView {...studyProps} />}
        {currentView === 'edit' && <EditView {...editProps} />}
      </main>
    </div>
  );
};

export default App;