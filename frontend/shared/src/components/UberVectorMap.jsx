import React, { useState, useEffect, useRef } from 'react';

/**
 * CityPlus Vector Map - High-fidelity, metropolitan vector city map
 * Built with edge-to-edge extended coordinates (450 x 820), multi-tier expressways,
 * Yamuna river corridor with bridges, lush park reserves, interactive zone clusters,
 * animated traffic vehicles, and hexagonal surge heatmaps.
 */

export const DELHI_ZONES = [
  { id: 'cp', name: 'Connaught Place', sub: 'Central Business District', x: 225, y: 310, surge: 2.0, bonus: 140, demand: '+48% requests', type: 'hub' },
  { id: 'stadium', name: 'National Stadium', sub: 'India Gate Cultural Arena', x: 340, y: 340, surge: 2.4, bonus: 180, demand: '+65% requests', type: 'stadium' },
  { id: 'cyber', name: 'Cyber City, Gurugram', sub: 'Tech & Fortune 500 Corridor', x: 260, y: 720, surge: 1.8, bonus: 110, demand: '+35% requests', type: 'office' },
  { id: 'airport', name: 'Terminal 3 - IGI Airport', sub: 'International Aviation Hub', x: 95, y: 590, surge: 1.5, bonus: 90, demand: '+28% requests', type: 'airport' },
  { id: 'noida', name: 'Noida Sector 18', sub: 'Commercial Expressway Hub', x: 385, y: 440, surge: 1.6, bonus: 85, demand: '+30% requests', type: 'office' },
  { id: 'mall', name: 'City Center Mall, Saket', sub: 'Retail & Lifestyle District', x: 210, y: 560, surge: 1.4, bonus: 60, demand: '+22% requests', type: 'mall' },
  { id: 'aiims', name: 'AIIMS Medical City', sub: 'Super-Specialty Health Zone', x: 200, y: 440, surge: 1.2, bonus: 40, demand: '+15% requests', type: 'hospital' },
  { id: 'south_ext', name: 'South Extension Market', sub: 'Premium Retail Ring', x: 275, y: 460, surge: 1.3, bonus: 50, demand: '+18% requests', type: 'retail' },
  { id: 'nehru', name: 'Nehru Place IT Market', sub: 'Tech Hardware & Finance Hub', x: 330, y: 540, surge: 1.5, bonus: 70, demand: '+25% requests', type: 'office' },
  { id: 'dwarka', name: 'Dwarka Sector 21', sub: 'Airport Metro Interchange', x: 75, y: 710, surge: 1.3, bonus: 45, demand: '+20% requests', type: 'residential' },
  { id: 'rohini', name: 'Rohini West Terminal', sub: 'North Metro Interchange', x: 110, y: 140, surge: 1.2, bonus: 40, demand: '+16% requests', type: 'residential' },
  { id: 'north_ind', name: 'Far North Industrial Suburb', sub: 'Logistics & Warehousing', x: 330, y: 120, surge: 2.2, bonus: 130, demand: '+40% requests', type: 'industrial' },
];

