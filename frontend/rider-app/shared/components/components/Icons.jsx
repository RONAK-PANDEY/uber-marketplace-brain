import React from 'react';

// Crisp SVG Icons matching Uber UI

export function UberLogo({ className = 'h-7 w-auto' }) {
  return (
    <svg viewBox="0 0 76 26" fill="currentColor" className={className} aria-label="Uber">
      <path d="M13.6 25.5C5.8 25.5 0 19.8 0 12.3S5.8-.8 13.6-.8s13.6 5.8 13.6 13.1c0 7.5-5.8 13.2-13.6 13.2zm0-4.3c5 0 8.7-3.9 8.7-8.9s-3.7-8.8-8.7-8.8-8.7 3.8-8.7 8.8 3.7 8.9 8.7 8.9zM30.6 25V0h4.8v9.9c1.6-1.5 3.8-2.3 6.1-2.3 5.4 0 9.1 3.9 9.1 9.4V25h-4.8v-7.8c0-3.1-1.9-5-4.6-5s-4.6 2-4.6 5.1V25h-6zM54.5 16.3c.1 5.3 3.9 8.8 9.1 8.8 3.8 0 6.6-1.7 8.1-4.4l-3.8-2.1c-.8 1.5-2.2 2.3-4.3 2.3-2.6 0-4.4-1.6-4.6-4.6h13.2c.1-.6.1-1.3.1-1.9 0-5.7-3.7-9.5-8.9-9.5-5.3 0-8.9 4-8.9 11.4zm8.8-7.3c2.4 0 4.1 1.6 4.3 4h-8.7c.3-2.4 2-4 4.4-4zM75 8v17h-4.8V8H75z" />
    </svg>
  );
}

// Car SVGs
export function UberGoCar({ className = 'w-16 h-10' }) {
  return (
    <svg viewBox="0 0 80 50" fill="none" className={className}>
      <ellipse cx="40" cy="46" rx="36" ry="3" fill="#000000" fillOpacity="0.12" />
      {/* Hatchback Body */}
      <path d="M12 36L14 26C15 22 18 19 22 18L32 15C36 12 44 11 54 13L64 19C68 21 71 24 72 28L74 36C74 38 72 40 70 40H14C12 40 12 38 12 36Z" fill="#E2E8F0" stroke="#0F172A" strokeWidth="2" strokeLinejoin="round" />
      {/* Windows */}
      <path d="M33 17L24 20C22 21 20.5 23 20 25L19 28H33V17Z" fill="#1E293B" />
      <path d="M37 17H52C57 17 61 19 63 23L65 28H37V17Z" fill="#1E293B" />
      {/* Wheels */}
      <circle cx="23" cy="39" r="6" fill="#0F172A" />
      <circle cx="23" cy="39" r="2.5" fill="#94A3B8" />
      <circle cx="61" cy="39" r="6" fill="#0F172A" />
      <circle cx="61" cy="39" r="2.5" fill="#94A3B8" />
      {/* Lights */}
      <path d="M12 30H15V34H12V30Z" fill="#EF4444" rx="1" />
      <path d="M72 30H74V34H71L72 30Z" fill="#FBBF24" />
    </svg>
  );
}

export function UberComfortCar({ className = 'w-16 h-10' }) {
  return (
    <svg viewBox="0 0 84 50" fill="none" className={className}>
      <ellipse cx="42" cy="46" rx="38" ry="3.5" fill="#000000" fillOpacity="0.15" />
      {/* Sedan Sleek Body */}
      <path d="M8 35L12 28C14 24 17 21 22 20L34 16C40 14 50 14 58 16L68 22C72 24 76 27 78 31L80 35C81 37 80 39 78 39H10C8 39 7 37 8 35Z" fill="#334155" stroke="#0F172A" strokeWidth="2" strokeLinejoin="round" />
      {/* Tinted Windows */}
      <path d="M35 18L24 21C22 22 20.5 24 20 26L18 29H35V18Z" fill="#0F172A" />
      <path d="M39 18H56C61 18 65 20 67 24L71 29H39V18Z" fill="#0F172A" />
      {/* Wheels */}
      <circle cx="22" cy="39" r="6.5" fill="#0F172A" />
      <circle cx="22" cy="39" r="3" fill="#CBD5E1" />
      <circle cx="66" cy="39" r="6.5" fill="#0F172A" />
      <circle cx="66" cy="39" r="3" fill="#CBD5E1" />
      {/* Chrome Trim */}
      <path d="M22 29H68" stroke="#94A3B8" strokeWidth="1" />
      {/* Headlights */}
      <path d="M77 31L80 33L77 35Z" fill="#38BDF8" />
    </svg>
  );
}

