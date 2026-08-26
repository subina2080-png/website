import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { motionPortfolioItems } from '../data/designInMotionData';
import '../styles/DesignInMotion.css';

// Register GSAP Plugin
gsap.registerPlugin(ScrollTrigger);

export default function DesignInMotion({ items = motionPortfolioItems }) {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const watermarkRef = useRef(null);
  const cardRefs = useRef([]);
  cardRefs.current = [];

  const addToCardRefs = (el) => {
    if (el && !cardRefs.current.includes(el)) {
      cardRefs.current.push(el);
    }
  };

  useGSAP(
    () => {
      const cards = cardRefs.current;
      if (!cards.length || !sectionRef.current) return;

      const isMobile = window.innerWidth <= 768;

      if (isMobile) {
        cards.forEach((card) => {
          gsap.set(card, {
            rotateY: 0,
            rotateX: 0,
            rotateZ: 0,
            z: 0,
            x: 0,
            y: 0,
            clearProps: 'transform',
          });
        });
        return;
      }

      const totalCards = cards.length;
      const radius = window.innerWidth > 900 ? 550 : 400;

      // 1. Initial Setup: Position cards into 3D cylindrical wall
      cards.forEach((card, i) => {
        const angleDeg = (i / totalCards) * 360;
        gsap.set(card, {
          rotateY: angleDeg,
          z: radius,
          x: 0,
          y: 0,
          rotateX: 0,
          rotateZ: 0,
          transformOrigin: '50% 50% 0px',
        });
      });

      // 2. Create GSAP ScrollTrigger Timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=220%',
          scrub: 1.2,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Phase 1: Rotate the 3D cylinder wall on scroll
      tl.to(
        cards,
        {
          rotateY: '+=120',
          duration: 1.5,
          ease: 'power1.inOut',
          stagger: 0.05,
        },
        0
      );

      // Subtly scale up background watermark text
      if (watermarkRef.current) {
        tl.fromTo(
          watermarkRef.current,
          { scale: 0.85, opacity: 0.05 },
          { scale: 1.15, opacity: 0.12, ease: 'power1.inOut', duration: 3 },
          0
        );
      }

      // Phase 2: Break 3D carousel apart -> flatten to 2D grid
      cards.forEach((card, i) => {
        tl.to(
          card,
          {
            rotateY: 0,
            rotateX: 0,
            rotateZ: 0,
            z: 0,
            x: 0,
            y: 0,
            duration: 2,
            ease: 'power3.out',
          },
          1.2 + i * 0.1
        );
      });
    },
    { scope: sectionRef, dependencies: [items] }
  );

  return (
    <section ref={sectionRef} className="design-in-motion-section">
      {/* Background Large Typography */}
      <div ref={watermarkRef} className="dim-bg-watermark">
        <span className="dim-watermark-text">DESIGN IN MOTION</span>
      </div>

      {/* Header Tagline */}
      <div className="dim-section-header">
        <span className="dim-tag">3D to 2D Gallery</span>
        <h2 className="dim-title">Design In Motion</h2>
      </div>

      {/* 3D Stage & Card Grid Container */}
      <div ref={stageRef} className="dim-stage">
        <div className="dim-grid">
          {items.map((item) => (
            <div
              key={item.id}
              ref={addToCardRefs}
              className="dim-card"
              style={{ aspectRatio: item.aspectRatio || '4/5' }}
            >
              <div className="dim-card-inner">
                <img
                  src={item.imageURL}
                  alt={item.title}
                  className="dim-card-image"
                  loading="lazy"
                />
                <div className="dim-card-overlay">
                  <span className="dim-card-category">{item.category}</span>
                  <h3 className="dim-card-title">{item.title}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
