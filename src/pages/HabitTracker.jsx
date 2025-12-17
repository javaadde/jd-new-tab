/* eslint-disable react/prop-types */
import React, { useState, useEffect, useMemo } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../api/client';
import { getUserId } from '../utils/user.js';

const HabitTracker = () => {
    const navigate = useNavigate();

    // -- STATE & BACKEND INTEGRATION --
    // -- STATE & BACKEND INTEGRATION --

    // Get or Create a User ID (simulating auth by device ID)
    // Get User ID
    const [userId] = useState(getUserId);

    // -- DATE HELPERS --
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonthIndex = now.getMonth(); // 0-11
    // Get month name (e.g. "January")
    const currentMonthName = now.toLocaleString('default', { month: 'long' });
    // Get days in current month
    const daysInCurrentMonth = new Date(currentYear, currentMonthIndex + 1, 0).getDate();

    const [dailyHabitsData, setDailyHabitsData] = useState({});
    const [weeklyHabitsData, setWeeklyHabitsData] = useState({});
    const [monthlyHabitsData, setMonthlyHabitsData] = useState({});
    const [loading, setLoading] = useState(true);

    // Load Data from Backend
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await apiClient.get(`/habits/${userId}`);
                setDailyHabitsData(data.dailyHabits || {});
                setWeeklyHabitsData(data.weeklyHabits || {});
                setMonthlyHabitsData(data.monthlyHabits || {});
            } catch (error) {
                console.error("Failed to fetch habits:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [userId]);

    // Save Data to Backend (Debounced)
    useEffect(() => {
        if (loading) return;

        const saveData = async () => {
            try {
                await apiClient.post('/habits', {
                    userId,
                    dailyHabits: dailyHabitsData,
                    weeklyHabits: weeklyHabitsData,
                    monthlyHabits: monthlyHabitsData
                });



            } catch (error) {
                console.error("Failed to save habits:", error);
            }
        };

        const timeoutId = setTimeout(saveData, 1000);
        return () => clearTimeout(timeoutId);
    }, [dailyHabitsData, weeklyHabitsData, monthlyHabitsData, userId, loading]);

    // Tab state for the bottom checklist section
    const [checklistTab, setChecklistTab] = useState('weekly');

    // -- CONFIG --
    const dailyHabitsList = [
        "Eat Breakfast", "Solve Leetcode Problems", "Read a page of book", "Keep Github Streak"
    ];

    const weeklyHabitsList = [
        "Laundry", "Change Sheets", "Plan the Week", "Grocery Shopping"
    ];

    const monthlyHabitsList = [
        "Pay Bills", "Review Goals", "Deep Clean", "Backup Files"
    ];

    // Removed hardcoded daysInMonth/weeksInMonth in favor of dynamic derived values above
    const weeksInMonth = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];

    // -- KEY GENERATORS --
    const getDailyKey = (habit, dayIndex) => {
        // key format: "HabitName_YYYY_MM_DD"
        // dayIndex is 0-based, so day is dayIndex + 1
        return `${habit}_${currentYear}_${currentMonthIndex}_${dayIndex + 1}`;
    };

    const getWeeklyKey = (habit, weekIndex) => {
        // key format: "HabitName_YYYY_MM_WeekN"
        return `${habit}_${currentYear}_${currentMonthIndex}_W${weekIndex}`;
    };

    const getMonthlyKey = (habit) => {
        // key format: "HabitName_YYYY_MM"
        return `${habit}_${currentYear}_${currentMonthIndex}`;
    };

    // -- HANDLERS --
    const toggleDaily = (habit, dayIndex) => {
        setDailyHabitsData(prev => {
            const key = getDailyKey(habit, dayIndex);
            const newState = { ...prev };
            if (newState[key]) delete newState[key];
            else newState[key] = true;
            return newState;
        });
    };

    const toggleWeekly = (habit, weekIndex) => {
        setWeeklyHabitsData(prev => {
            const key = getWeeklyKey(habit, weekIndex);
            const newState = { ...prev };
            if (newState[key]) delete newState[key];
            else newState[key] = true;
            return newState;
        });
    };

    const toggleMonthly = (habit) => {
        setMonthlyHabitsData(prev => {
            const key = getMonthlyKey(habit);
            const newState = { ...prev };
            if (newState[key]) delete newState[key];
            else newState[key] = true;
            return newState;
        });
    };

    // -- DERIVED DATA FOR GRAPHS --

    // 1. Total Completed in Current Month
    const totalDailyCompleted = useMemo(() => {
        // Count only keys that match the current month/year pattern
        // Or simply count based on iterating the grid (which is safer if we have stale keys in the object)
        let count = 0;
        dailyHabitsList.forEach(habit => {
            for (let i = 0; i < daysInCurrentMonth; i++) {
                if (dailyHabitsData[getDailyKey(habit, i)]) count++;
            }
        });
        return count;
    }, [dailyHabitsData, dailyHabitsList, daysInCurrentMonth, currentYear, currentMonthIndex]);

    // 2. Daily Progress Data (For Bar Chart)
    const chartData = useMemo(() => {
        return Array.from({ length: daysInCurrentMonth }, (_, i) => {
            let count = 0;
            dailyHabitsList.forEach(habit => {
                if (dailyHabitsData[getDailyKey(habit, i)]) count++;
            });
            return { day: i + 1, completed: count };
        });
    }, [dailyHabitsData, dailyHabitsList, daysInCurrentMonth]);

    // 3. Monthly Progress % (Pie Chart)
    const monthlyProgressPercent = useMemo(() => {
        const totalPossible = dailyHabitsList.length * daysInCurrentMonth;
        if (totalPossible === 0) return 0;
        return Math.round((totalDailyCompleted / totalPossible) * 100);
    }, [totalDailyCompleted, dailyHabitsList.length, daysInCurrentMonth]);

    const monthlyPieData = [
        { name: 'Completed', value: monthlyProgressPercent },
        { name: 'Remaining', value: 100 - monthlyProgressPercent }
    ];

    // 4. Weekly Pie Data (Dynamic based on selected tab would be cool, but keeping simple)
    // 4. Weekly Pie Data
    const checklistProgress = useMemo(() => {
        if (checklistTab === 'weekly') {
            // Count weekly items for current month
            let total = 0;
            weeklyHabitsList.forEach(h => {
                weeksInMonth.forEach((_, wIdx) => {
                    if (weeklyHabitsData[getWeeklyKey(h, wIdx)]) total++;
                });
            });

            const possible = weeklyHabitsList.length * weeksInMonth.length;
            return possible === 0 ? 0 : Math.round((total / possible) * 100);
        } else if (checklistTab === 'monthly') {
            let total = 0;
            monthlyHabitsList.forEach(h => {
                if (monthlyHabitsData[getMonthlyKey(h)]) total++;
            });

            const possible = monthlyHabitsList.length;
            return possible === 0 ? 0 : Math.round((total / possible) * 100);
        }
        return 0;
    }, [weeklyHabitsData, monthlyHabitsData, checklistTab, weeklyHabitsList, monthlyHabitsList, weeksInMonth]);

    const checklistPieData = [
        { name: 'Completed', value: checklistProgress },
        { name: 'Remaining', value: 100 - checklistProgress }
    ];


    return (
        <div className="w-full max-w-[1800px] mx-auto flex flex-col h-full overflow-y-auto pb-20 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
            {/* Header / Nav Back */}
            <div className="flex items-center justify-between mb-6 pt-2 shrink-0">
                <div className="flex items-baseline gap-4">
                    <h1 className="text-4xl font-bold font-['Geo']">Habit Tracker</h1>
                    <span className="opacity-60 font-['Grandstander']">Keep pushing forward</span>
                    {!loading && Object.keys(dailyHabitsData).length === 0 && (
                        <span className="text-red-500 text-xs font-bold animate-pulse bg-red-100 px-2 py-1 rounded">
                            ⚠ connection lost - check server
                        </span>
                    )}
                </div>
                <button
                    onClick={() => navigate('/')}
                    className="w-10 h-10 flex items-center justify-center hover:bg-[var(--fg)] hover:text-[var(--bg)] border-2 border-current transition-all"
                    title="Back to Home"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                </button>
            </div>

            {/* Top Section: Month Stats & Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr_300px] gap-6 mb-6 shrink-0">
                {/* Stat Card */}
                <div className="border-2 border-current p-0 flex flex-col">
                    <div className="bg-[var(--fg)] text-[var(--bg)] text-center py-2 font-bold uppercase tracking-widest">{currentMonthName}</div>
                    <div className="flex-1 flex flex-col justify-center items-center p-6 gap-2">
                        <div className="text-sm font-bold opacity-70 uppercase tracking-widest">Total Completed</div>
                        <div className="text-6xl font-bold font-['Geo']">{totalDailyCompleted}</div>
                    </div>
                </div>

                {/* Bar Chart */}
                <div className="border-2 border-current p-0 flex flex-col">
                    <div className="bg-[var(--fg)] text-[var(--bg)] text-center py-1 font-bold text-sm tracking-wider">DAILY PROGRESS</div>
                    <div className="flex-1 w-full min-h-[180px] p-4 bg-[var(--bg)]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} stroke="currentColor" vertical={false} />
                                <XAxis
                                    dataKey="day"
                                    stroke="currentColor"
                                    tick={{ fontSize: 10, fill: 'currentColor' }}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <Tooltip
                                    cursor={{ fill: 'currentColor', opacity: 0.1 }}
                                    contentStyle={{ backgroundColor: 'var(--bg)', borderColor: 'var(--fg)', color: 'var(--fg)' }}
                                    itemStyle={{ color: 'var(--fg)' }}
                                />
                                <Bar
                                    dataKey="completed"
                                    fill="var(--fg)"
                                    radius={[2, 2, 0, 0]}
                                    barSize={20}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Pie Chart */}
                <div className="border-2 border-current p-0 flex flex-col items-center justify-center relative">
                    <div className="absolute top-0 left-0 w-full bg-[var(--fg)] text-[var(--bg)] text-center py-1 font-bold text-xs tracking-wider">MONTHLY GOAL</div>
                    <div className="w-full h-full pt-8 px-4 pb-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={monthlyPieData}
                                    innerRadius={55}
                                    outerRadius={75}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    <Cell key="cell-0" fill="currentColor" opacity={1} />
                                    <Cell key="cell-1" fill="currentColor" opacity={0.15} />
                                </Pie>
                                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fill="currentColor" className="text-2xl font-bold font-['Geo']">
                                    {monthlyProgressPercent}%
                                </text>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Section 2: Daily Habits Grid (Matrix) */}
            <div className="border-2 border-current mb-6 overflow-hidden flex flex-col shrink-0">
                <div className="bg-[var(--fg)] text-[var(--bg)] px-4 py-2 font-bold flex justify-between tracking-wider text-sm uppercase">
                    <span>Daily Habits Matrix</span>
                    <span className="text-xs self-center opacity-80">Track your consistency</span>
                </div>
                <div className="p-0 overflow-x-auto [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:bg-[var(--fg)] [&::-webkit-scrollbar-track]:bg-transparent">
                    <table className="w-full min-w-[800px] border-collapse">
                        <thead>
                            <tr className="text-left bg-current/5">
                                <th className="p-3 w-[200px] font-bold border-r border-current">Habit</th>
                                {Array.from({ length: daysInCurrentMonth }).map((_, i) => (
                                    <th key={i} className="p-1 text-center text-[10px] sm:text-xs opacity-70 w-8 border-r border-current/20">{i + 1}</th>
                                ))}
                                <th className="p-3 text-center w-[80px] font-bold">Goal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dailyHabitsList.map((habit, idx) => {
                                // Calculate row progress based on current month keys
                                const rowCompleted = Array.from({ length: daysInCurrentMonth }).filter((_, i) => dailyHabitsData[getDailyKey(habit, i)]).length;

                                return (
                                    <tr key={idx} className="border-b border-current last:border-0 hover:bg-current/5 transition-colors group">
                                        <td className="p-3 font-medium border-r border-current text-sm">{habit}</td>
                                        {Array.from({ length: daysInCurrentMonth }).map((_, i) => (
                                            <td key={i} className="p-1 text-center border-r border-current/20">
                                                <div className="flex items-center justify-center">
                                                    <input
                                                        type="checkbox"
                                                        className="appearance-none w-3.5 h-3.5 border-2 border-current rounded-sm checked:bg-[var(--fg)] cursor-pointer transition-all relative after:content-['✓'] after:absolute after:text-[var(--bg)] after:text-[10px] after:top-[-2px] after:left-[1px] after:hidden checked:after:block hover:scale-110"
                                                        checked={!!dailyHabitsData[getDailyKey(habit, i)]}
                                                        onChange={() => toggleDaily(habit, i)}
                                                    />
                                                </div>
                                            </td>
                                        ))}
                                        <td className="p-3 text-center font-bold font-['Geo'] text-lg">
                                            {rowCompleted}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Section 3: Checklists (Tabs) */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
                <div className="flex flex-col">
                    {/* Folder Tabs */}
                    <div className="flex gap-1 pl-2">
                        {['weekly', 'monthly'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setChecklistTab(tab)}
                                className={`px-6 py-2 font-bold text-sm tracking-uppercase border-2 border-b-0 border-current transition-all capitalize ${checklistTab === tab
                                    ? 'bg-[var(--fg)] text-[var(--bg)] translate-y-[2px]'
                                    : 'bg-[var(--bg)] hover:bg-[var(--fg)]/10'
                                    }`}
                                style={{
                                    borderRadius: '8px 8px 0 0'
                                }}
                            >
                                {tab} Tasks
                            </button>
                        ))}
                    </div>

                    {/* Content Container */}
                    <div className="border-2 border-current p-6 bg-[var(--bg)] min-h-[250px]">

                        {/* Weekly Content */}
                        {checklistTab === 'weekly' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fadeIn">
                                {weeksInMonth.map((week, wIdx) => (
                                    <div key={wIdx} className="border-l-4 border-current pl-4 py-1">
                                        <div className="font-bold mb-3 text-lg font-['Geo']">{week}</div>
                                        <div className="flex flex-col gap-3">
                                            {weeklyHabitsList.map((h, i) => (
                                                <label key={i} className="flex items-center gap-2 text-sm cursor-pointer hover:opacity-70 transition-opacity">
                                                    <input
                                                        type="checkbox"
                                                        className="appearance-none w-3.5 h-3.5 border-2 border-current checked:bg-[var(--fg)] cursor-pointer relative after:content-['✓'] after:absolute after:text-[var(--bg)] after:text-[9px] after:top-[0px] after:left-[1px] after:hidden checked:after:block"
                                                        checked={!!weeklyHabitsData[getWeeklyKey(h, wIdx)]}
                                                        onChange={() => toggleWeekly(h, wIdx)}
                                                    />
                                                    <span className="font-medium">{h}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Monthly Content */}
                        {checklistTab === 'monthly' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
                                <div className="p-2">
                                    <h3 className="font-bold font-['Geo'] text-xl mb-4">Review & Plan</h3>
                                    <div className="flex flex-col gap-4">
                                        {monthlyHabitsList.map((h, i) => (
                                            <label key={i} className="flex items-center gap-3 text-lg cursor-pointer hover:bg-[var(--fg)]/5 p-2 rounded transition-colors">
                                                <input
                                                    type="checkbox"
                                                    className="appearance-none w-5 h-5 border-2 border-current checked:bg-[var(--fg)] cursor-pointer relative after:content-['✓'] after:absolute after:text-[var(--bg)] after:text-[12px] after:top-[0px] after:left-[2px] after:hidden checked:after:block"
                                                    checked={!!monthlyHabitsData[getMonthlyKey(h)]}
                                                    onChange={() => toggleMonthly(h)}
                                                />
                                                <span className="font-medium">{h}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div className="border-l-2 border-current/20 pl-6 flex flex-col justify-center opacity-60">
                                    <p className="italic font-['Grandstander']">"Goals are dreams with deadlines."</p>
                                    <p className="text-sm mt-2">- Napoleon Hill</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Checklist Pie */}
                <div className="border-2 border-current p-0 flex flex-col items-center justify-center relative min-h-[200px] mt-10">
                    <div className="absolute top-0 left-0 w-full bg-[var(--fg)] text-[var(--bg)] text-center py-1 font-bold text-xs tracking-wider uppercase">
                        {checklistTab} GOAL
                    </div>
                    <div className="w-full h-full pt-8 px-4">
                        <ResponsiveContainer width="100%" height={180}>
                            <PieChart>
                                <Pie
                                    data={checklistPieData}
                                    innerRadius={50}
                                    outerRadius={70}
                                    startAngle={180}
                                    endAngle={0}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    <Cell fill="currentColor" opacity={1} />
                                    <Cell fill="currentColor" opacity={0.15} />
                                </Pie>
                                <text x="50%" y="60%" textAnchor="middle" fill="currentColor" className="text-xl font-bold font-['Geo']">
                                    {checklistProgress}%
                                </text>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HabitTracker;
