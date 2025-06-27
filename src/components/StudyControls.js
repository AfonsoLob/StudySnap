// src/components/StudyControls.js
import React from 'react';
import '../styles/study.css';

const StudyControls = ({ 
  isFlipped, 
  onPrevious, 
  onNext, 
  onFlip, 
  onDifficultyRating, 
  darkMode 
}) => {

  return (
    <div className="space-y-6">
      {!isFlipped ? (
        <div className="action-buttons">
        <button
          onClick={onPrevious}
            className="btn btn-secondary"
        >
            ← Previous
        </button>
        <button
          onClick={onFlip}
            className="max-[610px]:!hidden btn btn-primary outline outline-1 outline-white/30"
        >
            Show Answer
        </button>
        <button
          onClick={onNext}
            className="btn btn-secondary"
        >
            Next →
        </button>
      </div>
      ) : (
        <div className="knowledge-rating flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              className={`rating-btn rating-${rating}`}
              onClick={() => onDifficultyRating(rating)}
            >
              {rating}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default StudyControls;