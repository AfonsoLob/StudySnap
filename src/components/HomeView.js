// src/components/HomeView.js
import React, { useRef, useEffect } from 'react';
import { formatTimeAgo } from '../utils/studyUtils';

const HomeView = ({ 
  darkMode,
  categories,
  setSelectedCategory,
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
      <div className="header text-center py-10">
        <h2 className="text-4xl font-bold mb-2 text-white">Your Study Categories</h2>
        <p className="text-lg text-white/80 font-normal">Master your subjects with organized flashcard collections</p>
      </div>
      <div className="flex px-3 justify-center mb-8 items-start">
        {!showCategoryForm && (
          <button
            onClick={() => setShowCategoryForm(true)}
            className="btn flex items-center bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-emerald-500 hover:to-green-600 border-2 border-white/20 backdrop-blur-lg rounded-2xl font-semibold text-base transition-all hover:bg-white/20 hover:border-white/30 ml-auto"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"></path>
            </svg>
            Create Category
          </button>
        )}
        {showCategoryForm && (
          <form
            onSubmit={e => {
              e.preventDefault();
              addCategory(newCategory);
              setNewCategory('');
              setShowCategoryForm(false);
            }}
            className="category-form active bg-white/10 backdrop-blur-2xl border-2 border-white/20 rounded-2xl p-2 max-w-3xl w-full animate-fadeIn"
            style={{ animation: 'fadeIn 0.3s' }}
          >
            <div
              className="
                form-content
                w-full
                flex-col
                sm:flex-row
                flex
                gap-3
                sm:w-[100%]
                mx-auto
              "
            >
              <input
                ref={inputRef}
                type="text"
                value={newCategory}
                onChange={e => setNewCategory(e.target.value)}
                placeholder="Enter category name..."
                maxLength={50}
                className="form-input flex py-2 px-5 bg-white/10 border-2 border-white/20 rounded-xl text-white text-base placeholder-white/60 focus:outline-none focus:border-white/40 focus:bg-white/20 focus:shadow-lg transition-all w-full"
                required
                onKeyDown={e => { if (e.key === 'Escape') { setShowCategoryForm(false); setNewCategory(''); } }}
              />
              {/* Desktop/tablet: buttons inline, mobile: buttons below input */}
              <div className="flex flex-row gap-3 sm:flex-row w-full sm:w-auto">
                <button
                  type="submit"
                  className="btn btn-add py-3 px-5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold shadow-md transition-all hover:from-emerald-500 hover:to-green-600 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed w-full sm:w-auto"
                  disabled={!newCategory.trim()}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"></path>
                  </svg>
                  Add
                </button>
                <button
                  type="button"
                  className="btn btn-cancel py-3 px-5 bg-white/10 border-2 border-white/20 text-white rounded-xl font-semibold transition-all hover:bg-white/15 hover:border-white/30 flex items-center justify-center gap-2 w-full sm:w-auto"
                  onClick={() => { setShowCategoryForm(false); setNewCategory(''); }}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                  </svg>
                  Cancel
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
      {/* Empty state for no categories */}
      {sortedCategories.length === 0 && !showCategoryForm && (
        <div className="text-center py-12">
          <svg
            className={`w-16 h-16 mx-auto mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-200'}`}
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeWidth="2"
              d="M3 7a2 2 0 012-2h4l2 3h6a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
            />
          </svg>
          <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-100'}`}>No categories yet</h3>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-300'}`}>Create your first category to get started organizing your studies!</p>
        </div>
      )}
      <div className="categories-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
        {sortedCategories.map(cat => (
          <div
            key={cat.id || cat.name}
            className="category-card bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 transition-all hover:-translate-y-1 hover:bg-white/15 cursor-pointer shadow-lg relative"
            onClick={() => {
              setSelectedCategory(cat);
              setCurrentView('category');
            }}
          >
            <button
              className="delete-btn absolute top-3 right-3 text-white/60 hover:text-red-400 text-xl font-bold z-10 bg-transparent"
              title="Delete category"
              onClick={e => { e.stopPropagation(); if(window.confirm(`Delete category '${cat.name}' and all its cards?`)) deleteCategory(cat.name); }}
            >
              ×
            </button>
            <h3 className="category-title text-xl font-semibold mb-2 text-white">{cat.name}</h3>
            <div className="category-meta text-white/70 text-sm mb-2">
              {categoryStats[cat.name]?.totalCards || 0} cards • {formatTimeAgo(categoryStats[cat.name]?.lastStudied)}
            </div>
            <div className="category-stats flex gap-6 mt-2">
              <div className="stat-item">
                <div className="stat-number text-lg font-bold text-emerald-300">{categoryStats[cat.name]?.mastery || 0}%</div>
                <div className="stat-label text-xs text-white/60">Mastery</div>
              </div>
              <div className="stat-item">
                <div className="stat-number text-lg font-bold text-indigo-200">{categoryStats[cat.name]?.streak || 0}</div>
                <div className="stat-label text-xs text-white/60">Streak</div>
              </div>
            </div>
            <svg className="progress-ring absolute bottom-4 right-4" width="40" height="40" viewBox="0 0 50 50">
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