// Sprawling multi-tier road network across 450 x 820 canvas
const ROADS = [
  // 1. Major Expressways (Multi-lane Highways)
  { id: 'nh48', name: 'NH-48 Delhi-Gurugram Expressway', path: 'M 350,-20 Q 225,310 95,590 T 260,720 L 290,840', width: 15, isHighway: true, traffic: 'heavy' },
  { id: 'ring_road', name: 'Inner Ring Road (Mahatma Gandhi Marg)', path: 'M 100,280 C 140,180 340,180 370,280 C 400,460 340,600 210,610 C 100,610 50,450 100,280 Z', width: 13, isHighway: true, traffic: 'moderate' },
  { id: 'outer_ring', name: 'Outer Ring Road Expressway', path: 'M 40,180 C 120,60 370,50 420,200 C 460,420 420,670 270,770 C 120,770 20,630 40,180 Z', width: 14, isHighway: true, traffic: 'fast' },
  { id: 'noida_dnd', name: 'DND Flyway & Noida Expressway', path: 'M 225,310 Q 320,380 385,440 L 470,510', width: 12, isHighway: true, traffic: 'fast' },
  { id: 'airport_exp', name: 'Airport Express Link', path: 'M 225,310 Q 140,430 95,590 L 75,710', width: 11, isHighway: true, traffic: 'fast' },

  // 2. Primary Boulevards & Arterials
  { id: 'art_central', name: 'Janpath & Rajpath Boulevard', path: 'M 225,-20 L 225,840', width: 9, traffic: 'moderate' },
  { id: 'art_east_west_1', name: 'Barakhamba - Vikas Marg', path: 'M -20,310 L 470,310', width: 9, traffic: 'heavy' },
  { id: 'art_east_west_2', name: 'Mehrauli - Badarpur Road', path: 'M -20,560 L 470,560', width: 8, traffic: 'fast' },
  { id: 'art_east_west_3', name: 'Ring Radial - Lodhi Road', path: 'M -20,440 L 470,440', width: 8, traffic: 'fast' },
  { id: 'art_north_radial', name: 'GT Karnal Radial Corridor', path: 'M 110,-20 L 110,400', width: 8, traffic: 'moderate' },
  { id: 'art_south_radial', name: 'Aurobindo Marg to Saket', path: 'M 200,310 L 200,720', width: 8, traffic: 'moderate' },
  { id: 'art_cyber_link', name: 'Golf Course Extension Parkway', path: 'M 180,720 L 470,720', width: 8, traffic: 'fast' },

  // 3. City Grids & Corridors
  { id: 'grid_1', path: 'M 40,90 L 420,90', width: 6 },
  { id: 'grid_2', path: 'M 30,220 L 430,220', width: 6 },
  { id: 'grid_3', path: 'M 30,370 L 430,370', width: 6 },
  { id: 'grid_4', path: 'M 30,490 L 430,490', width: 6 },
  { id: 'grid_5', path: 'M 30,640 L 430,640', width: 6 },
  { id: 'grid_6', path: 'M 30,780 L 430,780', width: 6 },

  // Vertical city grid
  { id: 'v_grid_1', path: 'M 60,-20 L 60,840', width: 5 },
  { id: 'v_grid_2', path: 'M 160,-20 L 160,840', width: 5 },
  { id: 'v_grid_3', path: 'M 290,-20 L 290,840', width: 5 },
  { id: 'v_grid_4', path: 'M 360,-20 L 360,840', width: 5 },
  { id: 'v_grid_5', path: 'M 420,-20 L 420,840', width: 5 },
];

// Sprawling green lungs of Delhi NCR
const PARKS = [
  { id: 'central_park', path: 'M 195,290 C 205,275 245,275 255,290 C 260,310 250,335 235,340 C 210,340 190,320 195,290 Z', label: 'Central Greens' },
  { id: 'lodhi_gardens', path: 'M 220,380 C 235,365 285,365 295,385 C 295,420 245,430 220,410 Z', label: 'Lodhi Reserve' },
  { id: 'nehru_park', path: 'M 130,340 C 145,320 190,330 195,365 C 185,395 140,405 125,370 Z', label: 'Nehru Park' },
  { id: 'ridge_forest', path: 'M 90,200 C 130,170 170,220 155,280 C 135,310 85,300 75,250 Z', label: 'Northern Ridge' },
  { id: 'sanjay_van', path: 'M 130,500 C 160,470 200,480 205,530 C 190,570 140,580 120,540 Z', label: 'Sanjay Van' },
  { id: 'jahanpanah', path: 'M 260,510 C 295,490 335,510 330,555 C 315,585 270,580 255,545 Z', label: 'Jahanpanah Reserve' },
  { id: 'biodiversity', path: 'M 180,750 C 220,730 270,740 265,790 C 245,820 190,815 175,780 Z', label: 'Aravalli Biodiversity Park' },
];

