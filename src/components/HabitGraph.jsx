import React, { useState, useEffect, useMemo } from 'react';
import { apiClient } from '../api/client';
import { getUserId } from '../utils/user';

/**
 * Monkeytype Integration:
 * - Fetches typing test data from public profile for user 'javaadde'
 * - Displays a GitHub-style heatmap showing tests completed over the last 12 months
 * - Updates automatically every 30 minutes
 * - Shows total tests completed in the footer
 */


const HabitGraph = () => {
    const [activeTab, setActiveTab] = useState('github');
    const [githubData, setGithubData] = useState([]);
    const [todayContributions, setTodayContributions] = useState(0);
    const [monkeytypeData, setMonkeytypeData] = useState([]);
    const [totalMonkeytypeTests, setTotalMonkeytypeTests] = useState(0);
    const [monkeytypeUsername, setMonkeytypeUsername] = useState('');
    const [tooltip, setTooltip] = useState({ active: false, x: 0, y: 0, text: '', date: '' });

    // Fetch GitHub Data with real-time polling
    useEffect(() => {
        const fetchGithubData = async () => {
            try {
                // Using a public API to get contribution data for 'javaadde'
                const response = await fetch('https://github-contributions-api.jogruber.de/v4/javaadde?y=last');
                const data = await response.json();

                // Transform flat daily data into weeks
                const days = data.contributions;

                // Get today's actual contribution count
                if (days.length > 0) {
                    const lastDay = days[days.length - 1];
                    setTodayContributions(lastDay.count || 0);
                }

                const weeks = [];

                // Determine start day of the week for the first data point
                if (days.length > 0) {
                    const firstDate = new Date(days[0].date);
                    const startDay = firstDate.getDay(); // 0 = Sunday

                    // Store full day objects instead of just levels
                    let currentWeek = Array(startDay).fill({ level: -1, count: 0, date: '' }); // Pad start

                    days.forEach(day => {
                        currentWeek.push({
                            level: day.level,
                            count: day.count || 0,
                            date: day.date
                        });
                        if (currentWeek.length === 7) {
                            weeks.push(currentWeek);
                            currentWeek = [];
                        }
                    });

                    // If there's a partial week at the end
                    if (currentWeek.length > 0) {
                        while (currentWeek.length < 7) {
                            currentWeek.push({ level: -1, count: 0, date: '' }); // Pad with empty days
                        }
                        weeks.push(currentWeek);
                    }
                }

                // Take the last 15-20 weeks to fit the container
                setGithubData(weeks.slice(-18));
            } catch (error) {
                console.error("Failed to fetch GitHub data", error);
                // Fallback to sample data if fetch fails - convert to new format
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
                ].map(week => week.map(level => ({ level, count: level * 2, date: '' }))));
            }
        };

        // Initial fetch
        fetchGithubData();

        // Poll for updates every 5 minutes (300000ms)
        // GitHub's contribution graph typically updates every few minutes
        const interval = setInterval(fetchGithubData, 300000);

        return () => clearInterval(interval);
    }, []);

    // Fetch Monkeytype Data
    useEffect(() => {
        const fetchMonkeytypeData = async () => {
            try {
                const username = 'javaadde';
                console.log('=== Monkeytype Data Fetching ===');

                // 1. Fetch the main profile page to get the embedded calendar data
                // This works because we have host_permissions in manifest.json
                const response = await fetch(`https://monkeytype.com/profile/${username}`);
                if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

                const html = await response.text();

                // 2. Extract profile data from the script tag
                const profileDataMatch = html.match(/(?:const|var|let|window\.)\s*_profileData\s*=\s*(\{[\s\S]*?\});/);

                let calendar = [];
                let totalTests = 0;

                if (profileDataMatch) {
                    try {
                        const jsonStr = profileDataMatch[1].trim();
                        const profileData = JSON.parse(jsonStr);

                        calendar = profileData?.typingStats?.calendar ||
                            profileData?.stats?.testActivity || [];

                        totalTests = profileData?.typingStats?.completedTests || 0;
                        setTotalMonkeytypeTests(totalTests);

                        console.log(`✅ Monkeytype: Found ${calendar.length} active days. Total: ${totalTests}`);
                    } catch (e) {
                        console.error('❌ Monkeytype: Data Parse Error', e);
                    }
                }

                const testsByDate = {};

                // 3. Process calendar data
                if (calendar && Array.isArray(calendar)) {
                    calendar.forEach(entry => {
                        let dateStr = '';
                        let count = 0;

                        if (entry.t) {
                            dateStr = new Date(entry.t).toISOString().split('T')[0];
                            count = entry.c || 1;
                        } else if (entry.date) {
                            dateStr = entry.date;
                            count = entry.count || 1;
                        }

                        if (dateStr) {
                            testsByDate[dateStr] = (testsByDate[dateStr] || 0) + count;
                        }
                    });
                }

                // 4. Create heatmap data for last 125 days
                const heatmapData = [];
                const today = new Date();

                for (let i = 125; i >= 0; i--) {
                    const date = new Date(today);
                    date.setDate(date.getDate() - i);
                    const dateStr = date.toISOString().split('T')[0];
                    const count = testsByDate[dateStr] || 0;

                    let level = 0;
                    if (count > 0) level = 1;
                    if (count >= 2) level = 2;
                    if (count >= 4) level = 3;
                    if (count >= 7) level = 4;

                    heatmapData.push({ date: dateStr, count, level });
                }

                // 5. Transform into weeks for the graph
                const weeks = [];
                const startDay = new Date(heatmapData[0].date).getDay();
                let currentWeek = Array(startDay).fill({ level: -1, count: 0, date: '' });

                heatmapData.forEach(day => {
                    currentWeek.push(day);
                    if (currentWeek.length === 7) {
                        weeks.push(currentWeek);
                        currentWeek = [];
                    }
                });

                if (currentWeek.length > 0) {
                    while (currentWeek.length < 7) {
                        currentWeek.push({ level: -1, count: 0, date: '' });
                    }
                    weeks.push(currentWeek);
                }

                setMonkeytypeData(weeks.slice(-18));

            } catch (error) {
                console.error("Monkeytype Fetch Error:", error);

                // Fallback sample data if scraping fails
                const sampleWeeks = [];
                for (let w = 0; w < 18; w++) {
                    const week = [];
                    for (let d = 0; d < 7; d++) {
                        const level = Math.random() > 0.8 ? Math.floor(Math.random() * 5) : 0;
                        week.push({ level, count: level * 2, date: '' });
                    }
                    sampleWeeks.push(week);
                }
                setMonkeytypeData(sampleWeeks);
            }
        };

        fetchMonkeytypeData();
        const interval = setInterval(fetchMonkeytypeData, 1800000);
        return () => clearInterval(interval);
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
        { key: 'typing', label: 'Typing' },
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
                                    {week.map((day, dayIdx) => (
                                        <div
                                            key={dayIdx}
                                            className={`flex-1 rounded-[1px] ${getContributionColor(day.level)} transition-colors hover:ring-1 hover:ring-current`}
                                            onMouseEnter={(e) => {
                                                const rect = e.currentTarget.getBoundingClientRect();
                                                const parentRect = e.currentTarget.offsetParent.getBoundingClientRect();

                                                // Format date to be more readable: Dec 20, 2025
                                                let displayDate = day.date;
                                                if (day.date) {
                                                    const d = new Date(day.date);
                                                    displayDate = d.toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    });
                                                }

                                                setTooltip({
                                                    active: true,
                                                    x: rect.left - parentRect.left + rect.width / 2,
                                                    y: rect.top - parentRect.top - 10,
                                                    text: `${day.count} contribution${day.count !== 1 ? 's' : ''}`,
                                                    date: displayDate
                                                });
                                            }}
                                            onMouseLeave={() => setTooltip({ ...tooltip, active: false })}
                                        />
                                    ))}
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between items-center mt-2 text-[10px] opacity-60 font-medium">
                            <span>Last 4 Months</span>
                            <span className="flex items-center gap-1">
                                <span className="opacity-100 font-bold text-[var(--fg)]">{todayContributions}</span>
                                <span>contributions today</span>
                            </span>
                        </div>
                    </div>
                ) : activeTab === 'habit' ? (
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
                ) : (
                    /* Monkeytype Tests Heatmap (GitHub-style) */
                    <div className="w-full h-full flex flex-col">
                        <div className="flex-1 flex gap-1 overflow-hidden">
                            {monkeytypeData.length > 0 ? (
                                monkeytypeData.map((week, weekIdx) => (
                                    <div key={weekIdx} className="flex flex-col gap-1 flex-1 min-w-[12px]">
                                        {week.map((day, dayIdx) => (
                                            <div
                                                key={dayIdx}
                                                className={`flex-1 rounded-[1px] ${getContributionColor(day.level)} transition-colors hover:ring-1 hover:ring-current`}
                                                onMouseEnter={(e) => {
                                                    const rect = e.currentTarget.getBoundingClientRect();
                                                    const parentRect = e.currentTarget.offsetParent.getBoundingClientRect();

                                                    // Format date to be more readable: Dec 20, 2025
                                                    let displayDate = day.date;
                                                    if (day.date) {
                                                        const d = new Date(day.date);
                                                        displayDate = d.toLocaleDateString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            year: 'numeric'
                                                        });
                                                    }

                                                    setTooltip({
                                                        active: true,
                                                        x: rect.left - parentRect.left + rect.width / 2,
                                                        y: rect.top - parentRect.top - 10,
                                                        text: `${day.count} test${day.count !== 1 ? 's' : ''}`,
                                                        date: displayDate
                                                    });
                                                }}
                                                onMouseLeave={() => setTooltip({ ...tooltip, active: false })}
                                            />
                                        ))}
                                    </div>
                                ))
                            ) : (
                                <div className="flex items-center justify-center w-full h-full text-xs opacity-60">
                                    No typing data available
                                </div>
                            )}
                        </div>
                        <div className="flex justify-between items-center mt-2 text-[10px] opacity-60 font-medium">
                            <span>Last 4 Months</span>
                            {monkeytypeData.length > 0 && (() => {
                                // Calculate total tests
                                let totalTests = 0;
                                monkeytypeData.forEach(week => {
                                    week.forEach(day => {
                                        if (day.count) totalTests += day.count;
                                    });
                                });
                                return (
                                    <span className="flex items-center gap-1">
                                        <span className="opacity-100 font-bold text-[var(--fg)]">{totalMonkeytypeTests || 0}</span>
                                        <span>tests completed</span>
                                    </span>
                                );
                            })()}
                        </div>
                    </div>
                )}

                {/* Custom Tooltip */}
                {tooltip.active && (
                    <div
                        className="absolute z-50 pointer-events-none bg-[var(--fg)] text-[var(--bg)] px-2 py-1 rounded text-[10px] font-bold shadow-lg flex flex-col items-center transform -translate-x-1/2 -translate-y-full mb-1 transition-opacity duration-150"
                        style={{
                            left: tooltip.x,
                            top: tooltip.y,
                        }}
                    >
                        <span className="whitespace-nowrap">{tooltip.text}</span>
                        <span className="opacity-70 text-[8px] whitespace-nowrap">{tooltip.date}</span>
                        {/* Tooltip Arrow */}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-t-[3px] border-t-[var(--fg)]" />
                    </div>
                )}
            </div>
        </div>
    );
};

export default HabitGraph;
