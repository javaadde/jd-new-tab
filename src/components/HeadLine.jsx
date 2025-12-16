import React from 'react';

const HeadLine = () => {
  return (
    <div className="flex items-end  select-none">
      {/* "Keeeep" Vertical Text */}
      <div className="flex flex-col justify-end pb-6">
        <span
          className="text-xl md:text-2xl font-bold tracking-[0.2em] opacity-92 uppercase"
          style={{
            writingMode: 'vertical-lr',
            transform: 'rotate(180deg)',
            textOrientation: 'mixed'
          }}
        >
          Keeeep
        </span>
      </div>

      {/* "Exploring" Main Text */}
      <h1 className="text-8xl lg:text-[11.2rem] font-bold leading-[0.8] tracking-tighter">
        Exploring
      </h1>
    </div>
  );
};

export default HeadLine;
