import React, { useState, useEffect } from "react";
import './App.css';
import { HeadLine, ProfileNav, SearchWidget, HabitGraph, AiTools, Footer } from './components';
import Bookmarks from './components/Bookmarks';

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
    <div
      className="h-screen w-full px-8 pb-3 box-border flex flex-col justify-between overflow-hidden transition-colors duration-300"
      style={{
        backgroundColor: theme.bg,
        color: theme.fg,
        '--fg': theme.fg,
        '--bg': theme.bg,
      }}
    >

      {/* Top Section: Header & Main Grid */}
      <div className="w-full max-w-[1800px] mx-auto flex-1 flex flex-col justify-center">

        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-x-8 gap-y-2 items-end">

          {/* Left Column */}
          <div className="flex flex-col justify-end gap-2 mb-5 pb-4">
            <HeadLine />

            <div className="w-full pl-1 mt-8">
              <SearchWidget />
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-4 items-end pb-8">
            <ProfileNav onBookmarkClick={() => setShowBookmarks(true)} />
            <div className="w-full h-48">
              <HabitGraph />
            </div>
          </div>

        </div>

        {/* AI Tools Section */}
        <div className="w-full">
          <AiTools />
        </div>

      </div>

      {/* Footer */}
      <div className="w-full max-w-[1800px] mx-auto pb-2">
        <Footer
          currentTheme={theme}
          onThemeChange={handleThemeChange}
        />
      </div>

      {/* Bookmarks Popup */}
      <Bookmarks
        showBookmarks={showBookmarks}
        setShowBookmarks={setShowBookmarks}
      />

    </div>
  );
}

export default App;
