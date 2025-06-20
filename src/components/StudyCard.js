// src/components/StudyCard.js
import React from 'react';
import { getMasteryDescription } from '../utils/studyUtils';

const StudyCard = ({ card, isFlipped, onFlip, darkMode, pageNumber, totalPages, studyProgress }) => {
  const cardBgClasses = darkMode
    ? 'bg-white/10 border border-white/20 text-white'
    : 'bg-white/20 border border-white/30 text-gray-800';
    
    const BgClasses = darkMode
    ? 'bg-white/10 border border-white/20'
    : 'bg-white/10 border border-white/20';

  const progress = studyProgress[card.id];
  const mastery = progress?.mastery || 0;
  const masteryDescription = getMasteryDescription(mastery);
  const masteryPercentage = Math.round(mastery);

  return (
    <div className="perspective-1000 mb-6">
      <div
        onClick={onFlip}
        className={`
          relative w-full min-h-[300px] p-8 flex items-center justify-center rounded-xl border
          ${cardBgClasses}
          shadow-lg cursor-pointer transition-transform duration-500
          transform-style-preserve-3d
          hover:scale-[1.02] hover:shadow-xl
        `}
        style={{
          transition: 'transform 0.5s',
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateX(180deg)' : 'rotateX(0deg)'
        }}
      >
        {/* Front */}
        <div
          className={`
            absolute inset-0 flex flex-col items-center justify-center w-full h-full
            backface-hidden
            px-6 py-8
          `}
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className={`card-category ${BgClasses}`}>
            {card.category}
          </div>
          <div className="flex-1 flex items-center justify-center w-full">
            <div className="text-white font-medium text-xl leading-relaxed mb-4 text-center break-words w-full">
              {card.front}
            </div>
          </div>
          <div className={`text-sm text-center ${darkMode ? 'text-gray-400' : 'text-gray-200'}`}>
            (Click to reveal answer)
          </div>
          {/* Mastery indicator */}
          <div className="absolute top-8 right-6 text-xs text-white font-medium bg-white/20 px-2 py-1 rounded">
            {masteryDescription} ({masteryPercentage}%)
          </div>
          {/* Page numbering bottom right */}
          <div className="absolute bottom-8 right-6 text-sm text-white font-medium">
            {pageNumber} / {totalPages}
          </div>
        </div>
        {/* Back */}
        <div
          className={`
            absolute inset-0 flex flex-col items-center justify-center w-full h-full
            backface-hidden
            px-6 py-8
          `}
          style={{ transform: 'rotateX(180deg)', backfaceVisibility: 'hidden' }}
        >
          <div className={`card-category ${BgClasses}`}>
            {card.category}
          </div>
          <div className="flex-1 flex items-center justify-center w-full">
            <div className="text-white font-medium text-xl leading-relaxed mb-4 text-center break-words w-full">
              {card.back}
            </div>
          </div>
          <div className={`text-sm text-center ${darkMode ? 'text-gray-400' : 'text-gray-200'}`}>
            (Answer)
          </div>
          {/* Mastery indicator */}
          <div className="absolute top-8 right-6 text-xs text-white font-medium bg-white/20 px-2 py-1 rounded">
            {masteryDescription} ({masteryPercentage}%)
          </div>
          {/* Page numbering bottom right */}
          <div className="absolute bottom-8 right-6 text-sm text-white font-medium">
            {pageNumber} / {totalPages}
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
      `}</style>
    </div>
  );
};

export default StudyCard;