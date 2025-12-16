import React, { useState } from 'react';

const AiTools = () => {
  const [activeTab, setActiveTab] = useState('chatters');

  // Categories with their tools - expanded with more tools
  const categories = {
    chatters: {
      label: "Chatters",
      tools: [
        { name: "ChatGPT", url: "https://chatgpt.com/", icon: <svg viewBox="0 0 24 24" className="w-8 h-8 md:w-10 md:h-10 fill-current"><path d="M12.3 2.1c-.2.2-.4.4-.7.6-5.8 4.1-7.1 12.5-2.8 18 .8 1 2.3 2.5 3 2.8.2.1.5.2.7.2.2 0 .5-.1.7-.2 5.8-4.1 7.1-12.5 2.8-18-.8-1-2.3-2.5-3-2.8-.2-.1-.5-.2-.7-.2z" /></svg> },
        { name: "Claude", url: "https://claude.ai/new/", icon: <div className="text-xl font-bold">C</div> },
        { name: "Gemini", url: "https://gemini.google.com/app", icon: <svg viewBox="0 0 48 48" className="w-8 h-8 md:w-10 md:h-10 fill-current"><path d="M45.963,23.959C34.056,23.489,24.51,13.944,24.041,2.037L24,1l-0.041,1.037C23.49,13.944,13.944,23.489,2.037,23.959L1,24l1.037,0.041c11.907,0.47,21.452,10.015,21.922,21.922L24,47l0.041-1.037c0.47-11.907,10.015-21.452,21.922-21.922L47,24L45.963,23.959z" /></svg> },
        { name: "Grok", url: "https://grok.x.ai", icon: <div className="text-xl font-bold">G</div> },
        { name: "DeepSeek", url: "https://chat.deepseek.com", icon: <div className="text-xl font-bold">D</div> },
        { name: "Copilot", url: "https://copilot.microsoft.com", icon: <div className="text-xl font-bold">Cp</div> },
        { name: "Mistral", url: "https://chat.mistral.ai/", icon: <div className="text-xl font-bold">Mi</div> },
        { name: "Pi", url: "https://pi.ai/", icon: <div className="text-xl font-bold">Pi</div> },
        { name: "Poe", url: "https://poe.com/", icon: <div className="text-xl font-bold">Po</div> },
        { name: "HuggingChat", url: "https://huggingface.co/chat/", icon: <div className="text-xl font-bold">HF</div> },
      ]
    },
    research: {
      label: "Research",
      tools: [
        { name: "Perplexity", url: "https://www.perplexity.ai/", icon: <svg viewBox="0 0 50 50" className="w-8 h-8 md:w-10 md:h-10 fill-current"><path d="M 5 5 L 5 45 L 45 45 L 45 5 L 5 5 z M 35 8.7734375 L 35 18 L 39 18 L 39 32 L 35 32 L 35 41.351562 L 26 33.351562 L 26 40 L 24 40 L 24 33.226562 L 15 41.226562 L 15 32 L 11 32 L 11 18 L 15 18 L 15 8.8984375 L 24 16.898438 L 24 9.125 L 26 9.125 L 26 16.773438 L 35 8.7734375 z" /></svg> },
        { name: "Elicit", url: "https://elicit.com/", icon: <div className="text-xl font-bold">E</div> },
        { name: "Consensus", url: "https://consensus.app/", icon: <div className="text-xl font-bold">Co</div> },
        { name: "Semantic", url: "https://www.semanticscholar.org/", icon: <div className="text-xl font-bold">S</div> },
        { name: "Notion AI", url: "https://notion.so/product/ai", icon: <div className="text-xl font-bold">N</div> },
        { name: "SciSpace", url: "https://typeset.io/", icon: <div className="text-xl font-bold">Sc</div> },
        { name: "Scholarcy", url: "https://www.scholarcy.com/", icon: <div className="text-xl font-bold">Sy</div> },
        { name: "Connected", url: "https://www.connectedpapers.com/", icon: <div className="text-xl font-bold">CP</div> },
        { name: "Scite", url: "https://scite.ai/", icon: <div className="text-xl font-bold">St</div> },
        { name: "You.com", url: "https://you.com/", icon: <div className="text-xl font-bold">Y</div> },
      ]
    },
    coding: {
      label: "Coding",
      tools: [
        { name: "Cursor", url: "https://cursor.com", icon: <svg viewBox="0 0 24 24" className="w-8 h-8 md:w-10 md:h-10 fill-current"><path d="M13.8 2.3l-9.3 9.3 9.3 9.3 2.1-2.1-5.7-5.7h11.4v-3H10.2l5.7-5.7z" /></svg> },
        { name: "Copilot", url: "https://github.com/features/copilot", icon: <div className="text-xl font-bold">GH</div> },
        { name: "Replit", url: "https://replit.com/", icon: <div className="text-xl font-bold">R</div> },
        { name: "v0", url: "https://v0.dev/", icon: <div className="text-xl font-bold">v0</div> },
        { name: "Bolt", url: "https://bolt.new/", icon: <div className="text-xl font-bold">B</div> },
        { name: "Codeium", url: "https://codeium.com/", icon: <div className="text-xl font-bold">Cd</div> },
        { name: "Tabnine", url: "https://www.tabnine.com/", icon: <div className="text-xl font-bold">Tb</div> },
        { name: "Lovable", url: "https://lovable.dev/", icon: <div className="text-xl font-bold">Lv</div> },
        { name: "Windsurf", url: "https://codeium.com/windsurf", icon: <div className="text-xl font-bold">Ws</div> },
        { name: "Aider", url: "https://aider.chat/", icon: <div className="text-xl font-bold">Ai</div> },
      ]
    },
    creative: {
      label: "Creative",
      tools: [
        { name: "Midjourney", url: "https://www.midjourney.com", icon: <div className="text-xl font-bold">M</div> },
        { name: "DALL-E", url: "https://openai.com/dall-e-3", icon: <div className="text-xl font-bold">DE</div> },
        { name: "Runway", url: "https://runwayml.com/", icon: <div className="text-xl font-bold">Rw</div> },
        { name: "Suno", url: "https://suno.ai/", icon: <div className="text-xl font-bold">Su</div> },
        { name: "ElevenLabs", url: "https://elevenlabs.io/", icon: <div className="text-xl font-bold">11</div> },
        { name: "Leonardo", url: "https://leonardo.ai/", icon: <div className="text-xl font-bold">Le</div> },
        { name: "Ideogram", url: "https://ideogram.ai/", icon: <div className="text-xl font-bold">Id</div> },
        { name: "Udio", url: "https://www.udio.com/", icon: <div className="text-xl font-bold">Ud</div> },
        { name: "Pika", url: "https://pika.art/", icon: <div className="text-xl font-bold">Pk</div> },
        { name: "Krea", url: "https://www.krea.ai/", icon: <div className="text-xl font-bold">Kr</div> },
      ]
    },
  };

  const tabKeys = Object.keys(categories);

  return (
    <div className="w-full">
      {/* Tab Section with clip-path - Multiple Tabs with gaps */}
      <div className="flex items-end relative z-20 gap-1">
        {tabKeys.map((key, index) => (
          <div
            key={key}
            onClick={() => setActiveTab(key)}
            className={`h-10 cursor-pointer transition-all duration-200 ${activeTab === key
              ? 'bg-[var(--fg)]'
              : 'bg-[var(--fg)]/60 hover:bg-[var(--fg)]/80'
              }`}
            style={{
              width: '110px',
              clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 100%, 0 100%)',
              zIndex: activeTab === key ? 10 : tabKeys.length - index,
            }}
          >
            <div className="px-2 pr-4 py-2 flex items-center justify-center">
              <span className="text-[var(--bg)] font-bold text-sm select-none whitespace-nowrap">
                {categories[key].label}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Folder Body - Taller to fill space */}
      <div className="w-full h-44 lg:h-44 border-2 border-current bg-[var(--bg)] relative z-10 p-4">
        <div
          className="flex gap-4 h-full items-center overflow-x-auto px-2 pb-2"
          style={{ scrollbarWidth: 'thin', scrollbarColor: 'var(--fg) var(--bg)' }}
        >
          {categories[activeTab].tools.map((tool, idx) => (
            <a
              key={`${tool.name}-${idx}`}
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 group cursor-pointer hover:-translate-y-1 transition-transform min-w-[70px]"
            >
              <div className="w-12 h-12 md:w-13 md:h-13 border-2 border-current flex items-center justify-center bg-[var(--bg)] group-hover:bg-[var(--fg)] group-hover:text-[var(--bg)] transition-colors shadow-[2px_2px_0px_0px_var(--fg)] overflow-hidden p-2">
                {tool.icon}
              </div>
              <span className="text-[10px] md:text-xs font-bold text-center leading-tight whitespace-nowrap">{tool.name}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AiTools;
