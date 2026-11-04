import React from 'react';

export function HeatmapMap({
  driverHeading = 45,
  isNavigating = false,
  className = 'w-full h-full',
}) {
  return (
    <div className={`relative overflow-hidden bg-[#e6ebf0] select-none ${className}`}>
      <svg
        viewBox="0 0 400 500"
        className="w-full h-full object-cover"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Radial Heat Gradient */}
          <radialGradient id="heatRadial" cx="55%" cy="38%" r="45%">
            <stop offset="0%" stopColor="#EF4444" stopOpacity="0.85" />
            <stop offset="28%" stopColor="#F97316" stopOpacity="0.75" />
            <stop offset="55%" stopColor="#FBBF24" stopOpacity="0.65" />
            <stop offset="80%" stopColor="#FDE68A" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#FEF08A" stopOpacity="0" />
          </radialGradient>

          {/* Hexagon Pattern Def */}
          <pattern id="hexGrid" width="40" height="69.282" patternUnits="userSpaceOnUse">
            <path
              d="M 40 0 L 20 11.547 L 0 0 L 0 23.094 L 20 34.641 L 40 23.094 Z M 0 34.641 L 20 46.188 L 0 57.735 L 0 69.282 L 20 69.282 L 40 57.735 L 40 46.188 L 20 34.641 Z"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="0.8"
              strokeOpacity="0.3"
            />
          </pattern>
        </defs>

        {/* Base Map Land */}
        <rect width="400" height="500" fill="#E8EEF2" />

        {/* Parks & River */}
        <path d="M 10 50 Q 50 30 90 60 L 90 120 Q 30 140 10 90 Z" fill="#DCFCE7" opacity="0.7" />
        <path d="M 280 20 L 370 30 L 380 110 L 290 90 Z" fill="#DCFCE7" opacity="0.7" />
        <path d="M 20 330 Q 70 310 110 340 L 100 420 Q 40 440 10 380 Z" fill="#DCFCE7" opacity="0.7" />
        <path d="M 290 350 L 380 320 L 390 430 L 310 440 Z" fill="#DCFCE7" opacity="0.7" />

        {/* River */}
        <path
          d="M -10 210 C 80 230 140 190 220 220 C 300 250 360 210 420 230 L 420 255 C 350 235 290 275 210 245 C 130 215 70 255 -10 235 Z"
          fill="#CFE8FC"
        />

        {/* Street Network */}
        <path d="M 0 40 L 400 40" stroke="#FFFFFF" strokeWidth="12" />
        <path d="M 0 110 L 400 110" stroke="#FFFFFF" strokeWidth="16" />
        <path d="M 0 190 L 400 190" stroke="#FFFFFF" strokeWidth="20" />
        <path d="M 0 280 L 400 280" stroke="#FFFFFF" strokeWidth="16" />
        <path d="M 0 360 L 400 360" stroke="#FFFFFF" strokeWidth="18" />

        <path d="M 50 0 L 50 500" stroke="#FFFFFF" strokeWidth="14" />
        <path d="M 130 0 L 130 500" stroke="#FFFFFF" strokeWidth="18" />
        <path d="M 220 0 L 220 500" stroke="#FFFFFF" strokeWidth="20" />
        <path d="M 320 0 L 320 500" stroke="#FFFFFF" strokeWidth="16" />

        {/* Diagonals */}
        <path d="M 0 410 L 400 140" stroke="#FFFFFF" strokeWidth="16" />

        {/* Multi-layered Colored Heatmap Cloud */}
        {/* Outer Heat Layer (Yellow) */}
        <circle cx="225" cy="185" r="140" fill="#FEF08A" fillOpacity="0.45" />
        {/* Mid Heat Layer (Orange) */}
        <circle cx="225" cy="185" r="95" fill="#FB923C" fillOpacity="0.6" />
        {/* Intense Core (Red/Orange) */}
        <circle cx="225" cy="185" r="55" fill="#EF4444" fillOpacity="0.75" />

        {/* Hexagonal Overlay Matrix (giving that exact hexagonal cell texture from the image) */}
        <g opacity="0.85">
          {/* Central Tier Hexagons */}
          {/* Center */}
          <polygon points="225,160 250,175 250,205 225,220 200,205 200,175" fill="#EF4444" fillOpacity="0.9" stroke="#FFFFFF" strokeWidth="1" />
          {/* Top */}
          <polygon points="225,115 250,130 250,160 225,175 200,160 200,130" fill="#F97316" fillOpacity="0.85" stroke="#FFFFFF" strokeWidth="1" />
          {/* Top-Right */}
          <polygon points="268,138 293,153 293,183 268,198 243,183 243,153" fill="#F97316" fillOpacity="0.85" stroke="#FFFFFF" strokeWidth="1" />
          {/* Bottom-Right */}
          <polygon points="268,207 293,222 293,252 268,267 243,252 243,222" fill="#FBBF24" fillOpacity="0.8" stroke="#FFFFFF" strokeWidth="1" />
          {/* Bottom */}
          <polygon points="225,230 250,245 250,275 225,290 200,275 200,245" fill="#FBBF24" fillOpacity="0.8" stroke="#FFFFFF" strokeWidth="1" />
          {/* Bottom-Left */}
          <polygon points="182,207 207,222 207,252 182,267 157,252 157,222" fill="#FBBF24" fillOpacity="0.8" stroke="#FFFFFF" strokeWidth="1" />
          {/* Top-Left */}
          <polygon points="182,138 207,153 207,183 182,198 157,183 157,153" fill="#F97316" fillOpacity="0.85" stroke="#FFFFFF" strokeWidth="1" />

          {/* Outer Ring Hexagons */}
          <polygon points="225,70 250,85 250,115 225,130 200,115 200,85" fill="#FDE047" fillOpacity="0.6" stroke="#FFFFFF" strokeWidth="1" />
          <polygon points="268,93 293,108 293,138 268,153 243,138 243,108" fill="#FDE047" fillOpacity="0.6" stroke="#FFFFFF" strokeWidth="1" />
          <polygon points="311,161 336,176 336,206 311,221 286,206 286,176" fill="#FDE047" fillOpacity="0.6" stroke="#FFFFFF" strokeWidth="1" />
          <polygon points="311,230 336,245 336,275 311,290 286,275 286,245" fill="#FEF08A" fillOpacity="0.5" stroke="#FFFFFF" strokeWidth="1" />
          <polygon points="225,275 250,290 250,320 225,335 200,320 200,290" fill="#FEF08A" fillOpacity="0.5" stroke="#FFFFFF" strokeWidth="1" />
          <polygon points="139,161 164,176 164,206 139,221 114,206 114,176" fill="#FDE047" fillOpacity="0.6" stroke="#FFFFFF" strokeWidth="1" />
          <polygon points="139,230 164,245 164,275 139,290 114,275 114,245" fill="#FEF08A" fillOpacity="0.5" stroke="#FFFFFF" strokeWidth="1" />
        </g>

        {/* Navigation Route Line if navigating */}
        {isNavigating && (
          <path
            d="M 225 320 L 225 240 L 225 190"
            fill="none"
            stroke="#2563EB"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray="8 6"
            className="animate-pulse"
          />
        )}

        {/* Blue Driver Navigation Chevron Arrow (From the image: pointing right at the core) */}
        <g
          transform={`translate(${isNavigating ? 225 : 225}, ${
            isNavigating ? 230 : 255
          }) rotate(${driverHeading})`}
          className="transition-transform duration-700 drop-shadow-xl"
        >
          {/* Pulse ring */}
          <circle cx="0" cy="0" r="16" fill="#2563EB" fillOpacity="0.25" className="animate-ping" />
          {/* Navigation Chevron */}
          <path
            d="M 0 -14 L 11 10 L 0 5 L -11 10 Z"
            fill="#2563EB"
            stroke="#FFFFFF"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
        </g>
      </svg>
    </div>
  );
}

