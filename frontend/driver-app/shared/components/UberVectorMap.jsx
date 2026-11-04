import React, { useState, useEffect, useRef } from 'react';

/**
 * UberVectorMap - High-fidelity vector city map matching the exact Uber rider and driver app styles.
 * Enhanced with real Delhi NCR commuter corridors, traffic congestion overlays,
 * zone selection inspector, interactive landmark pins, and realistic vehicle movement.
 */

export const DELHI_ZONES = [
  { id: 'cp', name: 'Connaught Place', sub: 'Central Business Hub', x: 260, y: 190, surge: 2.0, bonus: 140, demand: '+45% requests', type: 'hub' },
  { id: 'cyber', name: 'Cyber City, Gurugram', sub: 'Tech & Corporate District', x: 390, y: 370, surge: 1.8, bonus: 110, demand: '+35% requests', type: 'office' },
  { id: 'airport', name: 'Terminal 3 - IGI Airport', sub: 'Airport Corridor', x: 70, y: 390, surge: 1.5, bonus: 90, demand: '+28% requests', type: 'airport' },
  { id: 'stadium', name: 'National Stadium', sub: 'India Gate Cultural Zone', x: 390, y: 150, surge: 1.3, bonus: 50, demand: '+15% requests', type: 'stadium' },
  { id: 'mall', name: 'City Center Mall, Saket', sub: 'Retail & Leisure Hub', x: 130, y: 170, surge: 1.4, bonus: 60, demand: '+20% requests', type: 'mall' },
  { id: 'hospital', name: 'AIIMS Medical City', sub: 'Health District', x: 250, y: 330, surge: 1.2, bonus: 40, demand: '+12% requests', type: 'hospital' },
  { id: 'noida', name: 'Noida Sector 18', sub: 'Commercial Expressway', x: 440, y: 270, surge: 1.6, bonus: 85, demand: '+30% requests', type: 'office' },
];

const ROADS = [
  // Major Highways (Expressways)
  { id: 'nh48', name: 'NH-48 Expressway', path: 'M 20,440 Q 180,360 260,190 T 470,40', width: 14, isHighway: true, traffic: 'moderate' },
  { id: 'ring_road', name: 'Inner Ring Road', path: 'M 60,130 C 120,40 360,40 420,150 C 460,260 360,410 240,410 C 130,410 40,320 60,130 Z', width: 12, isHighway: true, traffic: 'heavy' },
  { id: 'noida_exp', name: 'Noida Expressway', path: 'M 260,190 Q 360,230 460,270', width: 10, isHighway: true, traffic: 'fast' },

  // Arterial Boulevards
  { id: 'art_1', name: 'Barakhamba Ave', path: 'M 260,20 L 260,460', width: 9, traffic: 'fast' },
  { id: 'art_2', name: 'Janpath Blvd', path: 'M 20,190 L 480,190', width: 9, traffic: 'moderate' },
  { id: 'art_3', name: 'Mall Road', path: 'M 30,80 L 470,80', width: 7, traffic: 'fast' },
  { id: 'art_4', name: 'Lodhi Expressway', path: 'M 20,310 L 480,310', width: 7, traffic: 'fast' },
  { id: 'art_5', name: 'Airport Parkway', path: 'M 130,20 L 130,460', width: 7, traffic: 'moderate' },
  { id: 'art_6', name: 'Cyber Link', path: 'M 390,20 L 390,460', width: 7, traffic: 'heavy' },

  // Secondary Connections
  { id: 'diag_1', path: 'M 40,30 L 260,190', width: 5 },
  { id: 'diag_2', path: 'M 260,190 L 460,350', width: 5 },
  { id: 'diag_3', path: 'M 260,190 L 390,150 L 450,110', width: 5 },
  { id: 'sec_1', path: 'M 70,200 L 70,390 L 180,390', width: 5 },
  { id: 'sec_2', path: 'M 310,120 L 380,120 L 380,250', width: 5 },
  { id: 'sec_3', path: 'M 190,240 L 190,360 L 250,360', width: 5 },
];

