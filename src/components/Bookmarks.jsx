import React, { useState } from "react";

export default function Bookmarks({ showBookmarks, setShowBookmarks }) {
  const [activeTab, setActiveTab] = useState('social');

  // Bookmark categories with sample bookmarks
  const categories = {
    social: {
      label: "Social",
      bookmarks: [
        { title: "Twitter/X", url: "https://x.com" },
        { title: "LinkedIn", url: "https://linkedin.com" },
        { title: "Instagram", url: "https://instagram.com" },
        { title: "Reddit", url: "https://reddit.com" },
        { title: "Discord", url: "https://discord.com" },
        { title: "Threads", url: "https://threads.net" },
      ]
    },
    dev: {
      label: "Dev",
      bookmarks: [
        { title: "GitHub", url: "https://github.com" },
        { title: "Stack Overflow", url: "https://stackoverflow.com" },
        { title: "Dev.to", url: "https://dev.to" },
        { title: "CodePen", url: "https://codepen.io" },
        { title: "Vercel", url: "https://vercel.com" },
        { title: "Netlify", url: "https://netlify.com" },
        { title: "npm", url: "https://npmjs.com" },
        { title: "MDN Docs", url: "https://developer.mozilla.org" },
      ]
    },
    work: {
      label: "Work",
      bookmarks: [
        { title: "Gmail", url: "https://mail.google.com" },
        { title: "Google Drive", url: "https://drive.google.com" },
        { title: "Notion", url: "https://notion.so" },
        { title: "Slack", url: "https://slack.com" },
        { title: "Trello", url: "https://trello.com" },
        { title: "Figma", url: "https://figma.com" },
        { title: "Canva", url: "https://canva.com" },
      ]
    },
    media: {
      label: "Media",
      bookmarks: [
        { title: "YouTube", url: "https://youtube.com" },
        { title: "Spotify", url: "https://spotify.com" },
        { title: "Netflix", url: "https://netflix.com" },
        { title: "Twitch", url: "https://twitch.tv" },
        { title: "SoundCloud", url: "https://soundcloud.com" },
        { title: "Prime Video", url: "https://primevideo.com" },
      ]
    },
    utils: {
      label: "Utils",
      bookmarks: [
        { title: "Google", url: "https://google.com" },
        { title: "ChatGPT", url: "https://chatgpt.com" },
        { title: "Translate", url: "https://translate.google.com" },
        { title: "Calendar", url: "https://calendar.google.com" },
        { title: "Maps", url: "https://maps.google.com" },
        { title: "Weather", url: "https://weather.com" },
      ]
    },
  };

  const tabKeys = Object.keys(categories);

  if (!showBookmarks) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
        onClick={() => setShowBookmarks(false)}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="w-full max-w-3xl">
          {/* Tab Section */}
          <div className="flex items-end relative z-20 gap-1">
            {tabKeys.map((key, index) => (
              <div
                key={key}
                onClick={() => setActiveTab(key)}
                className={`h-10 cursor-pointer transition-all duration-200 ${activeTab === key
                  ? 'bg-[var(--fg)]'
                  : 'bg-[var(--fg)]/60 hover:bg-[var(--fg)]/80'
                  }`}
                style={{
                  width: '100px',
                  clipPath: 'polygon(0 0, calc(100% - 18px) 0, 100% 100%, 0 100%)',
                  zIndex: activeTab === key ? 10 : tabKeys.length - index,
                }}
              >
                <div className="px-3 py-2 flex items-center justify-center">
                  <span className="text-[var(--bg)] font-bold text-sm select-none whitespace-nowrap">
                    {categories[key].label}
                  </span>
                </div>
              </div>
            ))}

            {/* Close button */}
            <button
              onClick={() => setShowBookmarks(false)}
              className="ml-auto h-10 w-10 bg-[var(--fg)] text-[var(--bg)] flex items-center justify-center hover:opacity-80 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Main Content */}
          <div className="border-2 border-current bg-[var(--bg)] p-6 max-h-[60vh] overflow-y-auto"
            style={{ scrollbarWidth: 'thin', scrollbarColor: 'var(--fg) var(--bg)' }}
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {categories[activeTab].bookmarks.map((bookmark, idx) => (
                <a
                  key={idx}
                  href={bookmark.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 border-2 border-current bg-[var(--bg)] hover:bg-[var(--fg)] hover:text-[var(--bg)] transition-colors group"
                >
                  <img
                    src={`https://www.google.com/s2/favicons?domain=${bookmark.url}&sz=32`}
                    alt=""
                    className="w-5 h-5 flex-shrink-0"
                  />
                  <span className="text-sm font-bold truncate">{bookmark.title}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
