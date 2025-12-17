import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserId } from '../utils/user';

const Footer = ({ currentTheme, onThemeChange, onBookmarkClick }) => {
    const [showThemePicker, setShowThemePicker] = useState(false);
    const navigate = useNavigate();

    const themes = [
        { name: "Ocean Blue", fg: "#3A5EBE", bg: "#EBEBEB" },
        { name: "Warm Maroon", fg: "#BA9C84", bg: "#60282B" },
        { name: "Sage Dark", fg: "#262626", bg: "#C4D9C6" },
        { name: "Sage Light", fg: "#C4D9C6", bg: "#262626" },
        { name: "Wine Light", fg: "#453336", bg: "#fafafa" },
        { name: "Wine Dark", fg: "#fafafa", bg: "#453336" },
        { name: "Teal Light", fg: "#004643", bg: "#fafafa" },
        { name: "Teal Dark", fg: "#fafafa", bg: "#004643" },
    ];

    return (
        <>
            <div className="flex justify-between items-end w-full">
                {/* Left - Bookmarks & Profile */}
                <div className="flex items-center gap-4">
                    {/* Bookmark Button */}
                    <button
                        onClick={onBookmarkClick}
                        className="w-14 h-14 border-2 border-current flex items-center justify-center hover:bg-[var(--fg)] hover:text-[var(--bg)] transition-colors cursor-pointer group"
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
                    <button
                        className="h-14 px-6 border-2 border-current flex items-center justify-center text-xl font-bold hover:bg-[var(--fg)] hover:text-[var(--bg)] transition-colors cursor-pointer"
                        title="User Profile"
                    >
                        @javaadde
                    </button>
                </div>

                {/* Right Actions */}
                <div className="flex gap-4 items-center">
                    {/* Spotify Quick Link */}
                    <a
                        href="https://open.spotify.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-14 h-14 border-2 border-current flex items-center justify-center hover:bg-[var(--fg)] hover:text-[var(--bg)] transition-colors cursor-pointer"
                        title="Spotify"
                    >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                        </svg>
                    </a>


                    {/* Theme Picker Button */}
                    <button
                        onClick={() => setShowThemePicker(true)}
                        className="w-14 h-14 border-2 border-current flex items-center justify-center hover:bg-[var(--fg)] hover:text-[var(--bg)] transition-colors cursor-pointer"
                        title="Theme Settings"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square">
                            <circle cx="12" cy="12" r="3" />
                            <path d="M12 1v4m0 14v4m11-11h-4M5 12H1m18.07-7.07l-2.83 2.83M8.76 15.24l-2.83 2.83m12.14 0l-2.83-2.83M8.76 8.76L5.93 5.93" />
                        </svg>
                    </button>

                    {/* Habit Tracker Button */}
                    <button
                        onClick={() => navigate('/habit-tracker')}
                        className="w-14 h-14 border-2 border-current flex items-center justify-center hover:bg-[var(--fg)] hover:text-[var(--bg)] transition-colors cursor-pointer"
                        title="Habit Tracker"
                    >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                            <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                    </button>


                    {/* Portfolio Link */}
                    <a
                        href="https://javaadde.vercel.app"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-14 h-14 border-2 border-current flex items-center justify-center hover:bg-[var(--fg)] hover:text-[var(--bg)] transition-colors cursor-pointer"
                        title="Portfolio"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter">
                            <path d="M7 17L17 7M17 7H7M17 7V17" />
                        </svg>
                    </a>
                </div>
            </div>

            {/* Theme Picker Popup */}
            {showThemePicker && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
                        onClick={() => setShowThemePicker(false)}
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                        <div className="w-full max-w-md">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-0">
                                <div
                                    className="h-10 bg-[var(--fg)] px-6 flex items-center"
                                    style={{
                                        clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 100%, 0 100%)'
                                    }}
                                >
                                    <span className="text-[var(--bg)] font-bold text-sm">Themes</span>
                                </div>
                                <button
                                    onClick={() => setShowThemePicker(false)}
                                    className="h-10 w-10 bg-[var(--fg)] text-[var(--bg)] flex items-center justify-center hover:opacity-80 transition-opacity"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Theme Grid */}
                            <div className="border-2 border-[var(--fg)] bg-[var(--bg)] p-6">
                                <div className="grid grid-cols-2 gap-4">
                                    {themes.map((theme, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => {
                                                onThemeChange(theme);
                                                setShowThemePicker(false);
                                            }}
                                            className="flex items-center gap-3 p-3 border-2 hover:scale-105 transition-transform cursor-pointer"
                                            style={{
                                                borderColor: theme.fg,
                                                backgroundColor: theme.bg,
                                            }}
                                        >
                                            {/* Color Preview */}
                                            <div className="flex gap-1">
                                                <div
                                                    className="w-6 h-6 border"
                                                    style={{ backgroundColor: theme.fg, borderColor: theme.fg }}
                                                />
                                                <div
                                                    className="w-6 h-6 border"
                                                    style={{ backgroundColor: theme.bg, borderColor: theme.fg }}
                                                />
                                            </div>
                                            <span
                                                className="text-sm font-bold"
                                                style={{ color: theme.fg }}
                                            >
                                                {theme.name}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}


        </>
    );
};

export default Footer;
