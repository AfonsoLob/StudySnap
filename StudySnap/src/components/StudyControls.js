// src/components/StudyControls.js
import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

const StudyControls = ({ 
  isFlipped, 
  onPrevious, 
  onNext, 
  onFlip, 
  onDifficultyRating, 
  onEndSession, 
  darkMode 
}) => {
  const buttonBaseClasses = "px-6 py-3 rounded-lg font-medium transition-colors";
  const secondaryButtonClasses = `${buttonBaseClasses} ${
    darkMode 
      ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
  }`;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 justify-items-center gap-2">
        <button
          onClick={onPrevious}
          className={`${secondaryButtonClasses} w-full`}
          style={{ minWidth: '110px' }}
        >
          Previous
        </button>
        <button
          onClick={onFlip}
          className={`${buttonBaseClasses} bg-indigo-500 hover:bg-indigo-600 text-white w-full`}
          style={{ minWidth: '110px' }}
        >
          {isFlipped ? 'Show Question' : 'Show Answer'}
        </button>
        <button
          onClick={onNext}
          className={`${secondaryButtonClasses} w-full`}
          style={{ minWidth: '110px' }}
        >
          Next
        </button>
      </div>
      {/* Difficulty Rating Controls - only show when answer is revealed */}
      {isFlipped && (
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => onDifficultyRating('easy')}
            className={`${buttonBaseClasses} bg-green-500 hover:bg-green-600 text-white`}
          >
            <CheckCircle className="inline-block mr-2" />
            Right
          </button>
          <button
            onClick={() => onDifficultyRating('hard')}
            className={`${buttonBaseClasses} bg-red-500 hover:bg-red-600 text-white`}
          >
            <XCircle className="inline-block mr-2" />
            Wrong
          </button>
        </div>
      )}
      <div className="flex justify-center">
        <button
          onClick={onEndSession}
          className={`${buttonBaseClasses} bg-gray-500 hover:bg-gray-600 text-white`}
        >
          End Session
        </button>
      </div>
    </div>
  );
}
export default StudyControls;