const PARKS = [
  { id: 'central_park', path: 'M 230,170 C 240,155 280,155 290,170 C 295,185 285,210 270,215 C 245,215 225,195 230,170 Z', label: 'Central Greens' },
  { id: 'lodhi_gardens', path: 'M 150,220 C 160,205 210,205 220,225 C 220,260 170,270 150,250 Z', label: 'Lodhi Reserve' },
  { id: 'deer_park', path: 'M 60,230 C 80,210 110,220 115,250 C 110,280 70,290 55,260 Z', label: 'West Forest' },
  { id: 'ridge_forest', path: 'M 310,250 C 340,240 370,260 365,300 C 350,330 310,320 305,280 Z', label: 'Ridge Park' },
];

const RIVER_PATH = 'M -20,10 C 60,30 110,110 160,130 C 220,150 280,70 340,85 C 410,100 450,180 520,210 L 520,240 C 440,210 400,125 335,110 C 275,95 215,175 155,155 C 100,135 50,55 -20,35 Z';

// Top-Down Uber Sedan SVG Component
export function TopDownSedan({ x, y, angle = 0, color = '#111827', size = 28 }) {
  const w = size;
  const h = size * 0.48;
  return (
    <g transform={`translate(${x},${y}) rotate(${angle})`} style={{ pointerEvents: 'none' }}>
      <ellipse cx={2} cy={3} rx={w * 0.52} ry={h * 0.6} fill="rgba(0,0,0,0.3)" filter="blur(2px)"/>
      <polygon points={`${w*0.5},${-h*0.35} ${w*0.5+24},${-h*1.1} ${w*0.5+24},${h*1.1} ${w*0.5},${h*0.35}`} fill="url(#headlightGradient)" opacity="0.45"/>
      <rect x={-w*0.5} y={-h*0.5} width={w} height={h} rx={h*0.35} fill={color} stroke="#374151" strokeWidth="0.8"/>
      <rect x={-w*0.1} y={-h*0.38} width={w*0.42} height={h*0.76} rx={h*0.2} fill="#60a5fa" opacity="0.85"/>
      <rect x={-w*0.18} y={-h*0.36} width={w*0.36} height={h*0.72} rx={h*0.18} fill={color}/>
      <path d={`M ${w*0.25},${-h*0.32} L ${w*0.32},${-h*0.32} L ${w*0.32},${h*0.32} L ${w*0.25},${h*0.32} Z`} fill="white" opacity="0.6"/>
      <rect x={w*0.12} y={-h*0.62} width={w*0.09} height={h*0.18} rx="1" fill={color}/>
      <rect x={w*0.12} y={h*0.44} width={w*0.09} height={h*0.18} rx="1" fill={color}/>
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
  pickupPoint = { x: 260, y: 190, label: 'Connaught Place' },
  dropoffPoint = { x: 390, y: 370, label: 'Cyber City' },
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

  // Animated background simulation cars
  const [simCars, setSimCars] = useState([
    { id: 1, x: 200, y: 190, angle: 0, speed: 1.0 },
    { id: 2, x: 260, y: 280, angle: 90, speed: 0.8 },
    { id: 3, x: 130, y: 310, angle: 45, speed: 0.9 },
    { id: 4, x: 320, y: 150, angle: 180, speed: 0.7 },
    { id: 5, x: 390, y: 240, angle: 270, speed: 0.85 },
    { id: 6, x: 100, y: 190, angle: 0, speed: 0.95 },
    { id: 7, x: 260, y: 90, angle: 90, speed: 0.75 },
    { id: 8, x: 390, y: 110, angle: 180, speed: 0.8 },
  ]);

  useEffect(() => {
    const t = setInterval(() => {
      setSimCars(prev => prev.map(c => {
        let nx = c.x + Math.cos(c.angle * Math.PI / 180) * c.speed;
        let ny = c.y + Math.sin(c.angle * Math.PI / 180) * c.speed;
        if (nx < 10) nx = 480;
        if (nx > 490) nx = 20;
        if (ny < 10) ny = 470;
        if (ny > 480) ny = 20;
        return { ...c, x: nx, y: ny };
      }));
    }, 50);
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
    const factor = e.deltaY < 0 ? 1.15 : 0.85;
    setZoom(z => Math.max(0.7, Math.min(2.5, z * factor)));
  }

  function resetView() {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }

  const p1 = pickupPoint || { x: 260, y: 190 };
  const p2 = dropoffPoint || { x: 390, y: 370 };
  const routeCurve = `M ${p1.x},${p1.y} C ${p1.x},${(p1.y + p2.y)/2} ${(p1.x + p2.x)/2},${p2.y} ${p2.x},${p2.y}`;

  const bg = isDark ? '#0f141c' : '#eef2ee';
  const waterColor = isDark ? '#0b1d2e' : '#c9e2f8';
  const parkColor = isDark ? '#102619' : '#d2ebd5';
  const roadCasing = isDark ? '#1a2332' : '#ccd2da';
  const roadFill = isDark ? '#222d3d' : '#ffffff';
  const highwayFill = isDark ? '#2e3d54' : '#ffffff';
  const highwayCasing = isDark ? '#3d516e' : '#f59e0b';
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
        viewBox="0 0 500 500"
        preserveAspectRatio="xMidYMid slice"
        style={{
          width: '100%',
          height: '100%',
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: 'center center',
          transition: isDragging ? 'none' : 'transform 0.15s ease-out',
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
            <stop offset="60%" stopColor="#f97316" stopOpacity="0.6"/>
            <stop offset="100%" stopColor="#f97316" stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="hexMedSurge" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.75"/>
            <stop offset="70%" stopColor="#eab308" stopOpacity="0.45"/>
            <stop offset="100%" stopColor="#eab308" stopOpacity="0"/>
          </radialGradient>
        </defs>

        {/* 1. Base Land Background */}
        <rect x="0" y="0" width="500" height="500" fill={bg}/>

        {/* 2. Yamuna River */}
        <path d={RIVER_PATH} fill={waterColor} opacity="0.9"/>
        <text x="360" y="80" fill={isDark ? '#1e3a5f' : '#8ab8e6'} fontSize="9" fontWeight="bold" letterSpacing="2">YAMUNA RIVER</text>

        {/* 3. Parks & Forest Reserves */}
        {PARKS.map(p => (
          <path key={p.id} d={p.path} fill={parkColor}/>
        ))}

        {/* 4. Road Casings */}
        {ROADS.map(r => (
          <path
            key={`casing_${r.id}`}
            d={r.path}
            fill="none"
            stroke={r.isHighway ? highwayCasing : roadCasing}
            strokeWidth={r.width + 3.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}

        {/* 5. Road Asphalt Surfaces */}
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

        {/* 6. Highway Center White Dash Lines */}
        {ROADS.filter(r => r.isHighway).map(r => (
          <path
            key={`dash_${r.id}`}
            d={r.path}
            fill="none"
            stroke={isDark ? '#64748b' : '#f59e0b'}
            strokeWidth="1.5"
            strokeDasharray="8,8"
            opacity="0.8"
          />
        ))}

        {/* 7. Live Traffic Congestion Overlays (Green / Yellow / Red) */}
        {showTraffic && (
          <g opacity="0.75">
            {/* Red heavy traffic bottleneck on Ring Road */}
            <path d="M 360,40 C 420,150 460,260 360,410" fill="none" stroke="#ef4444" strokeWidth="3" strokeDasharray="6,4"/>
            {/* Moderate yellow traffic on NH-48 */}
            <path d="M 120,400 Q 180,360 260,190" fill="none" stroke="#f59e0b" strokeWidth="3.5"/>
            {/* Free flowing green on Barakhamba & Noida Exp */}
            <path d="M 260,190 Q 360,230 460,270" fill="none" stroke="#10b981" strokeWidth="3"/>
          </g>
        )}

        {/* 8. Hexagonal Surge Heatmaps (Driver Mode) */}
        {showHeatmap && (
          <g>
            {DELHI_ZONES.map(z => {
              const isSelected = selectedZone?.id === z.id;
              const isHigh = z.surge >= 1.8;
              const grad = isHigh ? 'url(#hexHighSurge)' : 'url(#hexMedSurge)';
              const radius = isHigh ? 80 : 60;
              return (
                <g key={z.id} onClick={() => onZoneSelect && onZoneSelect(z)} style={{ cursor: 'pointer' }}>
                  <circle cx={z.x} cy={z.y} r={radius} fill={grad} stroke={isSelected ? '#fff' : 'none'} strokeWidth={isSelected ? 3 : 0}/>
                  {/* Badge */}
                  <rect
                    x={z.x - 38}
                    y={z.y - 12}
                    width={76}
                    height={24}
                    rx="12"
                    fill={isHigh ? '#ef4444' : '#f59e0b'}
                    filter="drop-shadow(0 4px 10px rgba(0,0,0,0.5))"
                  />
                  <text x={z.x} y={z.y + 4} textAnchor="middle" fill={isHigh ? 'white' : '#111'} fontSize="11" fontWeight="900">
                    {z.surge}x SURGE
                  </text>
                </g>
              );
            })}
          </g>
        )}

        {/* 9. Active Route Navigation Polyline */}
        {showRoute && (
          <g>
            <path
              d={routeCurve}
              fill="none"
              stroke="#2563eb"
              strokeWidth="11"
              strokeLinecap="round"
              opacity="0.3"
            />
            <path
              d={routeCurve}
              fill="none"
              stroke="url(#routeGradient)"
              strokeWidth="6.5"
              strokeLinecap="round"
            />
            <path
              d={routeCurve}
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeDasharray="6,16"
              strokeLinecap="round"
            />
          </g>
        )}

        {/* 10. City Landmark Markers */}
        {DELHI_ZONES.map(z => {
          const isSelected = selectedZone?.id === z.id;
          return (
            <g key={z.id} transform={`translate(${z.x},${z.y})`} onClick={() => onZoneSelect && onZoneSelect(z)} style={{ cursor: 'pointer' }}>
              <circle cx="0" cy="0" r={isSelected ? 6 : 4} fill={isSelected ? '#f59e0b' : (isDark ? '#60a5fa' : '#2563eb')} stroke="white" strokeWidth="1.5"/>
              <text
                x="8"
                y="3"
                fill={isSelected ? (isDark ? '#fbbf24' : '#b45309') : textColor}
                fontSize={isSelected ? "11" : "9.5"}
                fontWeight={isSelected ? "900" : "700"}
                style={{ textShadow: isDark ? '0 1px 4px #000' : '0 1px 3px #fff' }}
              >
                {z.name}
              </text>
            </g>
          );
        })}

        {/* 11. Moving Taxi Vehicles */}
        {carsToRender.map(car => (
          <TopDownSedan
            key={car.id}
            x={car.x}
            y={car.y}
            angle={car.angle}
            color={isDark ? '#1f2937' : '#111827'}
            size={26}
          />
        ))}

        {/* 12. Driver Position Marker */}
        {driverPosition && (
          <g transform={`translate(${driverPosition.x},${driverPosition.y})`}>
            <polygon
              points="0,-28 16,-8 0,-12 -16,-8"
              fill="#3b82f6"
              opacity="0.5"
              transform={`rotate(${driverPosition.angle || 0})`}
            />
            <circle cx="0" cy="0" r="14" fill="#3b82f6" stroke="white" strokeWidth="3" filter="drop-shadow(0 2px 8px rgba(59,130,246,0.6))"/>
            <polygon points="0,-7 6,5 0,3 -6,5" fill="white" transform={`rotate(${driverPosition.angle || 0})`}/>
          </g>
        )}

        {/* 13. Pickup Point (Rider Blue Pulse Dot / Pin) */}
        {pickupPoint && (
          <g transform={`translate(${p1.x},${p1.y})`}>
            <circle cx="0" cy="0" r="22" fill="#2563eb" opacity="0.18">
              <animate attributeName="r" values="16;28;16" dur="2.4s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values="0.25;0.05;0.25" dur="2.4s" repeatCount="indefinite"/>
            </circle>
            <circle cx="0" cy="0" r="10" fill="white" stroke="#2563eb" strokeWidth="3.5" filter="drop-shadow(0 2px 6px rgba(0,0,0,0.3))"/>
            <circle cx="0" cy="0" r="4.5" fill="#2563eb"/>
          </g>
        )}

        {/* 14. Dropoff Point Pin */}
        {showRoute && dropoffPoint && (
          <g transform={`translate(${p2.x},${p2.y})`}>
            <circle cx="0" cy="0" r="14" fill="rgba(239,68,68,0.2)"/>
            <rect x="-8" y="-8" width="16" height="16" rx="3" fill="#111827" stroke="white" strokeWidth="2.5" filter="drop-shadow(0 2px 6px rgba(0,0,0,0.3))"/>
            <rect x="-3" y="-3" width="6" height="6" fill="#ef4444"/>
          </g>
        )}
      </svg>

      {/* Floating Map Controls */}
      <div style={{ position: 'absolute', right: '12px', top: '70px', display: 'flex', flexDirection: 'column', gap: '6px', zIndex: 30 }}>
        <button
          onClick={e => { e.stopPropagation(); setZoom(z => Math.min(2.5, z * 1.25)); }}
          style={{
            width: '32px', height: '32px', borderRadius: '50%', background: isDark ? '#1e293b' : 'white',
            border: `1px solid ${isDark ? '#334155' : '#e5e7eb'}`, color: isDark ? 'white' : '#111',
            fontWeight: '900', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
          }}
          title="Zoom In"
        >
          +
        </button>
        <button
          onClick={e => { e.stopPropagation(); setZoom(z => Math.max(0.7, z * 0.8)); }}
          style={{
            width: '32px', height: '32px', borderRadius: '50%', background: isDark ? '#1e293b' : 'white',
            border: `1px solid ${isDark ? '#334155' : '#e5e7eb'}`, color: isDark ? 'white' : '#111',
            fontWeight: '900', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
          }}
          title="Zoom Out"
        >
          −
        </button>
        <button
          onClick={e => { e.stopPropagation(); resetView(); }}
          style={{
            width: '32px', height: '32px', borderRadius: '50%', background: isDark ? '#1e293b' : 'white',
            border: `1px solid ${isDark ? '#334155' : '#e5e7eb'}`, color: isDark ? 'white' : '#111',
            fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
          }}
          title="Recenter Map"
        >
          🎯
        </button>
      </div>

      {/* Traffic Legend (bottom left) */}
      <div style={{ position: 'absolute', left: '12px', top: '70px', background: isDark ? 'rgba(15,20,28,0.85)' : 'rgba(255,255,255,0.88)', borderRadius: '14px', padding: '6px 10px', display: 'flex', alignItems: 'center', gap: '8px', zIndex: 20, backdropFilter: 'blur(4px)', border: `1px solid ${isDark ? '#232d40' : '#e5e7eb'}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}/>
          <span style={{ fontSize: '9px', fontWeight: '700', color: isDark ? '#94a3b8' : '#4b5563' }}>Fast</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }}/>
          <span style={{ fontSize: '9px', fontWeight: '700', color: isDark ? '#94a3b8' : '#4b5563' }}>Slow</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }}/>
          <span style={{ fontSize: '9px', fontWeight: '700', color: isDark ? '#94a3b8' : '#4b5563' }}>Delay</span>
        </div>
      </div>
    </div>
  );
}
