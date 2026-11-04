import React, { useState, useEffect, useRef } from 'react';
import UberVectorMap, { DELHI_ZONES } from '../shared/components/UberVectorMap.jsx';
import { marketplaceSync } from '../shared/marketplaceSync.js';

/* ─────────────────────────── SVG ICONS ─────────────────────────── */
const BellIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);
const CarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
    <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v9a2 2 0 0 1-2 2h-2"/>
    <circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>
  </svg>
);
const BotIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M12 11V5"/><circle cx="12" cy="4" r="2"/>
    <path d="M8 15h.01M16 15h.01"/>
  </svg>
);
const PersonIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const NavIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <polygon points="3 11 22 2 13 21 11 13 3 11"/>
  </svg>
);
const BoltIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" style={{ color: '#f59e0b' }}>
    <path d="M13 2L4.09 12.26A1 1 0 0 0 5 14h6l-1 8 8.91-10.26A1 1 0 0 0 19 10h-6l1-8z"/>
  </svg>
);
const FilterIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
  </svg>
);
const SendIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
  </svg>
);
const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.46 2 2 0 0 1 3.59 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);
const MessageIcon2 = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);
const BackIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18">
    <path d="M19 12H5M12 5l-7 7 7 7"/>
  </svg>
);

/* ─────────────────────────── CONSTANTS ─────────────────────────── */
const OLLAMA_REMOTE_URL = 'http://10.151.32.198:11434';
const OLLAMA_MODELS = [
  { id: 'sam860/dolphin3-llama3.2:3b', name: 'Dolphin3 LLaMA 3.2 (3B)', tag: 'Fast Dispatch' },
  { id: 'huihui_ai/smallthinker-abliterated:3b', name: 'SmallThinker 3B', tag: 'Causal Reasoning' },
  { id: 'jaahas/qwen3.5-uncensored:4b', name: 'Qwen 3.5 Uncensored (4B)', tag: 'Financial Math' },
];

/* ═══════════════════════════ SCREENS ═══════════════════════════ */

