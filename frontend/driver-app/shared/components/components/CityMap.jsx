import React from 'react';
import { TopDownCar } from './Icons.jsx';

export function CityMap({
  showRoute = false,
  routeType = 'pickup', // 'pickup' | 'trip'
  arrivingTag = null, // e.g. "2 min" or "Arriving in 2 min"
  carPosition = null, // { x, y, rotation }
  className = 'w-full h-full',
  onSelectDestination,
}) {
  // Realistic city street geometry
  return (
    <div className={`relative overflow-hidden bg-[#e5ebf0] select-none ${className}`}>
      <svg
        viewBox="0 0 400 500"
        className="w-full h-full object-cover"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>

          <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* Background Land */}
        <rect width="400" height="500" fill="#E8EEF2" />

        {/* Green Parks / Public Spaces */}
        <path
          d="M 20 60 Q 60 40 100 70 L 110 140 Q 50 160 30 110 Z"
          fill="#DCFCE7"
          stroke="#BBF7D0"
          strokeWidth="1.5"
        />
        <path
          d="M 260 20 L 360 30 L 380 120 L 290 100 Z"
          fill="#DCFCE7"
          stroke="#BBF7D0"
          strokeWidth="1.5"
        />
        <path
          d="M 40 320 Q 90 300 130 330 L 120 420 Q 50 440 20 370 Z"
          fill="#DCFCE7"
          stroke="#BBF7D0"
          strokeWidth="1.5"
        />
        <path
          d="M 280 340 L 370 310 L 390 440 L 310 450 Z"
          fill="#DCFCE7"
          stroke="#BBF7D0"
          strokeWidth="1.5"
        />

        {/* Small Park Trees */}
        <circle cx="50" cy="80" r="5" fill="#86EFAC" />
        <circle cx="75" cy="100" r="6" fill="#4ADE80" />
        <circle cx="310" cy="50" r="7" fill="#4ADE80" />
        <circle cx="340" cy="80" r="5" fill="#86EFAC" />
        <circle cx="70" cy="350" r="6" fill="#4ADE80" />
        <circle cx="95" cy="380" r="5" fill="#86EFAC" />
        <circle cx="330" cy="360" r="6" fill="#4ADE80" />
        <circle cx="360" cy="390" r="7" fill="#86EFAC" />

        {/* River / Waterbody Curve */}
        <path
          d="M -10 210 C 80 230 140 190 220 220 C 300 250 360 210 420 230 L 420 260 C 350 240 290 280 210 250 C 130 220 70 260 -10 240 Z"
          fill="#CFE8FC"
          stroke="#BAE6FD"
          strokeWidth="1.5"
        />

        {/* Building Blocks */}
        <rect x="130" y="40" width="100" height="60" rx="4" fill="#FFFFFF" opacity="0.6" />
        <rect x="140" y="120" width="90" height="70" rx="4" fill="#FFFFFF" opacity="0.6" />
        <rect x="250" y="130" width="80" height="60" rx="4" fill="#FFFFFF" opacity="0.6" />
        <rect x="150" y="270" width="100" height="70" rx="4" fill="#FFFFFF" opacity="0.6" />
        <rect x="160" y="360" width="90" height="80" rx="4" fill="#FFFFFF" opacity="0.6" />

        {/* Major Roads Grid */}
        {/* Horizontal Avenues */}
        <path d="M 0 30 L 400 30" stroke="#FFFFFF" strokeWidth="14" strokeLinecap="round" />
        <path d="M 0 110 L 400 110" stroke="#FFFFFF" strokeWidth="18" strokeLinecap="round" />
        <path d="M 0 200 L 400 200" stroke="#FFFFFF" strokeWidth="22" strokeLinecap="round" />
        <path d="M 0 270 L 400 270" stroke="#FFFFFF" strokeWidth="16" strokeLinecap="round" />
        <path d="M 0 350 L 400 350" stroke="#FFFFFF" strokeWidth="18" strokeLinecap="round" />
        <path d="M 0 450 L 400 450" stroke="#FFFFFF" strokeWidth="14" strokeLinecap="round" />

        {/* Vertical Boulevards */}
        <path d="M 40 0 L 40 500" stroke="#FFFFFF" strokeWidth="14" />
        <path d="M 120 0 L 120 500" stroke="#FFFFFF" strokeWidth="18" />
        <path d="M 230 0 L 230 500" stroke="#FFFFFF" strokeWidth="20" />
        <path d="M 330 0 L 330 500" stroke="#FFFFFF" strokeWidth="16" />

        {/* Diagonal Arteries */}
        <path d="M 0 400 L 400 130" stroke="#FFFFFF" strokeWidth="16" strokeLinecap="round" />

        {/* Centerlines */}
        <path d="M 0 200 L 400 200" stroke="#E2E8F0" strokeWidth="1.5" strokeDasharray="6 6" />
        <path d="M 230 0 L 230 500" stroke="#E2E8F0" strokeWidth="1.5" strokeDasharray="6 6" />
        <path d="M 0 400 L 400 130" stroke="#E2E8F0" strokeWidth="1.5" strokeDasharray="6 6" />

        {/* Route Line if Active */}
        {showRoute && (
          <>
            {/* Route Outline Shadow */}
            <path
              d={
                routeType === 'pickup'
                  ? 'M 85 300 L 120 270 L 230 270 L 230 200 L 290 155'
                  : 'M 140 370 L 140 280 L 230 280 L 230 190 L 310 130'
              }
              fill="none"
              stroke="#000000"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#softShadow)"
            />

            {/* Route Pulse / Glow Line */}
            <path
              d={
                routeType === 'pickup'
                  ? 'M 85 300 L 120 270 L 230 270 L 230 200 L 290 155'
                  : 'M 140 370 L 140 280 L 230 280 L 230 190 L 310 130'
              }
              fill="none"
              stroke="#1E293B"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Start Origin Dot */}
            <circle
              cx={routeType === 'pickup' ? 85 : 140}
              cy={routeType === 'pickup' ? 300 : 370}
              r="7"
              fill="#2563EB"
              stroke="#FFFFFF"
              strokeWidth="3"
            />

            {/* Destination Pin */}
            <g
              transform={`translate(${routeType === 'pickup' ? 290 : 310}, ${
                routeType === 'pickup' ? 155 : 130
              })`}
            >
              <circle cx="0" cy="0" r="8" fill="#0F172A" stroke="#FFFFFF" strokeWidth="2.5" />
              <rect x="-3" y="-3" width="6" height="6" fill="#FFFFFF" rx="1" />
            </g>
          </>
        )}

        {/* Nearby Street Cars (animated subtly) */}
        {!showRoute && (
          <>
            {/* Car 1 */}
            <g transform="translate(120, 160)">
              <TopDownCar rotation={180} size={18} color="#1E293B" />
            </g>
            {/* Car 2 */}
            <g transform="translate(230, 90)">
              <TopDownCar rotation={90} size={18} color="#0F172A" />
            </g>
            {/* Car 3 */}
            <g transform="translate(270, 270)">
              <TopDownCar rotation={270} size={18} color="#1E293B" />
            </g>
            {/* Car 4 */}
            <g transform="translate(70, 350)">
              <TopDownCar rotation={0} size={18} color="#0F172A" />
            </g>
            {/* Car 5 */}
            <g transform="translate(330, 420)">
              <TopDownCar rotation={180} size={18} color="#1E293B" />
            </g>
          </>
        )}

        {/* Moving Car during Live Trip if Provided */}
        {showRoute && (
          <g
            transform={`translate(${carPosition ? carPosition.x : 210}, ${
              carPosition ? carPosition.y : 220
            })`}
          >
            <TopDownCar rotation={carPosition ? carPosition.rotation : 45} size={22} color="#000000" />
          </g>
        )}

        {/* Blue User Pickup Marker */}
        <g transform="translate(200, 240)">
          {/* Animated pulse wave */}
          <circle cx="0" cy="0" r="18" fill="#2563EB" fillOpacity="0.2" className="animate-ping" />
          <circle cx="0" cy="0" r="12" fill="#2563EB" fillOpacity="0.3" />
          <circle cx="0" cy="0" r="7" fill="#2563EB" stroke="#FFFFFF" strokeWidth="3" />
        </g>
      </svg>

      {/* Floating "Arriving in 2 min" Badge */}
      {arrivingTag && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-30 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-zinc-200/80 shadow-lg flex items-center gap-1.5 animate-bounce">
          <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-black tracking-tight text-zinc-900">{arrivingTag}</span>
        </div>
      )}

      {/* Route Time Tag on Destination */}
      {showRoute && !arrivingTag && (
        <div className="absolute top-[108px] right-[72px] z-30 bg-black text-white px-2 py-0.5 rounded-md text-[11px] font-black shadow-md flex items-center gap-1">
          <span>2 min</span>
        </div>
      )}
    </div>
  );
}
