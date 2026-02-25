"use client";

export default function ChatIndexPage() {
  return (
    // ✅ flex-1 instead of h-full — this lives inside a flex-col parent (SidebarInset > main)
    // h-full doesn't reliably fill flex containers; flex-1 does
      <div className="hidden md:flex flex-col items-center justify-center h-full w-full bg-[#0f1014] relative overflow-hidden text-gray-100 font-sans">
      
      {/* --- Background Ambience --- */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[30rem] sm:w-[40rem] md:w-[50rem] h-[30rem] sm:h-[40rem] md:h-[50rem] bg-purple-900/20 rounded-full mix-blend-screen filter blur-[100px] opacity-40 animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[30rem] sm:w-[40rem] md:w-[50rem] h-[30rem] sm:h-[40rem] md:h-[50rem] bg-indigo-900/10 rounded-full mix-blend-screen filter blur-[100px] opacity-30"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:3rem_3rem] sm:bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] pointer-events-none" />
      </div>

      {/* --- Main Content --- */}
      <div className="text-center px-6 py-8 sm:p-8 max-w-xs sm:max-w-md md:max-w-2xl z-10 flex flex-col items-center animate-in fade-in zoom-in duration-700">
        
        <div className="group relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center mb-6 sm:mb-8 md:mb-10 shadow-[0_0_40px_rgba(168,85,247,0.1)] transform transition-all duration-500 hover:scale-110 hover:rotate-3 hover:border-purple-500/40">
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-indigo-500/20 rounded-[1.5rem] md:rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <svg className="w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 text-gray-400 group-hover:text-white transition-colors duration-300 drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
          </svg>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 sm:mb-5 md:mb-6 tracking-tighter uppercase leading-[0.9] drop-shadow-2xl">
          No Channel <br />Selected
        </h2>

        <p className="text-gray-400 text-sm sm:text-base md:text-lg font-medium leading-relaxed max-w-[16rem] sm:max-w-xs md:max-w-md mb-8 sm:mb-10 md:mb-12 tracking-wide">
          Heloo Vaibhav and vinit Sir🫡
        </p>

        <div className="mb-6 sm:mb-8">
          <span className="bg-purple-500/10 border border-purple-500/20 px-4 sm:px-6 py-2 rounded-full text-[0.6rem] sm:text-xs font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-purple-300 shadow-[0_0_20px_rgba(168,85,247,0.15)] animate-pulse">
            Waiting for input...
          </span>
        </div>
      </div>
    </div>
  );
}