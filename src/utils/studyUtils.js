// src/utils/studyUtils.js


// Calculate mastery level description
export const getMasteryDescription = (mastery) => {
  if (mastery >= 90) return 'Mastered';
  if (mastery >= 70) return 'Well Known';
  if (mastery >= 50) return 'Familiar';
  if (mastery >= 30) return 'Learning';
  if (mastery >= 10) return 'New';
  return 'Unseen';
};

// Format time difference for display
export const formatTimeAgo = (timestamp) => {
  if (!timestamp) return 'Never';
  
  const now = new Date();
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return 'Today';
  if (diffDays === 2) return 'Yesterday';
  if (diffDays < 7) return `${diffDays - 1} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
};

// Calculate category daily streak
export const calculateCategoryStreak = (flashcards, studyProgress, category) => {
  const categoryCards = flashcards.filter(card => card.category === category);
  let maxStreak = 0;
  
  categoryCards.forEach(card => {
    const progress = studyProgress[card.id];
    if (progress && progress.streak > maxStreak) {
      const lastStudyDate = progress.lastStudyDate ? 
        new Date(progress.lastStudyDate.seconds * 1000) : null;
      
      if (lastStudyDate) {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const lastStudyDay = new Date(lastStudyDate.getFullYear(), lastStudyDate.getMonth(), lastStudyDate.getDate());
        const daysDiff = Math.floor((today - lastStudyDay) / (1000 * 60 * 60 * 24));
        
        // Only count streak if within 3 days
        if (daysDiff <= 3) {
          maxStreak = Math.max(maxStreak, progress.streak);
        }
      }
    }
  });
  
  return maxStreak;
}; 