import React, { useState, useEffect } from 'react';

const HeaderClock = () => {
    const [currentTime, setCurrentTime] = useState(new Date());

    // Update time every second
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const getGreeting = () => {
        const hour = currentTime.getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 17) return "Good Afternoon";
        if (hour < 21) return "Good Evening";
        return "Good Night";
    };

    const formatTime = () => {
        return currentTime.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const formatDate = () => {
        return currentTime.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="flex justify-end">
            <div className="h-12 px-5 border-2 border-current flex items-center gap-4 bg-[var(--bg)] text-[var(--fg)]">
                <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-wider font-bold opacity-70 leading-none mb-0.5">{getGreeting()}</span>
                    <span className="text-xl font-bold leading-none tracking-tight">{formatTime()}</span>
                </div>
                <div className="w-px h-8 bg-current opacity-30"></div>
                <span className="text-sm font-bold">{formatDate()}</span>
            </div>
        </div>
    );
};

export default HeaderClock;
