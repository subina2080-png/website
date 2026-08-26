import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, HeartPulse, CheckCircle2 } from 'lucide-react';

const BREATH_PATTERNS = {
  box: {
    name: "Box Breathing (4-4-4-4)",
    description: "Equal ratio breathing to quiet racing thoughts and restore neurological balance.",
    phases: [
      { name: "Inhale", duration: 4, action: "inhale" },       // ZOOM
      { name: "Hold", duration: 4, action: "hold-high" },     // LOCK (HIGH)
      { name: "Exhale", duration: 4, action: "exhale" },       // ZOOM OUT
      { name: "Hold", duration: 4, action: "hold-low" }       // LOCK (LOW)
    ]
  },
  relax: {
    name: "4-7-8 Relaxing Breath",
    description: "Deep parasympathetic trigger designed for high stress and peaceful bedtime prep.",
    phases: [
      { name: "Inhale", duration: 4, action: "inhale" },       // ZOOM
      { name: "Hold", duration: 7, action: "hold-high" },     // LOCK (HIGH)
      { name: "Exhale", duration: 8, action: "exhale" }        // ZOOM OUT
    ]
  },
  belly: {
    name: "Deep Belly Flow (5-5)",
    description: "Soothing rhythmic diaphragm expansion to relieve tension in chest & stomach.",
    phases: [
      { name: "Inhale", duration: 5, action: "inhale" },       // ZOOM
      { name: "Exhale", duration: 5, action: "exhale" }        // ZOOM OUT
    ]
  }
};

