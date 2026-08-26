import React, { useState } from 'react';
import confetti from 'canvas-confetti';

export default function Hero({ onExploreSubscription }) {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    if (onExploreSubscription) {
      onExploreSubscription();
    }
  };

  return (
    <section 
      id="hero" 
      style={{ 
        position: 'relative', 
        paddingTop: '11.5rem', 
        paddingBottom: '6rem', 
        background: '#FFFFFF', 
        overflow: 'hidden' 
      }}
    >
      <div className="container">
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: '1.05fr 0.95fr',
            gap: '3rem',
            alignItems: 'center'
          }}
          className="hero-exact-grid"
        >
          
          {/* Left Column: Title, 3 Bullets, Email Lead Form */}
          <div style={{ zIndex: 2 }}>
            <h1 
              style={{ 
                fontSize: 'clamp(2.6rem, 5vw, 4.4rem)', 
                fontWeight: 800, 
                color: '#222222', 
                lineHeight: 1.15, 
                letterSpacing: '-0.025em', 
                marginBottom: '2.5rem',
                fontFamily: 'var(--font-body)'
              }}
            >
              The only yoga membership you’ll ever need.
            </h1>

            {/* 3 Feature Bullet Points */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', marginBottom: '3rem' }}>
              <p style={{ fontSize: '1.2rem', color: '#555555', margin: 0, fontWeight: 500 }}>
                Practice yoga, meditation and breathwork.
              </p>
              <p style={{ fontSize: '1.2rem', color: '#555555', margin: 0, fontWeight: 500 }}>
                Learn Ayurveda and yoga philosophy.
              </p>
              <p style={{ fontSize: '1.2rem', color: '#555555', margin: 0, fontWeight: 500 }}>
                Earn yoga teaching certificates.
              </p>
            </div>

            {/* Email Input & Coral Button Form */}
            <form 
              onSubmit={handleSubmit}
              style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '420px' }}
            >
              <input
                type="email"
                placeholder="Enter your email address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '1.05rem 1.6rem',
                  borderRadius: '9999px',
                  border: '1.5px solid #E2E2E2',
                  fontSize: '0.98rem',
                  color: '#222222',
                  outline: 'none',
                  background: '#FFFFFF',
                  boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.04)'
                }}
              />

              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '1.05rem 2rem',
                  borderRadius: '9999px',
                  border: 'none',
                  background: 'linear-gradient(180deg, #F07844 0%, #E2642F 100%)',
                  color: '#FFFFFF',
                  fontSize: '1rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 8px 20px rgba(240, 120, 68, 0.35)',
                  textAlign: 'center'
                }}
                className="hero-coral-btn"
              >
                Start 7 Day Free Trial
              </button>
            </form>
          </div>

          {/* Right Column: Unique Dual Counter-Rotating Golden Yantra & Radiant Aura */}
          <div 
            style={{ 
              position: 'relative', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              minHeight: '520px'
            }}
          >
            {/* Radiant Pulsing Golden Aura Glow */}
            <div 
              className="golden-aura-pulse"
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '460px',
                height: '460px',
                transform: 'translate(-50%, -50%)',
                background: 'radial-gradient(circle, rgba(245, 158, 11, 0.25) 0%, rgba(240, 120, 68, 0.15) 45%, rgba(255, 255, 255, 0) 70%)',
                borderRadius: '50%',
                pointerEvents: 'none',
                zIndex: 0
              }}
            />

            {/* Counter-Rotating Dual Sacred Geometry Mandala Container */}
            <div 
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '520px',
                height: '520px',
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none',
                zIndex: 1
              }}
            >
              {/* Outer Golden Bhupura Gate Layer - Clockwise Spin (30s) */}
              <div 
                className="yantra-outer-spin"
                style={{
                  position: 'absolute',
                  inset: 0,
                  filter: 'drop-shadow(0 0 16px rgba(245, 158, 11, 0.45))'
                }}
              >
                <OuterYantraGateSVG color="#F59E0B" />
              </div>

              {/* Inner Sri Yantra Lotus & Triangles Layer - Counter-Clockwise Spin (20s) */}
              <div 
                className="yantra-inner-spin"
                style={{
                  position: 'absolute',
                  inset: 0,
                  filter: 'drop-shadow(0 0 12px rgba(240, 120, 68, 0.4))'
                }}
              >
                <InnerYantraGeometrySVG color="#F07844" />
              </div>
            </div>

            {/* Yogi Cutout Image (yoga-pilates-mats-kapotasana-yoga-03da7075e283595c693e327af21b40f0.png) */}
            <div 
              className="hero-yogi-float"
              style={{ position: 'relative', zIndex: 3, textAlign: 'center' }}
            >
              <img 
                src="/yoga-pilates-mats-kapotasana-yoga-03da7075e283595c693e327af21b40f0.png" 
                alt="Subina Aacharya Kapotasana Yoga Posture"
                decoding="async"
                fetchPriority="high"
                style={{ 
                  maxHeight: '470px', 
                  maxWidth: '100%', 
                  objectFit: 'contain'
                }}
              />
              
              {/* Soft Dynamic Ground Contact Shadow */}
              <div 
                className="shadow-pulse"
                style={{
                  width: '260px',
                  height: '14px',
                  background: 'radial-gradient(ellipse at center, rgba(0, 0, 0, 0.18) 0%, rgba(0, 0, 0, 0) 70%)',
                  margin: '-15px auto 0 auto',
                  borderRadius: '50%'
                }}
              />
            </div>
          </div>

        </div>
      </div>

      <style>{`
        /* Golden Aura Breathing Pulse */
        @keyframes aura-breath {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.85;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.15);
            opacity: 1;
          }
        }

        .golden-aura-pulse {
          animation: aura-breath 5s ease-in-out infinite;
        }

        /* Outer Gate Clockwise Spin (30s) */
        @keyframes outer-gate-clockwise {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .yantra-outer-spin {
          animation: outer-gate-clockwise 30s linear infinite;
          transform-origin: center center;
        }

        /* Inner Geometry Counter-Clockwise Spin (20s) */
        @keyframes inner-geometry-counter {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(-360deg);
          }
        }

        .yantra-inner-spin {
          animation: inner-geometry-counter 20s linear infinite;
          transform-origin: center center;
        }

        /* Floating Yogi Animation */
        @keyframes float-yogi-gentle {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        .hero-yogi-float {
          animation: float-yogi-gentle 4.5s ease-in-out infinite;
        }

        @keyframes shadow-pulse-anim {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(0.85);
            opacity: 0.55;
          }
        }

        .shadow-pulse {
          animation: shadow-pulse-anim 4.5s ease-in-out infinite;
        }

        .hero-coral-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 12px 25px rgba(240, 120, 68, 0.45) !important;
          background: linear-gradient(180deg, #F58350 0%, #E86B36 100%) !important;
        }

        .hero-coral-btn:active {
          transform: translateY(1px);
          box-shadow: 0 4px 10px rgba(240, 120, 68, 0.3) !important;
        }

        @media (max-width: 992px) {
          .hero-exact-grid { 
            grid-template-columns: 1fr !important; 
            gap: 3rem !important; 
          }
        }
      `}</style>
    </section>
  );
}

