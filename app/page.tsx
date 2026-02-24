"use client";
import Link from "next/link";
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    // Base: Discord-like dark gray background (#36393f approx) and white text
    <div className="min-h-screen bg-slate-800 text-gray-100 font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Navigation Bar - Darker tone (#202225 approx) */}
      <nav className="bg-slate-900 border-b border-slate-900/50 fixed top-0 w-full z-50 h-16 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex justify-between items-center">
          
          {/* Brand/Logo - Simple & Bold */}
          <div className="flex items-center gap-3">
            <div className="bg-indigo-500 p-1.5 rounded-md shadow-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5 text-white"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <span className="text-xl font-extrabold tracking-tight text-white uppercase font-sans">
              Tars
            </span>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-4">
            <SignedIn>
              <Link
                href="/chat"
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors hover:underline decoration-indigo-500 underline-offset-4 mr-2"
              >
                Open Chat
              </Link>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            
            <SignedOut>
              <SignInButton mode="modal">
                <button className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                  Login
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                {/* "Blurple" Button Style */}
                <button className="text-sm font-medium bg-indigo-500 text-white px-4 py-1.5 rounded hover:bg-indigo-400 transition-all shadow-sm">
                  Sign Up
                </button>
              </SignUpButton>
            </SignedOut>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 flex flex-col items-center text-center justify-center min-h-[90vh]">
        
        {/* Status Badge - Darker container, Green 'Online' dot */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 text-gray-300 text-xs font-bold uppercase tracking-wide mb-8">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
          </span>
          Internship Coding Challenge 2026
        </div>

        {/* Main Heading - Heavy font weight */}
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white mb-6">
          IMAGINE A <br />
          <span className="text-indigo-400">PLACE...</span>
        </h1>

        {/* Subtitle - Softer gray (#dcddde approx) */}
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
          ...where you can belong to a school club, a gaming group, or a worldwide art community. 
          Built with Next.js, Convex, and Clerk.
        </p>

        {/* Call to Action Buttons - Squarer, simple hover effects */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full sm:w-auto">
          <SignedIn>
            <Link
              href="/chat"
              className="bg-indigo-500 text-white px-8 py-3 rounded text-lg font-medium hover:bg-indigo-400 transition-all w-full sm:w-auto shadow-sm"
            >
              Enter Tars
            </Link>
          </SignedIn>

          <SignedOut>
            <SignUpButton mode="modal">
              <button className="bg-indigo-500 text-white px-8 py-3 rounded text-lg font-medium hover:bg-indigo-400 transition-all w-full sm:w-auto shadow-sm">
                Open in Browser
              </button>
            </SignUpButton>
            
            <SignInButton mode="modal">
              <button className="bg-slate-700 text-white px-8 py-3 rounded text-lg font-medium hover:bg-slate-600 transition-all w-full sm:w-auto shadow-sm">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
        </div>
      </main>
    </div>
  );
}