// src/components/HomeView.js
import React from 'react';
import FlashcardList from './FlashcardList';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

const HomeView = ({ 
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
}) => {
  const [showCategoryForm, setShowCategoryForm] = React.useState(false);
  const [newCategory, setNewCategory] = React.useState('');
  const [showAIModal, setShowAIModal] = React.useState(false);
  const [aiText, setAIText] = React.useState('');
  const [aiFile, setAIFile] = React.useState(null);
  const [aiLoading, setAILoading] = React.useState(false);
  const [aiError, setAIError] = React.useState('');
  const [aiSuccess, setAISuccess] = React.useState('');
  const cardBgClasses = darkMode ? 'bg-gray-700' : 'bg-white';

  // PDF text extraction helper
  async function extractTextFromPDF(file) {
    const pdfjsLib = await import('pdfjs-dist/build/pdf');
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.js`;
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let text = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map(item => item.str).join(' ') + '\n';
    }
    return text;
  }

  // AI flashcard generation handler
  const handleAIGenerate = async () => {
    setAILoading(true);
    setAIError('');
    setAISuccess('');
    let inputText = aiText;
    try {
      if (aiFile) {
        inputText = await extractTextFromPDF(aiFile);
      }
      if (!inputText.trim()) {
        setAIError('No text provided.');
        setAILoading(false);
        return;
      }
      if (!apiKey) {
        setAIError('No API key set. Please add your API key in settings.');
        setAILoading(false);
        return;
      }
      // Prompt for AI
      const prompt = `Generate flashcards from the following text. Format each as:\nQ: <question>\nA: <answer>\n---\n${inputText}`;
      // Use AIMLAPI endpoint
      const AI_API_URL = 'https://api.aimlapi.com/v1/chat/completions';
      const response = await fetch(AI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'You are a helpful assistant that creates flashcards.' },
            { role: 'user', content: prompt }
          ],
          max_tokens: 2000
        })
      });
      if (!response.ok) {
        let errorMsg = 'AI API error';
        try {
          const errorData = await response.json();
          if (errorData.error && errorData.error.message) {
            errorMsg += ': ' + errorData.error.message;
          } else {
            errorMsg += ` (${response.status} ${response.statusText})`;
          }
        } catch {
          errorMsg += ` (${response.status} ${response.statusText})`;
        }
        throw new Error(errorMsg);
      }
      const data = await response.json();
      const aiOutput = data.choices[0].message.content;
      // Parse flashcards from AI output
      const cards = [];
      const regex = /Q:\s*(.*?)\nA:\s*(.*?)\n---/gs;
      let match;
      while ((match = regex.exec(aiOutput)) !== null) {
        cards.push({ front: match[1].trim(), back: match[2].trim(), category: selectedCategory });
      }
      if (cards.length === 0) {
        setAIError('No flashcards found in AI response.');
        setAILoading(false);
        return;
      }
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

  if (!selectedCategory) {
    // Show categories
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Categories</h2>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {categories.map(cat => (
            <div
              key={cat}
              className={`${cardBgClasses} p-6 rounded-xl border ${darkMode ? 'border-gray-600' : 'border-gray-200'} shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col items-center relative`}
              onClick={() => setSelectedCategory(cat)}
            >
              <h3 className="text-xl font-semibold mb-2">{cat}</h3>
              <span className="text-sm text-gray-500">{flashcards.filter(card => card.category === cat).length} cards</span>
              {categories.length > 1 && (
                <button
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700 bg-transparent border-none text-lg font-bold"
                  title="Delete category"
                  onClick={e => { e.stopPropagation(); if(window.confirm(`Delete category '${cat}' and all its cards?`)) deleteCategory(cat); }}
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Inside a category: show cards in that category
  const categoryCards = flashcards.filter(card => card.category === selectedCategory);
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <button onClick={() => setSelectedCategory(null)} className="text-indigo-500 hover:underline">← Back to Categories</button>
        <h2 className="text-2xl font-bold">{selectedCategory}</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentView('create')}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium"
          >
            + Create Card
          </button>
          <button
            onClick={startStudying}
            disabled={categoryCards.length === 0}
            className="bg-sky-500 hover:bg-sky-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium"
          >
            Start Studying
          </button>
          <button
            onClick={() => setShowAIModal(true)}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium"
          >
            AI
          </button>
        </div>
      </div>
      {showAIModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg max-w-lg w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-2xl"
              onClick={() => setShowAIModal(false)}
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-4">Generate Flashcards with AI</h2>
            <div className="mb-4">
              <label className="block font-medium mb-2">Upload PDF (optional)</label>
              <input
                type="file"
                accept="application/pdf"
                onChange={e => setAIFile(e.target.files[0])}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
            </div>
            <div className="mb-4">
              <label className="block font-medium mb-2">Or paste text</label>
              <textarea
                value={aiText}
                onChange={e => setAIText(e.target.value)}
                rows={6}
                className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Paste text here..."
              />
            </div>
            {aiError && <div className="text-red-500 mb-2">{aiError}</div>}
            {aiSuccess && <div className="text-green-500 mb-2">{aiSuccess}</div>}
            <button
              className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center"
              onClick={handleAIGenerate}
              disabled={aiLoading || (!aiText && !aiFile)}
            >
              {aiLoading ? <span className="loader mr-2"></span> : null}
              Generate Flashcards
            </button>
          </div>
        </div>
      )}
      <FlashcardList
        flashcards={categoryCards}
        darkMode={darkMode}
        onEdit={editCard}
        onDelete={deleteFlashcard}
      />
    </div>
  );
};

export default HomeView;