import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, CloudRain, Sparkles, Wind, Trees, X } from 'lucide-react';

export default function AmbientSoundPlayer({ isOpen, onClose }) {
  const [activeSound, setActiveSound] = useState(null);
  const [volume, setVolume] = useState(0.4);

  const audioCtxRef = useRef(null);
  const activeNodesRef = useRef([]);

  const stopAllSounds = () => {
    if (activeNodesRef.current.length > 0) {
      activeNodesRef.current.forEach(node => {
        try { node.stop ? node.stop() : node.disconnect(); } catch (e) { }
      });
      activeNodesRef.current = [];
    }
  };

  const playSound = (type) => {
    stopAllSounds();

    if (activeSound === type) {
      setActiveSound(null);
      return;
    }

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(volume, ctx.currentTime);
      masterGain.connect(ctx.destination);

      if (type === 'rain') {
        // Sweet Gentle Rain & Soft Leaf Patter
        const bufferSize = ctx.sampleRate * 3;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99 * b0 + white * 0.05;
          b1 = 0.96 * b1 + white * 0.11;
          b2 = 0.86 * b2 + white * 0.25;
          data[i] = (b0 + b1 + b2) * 0.3; // Soft Pink/Brown Noise
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(450, ctx.currentTime);

        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.setValueAtTime(0.18, ctx.currentTime); // Gentle rain swell
        lfoGain.gain.setValueAtTime(120, ctx.currentTime);
        lfo.connect(filter.frequency);

        noise.connect(filter);
        filter.connect(masterGain);
        noise.start();
        lfo.start();

        activeNodesRef.current.push(noise, lfo);

      } else if (type === 'bowl') {
        // Sweet 432Hz Celestial Tibetan Singing Bowl with Binaural Shimmer Chorus
        const bowlPartials = [
          { freq: 432.0, gain: 0.14 },    // Healing Root Fundamental
          { freq: 434.2, gain: 0.08 },    // Sweet Chorus Beating Shimmer
          { freq: 648.0, gain: 0.05 },    // Perfect 5th Overtone
          { freq: 864.0, gain: 0.03 },    // Soft Pure Octave
        ];

        const bowlFilter = ctx.createBiquadFilter();
        bowlFilter.type = 'lowpass';
        bowlFilter.frequency.setValueAtTime(1600, ctx.currentTime);
        bowlFilter.connect(masterGain);

        bowlPartials.forEach(({ freq, gain }) => {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime);
          g.gain.setValueAtTime(gain, ctx.currentTime);

          osc.connect(g);
          g.connect(bowlFilter);
          osc.start();
          activeNodesRef.current.push(osc);
        });
      }

      setActiveSound(type);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    return () => stopAllSounds();
  }, []);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '450px', padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Volume2 color="var(--color-terracotta-600)" size={22} />
            <h3 style={{ fontSize: '1.4rem' }}>Ambient Zen Audio</h3>
          </div>
          <button onClick={onClose} style={{ color: 'var(--color-text-muted)' }}><X size={20} /></button>
        </div>

        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
          Select a background soundscape to enhance your reading, meditation, or yoga practice.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.8rem' }}>
          <button
            onClick={() => playSound('rain')}
            style={{
              padding: '1.2rem',
              borderRadius: 'var(--radius-md)',
              background: activeSound === 'rain' ? 'var(--color-sage-700)' : 'var(--color-sand-100)',
              color: activeSound === 'rain' ? '#FFFFFF' : 'var(--color-sage-900)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.5rem',
              fontWeight: 600
            }}
          >
            <CloudRain size={24} /> Gentle Rain
          </button>

          <button
            onClick={() => playSound('bowl')}
            style={{
              padding: '1.2rem',
              borderRadius: 'var(--radius-md)',
              background: activeSound === 'bowl' ? 'var(--color-sage-700)' : 'var(--color-sand-100)',
              color: activeSound === 'bowl' ? '#FFFFFF' : 'var(--color-sage-900)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.5rem',
              fontWeight: 600
            }}
          >
            <Sparkles size={24} /> 432Hz Bowl
          </button>
        </div>

        <div style={{ background: 'var(--color-sand-100)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: 600 }}>
            <span>Volume</span>
            <span>{Math.round(volume * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--color-sage-700)' }}
          />
        </div>

        {activeSound && (
          <button
            onClick={stopAllSounds}
            style={{ marginTop: '1.2rem', width: '100%', padding: '0.6rem', color: 'var(--color-terracotta-600)', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
          >
            <VolumeX size={16} /> Mute Audio
          </button>
        )}
      </div>
    </div>
  );
}
