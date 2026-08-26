import React, { useState, useEffect, useRef } from 'react';

// Exact frequencies for Piano Keys (C1 to G6) including deep sub-bass register
const NOTE_FREQS = {
  'C1': 32.70, 'D1': 36.71, 'E1': 41.20, 'F1': 43.65, 'G1': 49.00, 'A1': 55.00, 'B1': 61.74,
  'C2': 65.41, 'D2': 73.42, 'E2': 82.41, 'F2': 87.31, 'G2': 98.00, 'A2': 110.00, 'B2': 123.47,
  'C3': 130.81, 'D3': 146.83, 'E3': 164.81, 'F3': 174.61, 'G3': 196.00, 'A3': 220.00, 'B3': 246.94,
  'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 'G4': 392.00, 'A4': 440.00, 'B4': 493.88,
  'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F5': 698.46, 'G5': 783.99, 'A5': 880.00, 'B5': 987.77,
  'C6': 1046.50, 'D6': 1174.66, 'E6': 1318.51, 'F6': 1396.91, 'G6': 1567.98,
};

// Deep Meditative Handpan Scale assigned across 23 lines of SUBINA
const LINE_MELODY_NOTES = [
  'G4', 'F4', 'E4', 'D4', 'C4', 'B3', 'A3',
  'G3', 'F3', 'E3', 'D3', 'C3', 'B2',
  'A2', 'G2', 'F2', 'E2', 'D2', 'C2',
  'B1', 'A1', 'G1', 'C1'
];

