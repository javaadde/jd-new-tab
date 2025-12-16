import React from 'react';

const ProfileNav = ({ onBookmarkClick }) => {
    return (
        <div className="flex gap-4 h-12">
            {/* Bookmark Button */}
            <button
                onClick={onBookmarkClick}
                className="h-full aspect-square border-2 border-current flex items-center justify-center hover:bg-[var(--fg)] hover:text-[var(--bg)] transition-colors cursor-pointer group"
                title="Bookmarks"
            >
                <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="square"
                    strokeLinejoin="miter"
                    className="group-hover:scale-110 transition-transform"
                >
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                </svg>
            </button>

            {/* Profile Button */}
            <button className="h-full px-6 border-2 border-current flex items-center justify-center text-xl font-bold hover:bg-[var(--fg)] hover:text-[var(--bg)] transition-colors cursor-pointer">
                @javaadde
            </button>
        </div>
    );
};

export default ProfileNav;
