import React from 'react';

const AIModal = ({
  showAIModal,
  setShowAIModal,
  aiText,
  setAIText,
  aiFile,
  setAIFile,
  aiLoading,
  aiError,
  aiSuccess,
  handleAIGenerate
}) => {
  if (!showAIModal) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAIFile(file);
      // Clear text input when file is selected
      setAIText('');
    }
  };

  const handleRemoveFile = () => {
    setAIFile(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="glass-card p-8 max-w-md w-full relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-2xl transition-colors"
          onClick={() => setShowAIModal(false)}
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-4">Generate Flashcards with AI</h2>
        
        <div className="mb-6">
          <label className="block font-medium mb-2">Option 1: Upload a file</label>
          {aiFile ? (
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <span className="text-sm text-gray-700 dark:text-gray-300">{aiFile.name}</span>
              </div>
              <button
                onClick={handleRemoveFile}
                className="text-red-500 hover:text-red-700 dark:hover:text-red-400"
              >
                Remove
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                  </svg>
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">PDF or TXT files</p>
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  accept=".pdf,.txt"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          )}
        </div>

        <div className="mb-6">
          <label className="block font-medium mb-2">Option 2: Paste text</label>
          <textarea
            className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-transparent"
            rows="6"
            placeholder="Paste your text here..."
            value={aiText}
            onChange={(e) => {
              setAIText(e.target.value);
              // Clear file when text is entered
              if (e.target.value) setAIFile(null);
            }}
            disabled={!!aiFile}
          />
        </div>

        {aiError && <div className="text-red-500 mb-4">{aiError}</div>}
        {aiSuccess && <div className="text-green-500 mb-4">{aiSuccess}</div>}

        <button
          className="btn btn-primary w-full"
          onClick={handleAIGenerate}
          disabled={aiLoading || (!aiText && !aiFile)}
        >
          {aiLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </span>
          ) : (
            'Generate Flashcards'
          )}
        </button>
      </div>
    </div>
  );
};

export default AIModal; 