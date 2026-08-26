import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, X, Grid, Layers, Compass } from 'lucide-react';
import { calculateOwmItemProps } from '../animations/owmStructureMath';

gsap.registerPlugin(ScrollTrigger);

const OWM_GALLERY_ITEMS = [
  // --- 'O' STRUCTURE (Circle / Lotus Ring) ---
  {
    id: 'owm-o-1',
    letter: 'O',
    letterName: 'Organic Flow',
    title: 'Mindful Sanctuary',
    category: 'Meditation Space',
    subtitle: 'Panoramic mountain vista meditation sanctuary',
    image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1200&q=80',
    description: 'A serene space built with natural timber and floor-to-ceiling glass, facilitating deep inward stillness and breathing alignment.'
  },
  {
    id: 'owm-o-2',
    letter: 'O',
    letterName: 'Organic Flow',
    title: 'Vibrational Sound Bath',
    category: 'Sound Healing',
    subtitle: '432Hz Quartz crystal & Tibetan singing bowls',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80',
    description: 'Harmonic solfeggio frequency sound bath designed to release tension, realign subtle energy channels, and calm the nervous system.'
  },
  {
    id: 'owm-o-3',
    letter: 'O',
    letterName: 'Organic Flow',
    title: 'Sacred Lotus Stillness',
    category: 'Dhyana Practice',
    subtitle: 'Cultivating unshakeable inner peace',
    image: 'https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&w=1200&q=80',
    description: 'Sitting in timeless awareness, witnessing thoughts arise and pass like gentle ripples on a quiet mountain lake.'
  },

  // --- 'W' STRUCTURE (Wellness Wave Peaks) ---
  {
    id: 'owm-w-1',
    letter: 'W',
    letterName: 'Wellness Wave',
    title: 'Asana Precision & Flow',
    category: 'Vinyasa Practice',
    subtitle: 'Sacred movement and biomechanical alignment',
    image: 'https://images.unsplash.com/photo-1510894347713-da3ed8f4f92d?auto=format&fit=crop&w=1200&q=80',
    description: 'Blending physical grace with breath synchronicity to foster resilience, flexibility, and steady presence.'
  },
  {
    id: 'owm-w-2',
    letter: 'W',
    letterName: 'Wellness Wave',
    title: 'Pranayama Breathwork',
    category: 'Vital Energy',
    subtitle: 'Nadi Shodhana & Anuloma Viloma practices',
    image: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=1200&q=80',
    description: 'Rhythmic breath control techniques designed to oxygenate the body, balance solar and lunar energy currents, and quiet the mind.'
  },
  {
    id: 'owm-w-3',
    letter: 'W',
    letterName: 'Wellness Wave',
    title: 'Sunrise Surya Flow',
    category: 'Morning Practice',
    subtitle: 'Surya Namaskar at dawn in Kathmandu Valley',
    image: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=1200&q=80',
    description: 'Awakening the physical and energetic bodies with sun salutations as golden light illuminates the surrounding hills.'
  },

  // --- 'M' STRUCTURE (Mindfulness Mountain Peaks) ---
  {
    id: 'owm-m-1',
    letter: 'M',
    letterName: 'Mindful Mountain',
    title: 'Himalayan High Meditation',
    category: 'Altitude Stillness',
    subtitle: 'Silent contemplation amidst Himalayan peaks',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80',
    description: 'Elevated practice sessions held in high-altitude mountain sanctuaries, connecting breath with the vast expanse of nature.'
  },
  {
    id: 'owm-m-2',
    letter: 'M',
    letterName: 'Mindful Mountain',
    title: 'Chakra Awakening',
    category: 'Kundalini Awakening',
    subtitle: 'Harmonizing root-to-crown energy centers',
    image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1200&q=80',
    description: 'Guided meditative visualization and mantra chanting to activate and align the subtle energetic spine.'
  },
  {
    id: 'owm-m-3',
    letter: 'M',
    letterName: 'Mindful Mountain',
    title: 'Sunset Yin Release',
    category: 'Restorative Yin',
    subtitle: 'Deep connective tissue release & surrender',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80',
    description: 'Holding restorative poses supported by bolsters to release long-stored physical tension and mental chatter.'
  }
];