export default function BreathingToolkit({ showToast }) {
  const [selectedPatternKey, setSelectedPatternKey] = useState('box');
  const [isActive, setIsActive] = useState(false);
  const [currentPhaseIdx, setCurrentPhaseIdx] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(4);
  const [completedCycles, setCompletedCycles] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const audioCtxRef = useRef(null);

  const pattern = BREATH_PATTERNS[selectedPatternKey] || BREATH_PATTERNS.box;
  const currentPhase = pattern.phases[currentPhaseIdx] || pattern.phases[0];

  // Sweet Celestial Singing Bowl Chime (Warm Solfeggio Harmonics)
  const playChime = (freq = 528) => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const now = ctx.currentTime;
      const duration = 2.4; // Long, sweet natural bell decay

      const masterGain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2200, now);
      filter.Q.setValueAtTime(1.2, now);

      masterGain.connect(filter);
      filter.connect(ctx.destination);

      // Sweet Multi-Harmonic Bell Partials (Fundamental, Octave + Shimmer, Perfect 5th)
      const harmonics = [
        { ratio: 1.0, gain: 0.12, decay: 1.0 },     // Pure Solfeggio Fundamental (528Hz)
        { ratio: 2.003, gain: 0.04, decay: 0.8 },  // Sweet Octave with +3Hz Chorus Shimmer
        { ratio: 2.997, gain: 0.02, decay: 0.55 }, // Warm 5th Overtone
      ];

      harmonics.forEach(({ ratio, gain, decay }) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq * ratio, now);

        // Soft 20ms felt mallet attack & smooth exponential decay
        g.gain.setValueAtTime(0.0001, now);
        g.gain.linearRampToValueAtTime(gain, now + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, now + (duration * decay));

        osc.connect(g);
        g.connect(masterGain);

        osc.start(now);
        osc.stop(now + duration);
      });
    } catch (e) {}
  };

  useEffect(() => {
    let timer = null;
    if (isActive) {
      timer = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev > 1) {
            return prev - 1;
          } else {
            const nextIdx = (currentPhaseIdx + 1) % pattern.phases.length;
            if (nextIdx === 0) {
              setCompletedCycles(c => c + 1);
              playChime(639);
            } else {
              playChime(432);
            }
            setCurrentPhaseIdx(nextIdx);
            return pattern.phases[nextIdx].duration;
          }
        });
      }, 1000);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isActive, currentPhaseIdx, selectedPatternKey, soundEnabled]);

  const handleSelectPattern = (key) => {
    setIsActive(false);
    setSelectedPatternKey(key);
    setCurrentPhaseIdx(0);
    setSecondsLeft((BREATH_PATTERNS[key] || BREATH_PATTERNS.box).phases[0].duration);
    setCompletedCycles(0);
  };

  const handleReset = () => {
    setIsActive(false);
    setCurrentPhaseIdx(0);
    setSecondsLeft(pattern.phases[0].duration);
    setCompletedCycles(0);
  };

  const togglePlay = () => {
    if (!isActive) {
      playChime(528);
    }
    setIsActive(!isActive);
  };

  return (
    <section id="breathing" className="section" style={{ background: '#FFFFFF' }}>
      <div className="container">
        <div className="section-title-wrap">
          <div className="section-tag">
            <HeartPulse size={16} /> Pranayama Sanctuary
          </div>
          <h2>Guided Breathing & Mindful Visualizer</h2>
          <p>Harmonize your nervous system with interactive ancient breathwork routines. Select a rhythm, press start, and follow the soothing 3D visual expanding sphere.</p>
        </div>

        <div className="skeuo-card" style={{ maxWidth: '920px', margin: '0 auto', padding: '3rem 2.5rem', background: '#FFFFFF' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem', justifyContent: 'center', marginBottom: '2.2rem' }}>
            {Object.keys(BREATH_PATTERNS).map((key) => {
              const p = BREATH_PATTERNS[key];
              const isSelected = selectedPatternKey === key;
              return (
                <button key={key} onClick={() => handleSelectPattern(key)} className={`pill-skeuo ${isSelected ? 'active' : ''}`}>
                  {p.name}
                </button>
              );
            })}
          </div>

          <p style={{ textAlign: 'center', fontSize: '1rem', color: 'var(--color-text-muted)', marginBottom: '3rem', maxWidth: '640px', margin: '0 auto 3rem auto', lineHeight: 1.6 }}>
            {pattern.description}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            {/* Interactive Breathing Sphere Circle (Zoom = Inhale, Lock = Hold, Zoom Out = Exhale) */}
            <div
              className={`breathing-sphere-outer ${isActive ? (currentPhase?.action || '') : ''}`}
              onClick={togglePlay}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && togglePlay()}
              title={isActive ? "Click to Pause" : "Click to Start"}
              style={{
                transitionDuration: isActive ? `${currentPhase?.duration || 4}s` : '0.35s'
              }}
            >
              <div
                className="breathing-sphere-inner"
                style={{
                  transitionDuration: isActive ? `${currentPhase?.duration || 4}s` : '0.35s'
                }}
              >
                <div style={{ 
                  textAlign: 'center', 
                  pointerEvents: 'none', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  width: '100%',
                  padding: '0 0.25rem',
                  boxSizing: 'border-box'
                }}>
                  <div style={{ 
                    fontSize: isActive ? 'clamp(1.4rem, 4vw, 1.85rem)' : 'clamp(1.25rem, 3.5vw, 1.55rem)', 
                    lineHeight: 1.15, 
                    fontWeight: 700,
                    whiteSpace: 'nowrap'
                  }}>
                    {isActive ? (currentPhase?.name || 'Ready') : "Ready"}
                  </div>

                  <div style={{ 
                    fontSize: 'clamp(0.78rem, 2.2vw, 0.92rem)', 
                    opacity: 0.92, 
                    marginTop: '0.3rem', 
                    fontWeight: 600, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    gap: '0.3rem', 
                    whiteSpace: 'nowrap',
                    width: '100%'
                  }}>
                    {isActive ? (
                      `${secondsLeft}s`
                    ) : (
                      <>
                        <Play size={13} fill="#FFFFFF" color="#FFFFFF" style={{ flexShrink: 0 }} /> Tap to Start
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ height: '36px', textAlign: 'center' }}>
              {isActive ? (
                <p style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-sage-900)' }}>
                  {currentPhase?.name === 'Inhale' && '🌱 Gently breathe in through your nose...'}
                  {currentPhase?.name === 'Hold' && '✨ Hold breath softly, resting in stillness...'}
                  {currentPhase?.name === 'Exhale' && '🌊 Release breath slowly through your mouth...'}
                </p>
              ) : (
                <p style={{ fontSize: '1.05rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>Tap the sphere above to start or pause your breathwork session.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
