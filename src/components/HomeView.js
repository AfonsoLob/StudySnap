// src/components/HomeView.js
import React, { useRef, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { formatTimeAgo } from '../utils/studyUtils';

const HomeView = ({ 
  darkMode, 
  categories,
  setSelectedCategory,
  flashcards, 
  setCurrentView, 
  addCategory,
  deleteCategory,
  categoryStats
}) => {
  const [showCategoryForm, setShowCategoryForm] = React.useState(false);
  const [newCategory, setNewCategory] = React.useState('');
  const inputRef = useRef(null);

  // Auto-focus input when form is shown
  useEffect(() => {
    if (showCategoryForm && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showCategoryForm]);

  // Sort categories by createdAt (oldest first)
  const sortedCategories = [...categories].sort((a, b) => {
    // Handle cases where createdAt might be null/undefined
    if (!a.createdAt && !b.createdAt) return 0;
    if (!a.createdAt) return 1; // Put items without createdAt at the end
    if (!b.createdAt) return -1;
    
    // Convert to comparable values
    const aTime = a.createdAt.seconds || a.createdAt;
    const bTime = b.createdAt.seconds || b.createdAt;
    
    return aTime - bTime;
  });

  return (
    <div className="space-y-6">
      <div className="section-header">
        <h2>Your Study Categories</h2>
        <p className="section-subtitle">Master your subjects with organized flashcard collections</p>
      </div>
      <div className="flex justify-end items-center mb-6">
        <button
          onClick={() => setShowCategoryForm(true)}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium"
        >
          + Create Category
        </button>
      </div>
      {showCategoryForm && (
        <form
          onSubmit={e => { e.preventDefault(); addCategory(newCategory); setNewCategory(''); setShowCategoryForm(false); }}
          className="mb-4 flex space-x-2"
        >
          <input
            ref={inputRef}
            type="text"
            value={newCategory}
            onChange={e => setNewCategory(e.target.value)}
            placeholder="Category name"
            className={`px-3 py-2 ${darkMode ? 'bg-gray-700' : 'bg-white'} rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            required
          />
          <button type="submit" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium">Add</button>
          <button type="button" onClick={() => setShowCategoryForm(false)} className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg font-medium">Cancel</button>
        </form>
      )}
      <div className="categories-grid">
        {sortedCategories.map(cat => (
          <div
            key={cat.id || cat.name}
            className="category-card"
            onClick={() => {
              setSelectedCategory(cat);
              setCurrentView('category');
            }}
          >
            <button
              className="delete-btn"
              title="Delete category"
              onClick={e => { e.stopPropagation(); if(window.confirm(`Delete category '${cat.name}' and all its cards?`)) deleteCategory(cat.name); }}
            >
              ×
            </button>
            <h3 className="category-title">{cat.name}</h3>
            <div className="category-meta">
              {categoryStats[cat.name]?.totalCards || 0} cards • {formatTimeAgo(categoryStats[cat.name]?.lastStudied)}
            </div>
            <div className="category-stats">
              <div className="stat-item">
                <div className="stat-number">{categoryStats[cat.name]?.mastery || 0}%</div>
                <div className="stat-label">Mastery</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">{categoryStats[cat.name]?.streak || 0}</div>
                <div className="stat-label">Streak</div>
              </div>
            </div>
            <svg className="progress-ring" viewBox="0 0 50 50">
              <circle
                className="progress-ring-circle"
                cx="25"
                cy="25"
                r="20"
                strokeWidth="3"
                fill="none"
                stroke="rgba(255,255,255,0.2)"
              />
              <circle
                className="progress-ring-progress"
                cx="25"
                cy="25"
                r="20"
                strokeWidth="3"
                fill="none"
                stroke="#4ecdc4"
                strokeDasharray={2 * Math.PI * 20}
                strokeDashoffset={2 * Math.PI * 20 * (1 - (categoryStats[cat.name]?.mastery || 0) / 100)}
                style={{ transition: 'stroke-dashoffset 0.3s' }}
              />
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeView;