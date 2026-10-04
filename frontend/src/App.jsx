import { useState } from 'react';
import CinematicMasterclass from './components/CinematicMasterclass';
import Dashboard from './components/Dashboard';
import OperativeProfile from './components/OperativeProfile';
import { loadProfile, saveProfile } from './profileStore';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [theme, setTheme] = useState('dark');
  // The profile is loaded once from localStorage and shared with every screen.
  const [profile, setProfile] = useState(loadProfile);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleSaveProfile = (nextProfile) => {
    saveProfile(nextProfile);
    setProfile(nextProfile);
  };

  const goHome = () => setCurrentScreen('dashboard');

  // Screens that exist so far. Anything else (like 'ocr') falls back to a placeholder.
  const knownScreens = ['dashboard', 'calculator', 'profile'];

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
          profile={profile}
          onNavigate={(screenId) => setCurrentScreen(screenId)}
        />
      )}

      {currentScreen === 'calculator' && (
        <CinematicMasterclass
          theme={theme}
          onNavigate={goHome}
        />
      )}

      {currentScreen === 'profile' && (
        <OperativeProfile
          theme={theme}
          profile={profile}
          onSave={handleSaveProfile}
          onNavigate={goHome}
        />
      )}

      {/* Placeholder so unbuilt screens (e.g. Financial OCR) never show a blank page */}
      {!knownScreens.includes(currentScreen) && (
        <div
          className={`min-h-screen flex flex-col items-center justify-center gap-4 p-8 ${
            theme === 'dark' ? 'bg-black text-white' : 'bg-orange-50 text-stone-900'
          }`}
        >
          <p className="font-mono text-sm">This module is not built yet.</p>
          <button
            onClick={goHome}
            className={`px-4 py-2 rounded-lg border text-xs font-mono ${
              theme === 'dark'
                ? 'border-zinc-700 text-zinc-300 hover:border-emerald-500/50'
                : 'border-orange-300 text-stone-700 hover:border-orange-500'
            }`}
          >
            Back to terminal
          </button>
        </div>
      )}
    </div>
  );
}
