"use client";
import Link from "next/link";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useState } from "react";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen h-screen bg-[#0f1014] text-gray-100 font-sans selection:bg-purple-500/30 selection:text-white overflow-hidden relative flex flex-col">
      
      {/* --- Background Ambience --- */}
      <div className="absolute inset-0 pointer-events-none">
         {/* Top Left Glow */}
         <div className="absolute top-[-20%] left-[-10%] w-[50rem] h-[50rem] bg-purple-900/20 rounded-full mix-blend-screen filter blur-[100px] opacity-40 animate-pulse"></div>
         {/* Bottom Right Glow */}
         <div className="absolute bottom-[-20%] right-[-10%] w-[50rem] h-[50rem] bg-indigo-900/10 rounded-full mix-blend-screen filter blur-[100px] opacity-30"></div>
         
         {/* Grid Texture Overlay (Optional for tech feel) */}
         <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] pointer-events-none" />
      </div>

      {/* --- NAVBAR --- */}
      <nav className="w-full mx-auto px-6 h-20 flex items-center justify-between relative z-50 border-b border-white/5 bg-white/[0.01] backdrop-blur-sm">
        
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="w-10 h-10 bg-linear-to-tr from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(124,58,237,0.3)] group-hover:rotate-6 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <span className="text-xl font-bold tracking-wide text-gray-100 group-hover:text-purple-300 transition-colors">
            Tars Chat<span className="text-purple-500">.</span>
          </span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-widest text-gray-500">
          <a href="https://thegauravthakur.in" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors hover:scale-105 transform">
            Portfolio
          </a>
          <a href="https://github.com/2405Gaurav" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors hover:scale-105 transform">
            GitHub
          </a>
          <span className="w-px h-4 bg-white/10"></span>
          <span className="text-purple-400/80 cursor-default">Assignment</span>
        </div>

        {/* Right: Auth & Menu */}
        <div className="flex items-center gap-4">
          <SignedIn>
            <div className="p-0.5 rounded-full border border-purple-500/30 shadow-[0_0_10px_rgba(168,85,247,0.2)]">
                <UserButton afterSignOutUrl="/" appearance={{ elements: { userButtonAvatarBox: "w-8 h-8" }}} />
            </div>
          </SignedIn>
          
          <SignedOut>
             <SignInButton mode="modal">
                <button className="bg-white/5 border border-white/10 hover:bg-purple-600/20 hover:border-purple-500/50 hover:text-purple-300 text-gray-300 px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all shadow-lg backdrop-blur-md">
                  Login
                </button>
             </SignInButton>
          </SignedOut>

          {/* Mobile Toggle */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-gray-400 hover:text-white transition-colors">
            {isMenuOpen ? (
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown (Glass) */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-20 inset-x-0 bg-[#0f1014]/95 backdrop-blur-2xl border-b border-white/10 p-6 z-40 flex flex-col gap-6 text-center shadow-2xl animate-in slide-in-from-top-5">
           <a href="https://thegauravthakur.in" className="text-gray-300 font-bold uppercase tracking-widest hover:text-purple-400">Portfolio</a>
           <a href="https://github.com/2405Gaurav" className="text-gray-300 font-bold uppercase tracking-widest hover:text-purple-400">GitHub</a>
        </div>
      )}

      {/* --- HERO CONTENT --- */}
      <main className="flex-1 flex flex-col items-center mt-1 justify-center text-center px-4 relative z-10 w-full max-w-5xl mx-auto pb-10">
        
    

        {/* Headline */}
        <h1 className="text-5xl md:text-6xl lg:text-[6rem] font-black uppercase tracking-tighter mt-3 leading-[0.9] mb-8  drop-shadow-xl text-white">
          Group Chat <br />
          That&apos;s All <br />
          Fun & Games
        </h1>

        {/* Subtext */}
        <p className="max-w-2xl text-base md:text-lg font-medium leading-relaxed mb-8 text-gray-200 tracking-wide">
          Tars Chat is great for playing games and chilling with friends, or even building a worldwide community. 
          Customize your own space to talk, play, and hang out.
        </p>

        {/* Main Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-5 w-full justify-center mb-16 animate-in slide-in-from-bottom-5 duration-1000 fill-mode-backwards">
          <SignedIn>
            <Link 
              href="/chat" 
              className="group relative bg-purple-600 hover:bg-purple-500 text-white px-8 py-4 rounded-xl text-lg font-bold shadow-[0_0_30px_rgba(147,51,234,0.3)] hover:shadow-[0_0_50px_rgba(147,51,234,0.5)] transition-all transform hover:-translate-y-1"
            >
              <span className="flex items-center gap-3">
                Open Chat
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 group-hover:translate-x-1 transition-transform">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </span>
            </Link>
          </SignedIn>

          <SignedOut>
            <SignInButton mode="modal">
                <button className="group bg-white/5 border border-white/10 hover:bg-white/10 text-gray-200 px-8 py-4 rounded-xl text-lg font-bold transition-all flex items-center gap-3 hover:border-purple-500/30">
                  Login to Start
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 group-hover:text-purple-400 transition-colors">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                  </svg>
                </button>
            </SignInButton>
          </SignedOut>
        </div>

        {/* Tech Stack - Glass Cards */}
        <div className="w-full flex justify-center">
            <div className="bg-[#1a1b23]/40 backdrop-blur-md border border-white/5 rounded-2xl p-4 md:p-6 flex flex-wrap justify-center gap-6 md:gap-10 shadow-2xl max-w-4xl">
               <TechItem name="Next.js" icon="▲" delay="0" />
               <TechItem name="Convex" icon="C" delay="100" />
               <TechItem name="Clerk" icon="🔒" delay="200" />
               <TechItem name="Tailwind" icon="🌊" delay="300" />
               <TechItem name="Shadcn" icon="UI" delay="400" />
            </div>
        </div>

      </main>
    </div>
  );
}

// Tech Stack "Card" Component
function TechItem({ name, icon, delay }: { name: string; icon: string; delay: string }) {
    return (
        <div 
            className="flex flex-col items-center gap-2 group cursor-help"
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className="w-12 h-12 bg-white/5 border border-white/5 group-hover:border-purple-500/50 group-hover:bg-purple-500/10 rounded-xl flex items-center justify-center text-lg font-bold text-gray-400 group-hover:text-purple-300 transition-all duration-300 transform group-hover:-translate-y-2 group-hover:rotate-3 shadow-lg">
                {icon}
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600 group-hover:text-gray-300 transition-colors">
                {name}
            </span>
        </div>
    )
}