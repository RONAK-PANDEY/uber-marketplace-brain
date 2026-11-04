import React, { useState, useEffect } from 'react';
import UberVectorMap, { DELHI_ZONES } from '../shared/components/UberVectorMap.jsx';
import { marketplaceSync } from '../shared/marketplaceSync.js';

/* ─────────────────────────── SVG ICONS ─────────────────────────── */
const HomeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
  </svg>
);
const ActivityIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
  </svg>
);
const WalletIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
    <rect x="2" y="5" width="20" height="14" rx="2"/>
    <path d="M16 12h2"/>
  </svg>
);
const PersonIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);
const BackIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="20" height="20">
    <path d="M19 12H5M12 5l-7 7 7 7"/>
  </svg>
);
const BoltIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" style={{ color: '#f97316' }}>
    <path d="M13 2L4.09 12.26A1 1 0 0 0 5 14h6l-1 8 8.91-10.26A1 1 0 0 0 19 10h-6l1-8z"/>
  </svg>
);
const StarIcon = ({ filled }) => (
  <svg viewBox="0 0 24 24" fill={filled ? '#FFB800' : 'none'} stroke={filled ? '#FFB800' : '#d1d5db'} strokeWidth="1.5" width="28" height="28">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);
const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" width="38" height="38">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const PhoneCallIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.46 2 2 0 0 1 3.59 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);
const MessageIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);
const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" width="18" height="18">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

/* ═══════════════════════════ SCREENS ═══════════════════════════ */

