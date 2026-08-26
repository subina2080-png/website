import React, { useState, useEffect, useRef } from 'react';
import { Compass, BookOpen, HeartPulse, Sparkles, ShieldCheck, Calendar, User, Mail, Menu, X, Bookmark, Volume2, Music } from 'lucide-react';

export default function Navbar({ activeSection, setActiveSection, bookmarkedCount, toggleSoundModal }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // iPhone Volume Scrubber / Page Scroll Progress Calculator
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'hero', label: 'Home', icon: Compass },
    { id: 'blogs', label: 'Journal', icon: BookOpen },
    { id: 'breathing', label: 'Breathwork', icon: HeartPulse },
    { id: 'poses', label: 'Asana', icon: Sparkles },
    { id: 'subscription', label: 'Membership', icon: ShieldCheck },
    { id: 'schedule', label: 'Classes', icon: Calendar },
    { id: 'about', label: 'About', icon: User },
    { id: 'baba-subina', label: 'Baba', icon: Music },
    { id: 'contact', label: 'Contact', icon: Mail }
  ];

  const scrollTo = (id) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -24;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const mobileTabs = [
    { id: 'hero', label: 'Home', icon: Compass, dotBadge: true },
    { id: 'blogs', label: 'Journal', icon: BookOpen },
    { id: 'breathing', label: 'Breathwork', icon: HeartPulse, numBadge: 3 },
    { id: 'poses', label: 'Asana', icon: Sparkles },
    { id: 'contact', label: 'Contact', icon: Mail }
  ];

  const [hoveredTabIdx, setHoveredTabIdx] = useState(null);

  const activeTabIdx = mobileTabs.findIndex(t => t.id === activeSection);
  const currentTabIdx = activeTabIdx >= 0 ? activeTabIdx : 0;
  
  const activeIdxToUse = hoveredTabIdx !== null ? hoveredTabIdx : currentTabIdx;
  const pillLeftPercent = activeIdxToUse * (100 / mobileTabs.length);
  const pillWidthPercent = 100 / mobileTabs.length;

  const [isWobbling, setIsWobbling] = useState(false);
  const [prevTabIdx, setPrevTabIdx] = useState(currentTabIdx);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffsetPercent, setDragOffsetPercent] = useState(null);
  const barRef = useRef(null);

  useEffect(() => {
    if (activeIdxToUse !== prevTabIdx) {
      setIsWobbling(true);
      setPrevTabIdx(activeIdxToUse);
      const timer = setTimeout(() => setIsWobbling(false), 620);
      return () => clearTimeout(timer);
    }
  }, [activeIdxToUse, prevTabIdx]);

  const updateDragPosition = (e) => {
    if (!barRef.current) return;
    const rect = barRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = Math.min(100, Math.max(0, (x / rect.width) * 100));
    setDragOffsetPercent(percent);
  };

  const handlePointerDown = (e) => {
    setIsDragging(true);
    updateDragPosition(e);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    updateDragPosition(e);
  };

  const handlePointerUp = (e) => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragOffsetPercent !== null) {
      const tabWidth = 100 / mobileTabs.length;
      const targetIdx = Math.min(mobileTabs.length - 1, Math.max(0, Math.floor(dragOffsetPercent / tabWidth)));
      scrollTo(mobileTabs[targetIdx].id);
    }
    setDragOffsetPercent(null);
  };

  const displayLeftPercent = isDragging && dragOffsetPercent !== null
    ? Math.min(100 - pillWidthPercent, Math.max(0, dragOffsetPercent - (pillWidthPercent / 2)))
    : pillLeftPercent;

  return (
    <>
      {/* Top Floating Nav Wrapper for Desktop */}
      <div className="grey-glass-nav-wrapper desktop-top-nav-only">

        {/* Sleek Liquid Glass Capsule Bar */}
        <div className="grey-glass-bar">

          {/* Brand Logo Badge (Left) */}
          <div
            onClick={() => scrollTo('hero')}
            className="grey-brand-badge"
            title="Subina Aacharya Sanctuary"
          >
            <div className="grey-brand-icon">
              🧘‍♀️
            </div>
            <span style={{ color: 'var(--color-sage-900)', fontWeight: 700, fontSize: '0.88rem', letterSpacing: '-0.01em' }}>
              Subina
            </span>
          </div>

          {/* Desktop Nav Links (Balanced Center Navigation) */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }} className="desktop-grey-nav">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => scrollTo(link.id)}
                  className={`grey-nav-item ${isActive ? 'active' : ''}`}
                  title={link.label}
                >
                  <Icon size={16} />
                  <span className="nav-label">{link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Action Triggers (Right) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>

            {/* Ambient Audio Generator Button */}
            <button
              onClick={toggleSoundModal}
              className="grey-nav-item grey-action-item"
              title="Ambient Zen Audio Generator"
            >
              <Volume2 size={16} color="var(--color-terracotta-600)" />
              <span className="nav-label">Zen Audio</span>
            </button>

            {/* Bookmarks Counter Badge */}
            <button
              onClick={() => scrollTo('blogs')}
              className="grey-nav-item grey-action-item"
              title="Saved Bookmarks"
              style={{ position: 'relative' }}
            >
              <Bookmark size={16} color="var(--color-sage-900)" />
              <span className="nav-label">Saved ({bookmarkedCount})</span>
              {bookmarkedCount > 0 && !activeSection.includes('blogs') && (
                <span
                  style={{
                    position: 'absolute',
                    top: '0px',
                    right: '0px',
                    background: 'linear-gradient(180deg, #F07844 0%, #E2642F 100%)',
                    color: '#FFFFFF',
                    fontSize: '0.6rem',
                    fontWeight: 800,
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                    border: '1px solid #FFFFFF'
                  }}
                >
                  {bookmarkedCount}
                </span>
              )}
            </button>

            {/* Mobile Drawer Trigger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mobile-grey-toggle"
              style={{
                padding: '0.5rem',
                color: '#FFFFFF',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

        </div>

        {/* Mobile Drawer Overlay */}
        {mobileMenuOpen && (
          <div
            style={{
              position: 'absolute',
              top: 'calc(100% + 0.5rem)',
              left: 0,
              right: 0,
              background: 'linear-gradient(135deg, rgba(28, 30, 34, 0.96) 0%, rgba(12, 14, 17, 0.98) 100%)',
              backdropFilter: 'blur(34px)',
              WebkitBackdropFilter: 'blur(34px)',
              border: '1.5px solid rgba(255, 255, 255, 0.18)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.1rem',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.5)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.55rem',
              animation: 'fadeIn 0.2s ease-out'
            }}
          >
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => scrollTo(link.id)}
                  className={`grey-nav-item ${isActive ? 'active' : ''}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.7rem 1rem',
                    fontSize: '0.95rem',
                    textAlign: 'left',
                    width: '100%',
                    color: '#FFFFFF',
                    background: isActive ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                    borderRadius: 'var(--radius-full)',
                    border: isActive ? '1px solid rgba(255, 255, 255, 0.25)' : '1px solid transparent'
                  }}
                >
                  <Icon size={19} color={isActive ? '#FFFFFF' : 'rgba(255,255,255,0.7)'} />
                  <span style={{ fontWeight: isActive ? 700 : 500, color: isActive ? '#FFFFFF' : 'rgba(255,255,255,0.85)' }}>{link.label}</span>
                </button>
              );
            })}

            <div style={{ height: '1px', background: 'rgba(255,255,255,0.15)', margin: '0.35rem 0' }} />

            <button
              onClick={() => { toggleSoundModal(); setMobileMenuOpen(false); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.7rem 1rem',
                fontSize: '0.95rem',
                color: '#FFFFFF',
                width: '100%'
              }}
            >
              <Volume2 size={19} color="var(--color-terracotta-400)" />
              <span>Zen Audio Generator</span>
            </button>
          </div>
        )}
      </div>

      {/* iPhone WhatsApp-Style Dark Mode Bottom Mobile Navigation Bar */}
      <div 
        ref={barRef}
        className={`whatsapp-ios-bottom-bar mobile-bottom-bar-only ${isDragging ? 'is-dragging-active' : ''}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onMouseLeave={() => setHoveredTabIdx(null)}
      >
        
        {/* Snug-Fit Light-Refractive Glass Selection Pill */}
        <div
          className={`whatsapp-liquid-holo-pill ${isWobbling ? 'liquid-wobbling' : ''} ${isDragging ? 'liquid-dragging' : ''}`}
          style={{
            left: `calc(${displayLeftPercent}% + 3px)`,
            width: `calc(${pillWidthPercent}% - 6px)`
          }}
        />

        {mobileTabs.map((tab, idx) => {
          const Icon = tab.icon;
          const isActive = currentTabIdx === idx;
          const isHighlighted = activeIdxToUse === idx;
          return (
            <button
              key={tab.id}
              onClick={() => scrollTo(tab.id)}
              onMouseEnter={() => setHoveredTabIdx(idx)}
              className={`whatsapp-tab-item ${isHighlighted ? 'active' : ''}`}
              title={tab.label}
            >
              {tab.dotBadge && <div className="whatsapp-green-dot" />}
              {tab.numBadge && <div className="whatsapp-green-num-badge">{tab.numBadge}</div>}
              <Icon size={22} color={isHighlighted ? "#FFFFFF" : "rgba(255,255,255,0.7)"} strokeWidth={isHighlighted ? 2.5 : 1.8} />
              <span className="whatsapp-tab-label" style={{ color: isHighlighted ? "#FFFFFF" : "rgba(255,255,255,0.75)", fontWeight: isHighlighted ? 800 : 500 }}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      <style>{`
        @media (min-width: 1081px) {
          .mobile-bottom-bar-only { display: none !important; }
        }
        @media (max-width: 1080px) {
          .desktop-top-nav-only { display: none !important; }
          .mobile-bottom-bar-only { display: flex !important; }
        }
      `}</style>
    </>
  );
}
