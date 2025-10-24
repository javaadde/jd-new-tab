import React from "react";

export default function GoogleApps({ googleApps, showGoogleApps }) {
  return (
    showGoogleApps && (
      <div className="fixed top-20 right-6 w-96 bg-zinc-900 rounded-3xl p-5 shadow-2xl z-50 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold"></h3>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {googleApps.map((app) => (
            <a
              key={app.name}
              href={app.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 p-3 hover:bg-zinc-800 rounded-2xl transition-colors group"
            >
              <div className="w-12 h-12 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox={app.viewBox || "0 0 24 24"}
                  className="w-10 h-10"
                >
                  <path fill="white" d={app.icon} />
                </svg>
              </div>
              <span className="text-xs text-center text-zinc-300 group-hover:text-white transition-colors">
                {app.name}
              </span>
            </a>
          ))}
        </div>
      </div>
    )
  );
}
