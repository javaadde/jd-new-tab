const HeadLine = () => {
  return (
    <div className="flex flex-col select-none relative">
      {/* "Keep" positioned absolutely over the "E" of Exploring */}
      <h2 className="text-xl md:text-3xl font-bold opacity-90 absolute mb-2 top-0  left-3">Keep</h2>
      <h1 className="text-8xl lg:text-[11.2rem] font-bold leading-[0.8]  tracking-tighter mt-2">
        Exploring
      </h1>
    </div>
  );
};

export default HeadLine;
