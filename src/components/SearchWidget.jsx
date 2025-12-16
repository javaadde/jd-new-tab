import React, { useState } from 'react';

const SearchWidget = () => {
    const [query, setQuery] = useState('');
    const inputRef = React.useRef(null);

    React.useEffect(() => {
        const handleKeyDown = (e) => {
            // Focus on "/"
            if (e.key === '/' && document.activeElement !== inputRef.current) {
                e.preventDefault();
                inputRef.current?.focus();
            }
            // Focus on "Alt+j" and prevent default (Spotify/System shortcuts)
            if (e.altKey && e.key.toLowerCase() === 'j') {
                e.preventDefault();
                e.stopPropagation();
                inputRef.current?.focus();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim()) {
            window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        }
    };

    return (
        <div className="w-full flex gap-4 items-center">
            {/* Icon Box */}
            <div className="h-14 w-14 border-2 border-current flex items-center justify-center bg-[var(--bg)] shrink-0">
                <span className="text-3xl font-bold">G</span>
            </div>

            {/* Input Box */}
            <form onSubmit={handleSearch} className="flex-1 relative">
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full h-14 bg-[var(--bg)] border-2 border-current px-4 text-xl placeholder-current/50 focus:outline-none focus:bg-[var(--fg)]/5 transition-colors"
                    style={{ color: 'inherit' }}
                />
                <div className="absolute right-2 bottom-[-1.5rem] text-xs opacity-70 font-mono">
                    Alt + j or / to search
                </div>
            </form>
        </div>
    );
};

export default SearchWidget;
