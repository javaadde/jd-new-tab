import React, { useState, useEffect } from "react";
import { HashRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import { Footer } from './components';
import Bookmarks from './components/Bookmarks';
import Home from './pages/Home';
import HabitTracker from './pages/HabitTracker';

function App() {
  const [showBookmarks, setShowBookmarks] = useState(false);

  // Theme state with localStorage persistence
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('jd-theme');
    return saved ? JSON.parse(saved) : { fg: "#3A5EBE", bg: "#EBEBEB" };
  });

  // Apply theme when it changes
  useEffect(() => {
    document.documentElement.style.setProperty('--fg', theme.fg);
    document.documentElement.style.setProperty('--bg', theme.bg);
    localStorage.setItem('jd-theme', JSON.stringify(theme));
  }, [theme]);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };

  return (
    <HashRouter>
      <div
        className="h-screen w-full px-8 pb-3 box-border flex flex-col justify-between overflow-hidden transition-colors duration-300"
        style={{
          backgroundColor: theme.bg,
          color: theme.fg,
          '--fg': theme.fg,
          '--bg': theme.bg,
        }}
      >
        {/* Main Content Area */}
        <Routes>
          <Route
            path="/"
            element={
              <Home
                theme={theme}
                onThemeChange={handleThemeChange}
                onBookmarkClick={() => setShowBookmarks(true)}
              />
            }
          />
          <Route path="/habit-tracker" element={<HabitTracker />} />
        </Routes>

        {/* Bookmarks Popup */}
        <Bookmarks
          showBookmarks={showBookmarks}
          setShowBookmarks={setShowBookmarks}
        />
      </div>
    </HashRouter>
  );
}

export default App;
