import React from "react";

export default function Bookmarks({ bookmarks, showBookmarks, setShowBookmarks }) {
  console.log('Bookmarks component props:', { bookmarks, showBookmarks });
  
  return (
    showBookmarks && (
      <div className="fixed top-20 right-6 w-72 bg-zinc-900 rounded-3xl p-5 shadow-2xl z-50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Bookmarks</h3>
          <span className="text-sm text-zinc-400">
            {bookmarks?.length || 0} bookmarks
          </span>
        </div>
        <div className="space-y-2 max-h-[400px] overflow-y-auto hide-scrollbar">
          {bookmarks?.length > 0 ? (
            bookmarks.map((bookmark) => (
              <a
                key={bookmark.id}
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 bg-zinc-800 hover:bg-zinc-700 rounded-2xl transition-colors group break-words"
                title={bookmark.title || bookmark.url}
              >
                <div className="flex items-center space-x-3 overflow-hidden">
                  <img
                    src={`https://www.google.com/s2/favicons?domain=${bookmark.url}&sz=32`}
                    alt=""
                    className="w-4 h-4"
                  />
                  <span className="text-sm truncate">{bookmark.title || new URL(bookmark.url).hostname}</span>
                </div>
                <svg
                  className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </a>
            ))
          ) : (
            <div className="text-center text-zinc-500 py-4">
              No bookmarks found
            </div>
          )}
        </div>
      </div>
    )
  );
}