export function UberXLCar({ className = 'w-16 h-10' }) {
  return (
    <svg viewBox="0 0 88 52" fill="none" className={className}>
      <ellipse cx="44" cy="48" rx="40" ry="3.5" fill="#000000" fillOpacity="0.15" />
      {/* SUV Tall Body */}
      <path d="M8 36L10 26C11 21 14 17 19 16L30 13C36 12 56 12 66 14L74 19C78 22 81 26 82 30L84 36C84 38 82 40 80 40H10C8 40 8 38 8 36Z" fill="#1E293B" stroke="#000000" strokeWidth="2" strokeLinejoin="round" />
      {/* Roof rails */}
      <rect x="26" y="10" width="38" height="2" rx="1" fill="#64748B" />
      {/* Windows */}
      <path d="M31 15L20 18C18 19 16.5 21 16 23L15 28H31V15Z" fill="#38BDF8" fillOpacity="0.4" />
      <path d="M35 15H50V28H35V15Z" fill="#38BDF8" fillOpacity="0.4" />
      <path d="M54 15H64C68 15 72 17 74 21L76 28H54V15Z" fill="#38BDF8" fillOpacity="0.4" />
      {/* Wheels */}
      <circle cx="22" cy="40" r="7.5" fill="#0F172A" />
      <circle cx="22" cy="40" r="3.5" fill="#E2E8F0" />
      <circle cx="68" cy="40" r="7.5" fill="#0F172A" />
      <circle cx="68" cy="40" r="3.5" fill="#E2E8F0" />
      {/* Tail & Headlights */}
      <path d="M8 29H11V34H8V29Z" fill="#DC2626" />
      <path d="M82 31H84V35H81L82 31Z" fill="#FDE047" />
    </svg>
  );
}

// Top-Down Street Car Icon for Maps
export function TopDownCar({ rotation = 0, size = 22, color = '#000000' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      style={{ transform: `rotate(${rotation}deg)` }}
      className="transition-transform duration-500 drop-shadow-md"
    >
      <rect x="10" y="4" width="12" height="24" rx="4" fill={color} />
      {/* Windshields */}
      <path d="M12 9H20L19 12H13L12 9Z" fill="#93C5FD" />
      <path d="M13 21H19L20 23H12L13 21Z" fill="#93C5FD" />
      {/* Side mirrors */}
      <rect x="8" y="10" width="2" height="3" rx="1" fill={color} />
      <rect x="22" y="10" width="2" height="3" rx="1" fill={color} />
      {/* Roof */}
      <rect x="12" y="13" width="8" height="7" rx="1" fill="#FFFFFF" fillOpacity="0.25" />
    </svg>
  );
}

// User Avatars
export function RohitSinghAvatar({ className = 'w-12 h-12' }) {
  return (
    <div className={`${className} rounded-full overflow-hidden border-2 border-white shadow-md bg-gradient-to-tr from-amber-600 to-indigo-600 flex items-center justify-center shrink-0`}>
      <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
        <circle cx="32" cy="32" r="32" fill="#E2E8F0" />
        {/* Head */}
        <circle cx="32" cy="24" r="12" fill="#D97706" />
        {/* Hair / Beard */}
        <path d="M20 23C20 16 25 12 32 12C39 12 44 16 44 23C44 25 43 28 42 29C40 33 36 36 32 36C28 36 24 33 22 29C21 28 20 25 20 23Z" fill="#18181B" fillOpacity="0.8" />
        <circle cx="32" cy="24" r="10" fill="#FBBF24" />
        {/* Beard trim */}
        <path d="M26 27C26 31 29 33 32 33C35 33 38 31 38 27C38 29 36 31 32 31C28 31 26 29 26 27Z" fill="#18181B" />
        {/* Clothes */}
        <path d="M14 56C14 44 22 40 32 40C42 40 50 44 50 56V64H14V56Z" fill="#2563EB" />
        <path d="M28 40L32 47L36 40H28Z" fill="#FFFFFF" />
      </svg>
    </div>
  );
}