export default function BabaSubinaMelody() {
  const audioCtxRef = useRef(null);
  const svgRef = useRef(null);
  const singleStringsRef = useRef([]);
  const [, setRenderTrigger] = useState(0);

  // Web Audio Context initialization
  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      audioCtxRef.current = new AudioCtx();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  // Pure Acoustic Handpan Tone (Zero Echo, Zero Delay, 100% Direct Dry Output)
  const playHandpanNote = (ctx, noteName) => {
    const freq = NOTE_FREQS[noteName] || 196.00;
    const now = ctx.currentTime;
    const duration = 1.4; // Crisp, clean natural handpan ring decay

    const masterGain = ctx.createGain();

    // 1. Pure Handpan Partials (Fundamental 1.0x, Soft Octave 2.0x, Warm 5th 3.0x)
    const partials = [
      { ratio: 1.0, amp: 1.0, decay: 1.0 },     // Fundamental handpan tone
      { ratio: 2.0, amp: 0.35, decay: 0.75 },   // Soft octave overtone
      { ratio: 3.0, amp: 0.15, decay: 0.45 },   // Warm 5th overtone
    ];

    partials.forEach(({ ratio, amp, decay }) => {
      const pFreq = freq * ratio;
      if (pFreq > 8000) return;

      const osc = ctx.createOscillator();
      const pGain = ctx.createGain();

      osc.type = 'sine'; // Handpan tones are rich, pure sine partials
      osc.frequency.setValueAtTime(pFreq, now);

      // Soft 15ms felt mallet attack & soft peak volume (0.10) for pure dry tone
      const peakAmp = amp * 0.10;
      pGain.gain.setValueAtTime(0.0001, now);
      pGain.gain.linearRampToValueAtTime(peakAmp, now + 0.015);
      pGain.gain.exponentialRampToValueAtTime(0.0001, now + (duration * decay));

      osc.connect(pGain);
      pGain.connect(masterGain);

      osc.start(now);
      osc.stop(now + duration);
    });

    // 2. Sub-Bass Fundamental Body Layer
    const subOsc = ctx.createOscillator();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(freq, now);

    const subGain = ctx.createGain();
    subGain.gain.setValueAtTime(0.0001, now);
    subGain.gain.linearRampToValueAtTime(0.18, now + 0.015);
    subGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    subOsc.connect(subGain);
    subGain.connect(masterGain);

    // 3. Handpan Resonant Body Filter
    const chamberFilter = ctx.createBiquadFilter();
    chamberFilter.type = 'lowpass';
    const cutoff = Math.min(Math.max(freq * 2.5, 400), 3600);
    chamberFilter.frequency.setValueAtTime(cutoff, now);
    chamberFilter.Q.setValueAtTime(1.5, now);

    // 4. Direct 100% Output — NO DELAY, NO REVERB, NO ECHO LOOP
    masterGain.connect(chamberFilter);
    chamberFilter.connect(ctx.destination);

    subOsc.start(now);
    subOsc.stop(now + duration);
  };

  // String Strum / Hover Event Handler (Plays soft handpan note assigned to line)
  const handleStrumString = (str) => {
    const now = Date.now();
    if (now - str.lastPlucked < 65) return;

    str.lastPlucked = now;
    str.velocity = (Math.random() > 0.5 ? 1 : -1) * 5.2;
    str.phase = 0;

    try {
      const ctx = getAudioContext();
      playHandpanNote(ctx, str.noteName);
    } catch (e) {
      console.error(e);
    }

    setRenderTrigger((prev) => prev + 1);
  };

  // Generate Discrete Single String Segments for "SUBINA" with Lowered Bass Note per Line
  useEffect(() => {
    const viewBoxWidth = 1728;
    const viewBoxHeight = 441;

    const offscreen = document.createElement('canvas');
    offscreen.width = viewBoxWidth;
    offscreen.height = viewBoxHeight;
    const ctx = offscreen.getContext('2d');

    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '900 310px "Outfit", "Plus Jakarta Sans", "Inter", -apple-system, sans-serif';
    ctx.fillText('SUBINA', viewBoxWidth / 2, viewBoxHeight / 2 + 5);

    const textData = ctx.getImageData(0, 0, viewBoxWidth, viewBoxHeight).data;

    const numRows = 23;
    const paddingY = 10;
    const usableHeight = viewBoxHeight - paddingY * 2;
    const rowSpacing = usableHeight / (numRows - 1);

    const generatedStrings = [];
    let idCounter = 0;
    const vertexStep = 9.943;

    for (let r = 0; r < numRows; r++) {
      const y = Math.round(paddingY + rowSpacing * r);
      const noteName = LINE_MELODY_NOTES[r % LINE_MELODY_NOTES.length];

      let inSegment = false;
      let startX = 0;

      for (let x = 0; x < viewBoxWidth; x += 4) {
        const idx = (y * viewBoxWidth + x) * 4;
        const alpha = textData[idx + 3];

        if (alpha > 40 && !inSegment) {
          inSegment = true;
          startX = x;
        } else if (alpha <= 40 && inSegment) {
          inSegment = false;
          const endX = x;
          if (endX - startX >= 10) {
            const pts = [];
            for (let px = startX; px <= endX; px += vertexStep) {
              pts.push(px);
            }
            if (pts[pts.length - 1] < endX) pts.push(endX);

            generatedStrings.push({
              id: `string-${idCounter++}`,
              lineIndex: r + 1,
              noteName,
              x1: startX,
              x2: endX,
              y,
              pts,
              displacement: 0,
              velocity: 0,
              phase: Math.random() * Math.PI * 2,
              lastPlucked: 0,
            });
          }
        }
      }

      if (inSegment) {
        const endX = viewBoxWidth;
        if (endX - startX >= 10) {
          const pts = [];
          for (let px = startX; px <= endX; px += vertexStep) {
            pts.push(px);
          }
          if (pts[pts.length - 1] < endX) pts.push(endX);

          generatedStrings.push({
            id: `string-${idCounter++}`,
            lineIndex: r + 1,
            noteName,
            x1: startX,
            x2: endX,
            y,
            pts,
            displacement: 0,
            velocity: 0,
            phase: Math.random() * Math.PI * 2,
            lastPlucked: 0,
          });
        }
      }
    }

    singleStringsRef.current = generatedStrings;
    setRenderTrigger(1);
  }, []);

  // Multi-Wave Ripple Animation Loop (0.5s Animation Duration)
  useEffect(() => {
    let animId;

    const updatePhysics = () => {
      let needsRender = false;
      const strings = singleStringsRef.current;

      strings.forEach((str) => {
        if (Math.abs(str.displacement) > 0.01 || Math.abs(str.velocity) > 0.01) {
          needsRender = true;
          str.phase += 0.18;
          const force = -0.16 * str.displacement;
          str.velocity += force;
          str.velocity *= 0.88;
          str.displacement += str.velocity;

          if (Math.abs(str.displacement) < 0.01 && Math.abs(str.velocity) < 0.01) {
            str.displacement = 0;
            str.velocity = 0;
          }
        }
      });

      if (needsRender) {
        setRenderTrigger((prev) => prev + 1);
      }

      animId = requestAnimationFrame(updatePhysics);
    };

    animId = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <section
      id="baba-subina"
      className="baba-subina-section"
      style={{
        position: 'relative',
        padding: '2rem 0',
        background: '#070908',
        color: '#FFFFFF',
        overflow: 'hidden',
      }}
    >
      <div style={{ width: '100%', maxWidth: '1680px', margin: '0 auto', padding: '0 0.5rem', position: 'relative', zIndex: 2 }}>
        
        {/* PURE EXPANDED SUBINA STRING SVG CONTAINER */}
        <div
          className="flex w-full items-center justify-center mix-blend-difference"
          style={{ background: '#070908', borderRadius: 'var(--radius-lg)', padding: '0' }}
        >
          <div className="w-full max-w-none min-w-0">
            <svg
              ref={svgRef}
              viewBox="0 0 1728 441"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="xMidYMid meet"
              width="100%"
              style={{ display: 'block', width: '100%', height: 'auto', flexShrink: 0 }}
            >
              {singleStringsRef.current.map((str) => {
                const amp = str.displacement;
                const y = str.y;
                const x1 = str.x1;
                const x2 = str.x2;
                const isPlucked = Math.abs(amp) > 0.08;

                let segPathD = '';
                if (!isPlucked) {
                  segPathD = str.pts.map((px, idx) => (idx === 0 ? `M ${px.toFixed(3)} ${y}` : `L ${px.toFixed(3)} ${y}`)).join(' ');
                } else {
                  segPathD = str.pts.map((px, idx) => {
                    const t = (px - x1) / (x2 - x1);
                    const anchorShape = Math.sin(t * Math.PI);
                    const rippleWave = Math.sin(t * Math.PI * 1.5 + str.phase);
                    const dy = amp * 0.52 * anchorShape * rippleWave;
                    const ptY = (y + dy).toFixed(3);
                    return idx === 0 ? `M ${px.toFixed(3)} ${ptY}` : `L ${px.toFixed(3)} ${ptY}`;
                  }).join(' ');
                }

                return (
                  <g key={str.id}>
                    <path
                      d={segPathD}
                      stroke={isPlucked ? '#FFFFFF' : '#D8D8D8'}
                      className="tw-cursor-pointer"
                      style={{
                        fill: 'none',
                        strokeLinecap: 'round',
                        vectorEffect: 'non-scaling-stroke',
                        strokeWidth: isPlucked ? 1.35 : 0.65,
                      }}
                    />
                    <path
                      d={segPathD}
                      stroke="transparent"
                      className="tw-cursor-pointer"
                      style={{
                        fill: 'none',
                        strokeLinecap: 'round',
                        vectorEffect: 'non-scaling-stroke',
                        strokeWidth: 14,
                      }}
                      pointerEvents="stroke"
                      onMouseEnter={() => handleStrumString(str)}
                      onMouseMove={() => handleStrumString(str)}
                      onTouchStart={() => handleStrumString(str)}
                      onTouchMove={() => handleStrumString(str)}
                    />
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

      </div>
    </section>
  );
}
