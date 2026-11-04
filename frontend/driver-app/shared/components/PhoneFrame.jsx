import React, { useState, useEffect } from 'react';
import { UberLogo } from './Icons';

export function PhoneFrame({
  appType = 'rider', // 'rider' | 'driver'
  title = 'Rider App',
  subtitle = 'Book a Ride. Move Freely.',
  activeScreen = 0,
  screenTabs = [],
  onSelectScreen,
  children,
}) {
  const [time, setTime] = useState('9:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hrs = now.getHours();
      const mins = now.getMinutes().toString().padStart(2, '0');
      setTime(`${hrs % 12 || 12}:${mins}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const isRider = appType === 'rider';

  return (
    <div className="min-h-screen bg-[#0a0d12] text-white flex flex-col items-center justify-start p-4 sm:p-6 lg:p-8 relative overflow-x-hidden selection:bg-emerald-500 selection:text-black">
      {/* Ambient glowing radial backdrop */}
      <div
        className={`absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full blur-[140px] pointer-events-none opacity-25 ${
          isRider ? 'bg-gradient-to-b from-blue-600 via-emerald-600 to-transparent' : 'bg-gradient-to-b from-emerald-500 via-teal-700 to-transparent'
        }`}
      />

      {/* Top Uber Branding Bar on the Website */}
      <header className="w-full max-w-5xl flex flex-wrap items-center justify-between gap-4 mb-6 z-10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <UberLogo className="h-8 sm:h-9 text-white" />
            <span className="text-2xl font-light text-zinc-600">|</span>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">{title}</h1>
              <p className="text-xs font-semibold tracking-wide text-zinc-400">{subtitle}</p>
            </div>
          </div>
        </div>

        {/* Quick Switch to the other app */}
        <div className="flex items-center gap-2">
          {isRider ? (
            <a
              href="http://localhost:5174"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-700/80 text-xs font-bold text-zinc-300 hover:text-white hover:border-emerald-500 transition-colors shadow-sm"
            >
              <span>Switch to Driver App</span>
              <span className="text-emerald-400 font-extrabold">→</span>
            </a>
          ) : (
            <a
              href="http://localhost:5173"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-700/80 text-xs font-bold text-zinc-300 hover:text-white hover:border-blue-500 transition-colors shadow-sm"
            >
              <span>Switch to Rider App</span>
              <span className="text-blue-400 font-extrabold">→</span>
            </a>
          )}
        </div>
      </header>

      {/* Screen Navigation Selector for Judges & Testing */}
      {screenTabs && screenTabs.length > 0 && (
        <div className="w-full max-w-5xl mb-6 z-10 flex flex-wrap items-center justify-center gap-1.5 p-1.5 rounded-2xl bg-zinc-900/90 border border-zinc-800 backdrop-blur-md shadow-lg">
          <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider px-2 hidden sm:inline">
            Screens:
          </span>
          {screenTabs.map((tab, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectScreen?.(idx)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeScreen === idx
                  ? 'bg-white text-black shadow-md scale-[1.02]'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      )}

      {/* Main Realistic Phone Frame */}
      <div className="relative my-auto z-20">
        {/* Left Side Buttons (Volume Up / Down / Action) */}
        <div className="absolute -left-[14px] top-28 w-[4px] h-11 bg-zinc-700 rounded-l-md" />
        <div className="absolute -left-[14px] top-44 w-[4px] h-12 bg-zinc-700 rounded-l-md" />
        <div className="absolute -left-[14px] top-60 w-[4px] h-12 bg-zinc-700 rounded-l-md" />
        {/* Right Side Power Button */}
        <div className="absolute -right-[14px] top-36 w-[4px] h-16 bg-zinc-700 rounded-r-md" />

        {/* Titanium Outer Chassis */}
        <div className="relative w-[375px] sm:w-[390px] h-[812px] sm:h-[844px] rounded-[52px] p-[10px] bg-gradient-to-b from-[#2a2e36] via-[#1b1e24] to-[#121418] shadow-[0_25px_70px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.14)] ring-1 ring-black">
          {/* Inner Screen Bezel */}
          <div className="relative w-full h-full rounded-[42px] overflow-hidden bg-white text-zinc-900 flex flex-col shadow-inner">
            {/* iOS Status Bar */}
            <div className="relative h-11 px-7 pt-2 flex items-center justify-between text-black text-xs font-semibold select-none z-50">
              <span className="font-bold tracking-tight text-[13px]">{time}</span>

              {/* Dynamic Island Pill */}
              <div className="absolute left-1/2 -translate-x-1/2 top-2 h-6 w-24 bg-black rounded-full flex items-center justify-end pr-2.5 gap-1.5 shadow-md">
                <span className="size-2.5 rounded-full bg-[#111827] border border-zinc-800" />
                <span className="size-2.5 rounded-full bg-[#030712] border border-blue-950 flex items-center justify-center">
                  <span className="size-1 rounded-full bg-blue-900" />
                </span>
              </div>

              {/* Status Icons: Signal, WiFi, Battery */}
              <div className="flex items-center gap-1.5 text-black">
                {/* Cellular */}
                <svg className="w-4 h-3" viewBox="0 0 16 12" fill="currentColor">
                  <rect x="1" y="8" width="2" height="4" rx="0.5" />
                  <rect x="5" y="6" width="2" height="6" rx="0.5" />
                  <rect x="9" y="3" width="2" height="9" rx="0.5" />
                  <rect x="13" y="1" width="2" height="11" rx="0.5" />
                </svg>
                {/* WiFi */}
                <svg className="w-3.5 h-3" viewBox="0 0 16 12" fill="currentColor">
                  <path d="M8 10a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm-4.24-2.83a6 6 0 018.48 0l-1.06 1.06a4.5 4.5 0 00-6.36 0L3.76 7.17zM1.64 5.05a9 9 0 0112.72 0l-1.06 1.06a7.5 7.5 0 00-10.6 0L1.64 5.05z" />
                </svg>
                {/* Battery Pill */}
                <div className="w-5 h-2.5 rounded-sm border border-black p-0.5 flex items-center">
                  <div className="h-full w-full bg-black rounded-2xs" />
                </div>
              </div>
            </div>

            {/* Screen Content Viewport */}
            <div className="flex-1 relative overflow-y-auto overflow-x-hidden flex flex-col bg-[#F9FAFB]">
              {children}
            </div>

            {/* iOS Bottom Home Indicator Bar */}
            <div className="h-6 w-full flex items-center justify-center bg-white/95 backdrop-blur-sm z-50 shrink-0 border-t border-zinc-100">
              <div className="w-32 h-1 bg-black/60 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
