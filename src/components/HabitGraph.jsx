import React, { useState } from 'react';
import { apiClient } from '../api/client';
import { getUserId } from '../utils/user';

const HabitGraph = () => {
    const [activeTab, setActiveTab] = useState('github');

    // Sample GitHub contribution data (weeks x days)
    const githubData = [
        [0, 1, 2, 0, 1, 3, 2],
        [1, 2, 3, 1, 0, 2, 1],
        [2, 0, 1, 2, 3, 1, 0],
        [0, 1, 0, 2, 1, 2, 3],
        [3, 2, 1, 0, 1, 0, 2],
        [1, 0, 2, 1, 2, 3, 1],
        [2, 1, 0, 3, 0, 1, 2],
        [0, 2, 1, 1, 2, 0, 1],
        [1, 3, 2, 0, 1, 2, 0],
        [2, 1, 0, 2, 3, 1, 1],
    ];

    // Real Data Integration
    const [dailyHabitsData, setDailyHabitsData] = useState({});
    const userId = getUserId();

    // Load data from Backend (Poll for updates)
    React.useEffect(() => {
        const loadData = async () => {
            try {
                const data = await apiClient.get(`/habits/${userId}`);
                setDailyHabitsData(data.dailyHabits || {});
            } catch (error) {
                // Silent fail or minimal log
                // console.warn("Graph fetch error", error);
            }
        };
        loadData();

        // Poll every 2 seconds to keep in sync with Tracker updates
        const interval = setInterval(loadData, 2000);
        return () => clearInterval(interval);
    }, [userId]);

    const dailyHabitsCount = 5; // Matches HabitTracker.jsx list length

    // Compute last 7 days (or first 7 days for demo)
    // Compute last 7 days dynamically
    const habitData = React.useMemo(() => {
        const habits = ["Wake Up on Time", "Walk 2 Miles", "Read 1 Chapter", "Drink Water", "Code 1 Hour"];

        // Generate last 7 days including today
        return Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i)); // 6 days ago to today

            const year = d.getFullYear();
            const month = d.getMonth(); // 0-11
            const day = d.getDate(); // 1-31
            const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });

            let completed = 0;
            habits.forEach(h => {
                // construction: "HabitName_YYYY_MM_DD"
                // matches HabitTracker.jsx getDailyKey logic
                const key = `${h}_${year}_${month}_${day}`;
                if (dailyHabitsData[key]) completed++;
            });

            const pct = dailyHabitsCount > 0 ? Math.round((completed / dailyHabitsCount) * 100) : 0;
            return { day: dayName, value: pct };
        });
    }, [dailyHabitsData]);

    const getContributionColor = (level) => {
        const colors = [
            'bg-[var(--fg)]/10',
            'bg-[var(--fg)]/30',
            'bg-[var(--fg)]/50',
            'bg-[var(--fg)]/80',
        ];
        return colors[level] || colors[0];
    };

    const tabs = [
        { key: 'github', label: 'Activity' },
        { key: 'habit', label: 'Habits' },
    ];

    return (
        <div className="w-full h-full flex flex-col">
            {/* Tab Section */}
            <div className="flex items-end relative z-20 gap-1">
                {tabs.map((tab, index) => (
                    <div
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`h-8 cursor-pointer transition-all duration-200 ${activeTab === tab.key
                            ? 'bg-[var(--fg)]'
                            : 'bg-[var(--fg)]/60 hover:bg-[var(--fg)]/80'
                            }`}
                        style={{
                            width: '90px',
                            clipPath: 'polygon(0 0, calc(100% - 15px) 0, 100% 100%, 0 100%)',
                            zIndex: activeTab === tab.key ? 10 : tabs.length - index,
                        }}
                    >
                        <div className="px-2 pr-4 py-1.5 flex items-center justify-center">
                            <span className="text-[var(--bg)] font-bold text-xs select-none whitespace-nowrap">
                                {tab.label}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="flex-1 border-2 border-current bg-[var(--bg)] p-3 relative">
                {activeTab === 'github' ? (
                    /* GitHub Contribution Graph */
                    <div className="w-full h-full flex flex-col">
                        <div className="flex-1 flex gap-1 overflow-hidden">
                            {githubData.map((week, weekIdx) => (
                                <div key={weekIdx} className="flex flex-col gap-1 flex-1">
                                    {week.map((level, dayIdx) => (
                                        <div
                                            key={dayIdx}
                                            className={`flex-1 rounded-sm ${getContributionColor(level)} transition-colors hover:ring-1 hover:ring-current`}
                                            title={`Week ${weekIdx + 1}, Day ${dayIdx + 1}: ${level} contributions`}
                                        />
                                    ))}
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between mt-2 text-[10px] opacity-60 font-medium">
                            <span>10 weeks ago</span>
                            <span>Today</span>
                        </div>
                    </div>
                ) : (
                    /* Habit Bar Graph */
                    <div className="w-full h-full flex flex-col">
                        <div className="flex-1 flex items-end justify-around gap-2">
                            {habitData.map((item, idx) => (
                                <div key={idx} className="flex flex-col items-center flex-1 h-full justify-end">
                                    <div
                                        className="w-full bg-[var(--fg)] rounded-t-sm transition-all hover:opacity-80"
                                        style={{ height: `${item.value}%` }}
                                        title={`${item.day}: ${item.value}%`}
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-around mt-2 text-[10px] font-bold">
                            {habitData.map((item, idx) => (
                                <span key={idx} className="flex-1 text-center">{item.day}</span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HabitGraph;
