// src/components/StudyCard.js
import React from 'react';

const StudyCard = ({ card, isFlipped, onFlip, darkMode }) => {
  const cardBgClasses = darkMode ? 'bg-gray-700' : 'bg-white';

  return (
    <div className="perspective-1000 mb-6">
      <div
        onClick={onFlip}
        className={`
          relative w-full min-h-[300px] p-8 flex items-center justify-center rounded-xl border
          ${cardBgClasses}
          ${darkMode ? 'border-gray-600' : 'border-gray-200'}
          shadow-lg cursor-pointer transition-transform duration-500
          transform-style-preserve-3d
          hover:scale-[1.02] hover:shadow-xl
        `}
        style={{
          transition: 'transform 0.5s',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Front */}
        <div
          className={`
            absolute inset-0 flex flex-col items-center justify-center w-full h-full
            backface-hidden
          `}
        >
          <div className={`text-sm font-medium mb-4 ${darkMode ? 'text-sky-400' : 'text-sky-600'}`}>
            {card.category}
          </div>
          <div className="text-xl leading-relaxed mb-4">
            {card.front}
          </div>
          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            (Click to reveal answer)
          </div>
        </div>
        {/* Back */}
        <div
          className={`
            absolute inset-0 flex flex-col items-center justify-center w-full h-full
            backface-hidden rotate-y-180
          `}
        >
          <div className={`text-sm font-medium mb-4 ${darkMode ? 'text-sky-400' : 'text-sky-600'}`}>
            {card.category}
          </div>
          <div className="text-xl leading-relaxed mb-4">
            {card.back}
          </div>
          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            (Answer)
          </div>
        </div>
      </div>
      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
};

export default StudyCard;