/* Screen 0: Online / Offline with Micro-Shift Plan & Charging Prompts */
function OnlineScreen({ isOnline, setIsOnline, driverPos, onOpenPreferences, destinationFilter, onAcceptRecommendation }) {
  const [showMicroShift, setShowMicroShift] = useState(false);
  const [showBreakPrompt, setShowBreakPrompt] = useState(true);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, background: '#0b0e14', color: 'white', position: 'relative' }}>
      {/* Background Vector Map */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: isOnline ? 1 : 0.35 }}>
        <UberVectorMap
          theme="dark"
          driverPosition={driverPos}
          showHeatmap={false}
          interactive={true}
        />
      </div>

      {/* Floating Top Header */}
      <div style={{ position: 'relative', zIndex: 10, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontWeight: '900', fontSize: '18px', textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>CityPlus Driver</span>
          {destinationFilter && (
            <span style={{ background: '#2563eb', color: 'white', fontSize: '10px', fontWeight: '800', padding: '2px 8px', borderRadius: '10px' }}>
              🎯 {destinationFilter}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => setShowMicroShift(true)} style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#161c28', border: '1px solid #232d40', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.4)', fontSize: '16px' }} title="Micro-Shift Plan">
            🧭
          </button>
          <button onClick={onOpenPreferences} style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#161c28', border: '1px solid #232d40', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.4)' }} title="Trip Preferences">
            <FilterIcon/>
          </button>
        </div>
      </div>

      {/* Online / Offline Toggle Pill */}
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', justifyContent: 'center', marginTop: '4px' }}>
        <button onClick={() => setIsOnline(!isOnline)}
          style={{
            background: isOnline ? '#10b981' : '#374151', color: isOnline ? '#111' : 'white',
            padding: '7px 18px', borderRadius: '24px', fontWeight: '900', fontSize: '13px',
            border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.4)', transition: 'all 0.15s ease',
          }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: isOnline ? '#111' : '#9ca3af' }}/>
          <span>{isOnline ? 'Online' : 'Offline'}</span>
          <span style={{ fontSize: '11px', opacity: 0.8 }}>›</span>
        </button>
      </div>

      {/* Center Status Card */}
      <div style={{ position: 'relative', zIndex: 10, margin: 'auto 16px 10px', textAlign: 'center' }}>
        <div style={{ background: 'rgba(22,28,40,0.92)', borderRadius: '22px', padding: '18px 16px', border: '1px solid #232d40', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)' }}>
          <div style={{ fontSize: '28px', marginBottom: '4px' }}>{isOnline ? '🏙️' : '🌙'}</div>
          <p style={{ fontWeight: '900', fontSize: '17px', color: 'white', marginBottom: '4px' }}>
            {isOnline ? "You're all set!" : "You are Offline"}
          </p>
          <p style={{ fontSize: '11px', color: '#9ca3af', lineHeight: 1.4 }}>
            {isOnline
              ? "Receiving dispatch requests in Central Zone. Position at Stadium North for 2.4x surge."
              : "Go online to start receiving ride dispatches across Delhi NCR."}
          </p>
        </div>
      </div>

      {/* Break, Fuel, and Charging Prompt (Dismissible) */}
      {isOnline && showBreakPrompt && (
        <div style={{ position: 'relative', zIndex: 10, margin: '0 16px 8px' }}>
          <div style={{ background: '#1c1917', border: '1px solid #442a17', borderRadius: '16px', padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 4px 14px rgba(0,0,0,0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '18px' }}>⚡</span>
              <div>
                <p style={{ fontWeight: '800', fontSize: '11px', color: '#f59e0b' }}>Optimal EV Charging Window</p>
                <p style={{ fontSize: '10px', color: '#a8a29e' }}>Demand low next 20m • Fast Charger 800m away (HPCL)</p>
              </div>
            </div>
            <button onClick={() => setShowBreakPrompt(false)} style={{ background: 'none', border: 'none', color: '#78716c', fontSize: '15px', cursor: 'pointer', padding: '2px 4px' }}>✕</button>
          </div>
        </div>
      )}

      {/* Bottom Pinned Action Bar */}
      <div style={{ padding: '0 16px 14px', position: 'relative', zIndex: 10 }}>
        <button onClick={() => setIsOnline(!isOnline)}
          style={{
            width: '100%', padding: '14px', borderRadius: '16px', fontWeight: '900', fontSize: '14.5px',
            background: isOnline ? 'white' : '#10b981', color: '#111', border: 'none', cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)', transition: 'all 0.15s ease',
          }}>
          {isOnline ? 'Go Offline' : 'Go Online'}
        </button>
      </div>

      {/* Micro-Shift Plan Modal */}
      {showMicroShift && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 70, display: 'flex', alignItems: 'flex-end' }}>
          <div style={{ width: '100%', background: '#161c28', borderTopLeftRadius: '24px', borderTopRightRadius: '24px', padding: '20px 18px', borderTop: '1px solid #232d40' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontWeight: '900', fontSize: '16px' }}>Micro-Shift Opportunity Plan</span>
              <button onClick={() => setShowMicroShift(false)} style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>

            <p style={{ fontSize: '12px', color: '#10b981', fontWeight: '800', marginBottom: '12px' }}>
              “Work the airport queue until 8:40 PM, then head downtown before the concert ends.”
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
              <div style={{ background: '#0f141e', padding: '10px 12px', borderRadius: '12px', borderLeft: '3px solid #3b82f6' }}>
                <p style={{ fontWeight: '800', fontSize: '11.5px', color: '#93c5fd' }}>Phase 1: Now – 8:40 PM (Airport Queue)</p>
                <p style={{ fontSize: '10.5px', color: '#9ca3af', marginTop: '2px' }}>Current queue is 12 cars (~8m wait). Long trips average ₹520.</p>
              </div>
              <div style={{ background: '#0f141e', padding: '10px 12px', borderRadius: '12px', borderLeft: '3px solid #f59e0b' }}>
                <p style={{ fontWeight: '800', fontSize: '11.5px', color: '#fcd34d' }}>Phase 2: 9:15 PM – 10:45 PM (Stadium Dispersal)</p>
                <p style={{ fontSize: '10.5px', color: '#9ca3af', marginTop: '2px' }}>4,200 attendees exiting. Reposition to Gate 4 North for 2.4x surge.</p>
              </div>
              <div style={{ background: '#0f141e', padding: '10px 12px', borderRadius: '12px', borderLeft: '3px solid #10b981' }}>
                <p style={{ fontWeight: '800', fontSize: '11.5px', color: '#86efac' }}>Phase 3: 11:00 PM – Midnight (Cyber City Night Shift)</p>
                <p style={{ fontSize: '10.5px', color: '#9ca3af', marginTop: '2px' }}>Corporate night-shift outbound trips heading to South Delhi.</p>
              </div>
            </div>

            <button onClick={() => setShowMicroShift(false)} style={{ width: '100%', background: 'white', color: '#111', borderRadius: '14px', padding: '12px', fontWeight: '900', fontSize: '14px', border: 'none', cursor: 'pointer' }}>
              Got It
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* Screen 1: High Demand Heatmap & Zone Rankings */
function HeatmapScreen({ onNavigate, selectedZone, onSelectZone }) {
  const [tabMode, setTabMode] = useState('zones');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, background: '#0b0e14', color: 'white', position: 'relative' }}>
      {/* Expansive Map Viewport (58% of Screen) */}
      <div style={{ height: '58%', position: 'relative', flexShrink: 0 }}>
        <UberVectorMap
          theme="dark"
          showHeatmap={true}
          selectedZone={selectedZone}
          onZoneSelect={onSelectZone}
          interactive={true}
        />
        <div style={{ position: 'absolute', top: '12px', left: '14px', background: 'rgba(239,68,68,0.92)', borderRadius: '20px', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '6px', zIndex: 20, boxShadow: '0 4px 14px rgba(239,68,68,0.4)' }}>
          <BoltIcon/>
          <span style={{ fontSize: '10.5px', fontWeight: '900', color: 'white', letterSpacing: '0.3px' }}>SURGE ACTIVE (UP TO 2.4x)</span>
        </div>
      </div>

      {/* Bottom Information & Opportunity Sheet */}
      <div style={{ flex: 1, minHeight: 0, background: '#161c28', borderTop: '1px solid #232d40', display: 'flex', flexDirection: 'column' }}>
        {/* Sub Navigation Bar */}
        <div style={{ display: 'flex', borderBottom: '1px solid #1f2937', padding: '4px 6px', flexShrink: 0 }}>
          {[
            { id: 'zones', label: '1. Net/Min Rank' },
            { id: 'dispersal', label: '4. Dispersal Plan' },
            { id: 'whatif', label: '7. What-If Sim' },
          ].map(t => (
            <button key={t.id} onClick={() => setTabMode(t.id)}
              style={{
                flex: 1, padding: '8px 4px', fontSize: '10.5px', fontWeight: '800', border: 'none', cursor: 'pointer',
                background: tabMode === t.id ? '#232d40' : 'transparent', color: tabMode === t.id ? '#10b981' : '#9ca3af',
                borderRadius: '8px', transition: 'all 0.15s ease',
              }}>
              {t.label}
            </button>
          ))}
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '10px 14px' }}>
          {/* TAB 1: Net profit per minute zone rankings */}
          {tabMode === 'zones' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '10.5px', fontWeight: '900', color: '#9ca3af' }}>RANKED BY NET PROFIT PER MINUTE</span>
                <span style={{ fontSize: '10px', color: '#60a5fa' }}>After fuel & wait</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {[
                  { name: 'Connaught Place (CP)', net: '₹18.40/min', surge: '2.0x', wait: '2.5m', deadhead: 'Low (4%)', flag: 'HIGHEST NET' },
                  { name: 'National Stadium Arena', net: '₹17.80/min', surge: '2.4x', wait: '3.0m', deadhead: 'Low (6%)', flag: 'EVENT SURGE' },
                  { name: 'Cyber City Gurugram', net: '₹16.10/min', surge: '1.8x', wait: '3.1m', deadhead: 'Low (8%)', flag: 'LONG FARES' },
                  { name: 'Terminal 3 - IGI Airport', net: '₹14.50/min', surge: '1.5x', wait: '7.0m', deadhead: 'Zero (1%)', flag: 'QUEUED' },
                  { name: 'Far North Industrial Suburb', net: '₹9.20/min', surge: '2.2x', wait: '11m', deadhead: 'HIGH (74%)', flag: '⚠️ DEADHEAD RISK' },
                ].map((z, i) => (
                  <div key={i} style={{ background: '#0f141e', borderRadius: '12px', padding: '10px 12px', border: z.flag.includes('DEADHEAD') ? '1px solid #7f1d1d' : '1px solid #1e283d' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                      <span style={{ fontWeight: '800', fontSize: '12.5px', color: 'white' }}>{z.name}</span>
                      <span style={{ fontWeight: '900', fontSize: '12.5px', color: z.flag.includes('DEADHEAD') ? '#f87171' : '#10b981' }}>{z.net}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#9ca3af' }}>
                      <span>Surge: {z.surge} • Wait: {z.wait}</span>
                      <span style={{ color: z.flag.includes('DEADHEAD') ? '#ef4444' : '#60a5fa', fontWeight: '700' }}>{z.flag}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: Stadium Dispersal Planner */}
          {tabMode === 'dispersal' && (
            <div>
              <span style={{ fontSize: '10.5px', fontWeight: '900', color: '#9ca3af', display: 'block', marginBottom: '6px' }}>STADIUM DISPERSAL PLANNER</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '10px' }}>
                <div style={{ background: '#0f141e', padding: '8px 10px', borderRadius: '10px', borderLeft: '3px solid #6b7280' }}>
                  <span style={{ fontSize: '10px', fontWeight: '800', color: '#9ca3af' }}>8:00 – 9:30 PM (Mid-Match)</span>
                  <p style={{ fontSize: '11px', color: 'white', marginTop: '1px' }}>Low demand. Remain in Central Zone.</p>
                </div>
                <div style={{ background: '#0f141e', padding: '8px 10px', borderRadius: '10px', borderLeft: '3px solid #ef4444' }}>
                  <span style={{ fontSize: '10px', fontWeight: '800', color: '#f87171' }}>10:15 – 11:15 PM (Dispersal Rush)</span>
                  <p style={{ fontSize: '11px', color: 'white', marginTop: '1px' }}>4,200 attendees exiting. Surge forecast: 2.4x.</p>
                  <p style={{ fontSize: '10px', color: '#10b981', fontWeight: '700', marginTop: '1px' }}>→ Position at Gate 4 North by 10:10 PM.</p>
                </div>
              </div>

              <div style={{ background: '#0f141e', borderRadius: '10px', padding: '8px 10px', marginBottom: '10px', border: '1px solid #1e283d' }}>
                <p style={{ fontSize: '10.5px', color: '#93c5fd', fontWeight: '700', lineHeight: 1.35 }}>
                  🔍 <strong>Surge Clarity:</strong> Demand is authentic (stadium ticket scan data). ~18 drivers converging now. High surge window lasts 35 min.
                </p>
              </div>

              <button onClick={() => onNavigate(DELHI_ZONES[1])}
                style={{ width: '100%', background: '#2563eb', color: 'white', padding: '11px', borderRadius: '12px', fontWeight: '900', fontSize: '12.5px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(37,99,235,0.4)' }}>
                Position at Stadium North
              </button>
            </div>
          )}

          {/* TAB 3: What-If Simulator */}
          {tabMode === 'whatif' && (
            <div>
              <span style={{ fontSize: '10.5px', fontWeight: '900', color: '#9ca3af', display: 'block', marginBottom: '8px' }}>WHAT-IF EARNINGS SIMULATOR</span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
                <div style={{ background: '#0f141e', padding: '10px', borderRadius: '12px', border: '1px solid #1e283d', textAlign: 'center' }}>
                  <p style={{ fontSize: '10px', color: '#9ca3af', fontWeight: '700' }}>IF YOU STAY HERE</p>
                  <p style={{ fontSize: '18px', fontWeight: '900', color: '#f59e0b', margin: '2px 0' }}>₹340/hr</p>
                  <p style={{ fontSize: '9.5px', color: '#6b7280' }}>Est. 1.2 trips • 6m wait</p>
                </div>
                <div style={{ background: '#143322', padding: '10px', borderRadius: '12px', border: '1px solid #10b981', textAlign: 'center' }}>
                  <p style={{ fontSize: '10px', color: '#86efac', fontWeight: '700' }}>IF YOU MOVE TO STADIUM</p>
                  <p style={{ fontSize: '18px', fontWeight: '900', color: '#10b981', margin: '2px 0' }}>₹520/hr</p>
                  <p style={{ fontSize: '9.5px', color: '#a7f3d0' }}>+53% projected net</p>
                </div>
              </div>
              <p style={{ fontSize: '10.5px', color: '#9ca3af', textAlign: 'center', lineHeight: 1.3 }}>
                Move in 12 min. Net earnings are projected 22% higher after accounting for driving time, waiting, and EV energy costs.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* Screen 2: Performance & Net Earnings */
function EarningsScreen({ totalEarnings, completedTrips }) {
  const [subView, setSubView] = useState('performance');
  const [selectedDay, setSelectedDay] = useState('Wed');
  const [showCashOutModal, setShowCashOutModal] = useState(false);
  const [cashOutSuccess, setCashOutSuccess] = useState(false);

  const weekDays = [
    { day: 'Mon', amount: 2420, trips: 18, online: '7.2h' },
    { day: 'Tue', amount: 2680, trips: 21, online: '7.8h' },
    { day: 'Wed', amount: 2850, trips: 24, online: '8.5h' },
    { day: 'Thu', amount: 2310, trips: 17, online: '6.9h' },
    { day: 'Fri', amount: 3450, trips: 28, online: '9.4h' },
    { day: 'Sat', amount: 3820, trips: 31, online: '10.1h' },
    { day: 'Sun', amount: 3120, trips: 25, online: '8.8h' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, background: '#0b0e14', color: 'white', padding: '14px 16px', overflowY: 'auto' }}>
      {/* Sub-view toggle pill */}
      <div style={{ display: 'flex', background: '#161c28', borderRadius: '18px', padding: '4px', border: '1px solid #232d40', marginBottom: '12px' }}>
        <button onClick={() => setSubView('performance')}
          style={{ flex: 1, padding: '7px 4px', borderRadius: '14px', border: 'none', fontSize: '11px', fontWeight: '800', background: subView === 'performance' ? '#10b981' : 'transparent', color: subView === 'performance' ? '#111' : '#9ca3af', cursor: 'pointer' }}>
          Performance & Net
        </button>
        <button onClick={() => setSubView('future')}
          style={{ flex: 1, padding: '7px 4px', borderRadius: '14px', border: 'none', fontSize: '11px', fontWeight: '800', background: subView === 'future' ? '#10b981' : 'transparent', color: subView === 'future' ? '#111' : '#9ca3af', cursor: 'pointer' }}>
          Future Scope & Goals
        </button>
      </div>

      {subView === 'performance' ? (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <span style={{ fontSize: '11px', color: '#9ca3af', fontWeight: '700' }}>TODAY'S NET EARNINGS</span>
            <span style={{ fontSize: '10px', color: '#10b981', fontWeight: '800' }}>▲ +12% vs last week</span>
          </div>
          <p style={{ fontWeight: '900', fontSize: '32px', margin: '0 0 10px' }}>₹{totalEarnings || 2850}</p>

          <div style={{ background: '#161c28', borderRadius: '14px', padding: '10px 14px', border: '1px solid #232d40', marginBottom: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', padding: '4px 0', borderBottom: '1px solid #1f2937' }}>
              <span style={{ color: '#9ca3af' }}>Gross Fare</span>
              <span style={{ fontWeight: '800' }}>₹3,480.00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', padding: '4px 0', borderBottom: '1px solid #1f2937' }}>
              <span style={{ color: '#9ca3af' }}>Platform Service Fee (14%)</span>
              <span style={{ fontWeight: '800', color: '#ef4444' }}>-₹480.00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', padding: '4px 0', borderBottom: '1px solid #1f2937' }}>
              <span style={{ color: '#9ca3af' }}>EV Fuel / Charging</span>
              <span style={{ fontWeight: '800', color: '#f59e0b' }}>-₹150.00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', padding: '6px 0 2px' }}>
              <span style={{ fontWeight: '900', color: '#10b981' }}>Driver Take-Home Net</span>
              <span style={{ fontWeight: '900', color: '#10b981' }}>₹2,850.00</span>
            </div>
          </div>

          {/* 7-Day Bar Chart */}
          <div style={{ background: '#161c28', borderRadius: '14px', padding: '12px', border: '1px solid #232d40', marginBottom: '14px' }}>
            <p style={{ fontSize: '11px', fontWeight: '800', color: '#9ca3af', marginBottom: '8px' }}>7-DAY NET EARNINGS (SELECT DAY)</p>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '80px', paddingTop: '8px' }}>
              {weekDays.map(d => {
                const maxAmt = 4000;
                const h = Math.round((d.amount / maxAmt) * 70);
                const isSel = selectedDay === d.day;
                return (
                  <div key={d.day} onClick={() => setSelectedDay(d.day)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'pointer', flex: 1 }}>
                    <div style={{ width: '22px', height: `${h}px`, borderRadius: '4px', background: isSel ? '#10b981' : '#232d40', transition: 'all 0.15s ease' }}/>
                    <span style={{ fontSize: '9.5px', color: isSel ? '#10b981' : '#9ca3af', fontWeight: '800' }}>{d.day}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <button onClick={() => setShowCashOutModal(true)}
            style={{ width: '100%', background: '#10b981', color: '#111', borderRadius: '14px', padding: '13px', fontWeight: '900', fontSize: '14px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(16,185,129,0.3)' }}>
            Instant Cash Out to UPI (₹2,850)
          </button>
        </div>
      ) : (
        /* Future Scope & Predictive Planner */
        <div>
          <div style={{ background: '#161c28', borderRadius: '14px', padding: '12px 14px', border: '1px solid #232d40', marginBottom: '12px' }}>
            <span style={{ fontSize: '11px', fontWeight: '900', color: '#9ca3af' }}>WEEKLY GOAL TRACKER</span>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '6px 0 4px' }}>
              <span style={{ fontWeight: '900', fontSize: '20px', color: '#10b981' }}>₹18,520 / ₹25,000</span>
              <span style={{ fontSize: '11px', color: '#86efac', fontWeight: '800' }}>74% Achieved</span>
            </div>
            <div style={{ width: '100%', height: '8px', background: '#0f141e', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: '74%', height: '100%', background: '#10b981', borderRadius: '4px' }}/>
            </div>
          </div>

          <div style={{ background: '#161c28', borderRadius: '14px', padding: '12px 14px', border: '1px solid #232d40', marginBottom: '14px' }}>
            <span style={{ fontSize: '11px', fontWeight: '900', color: '#9ca3af' }}>UPCOMING 7-DAY EVENT RADAR</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
              <div style={{ background: '#0f141e', padding: '8px 10px', borderRadius: '10px', borderLeft: '3px solid #ef4444' }}>
                <p style={{ fontWeight: '800', fontSize: '11.5px', color: '#f87171' }}>National Stadium Semi-Finals (Fri, 10 PM)</p>
                <p style={{ fontSize: '10px', color: '#9ca3af' }}>Expected surge: 2.4x • Projected ₹1,400 in 2 hours</p>
              </div>
              <div style={{ background: '#0f141e', padding: '8px 10px', borderRadius: '10px', borderLeft: '3px solid #3b82f6' }}>
                <p style={{ fontWeight: '800', fontSize: '11.5px', color: '#93c5fd' }}>Cyber City Tech Summit (Mon, 8:30 AM)</p>
                <p style={{ fontSize: '10px', color: '#9ca3af' }}>Expected surge: 1.9x • Corporate executive long fares</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cash Out Modal */}
      {showCashOutModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 120, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: '400px', background: '#161c28', borderTopLeftRadius: '24px', borderTopRightRadius: '24px', padding: '20px 18px', borderTop: '1px solid #232d40' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span style={{ fontWeight: '900', fontSize: '16px' }}>Instant Cash Out</span>
              <button onClick={() => setShowCashOutModal(false)} style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>
            <p style={{ fontSize: '11.5px', color: '#9ca3af', marginBottom: '14px' }}>Transfer your daily net earnings directly to your verified bank account.</p>
            <div style={{ background: '#0f141e', borderRadius: '12px', padding: '12px', marginBottom: '16px', border: '1px solid #232d40' }}>
              <p style={{ fontSize: '11px', color: '#9ca3af' }}>Transfer To: UPI ID</p>
              <p style={{ fontWeight: '900', fontSize: '14px', color: '#10b981', marginTop: '2px' }}>amit.kumar@okhdfcbank</p>
            </div>
            <button onClick={() => { setCashOutSuccess(true); setTimeout(() => { setCashOutSuccess(false); setShowCashOutModal(false); alert('₹2,850 successfully transferred to your bank account!'); }, 800); }}
              style={{ width: '100%', background: '#10b981', color: '#111', borderRadius: '14px', padding: '13px', fontWeight: '900', fontSize: '14px', border: 'none', cursor: 'pointer' }}>
              {cashOutSuccess ? 'Processing...' : 'Confirm Transfer of ₹2,850'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* Screen 3: Active Trip (On Trip Navigation) */
function ActiveTripScreen({ currentTrip, onEndTrip }) {
  const [showCall, setShowCall] = useState(false);
  const [showChat, setShowChat] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, background: '#0b0e14', color: 'white', position: 'relative' }}>
      {/* Navigation Map (56% of Screen) */}
      <div style={{ height: '56%', position: 'relative', flexShrink: 0 }}>
        <UberVectorMap
          theme="dark"
          showRoute={true}
          interactive={true}
        />
        <div style={{ position: 'absolute', top: '12px', left: '14px', background: '#111827', borderRadius: '16px', padding: '8px 14px', border: '1px solid #10b981', boxShadow: '0 4px 14px rgba(0,0,0,0.5)', zIndex: 10 }}>
          <p style={{ fontSize: '10px', color: '#10b981', fontWeight: '800' }}>● ON TRIP NAVIGATION</p>
          <p style={{ fontWeight: '900', fontSize: '16px', color: 'white' }}>Drop off in 6 min • 3.8 km</p>
        </div>
      </div>

      {/* Passenger Card Sheet (Fixed at Bottom) */}
      <div style={{ flex: 1, minHeight: 0, background: '#161c28', borderTop: '1px solid #232d40', padding: '14px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
            <div style={{ width: '46px', height: '46px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '900', fontSize: '18px' }}>
              P
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: '900', fontSize: '15px' }}>{currentTrip?.riderName || 'Priya Sharma'}</p>
              <p style={{ fontSize: '11px', color: '#9ca3af' }}>⭐ 4.9 • Dropoff: {currentTrip?.dropoff || 'Cyber City'}</p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setShowCall(true)} style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#0f141e', border: '1px solid #232d40', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', cursor: 'pointer' }}><PhoneIcon/></button>
              <button onClick={() => setShowChat(true)} style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#0f141e', border: '1px solid #232d40', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60a5fa', cursor: 'pointer' }}><MessageIcon2/></button>
            </div>
          </div>

          <div style={{ background: '#0f141e', borderRadius: '12px', padding: '10px 12px', border: '1px solid #1e283d', marginBottom: '14px' }}>
            <p style={{ fontSize: '11px', color: '#9ca3af' }}>Guaranteed Fare Payout: <strong style={{ color: '#10b981' }}>₹{currentTrip?.fare || 160}</strong></p>
          </div>
        </div>

        <button onClick={onEndTrip}
          style={{ width: '100%', background: '#ef4444', color: 'white', borderRadius: '14px', padding: '14px', fontWeight: '900', fontSize: '14.5px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(239,68,68,0.4)' }}>
          End Trip & Collect Fare
        </button>
      </div>

      {/* Audio Call Modal */}
      {showCall && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(15,23,42,0.95)', zIndex: 80, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', padding: '50px 24px', color: 'white' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: '26px', fontWeight: '900' }}>
              P
            </div>
            <p style={{ fontSize: '20px', fontWeight: '900' }}>Priya Sharma</p>
            <p style={{ fontSize: '12px', color: '#10b981', marginTop: '4px' }}>Audio Call Connected (00:22)</p>
          </div>
          <button onClick={() => setShowCall(false)} style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#ef4444', border: 'none', color: 'white', fontSize: '20px', cursor: 'pointer' }}>📞</button>
        </div>
      )}

      {/* In-App Chat Drawer */}
      {showChat && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 80, display: 'flex', alignItems: 'flex-end' }}>
          <div style={{ width: '100%', height: '65%', background: '#161c28', borderTopLeftRadius: '24px', borderTopRightRadius: '24px', display: 'flex', flexDirection: 'column', borderTop: '1px solid #232d40' }}>
            <div style={{ padding: '14px 16px', borderBottom: '1px solid #232d40', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ fontWeight: '900', fontSize: '14px' }}>Chat with Priya Sharma</p>
              <button onClick={() => setShowChat(false)} style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ flex: 1, padding: '12px', overflowY: 'auto' }}>
              <div style={{ padding: '8px 12px', background: '#2563eb', borderRadius: '14px', maxWidth: '80%', color: 'white', fontSize: '12px' }}>
                I am on my way to Cyber City.
              </div>
            </div>
            <div style={{ padding: '10px 14px', borderTop: '1px solid #232d40' }}>
              <button onClick={() => setShowChat(false)} style={{ width: '100%', background: '#232d40', color: 'white', padding: '10px', borderRadius: '12px', border: 'none', fontWeight: '800', fontSize: '12px', cursor: 'pointer' }}>Close Chat</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* Screen 4: Explainable AI Assistant connected to Remote Ollama Server */
function AIAssistantScreen() {
  const [selectedModel, setSelectedModel] = useState('auto');
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      source: 'ollama-live',
      modelUsed: 'Smart Multi-Model Auto-Router',
      routingReason: 'Remote Ollama Live (http://10.151.32.198:11434)',
      text: 'Hello Amit! I am your CityPlus Explainable Marketplace AI assistant. Connected to Ollama server at http://10.151.32.198:11434 with smart auto-routing across 3 dedicated models: Qwen 3.5 4B for numerical/financial math, SmallThinker 3B for causal "why" reasoning, and Dolphin3 3B for rapid dispatch. Ask me anything!'
    },
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingElapsed, setThinkingElapsed] = useState(0);
  const [activeRoutingInfo, setActiveRoutingInfo] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  useEffect(() => {
    let interval = null;
    if (isThinking) {
      setThinkingElapsed(0);
      interval = setInterval(() => setThinkingElapsed(s => s + 1), 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isThinking]);

  const chips = [
    'Why is Central Zone best?',
    'What are my net earnings & fuel costs?',
    'Explain deadhead risk',
    'Micro-shift plan for tonight',
    'Fairness anti-crowding dispatch',
    'Best zones for today',
    'Navigation tips for NH-48',
    'Calculate hourly net profit rate',
  ];

  function routeModelForQuestion(promptText) {
    const p = promptText.toLowerCase();
    if (p.includes('earning') || p.includes('fare') || p.includes('rupee') || p.includes('₹') ||
        p.includes('profit') || p.includes('net') || p.includes('calc') || p.includes('projection') ||
        p.includes('hourly') || p.includes('bonus') || p.includes('fuel') || p.includes('cost')) {
      return { id: 'jaahas/qwen3.5-uncensored:4b', name: 'Qwen 3.5 Uncensored (4B)', intent: 'Financial & Quantitative Precision' };
    }
    if (p.includes('why') || p.includes('how') || p.includes('reason') || p.includes('explain') ||
        p.includes('fairness') || p.includes('deadhead') || p.includes('logic') || p.includes('cause')) {
      return { id: 'huihui_ai/smallthinker-abliterated:3b', name: 'SmallThinker 3B (Reasoning)', intent: 'Deep Causal & Strategic Reasoning' };
    }
    return { id: 'sam860/dolphin3-llama3.2:3b', name: 'Dolphin3 LLaMA 3.2 (3B)', intent: 'Fast Operational Dispatch Guidance' };
  }

  async function queryAI(promptText) {
    setIsThinking(true);
    let botReply = '';
    let responseSource = 'fallback';
    let latencySec = 0;
    const startTime = Date.now();

    let targetModelId = selectedModel;
    let targetModelName = '';
    let routingReason = '';

    if (selectedModel === 'auto') {
      const routed = routeModelForQuestion(promptText);
      targetModelId = routed.id;
      targetModelName = routed.name;
      routingReason = `Auto-Routed to ${routed.name} (${routed.intent})`;
    } else {
      const match = OLLAMA_MODELS.find(m => m.id === selectedModel);
      targetModelName = match ? match.name : selectedModel;
      routingReason = `Manual Override: ${targetModelName}`;
    }

    setActiveRoutingInfo(routingReason);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 45000);

      const res = await fetch(`/ollama/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: targetModelId,
          prompt: `You are an AI marketplace assistant for a CityPlus Uber Driver in Delhi NCR. Context: Driver Amit Kumar, DL 8C 7321, currently in Central Zone. Please answer directly, accurately, and concisely: ${promptText}`,
          stream: false,
          options: { num_predict: 220, temperature: 0.2 }
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        latencySec = Math.round((Date.now() - startTime) / 100) / 10;
        let text = (data.response || '').trim();
        if (!text && data.thinking) {
          text = data.thinking.replace(/^Thinking Process:\s*/i, '').trim();
        }
        if (text) {
          botReply = text;
          responseSource = 'ollama-live';
        }
      }
    } catch {
      // Direct IP fallback
      try {
        const controller2 = new AbortController();
        const timeoutId2 = setTimeout(() => controller2.abort(), 20000);
        const res2 = await fetch(`${OLLAMA_REMOTE_URL}/api/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: targetModelId,
            prompt: `Delhi NCR CityPlus Driver Assistant: ${promptText}`,
            stream: false,
            options: { num_predict: 180, temperature: 0.2 }
          }),
          signal: controller2.signal,
        });
        clearTimeout(timeoutId2);
        if (res2.ok) {
          const data2 = await res2.json();
          latencySec = Math.round((Date.now() - startTime) / 100) / 10;
          let text2 = (data2.response || '').trim();
          if (!text2 && data2.thinking) text2 = data2.thinking.trim();
          if (text2) {
            botReply = text2;
            responseSource = 'ollama-live';
          }
        }
      } catch {
        // Fallback below
      }
    }

    if (!botReply) {
      latencySec = Math.round((Date.now() - startTime) / 100) / 10;
      if (promptText.includes('Why is Central Zone') || promptText.includes('best')) {
        botReply = 'Central Zone (CP) currently has 284 active passenger requests vs only 12 available cars (23.3:1 demand ratio). Mean wait time is 2.5 min, yielding ₹18.40 net/minute. Return trip probability is 96%, virtually eliminating unpaid return driving!';
      } else if (promptText.includes('deadhead')) {
        botReply = 'Trips to peripheral suburbs (like Far North Industrial) carry a 74% probability of driving back empty for 18 km (~₹110 in uncompensated fuel loss). Our policy engine recommends accepting return-heavy corridors such as Cyber City Gurugram or Airport T3.';
      } else if (promptText.includes('Micro-shift') || promptText.includes('tonight')) {
        botReply = 'Work the IGI Airport T3 queue until 8:40 PM for guaranteed ₹500+ fares. Repositioning to National Stadium North by 10:15 PM catches 4,200+ exiting spectators at 2.4x surge before downtown cools down.';
      } else if (promptText.includes('Fairness') || promptText.includes('anti-crowding')) {
        botReply = 'When 15+ drivers converge on a single stadium gate, queue times spike for everyone. Our fairness dispatch algorithm distributes drivers across Gate 2, Gate 4 North, and Outer Ring Road to maximize per-car earnings.';
      } else if (promptText.includes('earning') || promptText.includes('fuel') || promptText.includes('hourly')) {
        botReply = 'You have earned ₹2,850 net across 24 completed trips today (8.5 hrs online, avg ₹410/hr). Gross fare is ₹3,480, less ₹480 platform fee and ₹150 EV charging. You are 74% towards your weekly ₹25,000 goal!';
      } else {
        botReply = `In Delhi NCR, corporate corridors (Cyber City & Noida Sector 18) generate 42% of premium fares during morning and evening rush. Always maintain battery above 30% before the 9:30 PM stadium dispersal.`;
      }
    }

    setIsThinking(false);
    setMessages(prev => [...prev, {
      sender: 'bot',
      source: responseSource,
      modelUsed: targetModelName,
      modelId: targetModelId,
      routingReason,
      latencySec,
      text: botReply
    }]);
  }

  function handleSendChip(chip) {
    setMessages(prev => [...prev, { sender: 'user', text: chip }]);
    queryAI(chip);
  }

  function handleSendCustom() {
    if (!input.trim() || isThinking) return;
    const txt = input.trim();
    setInput('');
    setMessages(prev => [...prev, { sender: 'user', text: txt }]);
    queryAI(txt);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, background: '#0b0e14', color: 'white' }}>
      {/* Top Header */}
      <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '8px', borderBottom: '1px solid #1f2937', background: '#0f141e', flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '18px' }}>🤖</span>
            <div>
              <p style={{ fontWeight: '900', fontSize: '14.5px', lineHeight: 1.2 }}>CityPlus AI Assistant</p>
              <p style={{ fontSize: '10px', color: '#10b981', fontWeight: '700' }}>● Remote Ollama Live (10.151.32.198)</p>
            </div>
          </div>
          <span style={{ background: '#143322', color: '#86efac', fontSize: '10px', fontWeight: '800', padding: '3px 8px', borderRadius: '10px' }}>
            Ready
          </span>
        </div>

        {/* Model Selector Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '10px', color: '#9ca3af', fontWeight: '800' }}>Model:</span>
          <select value={selectedModel} onChange={e => setSelectedModel(e.target.value)}
            style={{ flex: 1, background: '#161c28', color: 'white', border: '1px solid #232d40', borderRadius: '10px', padding: '5px 8px', fontSize: '10.5px', fontWeight: '700', outline: 'none', cursor: 'pointer' }}>
            <option value="auto">✨ Smart Auto-Route (Intent-Based)</option>
            <option value="sam860/dolphin3-llama3.2:3b">⚡ Dolphin3 3B (Fast Dispatch)</option>
            <option value="huihui_ai/smallthinker-abliterated:3b">🧠 SmallThinker 3B (Causal Reasoning)</option>
            <option value="jaahas/qwen3.5-uncensored:4b">🔢 Qwen 3.5 4B (Financial Math)</option>
          </select>
        </div>

        {activeRoutingInfo && (
          <div style={{ background: '#1e293b', borderRadius: '8px', padding: '3px 8px', fontSize: '9px', color: '#60a5fa', fontWeight: '700' }}>
            {activeRoutingInfo}
          </div>
        )}
      </div>

      {/* Message Thread */}
      <div style={{ flex: 1, minHeight: 0, padding: '12px 14px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {messages.map((m, idx) => (
          <div key={idx} style={{ alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start', maxWidth: '88%' }}>
            {m.sender === 'bot' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px', flexWrap: 'wrap' }}>
                {m.source === 'ollama-live' ? (
                  <span style={{ background: '#064e3b', color: '#a7f3d0', fontSize: '8.5px', fontWeight: '800', padding: '1px 5px', borderRadius: '5px', border: '1px solid #059669' }}>
                    🟢 LIVE OLLAMA ({m.latencySec ? `${m.latencySec}s` : '10.151.32.198'})
                  </span>
                ) : (
                  <span style={{ background: '#1e293b', color: '#93c5fd', fontSize: '8.5px', fontWeight: '800', padding: '1px 5px', borderRadius: '5px' }}>
                    📊 MARKETPLACE ENGINE GROUNDED
                  </span>
                )}
                {m.modelUsed && <span style={{ fontSize: '8.5px', color: '#9ca3af', fontWeight: '700' }}>{m.modelUsed}</span>}
              </div>
            )}
            <div style={{
              background: m.sender === 'user' ? '#2563eb' : '#161c28',
              color: 'white', borderRadius: '16px', padding: '9px 13px', fontSize: '11.5px', lineHeight: 1.45,
              border: m.sender === 'bot' ? '1px solid #232d40' : 'none',
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            }}>
              {m.text}
            </div>
          </div>
        ))}

        {isThinking && (
          <div style={{ alignSelf: 'flex-start', background: '#161c28', borderRadius: '16px', padding: '9px 13px', border: '1px solid #10b981', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', border: '2px solid #10b981', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }}/>
            <span style={{ fontSize: '11px', color: '#10b981', fontWeight: '700' }}>
              Querying Ollama at 10.151.32.198... ({thinkingElapsed}s)
            </span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Chips */}
      <div style={{ padding: '6px 12px', display: 'flex', flexWrap: 'wrap', gap: '5px', borderTop: '1px solid #1f2937', background: '#0a0d14', flexShrink: 0 }}>
        {chips.map(c => (
          <button key={c} onClick={() => handleSendChip(c)}
            style={{ background: '#161c28', border: '1px solid #232d40', color: '#d1d5db', borderRadius: '16px', padding: '4px 8px', fontSize: '9.5px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.15s ease' }}>
            {c}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div style={{ padding: '10px 12px', borderTop: '1px solid #1f2937', display: 'flex', gap: '8px', background: '#0f141e', flexShrink: 0 }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSendCustom()}
          placeholder="Ask AI why any zone or fare was chosen..."
          style={{ flex: 1, background: '#161c28', border: '1px solid #232d40', borderRadius: '20px', padding: '8px 12px', color: 'white', fontSize: '11.5px', outline: 'none' }}/>
        <button onClick={handleSendCustom}
          style={{ width: '34px', height: '34px', borderRadius: '50%', background: '#2563eb', border: 'none', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
          <SendIcon/>
        </button>
      </div>
    </div>
  );
}

/* Screen 5: Profile */
function ProfileScreen() {
  const items = [
    { label: 'My Earnings & Weekly Payout', icon: '💰' },
    { label: 'Driver Rating & Feedback (4.94 ★)', icon: '⭐' },
    { label: 'Vehicle DL 8C 7321 Documents', icon: '📄' },
    { label: 'Driver Support (24/7 Helpline)', icon: '🛟' },
    { label: 'App Settings & Navigation Sound', icon: '⚙️' },
    { label: 'Log Out', icon: '🚪' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, background: '#0b0e14', color: 'white', padding: '16px 14px', overflowY: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px', padding: '14px', background: '#161c28', borderRadius: '18px', border: '1px solid #232d40' }}>
        <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'linear-gradient(135deg, #10b981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#111', fontWeight: '900', fontSize: '20px' }}>
          A
        </div>
        <div>
          <p style={{ fontWeight: '900', fontSize: '17px' }}>Amit Kumar</p>
          <p style={{ fontSize: '11px', color: '#9ca3af' }}>Driver ID: D12345 • DL 8C 7321</p>
          <span style={{ background: '#1e3a8a', color: '#93c5fd', fontSize: '9.5px', fontWeight: '800', padding: '2px 8px', borderRadius: '8px', marginTop: '4px', display: 'inline-block' }}>
            💎 CityPlus Pro Diamond
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {items.map(it => (
          <div key={it.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', borderRadius: '12px', cursor: 'pointer', background: '#0f141e', marginBottom: '6px', border: '1px solid #1e283d' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '16px' }}>{it.icon}</span>
              <span style={{ fontWeight: '700', fontSize: '12.5px' }}>{it.label}</span>
            </div>
            <span style={{ color: '#6b7280', fontSize: '16px' }}>›</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════ DRIVER PHONE FRAME COMPONENT ═══════════════════ */
function DriverPhoneFrame({ children, activeTab, onTabClick, showBottomNav = true, zoomScale = 1.0 }) {
  const tabs = [
    { id: 0, label: 'Home', icon: <CarIcon/> },
    { id: 1, label: 'Heatmap', icon: <NavIcon/> },
    { id: 2, label: 'Earnings', icon: <span style={{ fontSize: '15px', fontWeight: '900' }}>₹</span> },
    { id: 4, label: 'Assistant', icon: <BotIcon/> },
    { id: 5, label: 'Profile', icon: <PersonIcon/> },
  ];

  return (
    <div style={{
      width: '420px',
      height: '860px',
      borderRadius: '54px',
      background: '#0b0e14',
      boxShadow: '0 0 0 12px #1f232b, 0 0 0 14px #2e333d, 0 35px 70px rgba(0,0,0,0.7)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      flexShrink: 0,
      transform: zoomScale !== 1.0 ? `scale(${zoomScale})` : 'none',
      transformOrigin: 'top center',
      marginBottom: zoomScale !== 1.0 ? `-${Math.round((1 - zoomScale) * 860)}px` : '0',
    }}>
      {/* Dynamic Island */}
      <div style={{
        position: 'absolute', top: '12px', left: '50%', transform: 'translateX(-50%)',
        width: '116px', height: '30px', background: 'black', borderRadius: '20px', zIndex: 100,
        boxShadow: '0 2px 8px rgba(0,0,0,0.6)',
      }}/>

      {/* Side Buttons */}
      <div style={{ position: 'absolute', left: '-13px', top: '120px', width: '4px', height: '30px', background: '#333', borderRadius: '3px 0 0 3px' }}/>
      <div style={{ position: 'absolute', left: '-13px', top: '165px', width: '4px', height: '54px', background: '#333', borderRadius: '3px 0 0 3px' }}/>
      <div style={{ position: 'absolute', left: '-13px', top: '230px', width: '4px', height: '54px', background: '#333', borderRadius: '3px 0 0 3px' }}/>
      <div style={{ position: 'absolute', right: '-13px', top: '170px', width: '4px', height: '74px', background: '#333', borderRadius: '0 3px 3px 0' }}/>

      {/* iOS Status Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '46px 22px 6px', background: '#0b0e14', fontSize: '12px', fontWeight: '800', color: 'white', flexShrink: 0, zIndex: 90 }}>
        <span>9:41</span>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <span style={{ fontSize: '10px', color: '#10b981' }}>▲▲▲</span>
          <span style={{ fontSize: '11px', fontWeight: '800' }}>5G</span>
          <div style={{ width: '22px', height: '11px', border: '1.5px solid white', borderRadius: '3px', padding: '1.5px' }}>
            <div style={{ width: '85%', height: '100%', background: '#10b981', borderRadius: '1.5px' }}/>
          </div>
        </div>
      </div>

      {/* Screen Body */}
      <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative' }}>
        {children}
      </div>

      {/* Bottom Nav */}
      {showBottomNav && (
        <div style={{ display: 'flex', borderTop: '1px solid #1f2937', background: '#0b0e14', flexShrink: 0, paddingBottom: '6px', paddingTop: '4px' }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => onTabClick && onTabClick(t.id)}
              style={{
                flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
                padding: '4px 0', color: activeTab === t.id ? '#10b981' : '#6b7280',
                background: 'none', border: 'none', cursor: 'pointer', fontSize: '10.5px', fontWeight: '700', gap: '3px',
              }}>
              {t.icon}
              <span>{t.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Home Indicator Bar */}
      <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: '6px', background: '#0b0e14', position: 'relative', zIndex: 80 }}>
        <div style={{ width: '130px', height: '4px', background: '#374151', borderRadius: '2px' }}/>
      </div>
    </div>
  );
}

/* ═══════════════════ MAIN DRIVER APPLICATION ═══════════════════ */
export default function DriverApp() {
  const [screen, setScreen] = useState(0);
  const [viewMode, setViewMode] = useState('single');
  const [zoomScale, setZoomScale] = useState(1.0);
  const [isOnline, setIsOnline] = useState(true);
  const [earningsTotal, setEarningsTotal] = useState(2850);
  const [tripsCount, setTripsCount] = useState(24);
  const [driverPos] = useState({ x: 225, y: 310 });
  const [selectedZone, setSelectedZone] = useState(DELHI_ZONES[0]);
  const [currentTrip, setCurrentTrip] = useState(null);
  const [destinationFilter, setDestinationFilter] = useState('');
  const [showPreferences, setShowPreferences] = useState(false);
  const [incomingRequest, setIncomingRequest] = useState(null);

  useEffect(() => {
    const unsub = marketplaceSync.subscribe(msg => {
      if (msg.type === 'RIDE_REQUESTED') {
        setIncomingRequest({
          riderName: msg.payload?.riderName || 'Rahul Sharma',
          pickup: msg.payload?.pickup?.name || 'Connaught Place',
          dropoff: msg.payload?.dropoff?.name || 'Cyber City',
          fare: msg.payload?.fare || 160,
          rideType: msg.payload?.rideType || 'CityPlus Go',
          distance: '1.4 km away',
        });
      }
    });
    return unsub;
  }, []);

  function handleAcceptRide() {
    if (!incomingRequest) return;
    marketplaceSync.publish('RIDE_ACCEPTED', {
      driverName: 'Rohit Singh',
      rating: '4.94',
      car: 'Honda City EV - DL 8C 7321',
      pickup: incomingRequest.pickup,
      fare: incomingRequest.fare,
    });
    setCurrentTrip(incomingRequest);
    setIncomingRequest(null);
    setScreen(3);
  }

  function handleDeclineRide() {
    setIncomingRequest(null);
  }

  function handleEndTrip() {
    const fare = currentTrip?.fare || 160;
    setEarningsTotal(prev => prev + fare);
    setTripsCount(prev => prev + 1);
    marketplaceSync.publish('TRIP_COMPLETED', {
      fare,
      driverName: 'Rohit Singh',
    });
    setCurrentTrip(null);
    setScreen(2);
  }

  const screenNames = ['1. Online / Offline', '2. Heatmap', '3. Earnings', '4. Active Trip', '5. AI Assistant', '6. Profile'];

  function renderScreen(index) {
    switch (index) {
      case 0:
        return (
          <OnlineScreen
            isOnline={isOnline}
            setIsOnline={setIsOnline}
            driverPos={driverPos}
            onOpenPreferences={() => setShowPreferences(true)}
            destinationFilter={destinationFilter}
            onAcceptRecommendation={z => setSelectedZone(z)}
          />
        );
      case 1:
        return (
          <HeatmapScreen
            onNavigate={z => { setSelectedZone(z); setScreen(0); }}
            selectedZone={selectedZone}
            onSelectZone={z => setSelectedZone(z)}
          />
        );
      case 2:
        return <EarningsScreen totalEarnings={earningsTotal} completedTrips={tripsCount}/>;
      case 3:
        return <ActiveTripScreen currentTrip={currentTrip} onEndTrip={handleEndTrip}/>;
      case 4:
        return <AIAssistantScreen/>;
      case 5:
        return <ProfileScreen/>;
      default:
        return null;
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at 50% 20%, #064e3b 0%, #061014 60%, #020609 100%)',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '20px 16px 40px',
      overflowX: 'hidden',
      position: 'relative',
    }}>
      {/* Top Header Bar */}
      <div style={{ width: '100%', maxWidth: '1280px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <span style={{ fontWeight: '900', fontSize: '32px', letterSpacing: '-1px', color: '#10b981' }}>CityPlus</span>
          <div style={{ width: '1.5px', height: '32px', background: '#1f2937' }}/>
          <div>
            <p style={{ fontWeight: '800', fontSize: '18px', color: 'white', lineHeight: 1.2 }}>Driver App</p>
            <p style={{ fontSize: '12px', color: '#9ca3af', lineHeight: 1.2 }}>Drive. Earn. Grow.</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* View Mode Toggle */}
          <div style={{ display: 'flex', background: '#0f172a', padding: '4px', borderRadius: '30px', border: '1px solid #1e293b' }}>
            <button onClick={() => setViewMode('single')}
              style={{
                padding: '7px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: '800', border: 'none', cursor: 'pointer',
                background: viewMode === 'single' ? '#10b981' : 'transparent', color: viewMode === 'single' ? '#111' : 'white',
                transition: 'all 0.15s ease',
              }}>
              📱 Interactive Phone
            </button>
            <button onClick={() => setViewMode('grid')}
              style={{
                padding: '7px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: '800', border: 'none', cursor: 'pointer',
                background: viewMode === 'grid' ? '#10b981' : 'transparent', color: viewMode === 'grid' ? '#111' : 'white',
                transition: 'all 0.15s ease',
              }}>
              🖼️ All 6 Screens (Grid)
            </button>
          </div>

          {/* Scale Zoom Controls */}
          {viewMode === 'single' && (
            <div style={{ display: 'flex', background: '#0f172a', padding: '4px', borderRadius: '20px', border: '1px solid #1e293b' }}>
              {[0.85, 0.95, 1.0].map(s => (
                <button key={s} onClick={() => setZoomScale(s)}
                  style={{
                    padding: '6px 10px', borderRadius: '16px', fontSize: '11px', fontWeight: '800', border: 'none', cursor: 'pointer',
                    background: zoomScale === s ? '#374151' : 'transparent', color: zoomScale === s ? '#10b981' : '#9ca3af',
                  }}>
                  {Math.round(s * 100)}%
                </button>
              ))}
            </div>
          )}
        </div>

        <a href="http://localhost:5173" target="_blank" rel="noopener noreferrer"
          style={{ background: '#0f172a', border: '1px solid #1e293b', color: 'white', padding: '9px 18px', borderRadius: '22px', fontSize: '12.5px', fontWeight: '800', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
          Switch to Rider App →
        </a>
      </div>

      {/* SINGLE INTERACTIVE PHONE VIEW */}
      {viewMode === 'single' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', position: 'relative' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '700px' }}>
            {screenNames.map((name, i) => (
              <button key={i} onClick={() => setScreen(i)}
                style={{
                  padding: '7px 15px', borderRadius: '20px', fontSize: '12px', fontWeight: '800', border: 'none', cursor: 'pointer',
                  background: screen === i ? '#10b981' : '#0f172a', color: screen === i ? '#111' : '#9ca3af',
                  transition: 'all 0.15s ease', boxShadow: screen === i ? '0 4px 12px rgba(16,185,129,0.3)' : 'none',
                }}>
                {name}
              </button>
            ))}
          </div>

          <div style={{ position: 'relative' }}>
            <DriverPhoneFrame activeTab={screen} onTabClick={idx => setScreen(idx)} showBottomNav={screen !== 3} zoomScale={zoomScale}>
              {renderScreen(screen)}

              {/* Real-time Incoming Ride Request Sheet */}
              {incomingRequest && (
                <div style={{ position: 'absolute', bottom: '16px', left: '16px', right: '16px', zIndex: 120, background: '#111827', borderRadius: '24px', border: '2px solid #10b981', padding: '20px', boxShadow: '0 10px 40px rgba(16,185,129,0.5)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ background: '#10b981', color: '#111', fontWeight: '900', fontSize: '11px', padding: '4px 10px', borderRadius: '20px' }}>
                      NEW RIDE REQUEST
                    </span>
                    <span style={{ fontWeight: '900', fontSize: '22px', color: '#10b981' }}>₹{incomingRequest.fare}</span>
                  </div>

                  <p style={{ fontWeight: '900', fontSize: '16px', color: 'white', marginBottom: '4px' }}>
                    {incomingRequest.riderName}
                  </p>
                  <p style={{ fontSize: '11.5px', color: '#9ca3af', marginBottom: '14px' }}>
                    Pickup: {incomingRequest.pickup} • {incomingRequest.rideType}
                  </p>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={handleDeclineRide}
                      style={{ flex: 1, padding: '12px', background: '#374151', color: 'white', borderRadius: '14px', fontWeight: '800', fontSize: '13px', border: 'none', cursor: 'pointer' }}>
                      Decline
                    </button>
                    <button onClick={handleAcceptRide}
                      style={{ flex: 2, padding: '12px', background: '#10b981', color: '#111', borderRadius: '14px', fontWeight: '900', fontSize: '13.5px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(16,185,129,0.4)' }}>
                      ACCEPT RIDE
                    </button>
                  </div>
                </div>
              )}
            </DriverPhoneFrame>
          </div>
        </div>
      )}

      {/* ALL 6 SCREENS GRID VIEW */}
      {viewMode === 'grid' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '32px',
          width: '100%',
          maxWidth: '1320px',
          justifyItems: 'center',
          marginTop: '10px',
        }}>
          {screenNames.map((name, i) => (
            <div key={i} onClick={() => { setScreen(i); setViewMode('single'); }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', cursor: 'pointer' }} title="Click to interact with this screen">
              <p style={{ fontSize: '13px', fontWeight: '800', color: '#10b981' }}>{name} (Click to interact)</p>
              <DriverPhoneFrame activeTab={i} onTabClick={() => {}} showBottomNav={i !== 3}>
                {renderScreen(i)}
              </DriverPhoneFrame>
            </div>
          ))}
        </div>
      )}

      {/* Shift Preferences Drawer */}
      {showPreferences && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 120, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: '400px', background: '#161c28', borderTopLeftRadius: '24px', borderTopRightRadius: '24px', padding: '22px 20px', borderTop: '1px solid #232d40' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span style={{ fontWeight: '900', fontSize: '16px' }}>Shift Preferences</span>
              <button onClick={() => setShowPreferences(false)} style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>
            <p style={{ fontSize: '11.5px', color: '#9ca3af', marginBottom: '14px' }}>Filter incoming requests to match your driving corridor.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
              {['All Rides (Highest Earnings)', 'Airport T3 Only', 'Cyber City Gurugram Only', 'North Delhi Only'].map(opt => (
                <button key={opt} onClick={() => { setDestinationFilter(opt.includes('All') ? '' : opt); setShowPreferences(false); }}
                  style={{ padding: '12px 14px', borderRadius: '12px', fontSize: '12.5px', fontWeight: '800', textAlign: 'left', border: '1px solid #232d40', background: destinationFilter === opt ? '#10b981' : '#0f141e', color: destinationFilter === opt ? '#111' : 'white', cursor: 'pointer' }}>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
