import React, { useState } from 'react';
import CinematicMasterclass from './components/CinematicMasterclass';
import Dashboard from './components/Dashboard';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [theme, setTheme] = useState('dark');

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      {/* 🌓 Global Theme Toggle Button */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={toggleTheme}
          className={`px-3 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider border transition-all shadow-lg backdrop-blur-md ${
            theme === 'dark'
              ? 'bg-zinc-900/80 text-orange-400 border-orange-500/30 hover:border-orange-400 hover:bg-zinc-800'
              : 'bg-white/80 text-orange-600 border-orange-300 hover:border-orange-500 hover:bg-orange-50'
          }`}
        >
          {theme === 'dark' ? '☀️ LIGHT MODE' : '🌙 DARK MODE'}
        </button>
      </div>

      {/* Screen Routing */}
      {currentScreen === 'dashboard' && (
        <Dashboard 
          theme={theme}
          onNavigate={(screenId) => setCurrentScreen(screenId)} 
        />
      )}

      {currentScreen === 'calculator' && (
        <CinematicMasterclass 
          theme={theme}
          onNavigate={() => setCurrentScreen('dashboard')} 
        />
      )}
    </div>
  );
}