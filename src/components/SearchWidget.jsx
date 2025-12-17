import React, { useState, useRef, useEffect } from 'react';
import { searchEngines } from './searchEngines';

const SearchWidget = () => {
    const [query, setQuery] = useState('');
    const [selectedEngine, setSelectedEngine] = useState(searchEngines[0]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const inputRef = useRef(null);
    const dropdownRef = useRef(null);

    // Sync highlighted index with selected engine when dropdown opens
    useEffect(() => {
        if (showDropdown) {
            setHighlightedIndex(searchEngines.findIndex(e => e.id === selectedEngine.id));
        }
    }, [showDropdown, selectedEngine.id]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            // Focus on "/"
            if (e.key === '/' && document.activeElement !== inputRef.current && !showDropdown) {
                e.preventDefault();
                inputRef.current?.focus();
            }
            // Focus on "Alt+j"
            if (e.altKey && e.key.toLowerCase() === 'j') {
                e.preventDefault();
                e.stopPropagation();
                inputRef.current?.focus();
            }
            // Toggle dropdown on "Alt+k"
            if (e.altKey && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                setShowDropdown(prev => !prev);
            }

            // Dropdown navigation
            if (showDropdown) {
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    setHighlightedIndex(prev => (prev + 1) % searchEngines.length);
                }
                if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    setHighlightedIndex(prev => (prev - 1 + searchEngines.length) % searchEngines.length);
                }
                if (e.key === 'Enter') {
                    e.preventDefault();
                    e.stopPropagation();
                    if (highlightedIndex !== -1) {
                        setSelectedEngine(searchEngines[highlightedIndex]);
                        setShowDropdown(false);
                    }
                }
                if (e.key === 'Escape') {
                    e.preventDefault();
                    setShowDropdown(false);
                }
            }
        };

        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showDropdown, highlightedIndex]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim()) {
            window.location.href = `${selectedEngine.url}${encodeURIComponent(query)}`;
        }
    };

    return (
        <div className="w-full flex gap-4 items-center relative ">
            {/* Engine Selector */}
            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="h-14 w-14 border-2 border-current flex items-center justify-center bg-[var(--bg)] shrink-0 cursor-pointer hover:scale-105 transition-transform"
                    title={selectedEngine.name}
                >
                    <svg viewBox={selectedEngine.viewBox || "0 0 24 24"} className="w-7 h-7">
                        {selectedEngine.icons.map((icon, idx) => (
                            <path key={idx} d={icon.path} fill="currentColor" fillRule={icon.fillRule || "nonzero"} />
                        ))}
                    </svg>
                </button>

                {showDropdown && (
                    <div className="absolute top-full mt-2 left-0 w-48 bg-[var(--bg)] border-2 border-[var(--fg)] shadow-lg py-2 flex flex-col gap-1 z-50">
                        {searchEngines.map((engine, idx) => (
                            <button
                                key={engine.id}
                                onClick={() => {
                                    setSelectedEngine(engine);
                                    setShowDropdown(false);
                                }}
                                className={`flex items-center gap-3 px-4 py-2 hover:bg-[var(--fg)]/10 transition-colors w-full text-left ${selectedEngine.id === engine.id || highlightedIndex === idx ? 'bg-[var(--fg)]/10' : ''
                                    }`}
                            >
                                <svg viewBox={engine.viewBox || "0 0 24 24"} className="w-5 h-5 shrink-0">
                                    {engine.icons.map((icon, i) => (
                                        <path key={i} d={icon.path} fill="currentColor" fillRule={icon.fillRule || "nonzero"} />
                                    ))}
                                </svg>
                                <span className="font-bold text-sm">{engine.name}</span>
                            </button>
                        ))}
                    </div>
                )}

            </div>

            {/* Input Box */}
            <form onSubmit={handleSearch} className="flex-1 relative">
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={`Search with ${selectedEngine.name}...`}
                    className="w-full h-14 bg-[var(--bg)] border-2 border-current px-4 text-xl placeholder-current/50 focus:outline-none focus:bg-[var(--fg)]/5 transition-colors"
                    style={{ color: 'inherit' }}
                />

                <div className="absolute right-2 bottom-[-1rem] text-[9px] opacity-70 font-mono">
                    Alt + j or / to search | Alt + k to switch engine
                </div>
            </form>
        </div>
    );
};

export default SearchWidget;
