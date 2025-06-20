// src/components/CreateView.js
import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

const CreateView = ({ darkMode, onBack, addFlashcard, selectedCategory, categories }) => {
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [bulkText, setBulkText] = useState('');
  const [category, setCategory] = useState(selectedCategory || '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isBulkMode) {
      // Parse bulk text into multiple cards
      const cards = parseBulkText(bulkText);
      for (const card of cards) {
        if (card.front && card.back) {
          await addFlashcard(card.front, card.back, category);
        }
      }
      setBulkText('');
    } else {
      await addFlashcard(front, back, category);
      setFront('');
      setBack('');
    }
  };

  const parseBulkText = (text) => {
    const cards = [];
    const lines = text.split('\n');
    let currentCard = {};

    lines.forEach(line => {
      if (line.trim().startsWith('Q:')) {
        if (currentCard.front) {
          cards.push(currentCard);
          currentCard = {};
        }
        currentCard.front = line.replace('Q:', '').trim();
      } else if (line.trim().startsWith('A:')) {
        currentCard.back = line.replace('A:', '').trim();
      }
    });

    if (currentCard.front && currentCard.back) {
      cards.push(currentCard);
    }

    return cards;
  };

  return (
    <div className="max-w-2xl mx-auto glass-list p-6">
      <div className="flex items-center mb-6">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold ml-4">Create New Flashcard</h1>
      </div>

      <div className="mb-6">
        <div className="flex space-x-4 mb-4">
          <button
            onClick={() => setIsBulkMode(false)}
            className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
              !isBulkMode
                ? 'btn-selected'
                : 'bg-gray-600'
            }`}
          >
            Single Card
          </button>
          <button
            onClick={() => setIsBulkMode(true)}
            className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
              isBulkMode
                ? 'btn-selected'
                : 'bg-gray-600'
            }`}
          >
            Bulk Create
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Category</label>
          <div className="w-full p-3 bg-black/30 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent bg-opacity-50">
            {category || 'No category selected'}
          </div>
        </div>
        
        {!isBulkMode ? (
          <>
            <div>
              <label className="block text-sm font-medium mb-2">Front</label>
              <textarea
                value={front}
                onChange={(e) => setFront(e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-600 bg-black/30"
                rows={3}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Back</label>
              <textarea
                value={back}
                onChange={(e) => setBack(e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-600 bg-black/30"
                rows={3}
                required
              />
            </div>
          </>
        ) : (
          <div>
            <label className="block text-sm font-medium mb-2">Enter multiple cards (one per line)</label>
            <textarea
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-600 bg-black/30"
              rows={10}
              placeholder={`Q: What is the capital of France?\nA: Paris\n\nQ: What is 2 + 2?\nA: 4\n\n(Each card should start with Q: for question and A: for answer)`}
              required
            />
          </div>
        )}

        <button
          type="submit"
          className="w-full py-3 px-6 bg-[#764ba2] text-white rounded-lg hover:bg-[#8557b2] transition-colors"
        >
          {isBulkMode ? 'Create Cards' : 'Create Card'}
        </button>
      </form>
    </div>
  );
};

export default CreateView;