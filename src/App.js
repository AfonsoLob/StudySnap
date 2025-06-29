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
import { generateFlashcards } from './utils/aiUtils';
import { calculateCategoryStreak } from './utils/studyUtils';
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
  getDoc,
  serverTimestamp
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
  const [studyProgress, setStudyProgress] = useState({});
  const [categoryStats, setCategoryStats] = useState({});
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  // Helper function to safely get category name
  const getCategoryName = (category) => {
    if (!category) return null;
    return typeof category === 'string' ? category : category.name;
  };

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
      setCategories(snap.docs.map(doc => {
        const data = doc.data();
        // Handle both old format (just name) and new format (name + createdAt)
        if (typeof data.name === 'string' && !data.createdAt) {
          // Old format - convert to new format with default createdAt
          return { 
            name: data.name, 
            createdAt: { seconds: Date.now() / 1000, nanoseconds: 0 }, // Default timestamp
            id: doc.id 
          };
        }
        // New format
        return { 
          name: data.name, 
          createdAt: data.createdAt, 
          id: doc.id 
        };
      }));
    });
    // Flashcards
    const cardRef = collection(db, 'users', user.uid, 'flashcards');
    const unsubCards = onSnapshot(cardRef, (snap) => {
      setFlashcards(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    // Study Progress
    const progressRef = collection(db, 'users', user.uid, 'studyProgress');
    const unsubProgress = onSnapshot(progressRef, (snap) => {
      const progress = {};
      snap.docs.forEach(doc => {
        progress[doc.id] = doc.data();
      });
      setStudyProgress(progress);
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
    return () => { unsubCat(); unsubCards(); unsubProgress(); };
  }, [user]);

  // Calculate category statistics when flashcards or study progress changes
  useEffect(() => {
    if (!flashcards.length) {
      setCategoryStats({});
      return;
    }

    const stats = {};
    categories.forEach(category => {
      const categoryName = getCategoryName(category);
      const categoryCards = flashcards.filter(card => card.category === categoryName);
      const totalCards = categoryCards.length;
      
      if (totalCards === 0) {
        stats[categoryName] = {
          totalCards: 0,
          mastery: 0,
          streak: 0,
          lastStudied: null
        };
        return;
      }

      // Calculate mastery based on study progress
      let totalMastery = 0;
      let lastStudied = null;

      categoryCards.forEach(card => {
        const progress = studyProgress[card.id];
        if (progress) {
          // Mastery is now already a percentage (0-100)
          totalMastery += progress.mastery || 0;
          
          if (progress.lastStudied && (!lastStudied || progress.lastStudied.toDate() > lastStudied.toDate())) {
            lastStudied = progress.lastStudied;
          }
        }
      });

      // Calculate average mastery (already in percentage)
      const averageMastery = totalCards > 0 ? totalMastery / totalCards : 0;
      const masteryPercentage = Math.round(averageMastery);
      
      // Calculate streak using utility function
      const maxStreak = calculateCategoryStreak(flashcards, studyProgress, categoryName);

      stats[categoryName] = {
        totalCards,
        mastery: masteryPercentage,
        streak: maxStreak,
        lastStudied
      };
    });

    setCategoryStats(stats);
  }, [flashcards, studyProgress, categories]);

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
    if (name && !categories.some(cat => cat.name === name)) {
      const catRef = collection(db, 'users', user.uid, 'categories');
      await addDoc(catRef, { name, createdAt: serverTimestamp() });
      showNotification('Category created successfully!', 'success');
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
    showNotification(`Category "${name}" deleted successfully!`, 'success');
  };

  // Add new flashcard (Firestore)
  const addFlashcard = async (front, back, category) => {
    if (front.trim() && back.trim()) {
      const card = {
        front: front.trim(),
        back: back.trim(),
        category: category || 'General'
      };
      const cardRef = collection(db, 'users', user.uid, 'flashcards');
      await addDoc(cardRef, card);
      setCurrentView(selectedCategory ? 'category' : 'home');
      showNotification('Flashcard created successfully!', 'success');
    }
  };

  // Update existing flashcard (Firestore)
  const updateFlashcard = async (updatedCard) => {
    const cardRef = doc(db, 'users', user.uid, 'flashcards', updatedCard.id);
    await setDoc(cardRef, updatedCard);
    setEditingCard(null);
    setCurrentView('home');
    showNotification('Flashcard updated successfully!', 'success');
  };

  // Delete flashcard (Firestore)
  const deleteFlashcard = async (id) => {
    const cardRef = doc(db, 'users', user.uid, 'flashcards', id);
    await deleteDoc(cardRef);
    showNotification('Flashcard deleted successfully!', 'success');
  };

  // Start studying (by category)
  const startStudying = async () => {
    const categoryName = getCategoryName(selectedCategory);
    const cards = flashcards.filter(card => card.category === categoryName);
    if (cards.length > 0) {
      // Track study session start for streak purposes
      if (user) {
        const sessionRef = doc(db, 'users', user.uid, 'studySessions', categoryName);
        await setDoc(sessionRef, {
          lastSessionStart: serverTimestamp(),
          category: categoryName
        }, { merge: true });
      }
      
      setCurrentCardIndex(0);
      setIsFlipped(false);
      setCurrentView('study');
    }
  };

  // Navigation functions
  const nextCard = () => {
    const categoryName = getCategoryName(selectedCategory);
    const cards = flashcards.filter(card => card.category === categoryName);
    setCurrentCardIndex((prev) => (prev + 1) % cards.length);
    setIsFlipped(false);
  };

  const prevCard = () => {
    const categoryName = getCategoryName(selectedCategory);
    const cards = flashcards.filter(card => card.category === categoryName);
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
    showNotification('API key saved successfully!', 'success');
  };

  // Handle difficulty rating and update study progress
  const handleDifficultyRating = async (cardId, rating) => {
    if (!user) return;
    
    const progressRef = doc(db, 'users', user.uid, 'studyProgress', cardId);
    const progressSnap = await getDoc(progressRef);
    
    let currentProgress = {
      mastery: 0,
      streak: 0,
      totalReviews: 0,
      lastStudied: serverTimestamp(),
      lastStudyDate: null
    };
    
    if (progressSnap.exists()) {
      currentProgress = progressSnap.data();
    }
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // New mastery calculation based on rating percentages
    // Base percentages: 1=20%, 2=40%, 3=60%, 4=80%, 5=100%
    const basePercentages = { 1: 20, 2: 40, 3: 60, 4: 80, 5: 100 };
    const caps = { 1: 30, 2: 50, 3: 70, 4: 90, 5: 100 };
    
    const basePercentage = basePercentages[rating];
    const cap = caps[rating];
    
    let newMastery;
    if (currentProgress.totalReviews === 0) {
      // First rating
      newMastery = basePercentage;
    } else {
      
      // Count how many times this rating was given before
      const previousRatings = currentProgress.ratingHistory || [];
      const sameRatingCount = previousRatings.filter(r => r === rating).length;
      
      // Calculate new mastery: base + (count * 2), but capped
      newMastery = Math.min(cap, basePercentage + (sameRatingCount * 2));
    }
    
    // Update streak logic
    let newStreak = currentProgress.streak;
    const lastStudyDate = currentProgress.lastStudyDate ? 
      new Date(currentProgress.lastStudyDate.seconds * 1000) : null;
    
    if (lastStudyDate) {
      const lastStudyDay = new Date(lastStudyDate.getFullYear(), lastStudyDate.getMonth(), lastStudyDate.getDate());
      const daysDiff = Math.floor((today - lastStudyDay) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === 0) {
        // Already studied today, don't increment streak
        newStreak = currentProgress.streak;
      } else if (daysDiff === 1) {
        // Studied yesterday, increment streak
        newStreak = currentProgress.streak + 1;
      } else if (daysDiff > 3) {
        // More than 3 days gap, reset streak
        newStreak = 1;
      } else {
        // 2-3 days gap, keep current streak
        newStreak = currentProgress.streak;
      }
    } else {
      // First time studying, start streak
      newStreak = 1;
    }
    
    // Update progress in Firestore
    await setDoc(progressRef, {
      ...currentProgress,
      mastery: newMastery,
      streak: newStreak,
      totalReviews: currentProgress.totalReviews + 1,
      lastStudied: serverTimestamp(),
      lastStudyDate: serverTimestamp(),
      ratingHistory: [...(currentProgress.ratingHistory || []), rating]
    });
  };

  // AI flashcard generation handler
  const handleAIGenerate = async () => {
    setAILoading(true);
    setAIError('');
    setAISuccess('');
    try {
      const input = aiFile || aiText;
      const categoryName = getCategoryName(selectedCategory);
      const cards = await generateFlashcards(input, apiKey, categoryName);
      // Add flashcards to Firestore
      const cardRef = collection(db, 'users', user.uid, 'flashcards');
      for (const card of cards) {
        await addDoc(cardRef, card);
      }
      setAISuccess(`Created ${cards.length} flashcards!`);
      setShowAIModal(false);
      setAIText('');
      setAIFile(null);
      showNotification(`Successfully created ${cards.length} flashcards!`, 'success');
    } catch (err) {
      setAIError(err.message);
      showNotification(`AI generation failed: ${err.message}`, 'error');
    } finally {
      setAILoading(false);
    }
  };

  // Helper function to show notifications
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 3000);
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
    setShowAIModal,
    categoryStats,
    studyProgress
  };

  const studyProps = {
    ...commonProps,
    flashcards: flashcards.filter(card => card.category === getCategoryName(selectedCategory)),
    currentCardIndex,
    isFlipped,
    nextCard,
    prevCard,
    flipCard,
    setCurrentView,
    handleDifficultyRating
  };

  const createProps = {
    darkMode,
    newCard,
    setNewCard,
    addFlashcard,
    setCurrentView,
    categories,
    selectedCategory: getCategoryName(selectedCategory),
    onBack: () => setCurrentView(selectedCategory ? 'category' : 'home')
  };

  const editProps = {
    darkMode,
    editingCard,
    setEditingCard,
    updateFlashcard,
    setCurrentView,
    categories
  };

  return (
    <>
      {notification.show && (
        <div className="notification-container">
          <div className={`notification px-6 py-3 rounded-xl shadow-lg font-semibold text-base animate-fadeIn ${
            notification.type === 'success' 
              ? 'bg-green-500/90 text-white' 
              : notification.type === 'error'
              ? 'bg-red-500/90 text-white'
              : 'bg-blue-500/90 text-white'
          }`}>
            {notification.message}
          </div>
        </div>
      )}
      <div
        className={`app-bg min-h-screen flex flex-col transition-colors duration-300 `}
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
          <div className="fixed inset-0 z-50 bg-black bg-opacity-60 backdrop-blur-sm" style={{ pointerEvents: 'auto' }}>
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
          {currentView === 'home' && <HomeView {...commonProps} addCategory={addCategory} />}
          {currentView === 'category' && selectedCategory && (
            <CategoryView {...commonProps} selectedCategory={selectedCategory} />
          )}
          {currentView === 'create' && <CreateView {...createProps} />}
          {currentView === 'study' && <StudyView {...studyProps} />}
          {currentView === 'edit' && <EditView {...editProps} />}
        </main>
      </div>
    </>
  );
};

export default App;