// River Yamuna meandering along eastern flank
const RIVER_PATH = 'M 350,-30 C 370,120 410,240 395,340 C 380,440 435,530 420,660 C 405,740 435,800 450,850 L 480,850 L 480,-30 Z';

// Top-Down Vehicle SVG
export function TopDownSedan({ x, y, angle = 0, color = '#111827', size = 26 }) {
  const w = size;
  const h = size * 0.48;
  return (
    <g transform={`translate(${x},${y}) rotate(${angle})`} style={{ pointerEvents: 'none' }}>
      <ellipse cx={2} cy={3} rx={w * 0.52} ry={h * 0.6} fill="rgba(0,0,0,0.3)" filter="blur(2px)"/>
      <polygon points={`${w*0.5},${-h*0.35} ${w*0.5+22},${-h*1.0} ${w*0.5+22},${h*1.0} ${w*0.5},${h*0.35}`} fill="url(#headlightGradient)" opacity="0.45"/>
      <rect x={-w*0.5} y={-h*0.5} width={w} height={h} rx={h*0.35} fill={color} stroke="#374151" strokeWidth="0.8"/>
      <rect x={-w*0.1} y={-h*0.38} width={w*0.42} height={h*0.76} rx={h*0.2} fill="#60a5fa" opacity="0.85"/>
      <rect x={-w*0.18} y={-h*0.36} width={w*0.36} height={h*0.72} rx={h*0.18} fill={color}/>
      <path d={`M ${w*0.25},${-h*0.32} L ${w*0.32},${-h*0.32} L ${w*0.32},${h*0.32} L ${w*0.25},${h*0.32} Z`} fill="white" opacity="0.6"/>
      <circle cx={w*0.48} cy={-h*0.32} r={h*0.14} fill="#fef08a"/>
      <circle cx={w*0.48} cy={h*0.32} r={h*0.14} fill="#fef08a"/>
      <rect x={-w*0.5} y={-h*0.38} width={w*0.06} height={h*0.22} fill="#ef4444" rx="0.5"/>
      <rect x={-w*0.5} y={h*0.16} width={w*0.06} height={h*0.22} fill="#ef4444" rx="0.5"/>
    </g>
  );
}