{/* Layer 1: Outer Golden Bhupura Rectangular/Square Temple Gate SVG */}
function OuterYantraGateSVG({ color = "#F59E0B" }) {
  return (
    <svg viewBox="0 0 500 500" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer Golden Bhupura Gate 1 */}
      <path 
        d="M 50 50 L 200 50 L 200 35 L 220 35 L 220 50 L 280 50 L 280 35 L 300 35 L 300 50 L 450 50 L 450 200 L 465 200 L 465 220 L 450 220 L 450 280 L 465 280 L 465 300 L 450 300 L 450 450 L 300 450 L 300 465 L 280 465 L 280 450 L 220 450 L 220 465 L 200 465 L 200 450 L 50 450 L 50 300 L 35 300 L 35 280 L 50 280 L 50 220 L 35 220 L 35 200 L 50 200 Z" 
        stroke={color} 
        strokeWidth="2.2" 
        strokeOpacity="0.85"
      />
      {/* Inner Golden Bhupura Gate 2 */}
      <path 
        d="M 65 65 L 205 65 L 205 52 L 220 52 L 220 65 L 280 65 L 280 52 L 295 52 L 295 65 L 435 65 L 435 205 L 448 205 L 448 220 L 435 220 L 435 280 L 448 280 L 448 295 L 435 295 L 435 435 L 295 435 L 295 448 L 280 448 L 280 435 L 220 435 L 220 448 L 205 448 L 205 435 L 65 435 L 65 295 L 52 295 L 52 280 L 65 280 L 65 220 L 52 220 L 52 205 L 65 205 Z" 
        stroke={color} 
        strokeWidth="1.6" 
        strokeOpacity="0.7"
      />
      {/* Corner Radiance Accent Dots */}
      <circle cx="50" cy="50" r="4" fill={color} />
      <circle cx="450" cy="50" r="4" fill={color} />
      <circle cx="450" cy="450" r="4" fill={color} />
      <circle cx="50" cy="450" r="4" fill={color} />
    </svg>
  );
}

