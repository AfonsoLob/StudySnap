import React, { useState } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import logo from '../assets/logoSnap.png'

const AuthForm = ({ user }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Login / Sign-Up 
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-400 to-purple-600 py-6 px-2">
      <div className="auth-container bg-slate-800/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl shadow-2xl p-10 w-full max-w-md border border-slate-200 dark:border-slate-700">
        {/* Brand Section */}
        <div className="brand-section text-center mb-8">
          <img
            src={logo}
            alt="StudySnap Logo"
            className="brand-icon w-16 h-16 rounded-full mb-4 mx-auto object-cover shadow-lg"
          />
          <h1 className="brand-title text-white text-3xl font-bold mb-2">StudySnap</h1>
          <p className="brand-subtitle text-slate-300 text-base" id="subtitle">
            {isLogin ? 'Welcome back to your studies' : 'Create an account to start studying'}
          </p>
        </div>
        {/* Auth Form */}
        <form id="authForm" onSubmit={handleSubmit} className="space-y-6">
          <div className="form-group mb-6">
            <label className="form-label block text-slate-200 text-sm font-medium mb-2" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              className="form-input w-full py-3 px-4 bg-slate-700 border-2 border-slate-500 rounded-lg text-white text-base placeholder-slate-400 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-400 transition-all"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group mb-6">
            <label className="form-label block text-slate-200 text-sm font-medium mb-2" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className="form-input w-full py-3 px-4 bg-slate-700 border-2 border-slate-500 rounded-lg text-white text-base placeholder-slate-400 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-400 transition-all"
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-400 text-center text-sm -mt-4 mb-2">{error}</p>}
          <button
            type="submit"
            className="btn-primary w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-indigo-700 hover:to-purple-700 rounded-lg text-white text-base font-semibold shadow-md transition-all mb-6"
          >
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>
        {/* Divider */}
        <div className="divider flex items-center my-6">
          <div className="divider-line flex-1 h-px bg-slate-600"></div>
          <span className="divider-text px-4 text-slate-400 text-sm">or</span>
          <div className="divider-line flex-1 h-px bg-slate-600"></div>
        </div>
        {/* Toggle Button */}
        <button
          type="button"
          className="btn-secondary w-full py-3 bg-slate-600 hover:bg-slate-700 rounded-lg text-slate-200 text-base font-medium transition-all"
          id="toggleBtn"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? (
            <>Don&apos;t have an account? <span className="purple-link text-purple-300 font-semibold hover:text-purple-200 transition-colors">Sign Up</span></>
          ) : (
            <>Already have an account? <span className="purple-link text-purple-300 font-semibold hover:text-purple-200 transition-colors">Login</span></>
          )}
        </button>
      </div>
    </div>
  );
};

export default AuthForm;