export default function UberVectorMap({
  theme = 'light', // 'light' (Rider) | 'dark' (Driver)
  showRoute = false,
  showHeatmap = false,
  showTraffic = true,
  pickupPoint = { x: 225, y: 310, label: 'Connaught Place' },
  dropoffPoint = { x: 260, y: 720, label: 'Cyber City, Gurugram' },
  selectedZone = null,
  onZoneSelect = null,
  driverPosition = null,
  activeCars = null,
  interactive = true,
}) {
  const isDark = theme === 'dark';

  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // 10 simulated moving traffic vehicles
  const [simCars, setSimCars] = useState([
    { id: 1, x: 225, y: 200, angle: 90, speed: 1.1 },
    { id: 2, x: 180, y: 310, angle: 0, speed: 0.9 },
    { id: 3, x: 290, y: 440, angle: 90, speed: 0.8 },
    { id: 4, x: 340, y: 280, angle: 180, speed: 0.95 },
    { id: 5, x: 120, y: 560, angle: 0, speed: 0.85 },
    { id: 6, x: 260, y: 640, angle: 90, speed: 1.0 },
    { id: 7, x: 95, y: 480, angle: 270, speed: 0.75 },
    { id: 8, x: 385, y: 380, angle: 90, speed: 0.9 },
    { id: 9, x: 110, y: 220, angle: 180, speed: 0.8 },
    { id: 10, x: 225, y: 680, angle: 90, speed: 1.05 },
  ]);

  useEffect(() => {
    const t = setInterval(() => {
      setSimCars(prev => prev.map(c => {
        let nx = c.x + Math.cos(c.angle * Math.PI / 180) * c.speed;
        let ny = c.y + Math.sin(c.angle * Math.PI / 180) * c.speed;
        if (nx < 20) nx = 430;
        if (nx > 440) nx = 30;
        if (ny < 10) ny = 810;
        if (ny > 820) ny = 20;
        return { ...c, x: nx, y: ny };
      }));
    }, 45);
    return () => clearInterval(t);
  }, []);

  function handleMouseDown(e) {
    if (!interactive) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  }

  function handleMouseMove(e) {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  }

  function handleMouseUp() {
    setIsDragging(false);
  }

  function handleWheel(e) {
    if (!interactive) return;
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.12 : 0.88;
    setZoom(z => Math.max(0.4, Math.min(2.4, z * factor)));
  }

  function zoomIn() {
    setZoom(z => Math.min(2.4, z + 0.25));
  }
  function zoomOut() {
    setZoom(z => Math.max(0.4, z - 0.25));
  }
  function resetView() {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }

  const p1 = pickupPoint || { x: 225, y: 310 };
  const p2 = dropoffPoint || { x: 260, y: 720 };
  const routeCurve = `M ${p1.x},${p1.y} C ${p1.x},${(p1.y + p2.y) / 2} ${(p1.x + p2.x) / 2},${p2.y} ${p2.x},${p2.y}`;

  const bg = isDark ? '#080c14' : '#f0f3f0';
  const waterColor = isDark ? '#0d1f33' : '#cfe4f7';
  const parkColor = isDark ? '#0f2418' : '#d7edd8';
  const roadCasing = isDark ? '#141d2b' : '#d2d7df';
  const roadFill = isDark ? '#1d2738' : '#ffffff';
  const highwayFill = isDark ? '#26344a' : '#ffffff';
  const highwayCasing = isDark ? '#3b4f6e' : '#f59e0b';
  const textColor = isDark ? '#94a3b8' : '#4b5563';

  const carsToRender = activeCars || simCars;

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        background: bg,
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 450 820"
        preserveAspectRatio="xMidYMid slice"
        style={{
          width: '100%',
          height: '100%',
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: 'center center',
          transition: isDragging ? 'none' : 'transform 0.12s ease-out',
        }}
      >
        <defs>
          <linearGradient id="headlightGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fef08a" stopOpacity="0.8"/>
            <stop offset="100%" stopColor="#fef08a" stopOpacity="0"/>
          </linearGradient>

          <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563eb"/>
            <stop offset="100%" stopColor="#3b82f6"/>
          </linearGradient>

          <radialGradient id="hexHighSurge" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.85"/>
            <stop offset="60%" stopColor="#f97316" stopOpacity="0.55"/>
            <stop offset="100%" stopColor="#f97316" stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="hexMedSurge" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8"/>
            <stop offset="70%" stopColor="#eab308" stopOpacity="0.45"/>
            <stop offset="100%" stopColor="#eab308" stopOpacity="0"/>
          </radialGradient>
        </defs>

        {/* 1. Base City Background */}
        <rect x="0" y="0" width="450" height="820" fill={bg}/>

        {/* 2. Yamuna River Flow */}
        <path d={RIVER_PATH} fill={waterColor} opacity={isDark ? 0.8 : 0.95}/>

        {/* 3. Lush Forest & Park Reserves */}
        {PARKS.map(p => (
          <g key={p.id}>
            <path d={p.path} fill={parkColor} opacity={isDark ? 0.75 : 0.9}/>
            <text
              x={p.path.match(/\d+/g)?.[0] || 200}
              y={parseInt(p.path.match(/\d+/g)?.[1] || 200, 10) + 15}
              fill={isDark ? '#22c55e' : '#15803d'}
              fontSize="9"
              fontWeight="700"
              opacity="0.75"
              pointerEvents="none"
            >
              {p.label}
            </text>
          </g>
        ))}

        {/* 4. Metro Lines (Dotted Transit Overlay) */}
        <path d="M 110,-20 L 110,400 L 225,310 L 330,540 L 385,440" fill="none" stroke="#eab308" strokeWidth="2.5" strokeDasharray="4 4" opacity="0.55"/>
        <path d="M -20,310 L 470,310" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeDasharray="4 4" opacity="0.55"/>

        {/* 5. Road Casings & Highway Foundations */}
        {ROADS.map(r => (
          <path
            key={`casing_${r.id}`}
            d={r.path}
            fill="none"
            stroke={r.isHighway ? highwayCasing : roadCasing}
            strokeWidth={r.width + (r.isHighway ? 3.5 : 2.5)}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}

        {/* 6. Road Center Fills */}
        {ROADS.map(r => (
          <path
            key={`fill_${r.id}`}
            d={r.path}
            fill="none"
            stroke={r.isHighway ? highwayFill : roadFill}
            strokeWidth={r.width}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}

        {/* 7. Live Traffic Congestion Color Overlays */}
        {showTraffic && ROADS.filter(r => r.traffic).map(r => (
          <path
            key={`traffic_${r.id}`}
            d={r.path}
            fill="none"
            stroke={r.traffic === 'heavy' ? '#ef4444' : r.traffic === 'moderate' ? '#f59e0b' : '#10b981'}
            strokeWidth="2.8"
            strokeLinecap="round"
            opacity={isDark ? 0.75 : 0.65}
          />
        ))}

        {/* 8. Hexagonal Demand Heatmap Clusters (Driver App) */}
        {showHeatmap && DELHI_ZONES.map(z => {
          const isHigh = z.surge >= 1.8;
          const radius = isHigh ? 64 : 48;
          const isSelected = selectedZone?.id === z.id;
          return (
            <g
              key={`heat_${z.id}`}
              onClick={() => onZoneSelect && onZoneSelect(z)}
              style={{ cursor: 'pointer' }}
            >
              {/* Outer pulsing ring */}
              <circle
                cx={z.x}
                cy={z.y}
                r={radius}
                fill={isHigh ? 'url(#hexHighSurge)' : 'url(#hexMedSurge)'}
              />
              {/* Inner core cell */}
              <polygon
                points={`
                  ${z.x},${z.y - 24}
                  ${z.x + 22},${z.y - 12}
                  ${z.x + 22},${z.y + 12}
                  ${z.x},${z.y + 24}
                  ${z.x - 22},${z.y + 12}
                  ${z.x - 22},${z.y - 12}
                `}
                fill={isHigh ? 'rgba(239,68,68,0.7)' : 'rgba(245,158,11,0.65)'}
                stroke={isSelected ? '#ffffff' : isHigh ? '#fca5a5' : '#fef08a'}
                strokeWidth={isSelected ? '2.5' : '1.2'}
              />
              {/* Surge Pill Badge */}
              <rect
                x={z.x - 24}
                y={z.y - 8}
                width="48"
                height="16"
                rx="8"
                fill="#111827"
                stroke={isHigh ? '#ef4444' : '#f59e0b'}
                strokeWidth="1.2"
              />
              <text
                x={z.x}
                y={z.y + 4}
                fill="white"
                fontSize="10"
                fontWeight="900"
                textAnchor="middle"
              >
                {z.surge}x
              </text>
            </g>
          );
        })}

        {/* 9. Trip Navigation Route with Glowing Stroke */}
        {showRoute && (
          <g>
            {/* Soft Route Halo */}
            <path
              d={routeCurve}
              fill="none"
              stroke="#60a5fa"
              strokeWidth="9"
              strokeLinecap="round"
              opacity="0.35"
            />
            {/* Main Solid Route Line */}
            <path
              d={routeCurve}
              fill="none"
              stroke="url(#routeGradient)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray="8 4"
            />
          </g>
        )}

        {/* 10. Live Traffic Moving Vehicles */}
        {carsToRender.map(car => (
          <TopDownSedan
            key={car.id}
            x={car.x}
            y={car.y}
            angle={car.angle}
            color={car.id === 99 ? '#10b981' : isDark ? '#ffffff' : '#111827'}
            size={car.id === 99 ? 30 : 25}
          />
        ))}

        {/* 11. Driver Current Position Dot */}
        {driverPosition && (
          <g transform={`translate(${driverPosition.x}, ${driverPosition.y})`}>
            <circle cx="0" cy="0" r="16" fill="rgba(16,185,129,0.3)"/>
            <circle cx="0" cy="0" r="8" fill="#10b981" stroke="white" strokeWidth="2.5"/>
            <polygon points="0,-12 -5,-3 5,-3" fill="#10b981"/>
          </g>
        )}

        {/* 12. Landmark Pins & Labels */}
        {DELHI_ZONES.map(z => {
          const isSelected = selectedZone?.id === z.id;
          return (
            <g
              key={z.id}
              transform={`translate(${z.x}, ${z.y})`}
              onClick={() => onZoneSelect && onZoneSelect(z)}
              style={{ cursor: 'pointer' }}
            >
              {isSelected && (
                <circle cx="0" cy="0" r="20" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeDasharray="3 3"/>
              )}
              <circle cx="0" cy="0" r="5" fill={isDark ? '#60a5fa' : '#2563eb'} stroke="white" strokeWidth="1.5"/>
              <text
                x="8"
                y="3"
                fill={textColor}
                fontSize="9.5"
                fontWeight="800"
                style={{
                  textShadow: isDark ? '0 1px 3px rgba(0,0,0,0.9)' : '0 1px 3px rgba(255,255,255,0.9)',
                  pointerEvents: 'none',
                }}
              >
                {z.name}
              </text>
            </g>
          );
        })}

        {/* 13. Pickup & Dropoff Markers */}
        {showRoute && (
          <>
            {/* Pickup Marker (Black Pill) */}
            <g transform={`translate(${p1.x}, ${p1.y})`}>
              <circle cx="0" cy="0" r="7" fill="#111827" stroke="white" strokeWidth="2.5"/>
              <rect x="-35" y="-30" width="70" height="20" rx="10" fill="#111827"/>
              <text x="0" y="-17" fill="white" fontSize="9.5" fontWeight="900" textAnchor="middle">
                PICKUP
              </text>
            </g>

            {/* Dropoff Marker (Red Pin) */}
            <g transform={`translate(${p2.x}, ${p2.y})`}>
              <circle cx="0" cy="0" r="7" fill="#ef4444" stroke="white" strokeWidth="2.5"/>
              <rect x="-40" y="-30" width="80" height="20" rx="10" fill="#ef4444"/>
              <text x="0" y="-17" fill="white" fontSize="9.5" fontWeight="900" textAnchor="middle">
                DROPOFF
              </text>
            </g>
          </>
        )}
      </svg>

      {/* Floating Map Zoom / Recenter Controls */}
      {interactive && (
        <div style={{ position: 'absolute', bottom: '16px', right: '14px', display: 'flex', flexDirection: 'column', gap: '6px', zIndex: 30 }}>
          <button
            onClick={zoomIn}
            style={{ width: '34px', height: '34px', borderRadius: '50%', background: isDark ? '#161c28' : 'white', border: `1px solid ${isDark ? '#232d40' : '#e5e7eb'}`, color: isDark ? 'white' : '#111', fontSize: '18px', fontWeight: '900', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}
            title="Zoom In"
          >
            +
          </button>
          <button
            onClick={zoomOut}
            style={{ width: '34px', height: '34px', borderRadius: '50%', background: isDark ? '#161c28' : 'white', border: `1px solid ${isDark ? '#232d40' : '#e5e7eb'}`, color: isDark ? 'white' : '#111', fontSize: '18px', fontWeight: '900', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}
            title="Zoom Out"
          >
            −
          </button>
          <button
            onClick={resetView}
            style={{ width: '34px', height: '34px', borderRadius: '50%', background: isDark ? '#161c28' : 'white', border: `1px solid ${isDark ? '#232d40' : '#e5e7eb'}`, color: isDark ? 'white' : '#111', fontSize: '12px', fontWeight: '900', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}
            title="Recenter Map"
          >
            🎯
          </button>
        </div>
      )}
    </div>
  );
}
