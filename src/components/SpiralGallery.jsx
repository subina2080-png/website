import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Activity, Sparkles, X, Compass, Grid } from 'lucide-react';
import { calculateGoldenSpiralProps, calculateSCurveFlowProps, goldenSpiral } from '../animations/goldenSpiralMath';
import GoldenSpiralCard from './GoldenSpiralCard';

gsap.registerPlugin(ScrollTrigger);

const FLOW_ITEMS = [
  {
    id: 'flow-1',
    title: 'Mindful Sanctuary',
    category: 'Meditation Space',
    subtitle: 'Panoramic mountain vista meditation sanctuary',
    image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1200&q=80',
    description: 'A serene space built with natural timber and floor-to-ceiling glass, facilitating deep inward stillness and breathing alignment.'
  },
  {
    id: 'flow-2',
    title: 'Vibrational Sound Bath',
    category: 'Sound Healing',
    subtitle: '432Hz Quartz crystal & Tibetan singing bowls',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80',
    description: 'Harmonic solfeggio frequency sound bath designed to release tension, realign subtle energy channels, and calm the nervous system.'
  },
  {
    id: 'flow-3',
    title: 'Asana Precision & Flow',
    category: 'Vinyasa Practice',
    subtitle: 'Sacred movement and biomechanical alignment',
    image: 'https://images.unsplash.com/photo-1510894347713-da3ed8f4f92d?auto=format&fit=crop&w=1200&q=80',
    description: 'Blending physical grace with breath synchronicity to foster resilience, flexibility, and steady presence.'
  },
  {
    id: 'flow-4',
    title: 'Pranayama Breathwork',
    category: 'Vital Energy',
    subtitle: 'Nadi Shodhana & Anuloma Viloma practices',
    image: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=1200&q=80',
    description: 'Rhythmic breath control techniques designed to oxygenate the body, balance solar and lunar energy currents, and quiet the mind.'
  },
  {
    id: 'flow-5',
    title: 'Sacred Lotus Stillness',
    category: 'Dhyana Practice',
    subtitle: 'Cultivating unshakeable inner peace',
    image: 'https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&w=1200&q=80',
    description: 'Sitting in timeless awareness, witnessing thoughts arise and pass like gentle ripples on a quiet mountain lake.'
  },
  {
    id: 'flow-6',
    title: 'Sunrise Flow',
    category: 'Morning Practice',
    subtitle: 'Surya Namaskar at dawn in Kathmandu Valley',
    image: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=1200&q=80',
    description: 'Awakening the physical and energetic bodies with sun salutations as golden light illuminates the surrounding hills.'
  }
];

