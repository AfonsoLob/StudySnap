// src/components/CardForm.js
import React from 'react';

const CardForm = ({ 
  title, 
  card, 
  setCard, 
  onSubmit, 
  onCancel, 
  submitText, 
  darkMode,
  categories,
  selectedCategory
}) => {
  const cardBgClasses = darkMode ? 'bg-gray-700' : 'bg-white';
  const inputClasses = `w-full p-3 border rounded-lg ${
    darkMode 
      ? 'bg-gray-800 border-gray-600 text-gray-100' 
      : 'bg-white border-gray-300'
  } focus:outline-none focus:ring-2 focus:ring-indigo-500`;

  const isSubmitDisabled = !card.front.trim() || !card.back.trim();

  return (
    <div className={`${cardBgClasses} rounded-xl border ${darkMode ? 'border-gray-600' : 'border-gray-200'} shadow-sm p-6`}>
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="category" className="block text-sm font-medium mb-2">
            Category
          </label>
          <select
            id="category"
            value={selectedCategory || card.category}
            onChange={e => setCard({ ...card, category: e.target.value })}
            className={inputClasses}
            disabled={!!selectedCategory}
            required
          >
            <option value="">Select a category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="front" className="block text-sm font-medium mb-2">
            Front (Question) *
          </label>
          <textarea
            id="front"
            value={card.front}
            onChange={(e) => setCard({...card, front: e.target.value})}
            placeholder="Enter your question here..."
            rows="3"
            className={`${inputClasses} resize-none`}
            required
          />
        </div>
        
        <div>
          <label htmlFor="back" className="block text-sm font-medium mb-2">
            Back (Answer) *
          </label>
          <textarea
            id="back"
            value={card.back}
            onChange={(e) => setCard({...card, back: e.target.value})}
            placeholder="Enter your answer here..."
            rows="3"
            className={`${inputClasses} resize-none`}
            required
          />
        </div>
        
        <div className="flex space-x-4 mt-6">
          <button
            type="submit"
            disabled={isSubmitDisabled}
            className="flex-1 bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 px-6 rounded-lg font-medium transition-colors"
          >
            {submitText}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              darkMode 
                ? 'bg-gray-800 hover:bg-gray-600 text-gray-300' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CardForm;