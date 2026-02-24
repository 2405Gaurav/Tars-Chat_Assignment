"use client";
import Link from "next/link";
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100">
      {/* Navigation Bar */}
      <nav className="border-b border-blue-100 bg-white/80 backdrop-blur-md fixed top-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          {/* Brand/Logo */}
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5 text-white"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-blue-900">
              TARS
            </span>
          </div>

          {/* Auth Buttons / Navbar links */}
          <div className="flex items-center gap-4">
            {/* What logged-in users see */}
            <SignedIn>
              <Link
                href="/chat"
                className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors mr-2"
              >
                Go to Chat
              </Link>
              {/* This adds the Profile picture with a Sign Out option */}
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            
            {/* What logged-out users see */}
            <SignedOut>
              <SignInButton mode="modal">
                <button className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-all shadow-sm hover:shadow-md">
                  Sign Up
                </button>
              </SignUpButton>
            </SignedOut>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 flex flex-col items-center text-center justify-center min-h-[90vh]">
        
        {/* Small Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold mb-8 border border-blue-100 shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
          </span>
          Internship Coding Challenge 2026
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6">
          TARS <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">Assignment</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          A real-time Live chat messaging web app built using Next.js, TypeScript, Convex, and Clerk. Connect, discover users, and message them seamlessly.
        </p>

        {/* Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full sm:w-auto">
          <SignedIn>
            <Link
              href="/chat"
              className="group flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-3.5 rounded-full font-medium hover:bg-blue-700 transition-all shadow-md hover:shadow-lg text-lg w-full sm:w-auto"
            >
              Open Chatroom
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </SignedIn>

          <SignedOut>
            <SignUpButton mode="modal">
              <button className="group flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-3.5 rounded-full font-medium hover:bg-blue-700 transition-all shadow-md hover:shadow-lg text-lg w-full sm:w-auto">
                Get Started
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </SignUpButton>
            
            <SignInButton mode="modal">
              <button className="flex items-center justify-center gap-2 bg-white text-slate-700 border border-slate-200 px-8 py-3.5 rounded-full font-medium hover:bg-slate-50 hover:border-blue-200 hover:text-blue-600 transition-all text-lg w-full sm:w-auto">
                Sign in to account
              </button>
            </SignInButton>
          </SignedOut>
        </div>
      </main>
    </div>
  );
}