/* Screen 0: Home Map */
function HomeScreen({ onBookRide, pickup, dropoff, onSelectDestination, smartPickupApplied, onToggleSmartPickup, onOpenSchedule }) {
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showPriceExplainer, setShowPriceExplainer] = useState(false);
  const [showAlternatives, setShowAlternatives] = useState(false);
  const [showSafetyModal, setShowSafetyModal] = useState(false);
  const [showPickupBanner, setShowPickupBanner] = useState(true);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, position: 'relative' }}>
      {/* Edge-to-Edge Vector City Map */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
        <UberVectorMap
          theme="light"
          pickupPoint={pickup}
          dropoffPoint={dropoff}
          showRoute={false}
          interactive={true}
        />
      </div>

      {/* Floating Top Header Bar */}
      <div style={{ position: 'relative', zIndex: 10, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button onClick={() => setShowSafetyModal(true)}
          style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'white', border: 'none', boxShadow: '0 4px 14px rgba(0,0,0,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }} title="Safety & Accessibility">
          <ShieldIcon/>
        </button>

        {/* Search Where-To Pill */}
        <div onClick={() => setShowSearchModal(true)}
          style={{ flex: 1, background: 'white', borderRadius: '30px', padding: '9px 14px', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 4px 16px rgba(0,0,0,0.12)', cursor: 'pointer' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#111' }}/>
          <span style={{ color: '#4b5563', fontWeight: '700', fontSize: '13px', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {dropoff ? `To: ${dropoff.name}` : 'Where to in Delhi NCR?'}
          </span>
          <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ color: 'white', fontSize: '13px' }}>→</span>
          </div>
        </div>

        <button onClick={onOpenSchedule}
          style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'white', border: 'none', boxShadow: '0 4px 14px rgba(0,0,0,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, fontSize: '17px' }} title="Demand-aware scheduling">
          ⏰
        </button>
      </div>

      {/* 1. Smart Pickup Suggestion Banner (Dismissible & Non-Clashing) */}
      {showPickupBanner && (
        <div style={{ position: 'relative', zIndex: 10, margin: '4px 14px 0' }}>
          <div style={{ background: smartPickupApplied ? '#ecfdf5' : 'rgba(255,255,255,0.96)', border: `1.5px solid ${smartPickupApplied ? '#10b981' : '#e5e7eb'}`, borderRadius: '16px', padding: '10px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 4px 14px rgba(0,0,0,0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
              <span style={{ fontSize: '18px' }}>🚶‍♂️</span>
              <div>
                <p style={{ fontWeight: '800', fontSize: '11.5px', color: smartPickupApplied ? '#059669' : '#111' }}>
                  {smartPickupApplied ? 'Smart Pickup: Gate 4 North Applied' : 'Smart Pickup Suggestion'}
                </p>
                <p style={{ fontSize: '10px', color: '#6b7280' }}>
                  Walk 2m to north point • 4m wait instead of 11m
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button onClick={onToggleSmartPickup}
                style={{ background: smartPickupApplied ? '#10b981' : '#111', color: 'white', fontSize: '10.5px', fontWeight: '800', border: 'none', padding: '6px 10px', borderRadius: '12px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                {smartPickupApplied ? '✓ Applied' : 'Save 7 min'}
              </button>
              <button onClick={() => setShowPickupBanner(false)}
                style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: '15px', cursor: 'pointer', padding: '2px 4px' }}>
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Floating Insights & Booking Sheet */}
      <div style={{ marginTop: 'auto', padding: '12px 14px', position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {/* Transparent wait estimate */}
        <div style={{ background: 'rgba(255,251,235,0.95)', border: '1px solid #fef3c7', borderRadius: '14px', padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backdropFilter: 'blur(8px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '15px' }}>⏳</span>
            <p style={{ fontWeight: '800', fontSize: '11px', color: '#92400e' }}>
              High demand near Stadium; estimated wait 9–14 min.
            </p>
          </div>
          <button onClick={() => setShowAlternatives(true)}
            style={{ background: '#f59e0b', color: 'white', border: 'none', borderRadius: '10px', padding: '5px 9px', fontSize: '10px', fontWeight: '800', cursor: 'pointer', whiteSpace: 'nowrap' }}>
            Alternatives →
          </button>
        </div>

        {/* Dynamic price explanation banner */}
        <div onClick={() => setShowPriceExplainer(true)}
          style={{ background: 'white', borderRadius: '16px', padding: '12px 14px', boxShadow: '0 6px 20px rgba(0,0,0,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BoltIcon/>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontWeight: '900', fontSize: '13px', color: '#111' }}>Surge Pricing +25% Active</span>
                <span style={{ background: '#ffedd5', color: '#c2410c', fontSize: '9px', fontWeight: '800', padding: '1px 5px', borderRadius: '5px' }}>SURGE</span>
              </div>
              <p style={{ fontSize: '10.5px', color: '#6b7280' }}>Prices are higher because high demand in Central Zone.</p>
            </div>
          </div>
          <button onClick={e => { e.stopPropagation(); onBookRide(); }}
            style={{ background: '#111', color: 'white', border: 'none', borderRadius: '12px', padding: '8px 14px', fontSize: '12px', fontWeight: '800', cursor: 'pointer' }}>
            Book now →
          </button>
        </div>
      </div>

      {/* Dynamic Price Explanation Modal */}
      {showPriceExplainer && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 60, display: 'flex', alignItems: 'flex-end' }}>
          <div style={{ width: '100%', background: 'white', borderTopLeftRadius: '24px', borderTopRightRadius: '24px', padding: '20px 18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BoltIcon/>
                <span style={{ fontWeight: '900', fontSize: '16px' }}>Dynamic Price Explanation</span>
              </div>
              <button onClick={() => setShowPriceExplainer(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ background: '#fff7ed', border: '1px solid #ffedd5', borderRadius: '14px', padding: '12px', marginBottom: '14px' }}>
              <p style={{ fontWeight: '800', fontSize: '12px', color: '#9a3412', marginBottom: '4px' }}>
                “Prices are higher because many people are requesting rides and few drivers are nearby.”
              </p>
              <p style={{ fontSize: '11px', color: '#c2410c', lineHeight: 1.35 }}>
                Demand multiplier is currently 1.25x to incentivize more drivers to enter Connaught Place and Stadium sectors.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', padding: '6px 0', borderBottom: '1px solid #f3f4f6' }}>
                <span style={{ color: '#6b7280' }}>Riders Requesting in Area</span>
                <span style={{ fontWeight: '800' }}>284 people</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', padding: '6px 0', borderBottom: '1px solid #f3f4f6' }}>
                <span style={{ color: '#6b7280' }}>Available Drivers Nearby</span>
                <span style={{ fontWeight: '800' }}>12 drivers (23.3:1 ratio)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', padding: '6px 0' }}>
                <span style={{ color: '#6b7280' }}>Expected Surge Drop</span>
                <span style={{ fontWeight: '800', color: '#10b981' }}>In ~25 minutes</span>
              </div>
            </div>
            <button onClick={() => setShowPriceExplainer(false)} style={{ width: '100%', background: '#111', color: 'white', borderRadius: '14px', padding: '12px', fontWeight: '800', border: 'none', cursor: 'pointer' }}>
              Understood
            </button>
          </div>
        </div>
      )}

      {/* Alternative Options Modal */}
      {showAlternatives && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 60, display: 'flex', alignItems: 'flex-end' }}>
          <div style={{ width: '100%', background: 'white', borderTopLeftRadius: '24px', borderTopRightRadius: '24px', padding: '20px 18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontWeight: '900', fontSize: '16px' }}>Alternative Commute Options</span>
              <button onClick={() => setShowAlternatives(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>
            <p style={{ fontSize: '11.5px', color: '#6b7280', marginBottom: '12px' }}>Save time and avoid high surge with these multimodal alternatives:</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '20px' }}>🚇</span>
                  <div>
                    <p style={{ fontWeight: '800', fontSize: '12.5px' }}>Delhi Metro Yellow Line</p>
                    <p style={{ fontSize: '10.5px', color: '#6b7280' }}>Every 3 min • 14 min to Cyber City • ₹40</p>
                  </div>
                </div>
                <span style={{ background: '#ecfdf5', color: '#059669', fontSize: '10px', fontWeight: '800', padding: '3px 8px', borderRadius: '8px' }}>Fastest</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '20px' }}>🚶‍♂️</span>
                  <div>
                    <p style={{ fontWeight: '800', fontSize: '12.5px' }}>Walk to North Gate Pickup</p>
                    <p style={{ fontSize: '10.5px', color: '#6b7280' }}>2 min walk • 4 min car wait • Save ₹60</p>
                  </div>
                </div>
                <button onClick={() => { onToggleSmartPickup(); setShowAlternatives(false); }}
                  style={{ background: '#111', color: 'white', border: 'none', borderRadius: '10px', padding: '5px 10px', fontSize: '10.5px', fontWeight: '800', cursor: 'pointer' }}>
                  Select
                </button>
              </div>
            </div>
            <button onClick={() => setShowAlternatives(false)} style={{ width: '100%', background: '#111', color: 'white', borderRadius: '14px', padding: '12px', fontWeight: '800', border: 'none', cursor: 'pointer' }}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Safety & Accessibility Controls Modal */}
      {showSafetyModal && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 60, display: 'flex', alignItems: 'flex-end' }}>
          <div style={{ width: '100%', background: 'white', borderTopLeftRadius: '24px', borderTopRightRadius: '24px', padding: '20px 18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldIcon/>
                <span style={{ fontWeight: '900', fontSize: '16px' }}>Safety & Accessibility</span>
              </div>
              <button onClick={() => setShowSafetyModal(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
              <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '12px' }}>
                <p style={{ fontWeight: '800', fontSize: '12.5px' }}>🔒 Verified Driver Identity & 4-Digit PIN</p>
                <p style={{ fontSize: '11px', color: '#6b7280' }}>PIN required before vehicle ignition is unlocked.</p>
              </div>
              <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '12px' }}>
                <p style={{ fontWeight: '800', fontSize: '12.5px' }}>♿ Wheelchair Accessible Vehicles (WAV)</p>
                <p style={{ fontSize: '11px', color: '#6b7280' }}>Guaranteed ramp access and certified assistance drivers.</p>
              </div>
              <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '12px' }}>
                <p style={{ fontWeight: '800', fontSize: '12.5px' }}>🚨 112 Emergency Police Integration</p>
                <p style={{ fontSize: '11px', color: '#6b7280' }}>One-tap link to local Delhi Police dispatch.</p>
              </div>
            </div>
            <button onClick={() => setShowSafetyModal(false)} style={{ width: '100%', background: '#111', color: 'white', borderRadius: '14px', padding: '12px', fontWeight: '800', border: 'none', cursor: 'pointer' }}>
              Done
            </button>
          </div>
        </div>
      )}

      {/* Destination Picker Modal */}
      {showSearchModal && (
        <div style={{ position: 'absolute', inset: 0, background: 'white', zIndex: 70, display: 'flex', flexDirection: 'column', padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <button onClick={() => setShowSearchModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}><BackIcon/></button>
            <span style={{ fontWeight: '900', fontSize: '17px' }}>Choose Destination</span>
          </div>
          <p style={{ fontSize: '11.5px', fontWeight: '800', color: '#6b7280', marginBottom: '10px' }}>DELHI NCR COMMUTER HUBS</p>
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {DELHI_ZONES.filter(z => z.id !== 'cp').map(z => (
              <div key={z.id} onClick={() => { onSelectDestination(z); setShowSearchModal(false); onBookRide(); }}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 10px', borderBottom: '1px solid #f3f4f6', cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>
                    {z.type === 'airport' ? '✈️' : z.type === 'office' ? '🏢' : z.type === 'stadium' ? '🏟️' : '📍'}
                  </div>
                  <div>
                    <p style={{ fontWeight: '800', fontSize: '13.5px', color: '#111' }}>{z.name}</p>
                    <p style={{ fontSize: '11px', color: '#6b7280' }}>{z.sub}</p>
                  </div>
                </div>
                <span style={{ background: '#ecfdf5', color: '#059669', fontSize: '11px', fontWeight: '800', padding: '3px 8px', borderRadius: '10px' }}>
                  {z.surge}x Surge
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* Screen 1: Ride-Option Comparison */
function ChooseRideScreen({ onBack, onConfirm, selectedRide, setSelectedRide, pickup, dropoff, promoCode, setPromoCode, paymentMode, setPaymentMode }) {
  const baseMultiplier = dropoff?.id === 'cyber' ? 2.8 : dropoff?.id === 'airport' ? 2.2 : dropoff?.id === 'noida' ? 2.4 : dropoff?.id === 'stadium' ? 1.8 : 1.0;

  const rides = [
    { id: 'moto', name: 'CityPlus Moto', desc: 'Fast bike rides in traffic', seats: 1, eta: '2 min', fare: Math.round(38 * baseMultiplier), tag: 'FASTEST', icon: '🛵' },
    { id: 'auto', name: 'CityPlus Auto', desc: 'No bargaining direct auto', seats: 3, eta: '2 min', fare: Math.round(65 * baseMultiplier), tag: 'POPULAR', icon: '🛺' },
    { id: 'pool', name: 'CityPlus Share', desc: 'Carpool & split fare', seats: 2, eta: '5 min', fare: Math.round(85 * baseMultiplier), tag: 'SAVE 30%', icon: '👥' },
    { id: 'go', name: 'CityPlus Go', desc: 'Compact comfortable sedans', seats: 4, eta: '3 min', fare: Math.round(120 * baseMultiplier), tag: 'STANDARD', icon: '🚗' },
    { id: 'comfort', name: 'CityPlus Comfort', desc: 'Newer cars, extra legroom', seats: 4, eta: '4 min', fare: Math.round(160 * baseMultiplier), tag: 'TOP RATED', icon: '🚘' },
    { id: 'premier', name: 'CityPlus Premier', desc: 'Executive luxury rides', seats: 4, eta: '5 min', fare: Math.round(230 * baseMultiplier), tag: 'PREMIUM', icon: '✨' },
    { id: 'xl', name: 'CityPlus XL', desc: 'Spacious 6-seater SUVs', seats: 6, eta: '6 min', fare: Math.round(220 * baseMultiplier), tag: '6 SEATS', icon: '🚙' },
    { id: 'package', name: 'CityPlus Package', desc: 'Instant door-to-door delivery', seats: 0, eta: '4 min', fare: Math.round(75 * baseMultiplier), tag: 'PARCEL', icon: '📦' },
  ];

  const currentFare = rides.find(r => r.id === selectedRide)?.fare || 120;
  const discount = promoCode === 'DELHI25' ? Math.round(currentFare * 0.25) : promoCode === 'CITY50' ? 50 : 0;
  const finalFare = Math.max(25, currentFare - discount);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, background: 'white' }}>
      {/* Header */}
      <div style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f3f4f6', zIndex: 10, flexShrink: 0 }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}><BackIcon/></button>
        <span style={{ fontWeight: '900', fontSize: '16px' }}>Choose a Ride</span>
        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>
          📍
        </div>
      </div>

      {/* Expanded Route Preview Map */}
      <div style={{ height: '240px', position: 'relative', flexShrink: 0 }}>
        <UberVectorMap
          theme="light"
          pickupPoint={pickup}
          dropoffPoint={dropoff}
          showRoute={true}
          interactive={false}
        />
        <div style={{ position: 'absolute', bottom: '10px', left: '14px', background: 'white', borderRadius: '14px', padding: '6px 12px', boxShadow: '0 4px 12px rgba(0,0,0,0.12)', zIndex: 10, fontSize: '11px', fontWeight: '800' }}>
          📍 To: {dropoff?.name || 'Cyber City'}
        </div>
      </div>

      {/* Ride Options List */}
      <div style={{ flex: 1, minHeight: 0, padding: '8px 14px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {rides.map(r => {
          const isSelected = selectedRide === r.id;
          return (
            <div key={r.id} onClick={() => setSelectedRide(r.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px', padding: '11px 14px',
                borderRadius: '16px', border: `2px solid ${isSelected ? '#111' : '#f3f4f6'}`,
                background: isSelected ? '#f8fafc' : 'white', cursor: 'pointer', transition: 'all 0.15s ease',
              }}>
              <div style={{ fontSize: '26px' }}>{r.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <p style={{ fontWeight: '800', fontSize: '13.5px', color: '#111' }}>{r.name}</p>
                  <span style={{ background: '#f1f5f9', color: '#475569', fontSize: '9px', fontWeight: '800', padding: '2px 5px', borderRadius: '5px' }}>{r.tag}</span>
                </div>
                <p style={{ fontSize: '10.5px', color: '#64748b' }}>👤 {r.seats} seats &nbsp;•&nbsp; ETA {r.eta}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontWeight: '900', fontSize: '16px', color: '#111' }}>₹{r.fare}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Pinned Confirmation Bar */}
      <div style={{ padding: '10px 14px 14px', borderTop: '1px solid #f3f4f6', background: 'white', flexShrink: 0 }}>
        {/* Promo code pills */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '10px', alignItems: 'center' }}>
          <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '700' }}>Promo:</span>
          {['DELHI25', 'CITY50'].map(code => (
            <button key={code} onClick={() => setPromoCode(promoCode === code ? '' : code)}
              style={{ padding: '4px 8px', borderRadius: '8px', fontSize: '10px', fontWeight: '800', border: '1px dashed #94a3b8', background: promoCode === code ? '#ecfdf5' : '#f8fafc', color: promoCode === code ? '#059669' : '#475569', cursor: 'pointer' }}>
              {code} {promoCode === code ? '✓' : ''}
            </button>
          ))}
          {discount > 0 && <span style={{ marginLeft: 'auto', fontSize: '11px', fontWeight: '800', color: '#059669' }}>-₹{discount} OFF</span>}
        </div>

        <button onClick={() => onConfirm(finalFare)}
          style={{
            width: '100%', background: '#111', color: 'white', borderRadius: '16px', padding: '14px', fontWeight: '900', fontSize: '14.5px', border: 'none', cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
          }}>
          Confirm {rides.find(r => r.id === selectedRide)?.name} • ₹{finalFare}
        </button>
      </div>
    </div>
  );
}

/* Screen 2: Booking Progress */
function BookingScreen({ onFound }) {
  useEffect(() => {
    const unsub = marketplaceSync.subscribe(msg => {
      if (msg.type === 'RIDE_ACCEPTED') {
        onFound(msg.payload);
      }
    });

    const t = setTimeout(() => {
      onFound({ driverName: 'Rohit Singh', rating: '4.94', car: 'Honda City EV - DL 8C 7321' });
    }, 3500);

    return () => {
      unsub();
      clearTimeout(t);
    };
  }, [onFound]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, background: 'white', alignItems: 'center', justifyContent: 'center', padding: '24px', textAlign: 'center' }}>
      <p style={{ fontWeight: '900', fontSize: '22px', marginBottom: '24px' }}>Finding your driver...</p>
      <div style={{ position: 'relative', width: '160px', height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
        <svg width="160" height="160" viewBox="0 0 160 160" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="80" cy="80" r="70" fill="none" stroke="#f1f5f9" strokeWidth="6"/>
          <circle cx="80" cy="80" r="70" fill="none" stroke="#10b981" strokeWidth="6" strokeDasharray="440" strokeDashoffset="120" strokeLinecap="round">
            <animateTransform attributeName="transform" type="rotate" from="0 80 80" to="360 80 80" dur="2s" repeatCount="indefinite"/>
          </circle>
        </svg>
        <div style={{ fontSize: '38px' }}>🚗</div>
      </div>
      <p style={{ fontWeight: '900', fontSize: '17px', color: '#111', marginBottom: '4px' }}>Connecting to Nearby Drivers</p>
      <p style={{ fontSize: '12px', color: '#64748b' }}>Dispatching via CityPlus Fair Matching Algorithm</p>
    </div>
  );
}

/* Screen 3: Arriving in 2 min */
function ArrivingScreen({ onComplete, secondsLeft, driver, pickup, dropoff, safetyPin }) {
  const [showCallModal, setShowCallModal] = useState(false);
  const [callDuration, setCallDuration] = useState(18);
  const [showMessageDrawer, setShowMessageDrawer] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'driver', text: 'Namaste! I am on my way in a White Honda City EV.' }
  ]);
  const [chatInput, setChatInput] = useState('');

  useEffect(() => {
    let t = null;
    if (showCallModal) {
      t = setInterval(() => setCallDuration(d => d + 1), 1000);
    }
    return () => clearInterval(t);
  }, [showCallModal]);

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const progress = Math.max(0, 1 - (secondsLeft / 120));
  const carX = Math.round(pickup.x - (pickup.x - 180) * (1 - progress));
  const carY = Math.round(pickup.y - (pickup.y - 200) * (1 - progress));

  function sendChatMessage(msg) {
    if (!msg.trim()) return;
    setChatMessages(prev => [...prev, { sender: 'rider', text: msg }]);
    setChatInput('');
    setTimeout(() => {
      setChatMessages(prev => [...prev, { sender: 'driver', text: 'Got it, see you shortly at the pickup point!' }]);
    }, 1000);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, background: 'white', position: 'relative' }}>
      {/* Header */}
      <div style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f3f4f6', zIndex: 10, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BackIcon/>
          <span style={{ fontWeight: '900', fontSize: '16px' }}>Arriving in {mins} min</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', padding: '3px 8px' }}>
          <ShieldIcon/>
          <span style={{ fontSize: '11.5px', fontWeight: '900', color: '#1e40af' }}>PIN: {safetyPin}</span>
        </div>
      </div>

      {/* Large Live Tracking Map */}
      <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
        <UberVectorMap
          theme="light"
          pickupPoint={pickup}
          dropoffPoint={dropoff}
          showRoute={true}
          activeCars={[{ id: 99, x: carX, y: carY, angle: 45 }]}
          interactive={true}
        />
        <div style={{ position: 'absolute', top: '12px', left: '14px', background: 'white', borderRadius: '16px', padding: '8px 14px', boxShadow: '0 4px 16px rgba(0,0,0,0.12)', zIndex: 10 }}>
          <p style={{ fontSize: '10px', color: '#64748b', fontWeight: '700' }}>Driver arriving</p>
          <p style={{ fontWeight: '900', fontSize: '20px', color: '#111' }}>{mins}:{String(secs).padStart(2, '0')}</p>
        </div>
      </div>

      {/* Driver Card Sheet (Fixed at Bottom) */}
      <div style={{ padding: '14px 16px', background: 'white', borderTop: '1px solid #f3f4f6', boxShadow: '0 -4px 18px rgba(0,0,0,0.06)', zIndex: 10, flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <p style={{ fontSize: '11.5px', fontWeight: '800', color: '#10b981' }}>● Your driver is on the way!</p>
          <span style={{ fontSize: '10.5px', color: '#64748b' }}>Share trip status</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
          <div style={{ width: '46px', height: '46px', borderRadius: '50%', background: 'linear-gradient(135deg, #f97316, #ef4444)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '900', fontSize: '18px' }}>
            {driver?.driverName ? driver.driverName[0] : 'R'}
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: '900', fontSize: '14.5px' }}>{driver?.driverName || 'Rohit Singh'}</p>
            <p style={{ fontSize: '11px', color: '#64748b' }}>⭐ {driver?.rating || '4.94'} • {driver?.car || 'Honda City EV - DL 8C 7321'}</p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => setShowCallModal(true)} style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#f1f5f9', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><PhoneCallIcon/></button>
            <button onClick={() => setShowMessageDrawer(true)} style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#f1f5f9', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><MessageIcon/></button>
          </div>
        </div>

        <button onClick={onComplete}
          style={{ width: '100%', background: '#111', color: 'white', borderRadius: '14px', padding: '13px', fontWeight: '900', fontSize: '14px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(0,0,0,0.2)' }}>
          Complete Ride (Simulate Drop-off)
        </button>
      </div>

      {/* Simulated In-App Call Modal */}
      {showCallModal && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(15,23,42,0.96)', zIndex: 80, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', padding: '50px 24px', color: 'white' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '74px', height: '74px', borderRadius: '50%', background: 'linear-gradient(135deg, #f97316, #ef4444)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', fontSize: '28px', fontWeight: '900' }}>
              R
            </div>
            <p style={{ fontSize: '20px', fontWeight: '900' }}>Rohit Singh</p>
            <p style={{ fontSize: '12px', color: '#10b981', marginTop: '4px' }}>In-App Audio Call Connected (00:{String(callDuration).padStart(2, '0')})</p>
          </div>
          <div style={{ display: 'flex', gap: '24px' }}>
            <button style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white', fontSize: '18px', cursor: 'pointer' }}>🔇</button>
            <button onClick={() => setShowCallModal(false)} style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#ef4444', border: 'none', color: 'white', fontSize: '20px', cursor: 'pointer' }}>📞</button>
          </div>
        </div>
      )}

      {/* Simulated In-App Chat Drawer */}
      {showMessageDrawer && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 80, display: 'flex', alignItems: 'flex-end' }}>
          <div style={{ width: '100%', height: '70%', background: 'white', borderTopLeftRadius: '24px', borderTopRightRadius: '24px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '14px 16px', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontWeight: '900', fontSize: '14px' }}>Chat with Rohit Singh</p>
                <p style={{ fontSize: '10.5px', color: '#10b981' }}>● Online • Honda City EV</p>
              </div>
              <button onClick={() => setShowMessageDrawer(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ flex: 1, padding: '12px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {chatMessages.map((m, idx) => (
                <div key={idx} style={{ alignSelf: m.sender === 'rider' ? 'flex-end' : 'flex-start', maxWidth: '80%', padding: '10px 14px', borderRadius: '16px', background: m.sender === 'rider' ? '#111' : '#f1f5f9', color: m.sender === 'rider' ? 'white' : '#111', fontSize: '12px' }}>
                  {m.text}
                </div>
              ))}
            </div>
            {/* Quick response chips */}
            <div style={{ display: 'flex', gap: '6px', padding: '6px 12px', overflowX: 'auto', background: '#f8fafc' }}>
              {["I'm at the gate", "On my way", "Where are you?"].map(t => (
                <button key={t} onClick={() => sendChatMessage(t)}
                  style={{ padding: '5px 10px', borderRadius: '14px', background: 'white', border: '1px solid #e2e8f0', fontSize: '10.5px', fontWeight: '700', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  {t}
                </button>
              ))}
            </div>
            <div style={{ padding: '10px 14px', borderTop: '1px solid #f3f4f6', display: 'flex', gap: '8px' }}>
              <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendChatMessage(chatInput)}
                placeholder="Type a message to driver..."
                style={{ flex: 1, padding: '9px 14px', borderRadius: '20px', border: '1px solid #e2e8f0', fontSize: '12px', outline: 'none' }}/>
              <button onClick={() => sendChatMessage(chatInput)} style={{ background: '#111', color: 'white', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer' }}>↑</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* Screen 4: Ride Completed! */
function CompletedScreen({ fare, rating, setRating, onDone }) {
  const [tip, setTip] = useState(0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, background: 'white', alignItems: 'center', justifyContent: 'center', padding: '24px 20px', textAlign: 'center' }}>
      <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', boxShadow: '0 8px 24px rgba(16,185,129,0.35)' }}>
        <CheckIcon/>
      </div>
      <p style={{ fontWeight: '900', fontSize: '24px', color: '#111', marginBottom: '4px' }}>Ride Completed!</p>
      <p style={{ fontWeight: '900', fontSize: '38px', color: '#111', margin: '4px 0 16px' }}>₹{fare || 142}</p>

      <div style={{ width: '100%', background: '#f8fafc', borderRadius: '18px', padding: '14px 18px', marginBottom: '20px', display: 'flex', justifyContent: 'space-around', border: '1px solid #f1f5f9' }}>
        <div>
          <p style={{ fontSize: '11px', color: '#64748b' }}>Trip Distance</p>
          <p style={{ fontWeight: '900', fontSize: '16px', color: '#111', marginTop: '2px' }}>8.2 km</p>
        </div>
        <div style={{ width: '1px', background: '#e2e8f0' }}/>
        <div>
          <p style={{ fontSize: '11px', color: '#64748b' }}>Trip Duration</p>
          <p style={{ fontWeight: '900', fontSize: '16px', color: '#111', marginTop: '2px' }}>14 min</p>
        </div>
      </div>

      <p style={{ fontWeight: '800', fontSize: '13px', color: '#475569', marginBottom: '10px' }}>Rate Rohit Singh</p>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '18px' }}>
        {[1, 2, 3, 4, 5].map(star => (
          <span key={star} onClick={() => setRating(star)} style={{ cursor: 'pointer' }}>
            <StarIcon filled={star <= rating}/>
          </span>
        ))}
      </div>

      {/* Tip driver pills */}
      <div style={{ width: '100%', marginBottom: '22px' }}>
        <p style={{ fontSize: '11px', fontWeight: '800', color: '#64748b', marginBottom: '8px' }}>Add a Tip for Great Driving</p>
        <div style={{ display: 'flex', gap: '8px' }}>
          {[0, 20, 50, 100].map(amt => (
            <button key={amt} onClick={() => setTip(amt)}
              style={{ flex: 1, padding: '9px 4px', borderRadius: '12px', fontSize: '11.5px', fontWeight: '800', border: '1px solid #cbd5e1', background: tip === amt ? '#111' : '#f8fafc', color: tip === amt ? 'white' : '#111', cursor: 'pointer' }}>
              {amt === 0 ? 'No Tip' : `+₹${amt}`}
            </button>
          ))}
        </div>
      </div>

      <button onClick={onDone}
        style={{ width: '100%', background: '#111', color: 'white', borderRadius: '16px', padding: '15px', fontWeight: '900', fontSize: '15px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}>
        Done
      </button>
    </div>
  );
}

/* Screen 5: CityPlus Wallet */
function WalletScreen({ balance, onAddBalance }) {
  const [showAddMoney, setShowAddMoney] = useState(false);

  const transactions = [
    { desc: 'Trip to Connaught Place', date: 'Today, 2:45 PM', amount: -142, icon: '🚗' },
    { desc: 'Added via UPI / Google Pay', date: 'Yesterday', amount: 500, icon: '⚡' },
    { desc: 'Trip to IGI Airport T3', date: '02 Nov, 8:15 AM', amount: -380, icon: '✈️' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, background: 'white', padding: '18px 16px', overflowY: 'auto' }}>
      <p style={{ fontWeight: '900', fontSize: '24px', marginBottom: '14px' }}>CityPlus Wallet</p>
      <div style={{ background: 'linear-gradient(135deg, #111827, #1f2937)', borderRadius: '22px', padding: '22px', color: 'white', marginBottom: '22px', boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
        <p style={{ fontSize: '12px', color: '#9ca3af', fontWeight: '700' }}>CityPlus Cash Balance</p>
        <p style={{ fontWeight: '900', fontSize: '36px', margin: '4px 0 16px' }}>₹{balance.toFixed(2)}</p>
        <button onClick={() => setShowAddMoney(true)}
          style={{ background: '#10b981', color: '#111', border: 'none', padding: '10px 18px', borderRadius: '20px', fontWeight: '900', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>+</span> Add Money
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '20px' }}>
        <p style={{ fontSize: '12px', fontWeight: '900', color: '#64748b', marginBottom: '6px' }}>RECENT TRANSACTIONS</p>
        {transactions.map((t, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 10px', borderRadius: '14px', background: '#f8fafc', marginBottom: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '18px' }}>{t.icon}</span>
              <div>
                <p style={{ fontWeight: '800', fontSize: '12.5px', color: '#111' }}>{t.desc}</p>
                <p style={{ fontSize: '10.5px', color: '#64748b' }}>{t.date}</p>
              </div>
            </div>
            <span style={{ fontWeight: '900', fontSize: '13px', color: t.amount > 0 ? '#10b981' : '#111' }}>
              {t.amount > 0 ? `+₹${t.amount}` : `-₹${Math.abs(t.amount)}`}
            </span>
          </div>
        ))}
      </div>

      {/* Add Money Modal */}
      {showAddMoney && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 120, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: '400px', background: 'white', borderTopLeftRadius: '24px', borderTopRightRadius: '24px', padding: '22px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontWeight: '900', fontSize: '16px' }}>Add Money to CityPlus Cash</span>
              <button onClick={() => setShowAddMoney(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '18px' }}>
              {[100, 250, 500, 1000].map(amt => (
                <button key={amt} onClick={() => { onAddBalance(amt); setShowAddMoney(false); alert(`Added ₹${amt} to your CityPlus Wallet!`); }}
                  style={{ padding: '12px 4px', borderRadius: '12px', background: '#f8fafc', border: '1.5px solid #e2e8f0', fontWeight: '900', fontSize: '13px', cursor: 'pointer' }}>
                  +₹{amt}
                </button>
              ))}
            </div>
            <p style={{ fontSize: '11px', color: '#64748b', textAlign: 'center' }}>Instant transfer via UPI, Google Pay, or Credit Card.</p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════ PHONE FRAME COMPONENT ═══════════════════ */
function PhoneFrame({ children, activeTab, onTabClick, showBottomNav = true, zoomScale = 1.0 }) {
  const tabs = [
    { id: 'home', label: 'Home', icon: <HomeIcon/> },
    { id: 'activity', label: 'Activity', icon: <ActivityIcon/> },
    { id: 'wallet', label: 'Wallet', icon: <WalletIcon/> },
    { id: 'profile', label: 'Profile', icon: <PersonIcon/> },
  ];

  return (
    <div style={{
      width: '420px',
      height: '860px',
      borderRadius: '54px',
      background: 'white',
      boxShadow: '0 0 0 12px #1f232b, 0 0 0 14px #2e333d, 0 35px 70px rgba(0,0,0,0.65)',
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
        boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
      }}/>

      {/* Side Buttons */}
      <div style={{ position: 'absolute', left: '-13px', top: '120px', width: '4px', height: '30px', background: '#333', borderRadius: '3px 0 0 3px' }}/>
      <div style={{ position: 'absolute', left: '-13px', top: '165px', width: '4px', height: '54px', background: '#333', borderRadius: '3px 0 0 3px' }}/>
      <div style={{ position: 'absolute', left: '-13px', top: '230px', width: '4px', height: '54px', background: '#333', borderRadius: '3px 0 0 3px' }}/>
      <div style={{ position: 'absolute', right: '-13px', top: '170px', width: '4px', height: '74px', background: '#333', borderRadius: '0 3px 3px 0' }}/>

      {/* iOS Status Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '46px 22px 6px', background: 'white', fontSize: '12px', fontWeight: '800', color: '#111', flexShrink: 0, zIndex: 90 }}>
        <span>9:41</span>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M1.5 8.5C5.5 4 10.5 2 12 2s6.5 2 10.5 6.5"/><path d="M5 12.5C7.5 10 10 9 12 9s4.5 1 7 3.5"/><path d="M8.5 16C10 14.5 11 14 12 14s2 .5 3.5 2"/><circle cx="12" cy="20" r="1.5"/></svg>
          <span style={{ fontSize: '11px', fontWeight: '800' }}>5G</span>
          <div style={{ width: '22px', height: '11px', border: '1.5px solid #111', borderRadius: '3px', padding: '1.5px' }}>
            <div style={{ width: '85%', height: '100%', background: '#111', borderRadius: '1.5px' }}/>
          </div>
        </div>
      </div>

      {/* Screen Body */}
      <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative' }}>
        {children}
      </div>

      {/* Bottom Nav */}
      {showBottomNav && (
        <div style={{ display: 'flex', borderTop: '1px solid #f3f4f6', background: 'white', flexShrink: 0, paddingBottom: '6px', paddingTop: '4px' }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => onTabClick && onTabClick(t.id)}
              style={{
                flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
                padding: '4px 0', color: activeTab === t.id ? '#111' : '#9ca3af',
                background: 'none', border: 'none', cursor: 'pointer', fontSize: '10.5px', fontWeight: '700', gap: '3px',
              }}>
              {t.icon}
              <span>{t.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Home Indicator Bar */}
      <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: '6px', background: showBottomNav ? 'white' : 'transparent', position: 'relative', zIndex: 80 }}>
        <div style={{ width: '130px', height: '4px', background: '#d1d5db', borderRadius: '2px' }}/>
      </div>
    </div>
  );
}

/* ═══════════════════ MAIN RIDER APPLICATION ═══════════════════ */
export default function RiderApp() {
  const [screen, setScreen] = useState(0);
  const [activeTab, setActiveTab] = useState('home');
  const [selectedRide, setSelectedRide] = useState('go');
  const [arrivingSeconds, setArrivingSeconds] = useState(120);
  const [rating, setRating] = useState(5);
  const [walletBalance, setWalletBalance] = useState(842.50);
  const [viewMode, setViewMode] = useState('single');
  const [zoomScale, setZoomScale] = useState(1.0); // 0.85, 0.95, 1.0
  const [assignedDriver, setAssignedDriver] = useState(null);
  const [promoCode, setPromoCode] = useState('');
  const [paymentMode, setPaymentMode] = useState('wallet');
  const [confirmedFare, setConfirmedFare] = useState(120);
  const [smartPickupApplied, setSmartPickupApplied] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduledTime, setScheduledTime] = useState('10:35 PM');
  const safetyPin = '4821';

  const [pickup, setPickup] = useState({ x: 225, y: 310, name: 'Connaught Place' });
  const [dropoff, setDropoff] = useState({ x: 260, y: 720, name: 'Cyber City, Gurugram' });

  function handleToggleSmartPickup() {
    if (!smartPickupApplied) {
      setSmartPickupApplied(true);
      setPickup({ x: 225, y: 240, name: 'North Gate Express Point' });
    } else {
      setSmartPickupApplied(false);
      setPickup({ x: 225, y: 310, name: 'Connaught Place' });
    }
  }

  useEffect(() => {
    if (screen !== 3 || arrivingSeconds <= 0) return;
    const t = setInterval(() => setArrivingSeconds(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [screen, arrivingSeconds]);

  useEffect(() => {
    const unsub = marketplaceSync.subscribe(msg => {
      if (msg.type === 'TRIP_COMPLETED') {
        const fare = confirmedFare || 120;
        setWalletBalance(prev => Math.max(0, prev - fare));
        setScreen(4);
      }
    });
    return unsub;
  }, [confirmedFare]);

  function handleTab(tab) {
    setActiveTab(tab);
    if (tab === 'home') setScreen(0);
    else if (tab === 'wallet') setScreen(5);
    else setScreen(0);
  }

  function handleConfirmRide(fare) {
    setConfirmedFare(fare);
    setScreen(2);
    marketplaceSync.publish('RIDE_REQUESTED', {
      riderName: 'Rahul Sharma',
      rideType: selectedRide,
      fare: fare,
      pickup: pickup.name,
      dropoff: dropoff.name,
      distance: dropoff.id === 'cyber' ? '28 km' : '8.2 km',
      eta: '14 min',
    });
  }

  function handleDriverFound(driverInfo) {
    setAssignedDriver(driverInfo);
    setArrivingSeconds(120);
    setScreen(3);
  }

  function renderScreen(index) {
    switch (index) {
      case 0:
        return (
          <HomeScreen
            onBookRide={() => setScreen(1)}
            pickup={pickup}
            dropoff={dropoff}
            onSelectDestination={d => setDropoff(d)}
            smartPickupApplied={smartPickupApplied}
            onToggleSmartPickup={handleToggleSmartPickup}
            onOpenSchedule={() => setShowScheduleModal(true)}
          />
        );
      case 1:
        return (
          <ChooseRideScreen
            onBack={() => setScreen(0)}
            onConfirm={handleConfirmRide}
            selectedRide={selectedRide}
            setSelectedRide={setSelectedRide}
            pickup={pickup}
            dropoff={dropoff}
            promoCode={promoCode}
            setPromoCode={setPromoCode}
            paymentMode={paymentMode}
            setPaymentMode={setPaymentMode}
          />
        );
      case 2:
        return <BookingScreen onFound={handleDriverFound}/>;
      case 3:
        return (
          <ArrivingScreen
            onComplete={() => setScreen(4)}
            secondsLeft={arrivingSeconds}
            driver={assignedDriver}
            pickup={pickup}
            dropoff={dropoff}
            safetyPin={safetyPin}
          />
        );
      case 4:
        return <CompletedScreen fare={confirmedFare} rating={rating} setRating={setRating} onDone={() => { setScreen(0); setActiveTab('home'); }}/>;
      case 5:
        return <WalletScreen balance={walletBalance} onAddBalance={amt => setWalletBalance(b => b + amt)}/>;
      default:
        return null;
    }
  }

  const screenNames = ['1. Home Map', '2. Choose Ride', '3. Booking...', '4. Arriving (Trip)', '5. Ride Completed', '6. Wallet'];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at 50% 20%, #1a1e29 0%, #0c0e14 100%)',
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
          <span style={{ fontWeight: '900', fontSize: '32px', letterSpacing: '-1px', color: '#60a5fa' }}>CityPlus</span>
          <div style={{ width: '1.5px', height: '32px', background: '#374151' }}/>
          <div>
            <p style={{ fontWeight: '800', fontSize: '18px', color: 'white', lineHeight: 1.2 }}>Rider App</p>
            <p style={{ fontSize: '12px', color: '#9ca3af', lineHeight: 1.2 }}>Book a Ride. Move Freely.</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* View Mode Toggle */}
          <div style={{ display: 'flex', background: '#1f2937', padding: '4px', borderRadius: '30px', border: '1px solid #374151' }}>
            <button onClick={() => setViewMode('single')}
              style={{
                padding: '7px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: '800', border: 'none', cursor: 'pointer',
                background: viewMode === 'single' ? '#3b82f6' : 'transparent', color: 'white',
                transition: 'all 0.15s ease',
              }}>
              📱 Interactive Phone
            </button>
            <button onClick={() => setViewMode('grid')}
              style={{
                padding: '7px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: '800', border: 'none', cursor: 'pointer',
                background: viewMode === 'grid' ? '#3b82f6' : 'transparent', color: 'white',
                transition: 'all 0.15s ease',
              }}>
              🖼️ All 6 Screens (Grid)
            </button>
          </div>

          {/* Scale Zoom Controls */}
          {viewMode === 'single' && (
            <div style={{ display: 'flex', background: '#1f2937', padding: '4px', borderRadius: '20px', border: '1px solid #374151' }}>
              {[0.85, 0.95, 1.0].map(s => (
                <button key={s} onClick={() => setZoomScale(s)}
                  style={{
                    padding: '6px 10px', borderRadius: '16px', fontSize: '11px', fontWeight: '800', border: 'none', cursor: 'pointer',
                    background: zoomScale === s ? '#374151' : 'transparent', color: zoomScale === s ? '#60a5fa' : '#9ca3af',
                  }}>
                  {Math.round(s * 100)}%
                </button>
              ))}
            </div>
          )}
        </div>

        <a href="http://localhost:5174" target="_blank" rel="noopener noreferrer"
          style={{ background: '#111827', border: '1px solid #374151', color: 'white', padding: '9px 18px', borderRadius: '22px', fontSize: '12.5px', fontWeight: '800', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
          Switch to Driver App →
        </a>
      </div>

      {/* SINGLE INTERACTIVE PHONE VIEW */}
      {viewMode === 'single' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '700px' }}>
            {screenNames.map((name, i) => (
              <button key={i} onClick={() => setScreen(i)}
                style={{
                  padding: '7px 15px', borderRadius: '20px', fontSize: '12px', fontWeight: '800', border: 'none', cursor: 'pointer',
                  background: screen === i ? 'white' : '#1f2937', color: screen === i ? '#111' : '#9ca3af',
                  transition: 'all 0.15s ease', boxShadow: screen === i ? '0 4px 12px rgba(255,255,255,0.2)' : 'none',
                }}>
                {name}
              </button>
            ))}
          </div>

          <PhoneFrame activeTab={activeTab} onTabClick={handleTab} showBottomNav={screen === 0 || screen === 5} zoomScale={zoomScale}>
            {renderScreen(screen)}

            {/* Demand-Aware Scheduling Modal */}
            {showScheduleModal && (
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 120, display: 'flex', alignItems: 'flex-end' }}>
                <div style={{ width: '100%', background: 'white', borderTopLeftRadius: '24px', borderTopRightRadius: '24px', padding: '22px 20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <span style={{ fontWeight: '900', fontSize: '17px' }}>Demand-Aware Scheduling</span>
                    <button onClick={() => setShowScheduleModal(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>✕</button>
                  </div>

                  <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '14px', padding: '14px', marginBottom: '16px' }}>
                    <p style={{ fontWeight: '800', fontSize: '12.5px', color: '#1e40af', marginBottom: '4px' }}>
                      “Reserve a ride at 10:35 PM to avoid the stadium rush.”
                    </p>
                    <p style={{ fontSize: '11px', color: '#3b82f6', lineHeight: 1.35 }}>
                      Forecast model predicts surge will drop from 2.0x to 1.1x at 10:35 PM. Saves up to ₹140.
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginBottom: '18px' }}>
                    {['10:15 PM (Surge)', '10:35 PM (Recommended)', '11:00 PM'].map(t => (
                      <button key={t} onClick={() => setScheduledTime(t)}
                        style={{ flex: 1, padding: '10px 4px', borderRadius: '12px', fontSize: '11px', fontWeight: '800', border: '1px solid #cbd5e1', background: scheduledTime === t ? '#111' : '#f8fafc', color: scheduledTime === t ? 'white' : '#111', cursor: 'pointer' }}>
                        {t}
                      </button>
                    ))}
                  </div>

                  <button onClick={() => { setShowScheduleModal(false); alert(`Ride successfully reserved for ${scheduledTime}! Fare locked.`); }}
                    style={{ width: '100%', background: '#111', color: 'white', borderRadius: '16px', padding: '15px', fontWeight: '900', fontSize: '14.5px', border: 'none', cursor: 'pointer' }}>
                    Lock Fare & Reserve for {scheduledTime}
                  </button>
                </div>
              </div>
            )}
          </PhoneFrame>
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
              <p style={{ fontSize: '13px', fontWeight: '800', color: '#60a5fa' }}>{name} (Click to interact)</p>
              <PhoneFrame activeTab={i === 5 ? 'wallet' : 'home'} onTabClick={() => {}} showBottomNav={i === 0 || i === 5}>
                {renderScreen(i)}
              </PhoneFrame>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
