export default function ChatIndexPage() {
  return (
    <div className="hidden md:flex flex-col items-center justify-center h-full bg-slate-700 w-full relative overflow-hidden">
      
      {/* Subtle Background Pattern (Optional decoration) */}
      <div className="absolute inset-0 pointer-events-none opacity-5 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-slate-900 to-transparent"></div>

      <div className="text-center p-8 max-w-md z-10 flex flex-col items-center">
        
        {/* Hero Graphic - Squircle shape common in gaming UIs */}
        <div className="w-24 h-24 bg-slate-800 rounded-3xl flex items-center justify-center mb-6 shadow-2xl border-t border-slate-600 transform -rotate-3 transition-transform hover:rotate-0">
          <svg
            className="w-12 h-12 text-indigo-400"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M13 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H7a1 1 0 110-2h5V4a1 1 0 011-1z" />
          </svg>
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-bold text-gray-200 mb-3 tracking-wide uppercase">
          No Channel Selected
        </h2>

        {/* Description */}
        <p className="text-gray-400 text-sm leading-relaxed max-w-xs mb-8">
          You find yourself in a strange place. You can select a user from the sidebar to start chatting.
        </p>

        {/* Non-clickable Visual Cue */}
        <div className="px-5 py-2 bg-slate-800/50 rounded text-xs font-mono text-gray-500 border border-slate-600/50 select-none">
          Waiting for input...
        </div>
      </div>
    </div>
  );
}