// src/components/Header.js
import React from 'react';
import { BookOpen, Sun, Moon, Settings } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import logo from '../assets/logoSnap.png';
const Header = ({ darkMode, toggleDarkMode, setCurrentView, user, onShowSettings }) => {
  return (
    <header className="glass-header sticky top-0 z-40 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div 
            onClick={() => setCurrentView('home')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-13 h-10 bg-gradient-to-br from-primary to-primary-light rounded-xl flex items-center justify-center transform transition-transform group-hover:scale-105">
              <img src={logo} alt="StudySnap Logo" className="w-[3.5rem] object-contain" />
            </div>            
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text drop-shadow-md">
              StudySnap
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary/50"
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-yellow-400" tabIndex={-1} />
              ) : (
                <Moon className="w-5 h-5 text-indigo-200" tabIndex={-1} />
              )}
            </button>
            {user && (
              <>
                <button
                  onClick={onShowSettings}
                  className="p-2 rounded-lg transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  title="Settings"
                >
                  <Settings className="w-5 h-5 text-gray-200" />
                </button>
                <button
                  onClick={() => signOut(auth)}
                  className="btn btn-primary"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;