{/* Layer 2: Inner Sri Yantra Lotus & Interlocking Triangles SVG */}
function InnerYantraGeometrySVG({ color = "#F07844" }) {
  return (
    <svg viewBox="0 0 500 500" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer Circles */}
      <circle cx="250" cy="250" r="170" stroke={color} strokeWidth="1.6" strokeOpacity="0.8" />
      <circle cx="250" cy="250" r="160" stroke={color} strokeWidth="1.3" strokeOpacity="0.7" />

      {/* 16 Lotus Petals Ring */}
      {[...Array(16)].map((_, i) => {
        const angle = (i * 360) / 16;
        const rad = (angle * Math.PI) / 180;
        const x = 250 + 155 * Math.cos(rad);
        const y = 250 + 155 * Math.sin(rad);
        return (
          <circle key={i} cx={x} cy={y} r="22" stroke={color} strokeWidth="1.3" strokeOpacity="0.6" />
        );
      })}

      {/* Inner Concentric Circles */}
      <circle cx="250" cy="250" r="130" stroke={color} strokeWidth="1.6" strokeOpacity="0.8" />
      <circle cx="250" cy="250" r="115" stroke={color} strokeWidth="1.3" strokeOpacity="0.7" />

      {/* Interlocking Triangles */}
      <polygon points="250,360 140,170 360,170" stroke={color} strokeWidth="1.6" strokeOpacity="0.75" />
      <polygon points="250,340 160,185 340,185" stroke={color} strokeWidth="1.3" strokeOpacity="0.65" />
      <polygon points="250,315 175,200 325,200" stroke={color} strokeWidth="1.3" strokeOpacity="0.65" />

      <polygon points="250,140 140,330 360,330" stroke={color} strokeWidth="1.6" strokeOpacity="0.75" />
      <polygon points="250,160 160,315 340,315" stroke={color} strokeWidth="1.3" strokeOpacity="0.65" />
      <polygon points="250,185 175,300 325,300" stroke={color} strokeWidth="1.3" strokeOpacity="0.65" />

      {/* Glowing Golden Bindu Center */}
      <circle cx="250" cy="250" r="5" fill="#F59E0B" />
      <circle cx="250" cy="250" r="8" stroke="#F59E0B" strokeWidth="1" strokeOpacity="0.6" />
    </svg>
  );
}
