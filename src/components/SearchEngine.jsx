import React from "react";

export default function SearchEngine({
  searchEngines = [],
  searchEngine = "google",
  setSearchEngine,
  showEngineDropdown,
  setShowEngineDropdown,
  searchQuery,
  setSearchQuery,
  handleSearch,
}) {
  return (
    <div className="w-full max-w-2xl">
      <form
        onSubmit={handleSearch}
        className="relative bg-gray-800 border-1  border-gray-700 rounded-full flex items-center"
      >
        <div className="pl-5 pr-3">
          <svg width="24" height="24" viewBox="0 0 45 45" fill="none">
            <path
              fill="white"
              fillRule="evenodd"
              clipRule="evenodd"
              d="M5 20.014A15.01 15.01 0 0 1 9.399 9.4a15.012 15.012 0 0 1 21.229 0 15.01 15.01 0 0 1 4.396 10.614 15.01 15.01 0 0 1-4.396 10.614 15.012 15.012 0 0 1-21.23 0 15.01 15.01 0 0 1-4.396-10.614ZM20.013 0A20.016 20.016 0 0 0 3.729 8.38a20.013 20.013 0 0 0 2.417 26.063 20.015 20.015 0 0 0 17.547 5.244 20.015 20.015 0 0 0 8.593-3.862l8.474 8.473a2.502 2.502 0 0 0 3.538-3.538l-8.474-8.473a20.013 20.013 0 0 0 2.166-21.075A20.016 20.016 0 0 0 20.012 0Zm0 30.02a10.008 10.008 0 0 0 7.076-2.93 10.007 10.007 0 0 0 0-14.152 10.008 10.008 0 0 0-17.084 7.076A10.007 10.007 0 0 0 20.012 30.02Z"
            />
          </svg>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setShowEngineDropdown(!showEngineDropdown)}
            className="flex items-center gap-2 px-3 py-2 hover:bg-gray-700 rounded-full transition-colors"
          >
            <div className="flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d={searchEngines.find((e) => e.id === searchEngine)?.icon} />
              </svg>
              <span className="text-sm text-zinc-300">
                {searchEngines.find((e) => e.id === searchEngine)?.name || "Search"}
              </span>
            </div>
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>

          {showEngineDropdown && (
            <div className="absolute top-full left-0 mt-2 w-48 max-h-[280px] overflow-y-auto hide-scrollbar bg-gray-800 rounded-2xl shadow-xl z-50">
              {searchEngines?.map((engine) => (
                <button
                  key={engine.id}
                  type="button"
                  onClick={() => {
                    setSearchEngine(engine.id);
                    setShowEngineDropdown(false);
                  }}
                  className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-700 transition-colors flex items-center gap-3 ${
                    searchEngine === engine.id ? "bg-gray-700 text-white" : "text-zinc-300"
                  }`}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d={engine.icon} />
                  </svg>
                  {engine.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Type here..."
          className="flex-1 bg-transparent text-white px-4 py-4 text-base focus:outline-none"
        />

        <button
          type="submit"
          className="mr-2 cursor-pointer px-6 py-2 bg-[#5320de] hover:bg-[#5d2de1] text-white rounded-full text-sm font-medium transition-colors"
        >
          Search
        </button>
      </form>
    </div>
  );
}