export default function SpiralGallery() {
  const sectionRef = useRef(null);
  const cardRefs = useRef([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [layoutMode, setLayoutMode] = useState('scurve'); // 'scurve' | 'spiral'
  const [isGridAligned, setIsGridAligned] = useState(false);

  const [viewportSize, setViewportSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800
  });

  const isMobile = viewportSize.width < 768;

  useEffect(() => {
    let timer = null;
    const handleResize = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        setViewportSize({ width: window.innerWidth, height: window.innerHeight });
      }, 150);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const updateCardPositions = (progress) => {
      const width = viewportSize.width;
      const height = viewportSize.height;

      FLOW_ITEMS.forEach((item, index) => {
        const cardEl = cardRefs.current[index];
        if (!cardEl) return;

        let props;
        if (layoutMode === 'scurve') {
          props = calculateSCurveFlowProps(
            index,
            FLOW_ITEMS.length,
            progress,
            width,
            height,
            isMobile
          );
        } else {
          props = calculateGoldenSpiralProps(
            index,
            FLOW_ITEMS.length,
            progress,
            width,
            height,
            isMobile
          );
        }

        const transform = `translate3d(${props.x}px, ${props.y}px, ${props.z}px) rotateX(${props.rotateX}deg) rotateY(${props.rotateY}deg) rotateZ(${props.rotateZ}deg) scale(${props.scale})`;

        cardEl.style.transform = transform;
        cardEl.style.opacity = props.opacity;
        cardEl.style.filter = props.blur > 0.2 ? `blur(${props.blur}px)` : 'none';
        cardEl.style.zIndex = props.zIndex;

        if (props.isFocal) {
          cardEl.classList.add('is-focal-preview');
        } else {
          cardEl.classList.remove('is-focal-preview');
        }

        if (props.isSymmetricalEnd) {
          cardEl.classList.add('is-symmetrical-grid');
        } else {
          cardEl.classList.remove('is-symmetrical-grid');
        }
      });

      if (progress > 0.85) {
        setIsGridAligned(true);
      } else {
        setIsGridAligned(false);
      }
    };

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom bottom',
        pin: true,
        scrub: 1.6,
        onUpdate: (self) => {
          updateCardPositions(self.progress);
        }
      });

      updateCardPositions(0);
    }, sectionRef);

    return () => ctx.revert();
  }, [viewportSize, isMobile, layoutMode]);

  const generateSCurvePath = () => {
    const w = viewportSize.width;
    const h = viewportSize.height;
    const isM = isMobile;

    const scaleX = isM ? 0.65 : Math.min(1.25, w / 1100);
    const scaleY = isM ? 0.7 : Math.min(1.15, h / 850);
    const cx = w / 2;
    const cy = h / 2;

    const p0 = { x: cx - 260 * scaleX, y: cy + 245 * scaleY };
    const c0 = { x: cx - 160 * scaleX, y: cy + 200 * scaleY };
    const c1 = { x: cx - 40 * scaleX,  y: cy + 180 * scaleY };
    const p1 = { x: cx + 40 * scaleX,  y: cy + 160 * scaleY };
    const c2 = { x: cx + 180 * scaleX, y: cy + 130 * scaleY };
    const c3 = { x: cx + 320 * scaleX, y: cy + 90 * scaleY };
    const p2 = { x: cx + 300 * scaleX, y: cy + 60 * scaleY };
    const c4 = { x: cx + 360 * scaleX, y: cy - 10 * scaleY };
    const c5 = { x: cx + 180 * scaleX, y: cy - 20 * scaleY };
    const p3 = { x: cx + 20 * scaleX,  y: cy - 20 * scaleY };
    const c6 = { x: cx - 180 * scaleX, y: cy - 20 * scaleY };
    const c7 = { x: cx - 360 * scaleX, y: cy - 70 * scaleY };
    const p4 = { x: cx - 280 * scaleX, y: cy - 130 * scaleY };
    const c8 = { x: cx - 220 * scaleX, y: cy - 190 * scaleY };
    const c9 = { x: cx - 160 * scaleX, y: cy - 220 * scaleY };
    const p5 = { x: cx - 100 * scaleX, y: cy - 240 * scaleY };

    return `M ${p0.x} ${p0.y} C ${c0.x} ${c0.y}, ${c1.x} ${c1.y}, ${p1.x} ${p1.y} C ${c2.x} ${c2.y}, ${c3.x} ${c3.y}, ${p2.x} ${p2.y} C ${c4.x} ${c4.y}, ${c5.x} ${c5.y}, ${p3.x} ${p3.y} C ${c6.x} ${c6.y}, ${c7.x} ${c7.y}, ${p4.x} ${p4.y} C ${c8.x} ${c8.y}, ${c9.x} ${c9.y}, ${p5.x} ${p5.y}`;
  };

  const generateSpiralPath = () => {
    const points = [];
    const steps = 60;
    const pathScale = isMobile
      ? Math.min(viewportSize.width, viewportSize.height) * 0.0035
      : Math.min(viewportSize.width, viewportSize.height) * 0.0048;
    const offsetX = viewportSize.width / 2 + (isMobile ? 0 : -viewportSize.width * 0.04);
    const offsetY = viewportSize.height / 2 + (isMobile ? 0 : viewportSize.height * 0.02);

    for (let i = 0; i <= steps; i++) {
      const t = 4.2 - (i / steps) * 5.0;
      const pt = goldenSpiral(t, pathScale);
      points.push(`${i === 0 ? 'M' : 'L'} ${pt.x + offsetX} ${pt.y + offsetY}`);
    }
    return points.join(' ');
  };

  return (
    <section ref={sectionRef} className="golden-spiral-section" id="spiral">
      {/* Background Header Badge & Controls */}
      <div className="golden-spiral-header">
        <div className="golden-header-pill">
          {layoutMode === 'scurve' ? <Activity size={14} /> : (isGridAligned ? <Grid size={14} /> : <Compass size={14} />)}
          <span>
            {layoutMode === 'scurve' ? "S-CURVE WAVE FLOW" : (isGridAligned ? "COLLECTION ALIGNED" : "GOLDEN SPIRAL REVERSE FLOW")}
          </span>
        </div>
        <h2 className="golden-section-title">
          {layoutMode === 'scurve' ? "CONTINUOUS S-WAVE TRAJECTORY" : (isGridAligned ? "COLLECTION ALIGNED" : "GOLDEN RATIO SPATIAL TRAJECTORY")}
        </h2>
        <p className="golden-section-sub">
          {layoutMode === 'scurve'
            ? "Cards flowing along the continuous S-Curve wave trajectory."
            : (isGridAligned ? "All images settled symmetrically in front." : "Scroll to advance images softly through the Golden Spiral motion path.")}
        </p>

        <div className="scurve-layout-toggles" style={{ marginTop: '10px' }}>
          <button
            className={`scurve-toggle-btn ${layoutMode === 'scurve' ? 'active' : ''}`}
            onClick={() => setLayoutMode('scurve')}
          >
            <Activity size={13} /> S-CURVE WAVE
          </button>
          <button
            className={`scurve-toggle-btn ${layoutMode === 'spiral' ? 'active' : ''}`}
            onClick={() => setLayoutMode('spiral')}
          >
            <Compass size={13} /> GOLDEN SPIRAL
          </button>
        </div>
      </div>

      {/* Subtle Vector Guide Line */}
      <svg className="golden-spiral-guide-svg" viewBox={`0 0 ${viewportSize.width} ${viewportSize.height}`}>
        <defs>
          <marker
            id="blueArrowhead"
            markerWidth="8"
            markerHeight="8"
            refX="4"
            refY="4"
            orient="auto"
          >
            <polygon points="0 0, 8 4, 0 8" fill="#3B82F6" />
          </marker>
        </defs>
        <path
          d={layoutMode === 'scurve' ? generateSCurvePath() : generateSpiralPath()}
          stroke={layoutMode === 'scurve' ? "#3B82F6" : "rgba(212, 175, 55, 0.25)"}
          strokeWidth={layoutMode === 'scurve' ? "2.5" : "1.8"}
          strokeDasharray={layoutMode === 'scurve' ? "8 6" : "5 7"}
          markerEnd={layoutMode === 'scurve' ? "url(#blueArrowhead)" : undefined}
          fill="none"
        />
      </svg>

      {/* 3D Stage Container */}
      <div
        className="golden-spiral-stage"
        style={{
          perspective: '1600px',
          transformStyle: 'preserve-3d'
        }}
      >
        {FLOW_ITEMS.map((item, index) => (
          <GoldenSpiralCard
            key={item.id}
            ref={(el) => (cardRefs.current[index] = el)}
            item={item}
            onSelect={(selected) => setSelectedItem(selected)}
          />
        ))}
      </div>

      {/* Item Details Overlay Modal */}
      {selectedItem && (
        <div className="project-modal-backdrop" onClick={() => setSelectedItem(null)}>
          <div className="project-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setSelectedItem(null)}>
              <X size={20} />
            </button>
            <div className="modal-content-grid">
              <div className="modal-media-wrap">
                <img src={selectedItem.image} alt={selectedItem.title} className="modal-hero-image" />
              </div>
              <div className="modal-info-panel">
                <span className="modal-category-tag">{selectedItem.category}</span>
                <h2 className="modal-project-title">{selectedItem.title}</h2>
                <p className="modal-description">{selectedItem.description}</p>
                <button className="modal-cta-btn" onClick={() => setSelectedItem(null)}>
                  EXPLORE PRACTICE <Sparkles size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
