// src/components/StudyControls.js
import React from 'react';

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
        <div className="flex justify-center space-x-2">
          {[1, 2, 3, 4, 5].map((level) => (
            <button
              key={level}
              onClick={() => onDifficultyRating(level)}
              className={`${buttonBaseClasses} flex items-center justify-center rounded-3xl ${
                level === 1 ? 'bg-red-500 hover:bg-red-600' :
                level === 2 ? 'bg-orange-500 hover:bg-orange-600' :
                level === 3 ? 'bg-yellow-500 hover:bg-yellow-600' :
                level === 4 ? 'bg-green-500 hover:bg-green-600' :
                'bg-blue-500 hover:bg-blue-600'
              } text-white w-12`}
              title={`Knowledge level: ${level}`}
            >
              {level}
            </button>
          ))}
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