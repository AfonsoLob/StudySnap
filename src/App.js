// src/App.js
import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import HomeView from './components/HomeView';
import CreateView from './components/CreateView';
import StudyView from './components/StudyView';
import EditView from './components/EditView';
import CategoryView from './components/CategoryView';
import AIModal from './components/AIModal';
import { auth, db } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import AuthForm from './components/AuthForm';
import { extractTextFromPDF, generateFlashcards } from './utils/aiUtils';
import './styles/base.css';
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
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiText, setAIText] = useState('');
  const [aiFile, setAIFile] = useState(null);
  const [aiLoading, setAILoading] = useState(false);
  const [aiError, setAIError] = useState('');
  const [aiSuccess, setAISuccess] = useState('');
  const [modalTop, setModalTop] = useState(0);
  const settingsModalRef = useRef(null);

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

  // Calculate modal top position based on scroll and window height
  const updateModalPosition = () => {
    if (settingsModalRef.current) {
      const modalHeight = settingsModalRef.current.offsetHeight;
      const top = window.scrollY + (window.innerHeight / 2) - (modalHeight / 2);
      setModalTop(Math.max(top, 24)); // Prevent it from going off the top
    }
  };

  useEffect(() => {
    if (showSettings) {
      updateModalPosition();
      window.addEventListener('scroll', updateModalPosition);
      window.addEventListener('resize', updateModalPosition);
    }
    return () => {
      window.removeEventListener('scroll', updateModalPosition);
      window.removeEventListener('resize', updateModalPosition);
    };
  }, [showSettings]);

  // Prevent background scroll when settings modal is open
  useEffect(() => {
    if (showSettings) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showSettings]);

  // Close modal on click outside
  useEffect(() => {
    if (!showSettings) return;
    function handleClick(e) {
      if (settingsModalRef.current && !settingsModalRef.current.contains(e.target)) {
        setShowSettings(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showSettings]);

  if (!user) {
    return <AuthForm user={user} />;
  }

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.setAttribute('data-theme', !darkMode ? 'dark' : 'light');
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

  // AI flashcard generation handler
  const handleAIGenerate = async () => {
    setAILoading(true);
    setAIError('');
    setAISuccess('');
    try {
      const input = aiFile || aiText;
      const cards = await generateFlashcards(input, apiKey, selectedCategory);
      
      // Add flashcards to Firestore
      const cardRef = collection(db, 'users', user.uid, 'flashcards');
      for (const card of cards) {
        await addDoc(cardRef, card);
      }
      
      setAISuccess(`Created ${cards.length} flashcards!`);
      setShowAIModal(false);
      setAIText('');
      setAIFile(null);
    } catch (err) {
      setAIError(err.message);
    } finally {
      setAILoading(false);
    }
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
    user,
    showAIModal,
    setShowAIModal
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
    <div
      className={`app-bg min-h-screen transition-colors duration-300 `}
      style={{
        // Ensure glassmorphism effect overlays the gradient
        backgroundColor: darkMode
          ? 'rgba(31,41,55,0.7)'
          : 'rgba(255,255,255,0.7)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
      data-theme={darkMode ? 'dark' : undefined}
    >
      <Header 
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        setCurrentView={setCurrentView}
        user={user}
        onShowSettings={() => setShowSettings(true)}
      />

      {showSettings && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 backdrop-blur-sm" style={{ pointerEvents: 'auto' }}>
          <div
            ref={settingsModalRef}
            className="glass-list p-8 max-w-md w-full absolute left-1/2 flex flex-col items-center justify-center"
            style={{
              top: modalTop,
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          >
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-2xl transition-colors"
              onClick={() => setShowSettings(false)}
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-4">AI API Key</h2>
            <input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full p-2 mb-4 rounded-md border border-gray-300 dark:border-gray-600 bg-transparent"
              placeholder="Enter your API key"
            />
            <button
              onClick={() => {
                saveApiKey(apiKey);
                setShowSettings(false);
              }}
              className="btn btn-primary w-full"
            >
              Save
            </button>
          </div>
        </div>
      )}

      <AIModal
        showAIModal={showAIModal}
        setShowAIModal={setShowAIModal}
        aiText={aiText}
        setAIText={setAIText}
        aiFile={aiFile}
        setAIFile={setAIFile}
        aiLoading={aiLoading}
        aiError={aiError}
        aiSuccess={aiSuccess}
        handleAIGenerate={handleAIGenerate}
      />

      <main className="container mx-auto px-4 py-8">
        {currentView === 'home' && <HomeView {...commonProps} />}
        {currentView === 'category' && selectedCategory && (
          <CategoryView {...commonProps} selectedCategory={selectedCategory} />
        )}
        {currentView === 'create' && <CreateView {...createProps} />}
        {currentView === 'study' && <StudyView {...studyProps} />}
        {currentView === 'edit' && <EditView {...editProps} />}
      </main>
    </div>
  );
};

export default App;