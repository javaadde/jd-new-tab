/* eslint-disable react/prop-types */
import React from 'react';
import { HeadLine, HeaderClock, SearchWidget, HabitGraph, AiTools, Footer } from '../components';

const Home = ({ theme, onThemeChange, onBookmarkClick }) => {
    return (
        <div className="w-full max-w-[1800px] mx-auto flex-1 flex flex-col justify-between overflow-hidden">
            <div className="flex-1 flex flex-col justify-center">
                <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-x-8 gap-y-2 items-end">
                    {/* Left Column */}
                    <div className="flex flex-col justify-end gap-2 mb-5 pb-4">
                        <HeadLine />
                        <div className="w-full pl-1 mt-8">
                            <SearchWidget />
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="flex flex-col gap-4 items-end pb-8">
                        <HeaderClock />
                        <div className="w-full h-48">
                            <HabitGraph />
                        </div>
                    </div>
                </div>

                {/* AI Tools Section */}
                <div className="w-full">
                    <AiTools />
                </div>
            </div>

            {/* Footer - Only on Home */}
            <div className="w-full pb-2 shrink-0">
                <Footer
                    currentTheme={theme}
                    onThemeChange={onThemeChange}
                    onBookmarkClick={onBookmarkClick}
                />
            </div>
        </div>
    );
};

export default Home;