export default function OwmGallery() {
  const sectionRef = useRef(null);
  const cardRefs = useRef([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [viewMode, setViewMode] = useState('owm'); // 'owm' | 'om_symbol' | 'grid'
  const [scrollProgress, setScrollProgress] = useState(0);

  const [viewportSize, setViewportSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800
  });

  const isMobile = viewportSize.width < 768;

  // Handle window resizing
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

  // Update card positions directly via DOM matrix mutation for maximum performance
  useEffect(() => {
    const updatePositions = (progress) => {
      setScrollProgress(progress);
      const width = viewportSize.width;
      const height = viewportSize.height;

      // Group items by letter to calculate subIndex
      const letterCounts = { O: 0, W: 0, M: 0 };
      const letterTotals = {
        O: OWM_GALLERY_ITEMS.filter(i => i.letter === 'O').length,
        W: OWM_GALLERY_ITEMS.filter(i => i.letter === 'W').length,
        M: OWM_GALLERY_ITEMS.filter(i => i.letter === 'M').length
      };

      OWM_GALLERY_ITEMS.forEach((item, index) => {
        const cardEl = cardRefs.current[index];
        if (!cardEl) return;

        const subIndex = letterCounts[item.letter]++;
        const totalInLetter = letterTotals[item.letter];

        const props = calculateOwmItemProps({
          index,
          totalItems: OWM_GALLERY_ITEMS.length,
          letter: item.letter,
          subIndex,
          totalInLetter,
          scrollProgress: progress,
          viewMode,
          viewportWidth: width,
          viewportHeight: height,
          isMobile
        });

        const transform = `translate3d(${props.x}px, ${props.y}px, ${props.z}px) rotateX(${props.rotateX}deg) rotateY(${props.rotateY}deg) rotateZ(${props.rotateZ}deg) scale(${props.scale})`;

        cardEl.style.transform = transform;
        cardEl.style.opacity = props.opacity;
        cardEl.style.zIndex = props.zIndex;
      });
    };

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=160%',
        pin: true,
        scrub: 1.5,
        onUpdate: (self) => {
          updatePositions(self.progress);
        }
      });

      // Initial layout update
      updatePositions(scrollProgress);
    }, sectionRef);

    return () => ctx.revert();
  }, [viewportSize, isMobile, viewMode]);

  return (
    <section ref={sectionRef} className="owm-gallery-section" id="owm-gallery">
      {/* Dynamic Background Ambiance */}
      <div className="owm-bg-ambient">
        <div className="owm-glow-orb orb-1"></div>
        <div className="owm-glow-orb orb-2"></div>
        <div className="owm-glow-orb orb-3"></div>
      </div>

      {/* Header Badge & Navigation Controls */}
      <div className="owm-gallery-header">
        <div className="owm-header-badge">
          <Sparkles size={14} className="sparkle-icon" />
          <span>SACRED GEOMETRY GALLERY</span>
        </div>
        <h2 className="owm-section-title">
          {viewMode === 'owm' && "O — W — M STRUCTURAL IMAGE SCROLL"}
          {viewMode === 'om_symbol' && "SACRED OM (ॐ) SYMBOL STRUCTURE"}
          {viewMode === 'grid' && "BALANCED GALLERY GRID"}
        </h2>
        <p className="owm-section-subtitle">
          {viewMode === 'owm' && "Images structured dynamically inside the letters Organic Flow (O), Wellness (W), and Mindfulness (M)."}
          {viewMode === 'om_symbol' && "Images positioned inside the sacred curves and bindu point of the Om (ॐ) symbol."}
          {viewMode === 'grid' && "All collection images arranged symmetrically."}
        </p>

        {/* View Mode Mode Toggles */}
        <div className="owm-mode-toggles">
          <button
            className={`mode-btn ${viewMode === 'owm' ? 'active' : ''}`}
            onClick={() => setViewMode('owm')}
          >
            <Compass size={14} />
            <span>O — W — M LETTERS</span>
          </button>

          <button
            className={`mode-btn ${viewMode === 'om_symbol' ? 'active' : ''}`}
            onClick={() => setViewMode('om_symbol')}
          >
            <Layers size={14} />
            <span>SACRED ॐ OM MASK</span>
          </button>

          <button
            className={`mode-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
          >
            <Grid size={14} />
            <span>GRID VIEW</span>
          </button>
        </div>
      </div>

      {/* Background SVG Structure Outlines */}
      <div className="owm-svg-background-layer">
        {viewMode === 'owm' && (
          <svg className="owm-letters-svg" viewBox="0 0 1200 400" preserveAspectRatio="xMidYMid meet">
            {/* Letter 'O' Circle */}
            <circle cx="200" cy="200" r="150" fill="none" stroke="rgba(212, 175, 55, 0.12)" strokeWidth="2.5" strokeDasharray="6 8" />
            <text x="200" y="215" textAnchor="middle" fill="rgba(212, 175, 55, 0.05)" fontSize="180" fontWeight="900" fontFamily="Playfair Display, serif">O</text>

            {/* Letter 'W' Path */}
            <path d="M 440 70 L 520 340 L 600 170 L 680 340 L 760 70" fill="none" stroke="rgba(212, 175, 55, 0.12)" strokeWidth="2.5" strokeDasharray="6 8" />
            <text x="600" y="215" textAnchor="middle" fill="rgba(212, 175, 55, 0.05)" fontSize="180" fontWeight="900" fontFamily="Playfair Display, serif">W</text>

            {/* Letter 'M' Path */}
            <path d="M 840 340 L 920 70 L 1000 230 L 1080 70 L 1160 340" fill="none" stroke="rgba(212, 175, 55, 0.12)" strokeWidth="2.5" strokeDasharray="6 8" />
            <text x="1000" y="215" textAnchor="middle" fill="rgba(212, 175, 55, 0.05)" fontSize="180" fontWeight="900" fontFamily="Playfair Display, serif">M</text>
          </svg>
        )}

        {viewMode === 'om_symbol' && (
          <div className="owm-om-symbol-bg">
            <span className="om-watermark">ॐ</span>
          </div>
        )}
      </div>

      {/* 3D OWM Stage Container */}
      <div
        className="owm-stage-3d"
        style={{
          perspective: '1600px',
          transformStyle: 'preserve-3d'
        }}
      >
        {OWM_GALLERY_ITEMS.map((item, index) => (
          <div
            key={item.id}
            ref={(el) => (cardRefs.current[index] = el)}
            className="owm-card-wrapper"
            onClick={() => setSelectedItem(item)}
          >
            <div className="owm-card-inner">
              <div className="owm-image-frame">
                <img src={item.image} alt={item.title} className="owm-card-img" />
                <div className="owm-card-overlay"></div>
                <div className="owm-card-badge">{item.letter}</div>
              </div>

              <div className="owm-card-meta">
                <span className="owm-card-category">{item.category}</span>
                <h3 className="owm-card-title">{item.title}</h3>
                <p className="owm-card-sub">{item.subtitle}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Overlay Modal */}
      {selectedItem && (
        <div className="owm-modal-backdrop" onClick={() => setSelectedItem(null)}>
          <div className="owm-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="owm-modal-close" onClick={() => setSelectedItem(null)}>
              <X size={20} />
            </button>
            <div className="owm-modal-grid">
              <div className="owm-modal-image-wrap">
                <img src={selectedItem.image} alt={selectedItem.title} className="owm-modal-img" />
                <div className="owm-modal-tag">{selectedItem.letterName} — Section '{selectedItem.letter}'</div>
              </div>
              <div className="owm-modal-info">
                <span className="owm-modal-category">{selectedItem.category}</span>
                <h2 className="owm-modal-title">{selectedItem.title}</h2>
                <h4 className="owm-modal-subtitle">{selectedItem.subtitle}</h4>
                <p className="owm-modal-desc">{selectedItem.description}</p>

                <div className="owm-modal-actions">
                  <button className="owm-cta-button" onClick={() => setSelectedItem(null)}>
                    EXPLORE PRACTICE <Sparkles size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
