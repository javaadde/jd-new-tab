import React, { useState, useEffect, useMemo } from 'react';
import { apiClient } from '../api/client';
import { getUserId } from '../utils/user';

const HabitGraph = () => {
    const [activeTab, setActiveTab] = useState('github');
    const [githubData, setGithubData] = useState([]);

    // Fetch GitHub Data
    useEffect(() => {
        const fetchGithubData = async () => {
            try {
                // Using a public API to get contribution data for 'javaadde'
                const response = await fetch('https://github-contributions-api.jogruber.de/v4/javaadde?y=last');
                const data = await response.json();

                // Transform flat daily data into weeks
                // We want the last 20 weeks to fit the UI
                const days = data.contributions;

                // Manual override: Show 4 contributions for today (last day)
                if (days.length > 0) {
                    days[days.length - 1].level = 4;
                }

                const weeks = [];

                // Determine start day of the week for the first data point
                if (days.length > 0) {
                    const firstDate = new Date(days[0].date);
                    const startDay = firstDate.getDay(); // 0 = Sunday

                    let currentWeek = Array(startDay).fill(0); // Pad start

                    days.forEach(day => {
                        currentWeek.push(day.level);
                        if (currentWeek.length === 7) {
                            weeks.push(currentWeek);
                            currentWeek = [];
                        }
                    });

                    // If there's a partial week at the end
                    if (currentWeek.length > 0) {
                        while (currentWeek.length < 7) {
                            currentWeek.push(-1); // Pad with -1 to indicate future/empty days
                        }
                        weeks.push(currentWeek);
                    }
                }

                // Take the last 15-20 weeks to fit the container
                // The current UI shows about 10-15 columns comfortably
                setGithubData(weeks.slice(-18));
            } catch (error) {
                console.error("Failed to fetch GitHub data", error);
                // Fallback to sample data if fetch fails
                setGithubData([
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
                    [2, 1, 0, 2, 3, 1, 4],
                ]);
            }
        };
        fetchGithubData();
    }, []);


    // Real Data Integration
    const [dailyHabitsData, setDailyHabitsData] = useState({});
    const userId = getUserId();

    // Load data from Backend (Poll for updates)
    useEffect(() => {
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

    // Matches HabitTracker.jsx list
    const habits = [
        "Eat Breakfast",
        "Solve Leetcode Problems",
        "Read a page of book",
        "Keep Github Streak"
    ];
    const dailyHabitsCount = habits.length;

    // Compute last 7 days dynamically
    const habitData = useMemo(() => {
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
    }, [dailyHabitsData, habits, dailyHabitsCount]);

    const getContributionColor = (level) => {
        if (level === -1) return 'bg-transparent'; // Invisible for padded days
        const colors = [
            'bg-[var(--fg)]/10',
            'bg-[var(--fg)]/30',
            'bg-[var(--fg)]/50',
            'bg-[var(--fg)]/80',
            'bg-[var(--fg)]', // Added level 4 just in case
        ];
        // Ensure level is within bounds (0-4)
        const effectiveLevel = Math.min(Math.max(level, 0), 4);
        return colors[effectiveLevel] || colors[0];
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
                            {/* Added mask for fade-in effect on left side if specialized */}
                            {githubData.map((week, weekIdx) => (
                                <div key={weekIdx} className="flex flex-col gap-1 flex-1 min-w-[12px]">
                                    {week.map((level, dayIdx) => (
                                        <div
                                            key={dayIdx}
                                            className={`flex-1 rounded-[1px] ${getContributionColor(level)} transition-colors hover:ring-1 hover:ring-current`}
                                            title={`Contributions: level ${level}`}
                                        />
                                    ))}
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between mt-2 text-[10px] opacity-60 font-medium">
                            <span>Last 4 Months</span>
                            <span>Today</span>
                        </div>
                    </div>
                ) : (
                    /* Habit Bar Graph */
                    <div className="w-full h-full flex flex-col">
                        <div className="flex-1 flex items-end justify-around gap-2">
                            {habitData.map((item, idx) => (
                                <div key={idx} className="flex flex-col items-center flex-1 h-full justify-end group">
                                    <div className="text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity mb-1">{item.value}%</div>
                                    <div
                                        className="w-full bg-[var(--fg)] rounded-t-sm transition-all hover:opacity-80"
                                        style={{ height: `${Math.max(item.value, 5)}%`, opacity: item.value === 0 ? 0.2 : 1 }}
                                        // Min height 5% so visualization is visible even if 0, but with low opacity
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
