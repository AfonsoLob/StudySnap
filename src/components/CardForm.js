// src/components/CardForm.js
import React from 'react';

const CardForm = ({ 
  card, 
  setCard, 
  onSubmit, 
  onCancel, 
  submitText, 
  darkMode,
  selectedCategory
}) => {

  const isSubmitDisabled = !card.front.trim() || !card.back.trim();

  return (
    <div className={"p-6 rounded-xl shadow-sm"}>
      
      <form onSubmit={onSubmit} className="space-y-6">
        <div>
          <label htmlFor="category" className="block text-sm font-medium mb-2">
            Category
          </label>
          <div
            id="category"
            className={`w-full p-3 rounded-lg border border-gray-600 ${darkMode ? 'bg-white/20' : 'bg-black/20'}`}
          >
            {selectedCategory?.name || card.category || <span className="italic text-gray-400">No category</span>}
          </div>
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
            className={`w-full p-3 rounded-lg border border-gray-600 ${darkMode ? 'bg-white/20' : 'bg-black/20'} resize-none`}
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
            className={`w-full p-3 rounded-lg border border-gray-600 ${darkMode ? 'bg-white/20' : 'bg-black/20'} resize-none`}
            required
          />
        </div>
        
        <div className="flex space-x-4 mt-6">
          <button
            type="submit"
            disabled={isSubmitDisabled}
            className="flex-1 bg-[#764ba2] hover:bg-[#8557b2] disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 px-6 rounded-lg font-medium transition-colors"
          >
            {submitText}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              darkMode 
                ? 'bg-white/30 hover:bg-gray-400 text-white' 
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