export function PriyaSharmaAvatar({ className = 'w-12 h-12' }) {
  return (
    <div className={`${className} rounded-full overflow-hidden border-2 border-white shadow-md bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center shrink-0`}>
      <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
        <circle cx="32" cy="32" r="32" fill="#FCE7F3" />
        {/* Hair back */}
        <circle cx="32" cy="25" r="15" fill="#1C1917" />
        {/* Face */}
        <circle cx="32" cy="25" r="10" fill="#FBCFE8" />
        {/* Hair front */}
        <path d="M22 22C24 16 28 14 32 14C36 14 40 16 42 22C42 18 39 16 32 16C25 16 22 18 22 22Z" fill="#1C1917" />
        {/* Smile */}
        <path d="M29 28Q32 31 35 28" stroke="#BE185D" strokeWidth="1.5" strokeLinecap="round" />
        {/* Clothes */}
        <path d="M16 56C16 45 23 41 32 41C41 41 48 45 48 56V64H16V56Z" fill="#E11D48" />
      </svg>
    </div>
  );
}

export function AmitKumarAvatar({ className = 'w-14 h-14' }) {
  return (
    <div className={`${className} rounded-full overflow-hidden border-2 border-white shadow-lg bg-gradient-to-tr from-blue-600 to-emerald-600 flex items-center justify-center shrink-0`}>
      <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
        <circle cx="32" cy="32" r="32" fill="#E0F2FE" />
        {/* Head */}
        <circle cx="32" cy="24" r="11" fill="#F59E0B" />
        {/* Hair */}
        <path d="M21 21C22 14 26 11 32 11C38 11 42 14 43 21C40 17 36 15 32 15C28 15 24 17 21 21Z" fill="#0F172A" />
        {/* Clothes - collared uniform */}
        <path d="M14 56C14 43 22 39 32 39C42 39 50 43 50 56V64H14V56Z" fill="#0F172A" />
        <path d="M26 39L32 48L38 39H26Z" fill="#FFFFFF" />
        <path d="M31 43H33V52H31V43Z" fill="#EF4444" />
      </svg>
    </div>
  );
}

// 3D-Style Robot Avatar for AI Assistant
export function RobotAIAvatar({ className = 'w-24 h-24' }) {
  return (
    <div className={`${className} mx-auto relative flex items-center justify-center`}>
      <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-xl animate-pulse" />
      <svg viewBox="0 0 100 100" fill="none" className="w-full h-full relative z-10 drop-shadow-xl">
        {/* Antenna */}
        <rect x="47" y="10" width="6" height="12" rx="3" fill="#64748B" />
        <circle cx="50" cy="9" r="6" fill="#38BDF8" className="animate-ping" style={{ animationDuration: '3s' }} />
        <circle cx="50" cy="9" r="5" fill="#0284C7" />
        {/* Outer Head Shell */}
        <rect x="20" y="22" width="60" height="52" rx="20" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="2.5" />
        {/* Ear Pods */}
        <rect x="14" y="38" width="6" height="20" rx="3" fill="#3B82F6" />
        <rect x="80" y="38" width="6" height="20" rx="3" fill="#3B82F6" />
        {/* Visor Screen */}
        <rect x="26" y="30" width="48" height="36" rx="14" fill="#0F172A" />
        {/* Glowing Eyes */}
        <ellipse cx="40" cy="48" rx="6" ry="7" fill="#38BDF8" />
        <ellipse cx="60" cy="48" rx="6" ry="7" fill="#38BDF8" />
        <circle cx="42" cy="46" r="2" fill="#FFFFFF" />
        <circle cx="62" cy="46" r="2" fill="#FFFFFF" />
        {/* Smile / Voice wave */}
        <path d="M44 57Q50 61 56 57" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    </div>
  );
}
