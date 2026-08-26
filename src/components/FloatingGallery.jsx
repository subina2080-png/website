import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projects } from '../data/projects';
import { galleryConfig } from '../data/config';
import { calculateCard3DProps } from '../animations/galleryMath';
import { initSmoothScroll, destroySmoothScroll } from '../animations/smoothScroll';
import TrionnProjectCard from './TrionnProjectCard';
import HeroTypography from './HeroTypography';

gsap.registerPlugin(ScrollTrigger);

export default function FloatingGallery({ 
  onCardHover, 
  onCardLeave, 
  onSelectProject 
}) {
  const gallerySectionRef = useRef(null);
  const stageRef = useRef(null);
  const cardRefs = useRef([]);
  const typographyTrackRef = useRef(null);

  const [viewportSize, setViewportSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800
  });

  const isMobile = viewportSize.width < 768;

  // Window resize handler
  useEffect(() => {
    let timeoutId = null;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setViewportSize({
          width: window.innerWidth,
          height: window.innerHeight
        });
      }, 150);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  // Direct DOM matrix update loop for 60-120fps ultra-smooth performance
  useEffect(() => {
    const updateTransforms = (progress, velocity) => {
      const width = viewportSize.width;
      const height = viewportSize.height;

      // Apply parallax transform to background typography directly
      if (typographyTrackRef.current) {
        const translateX = -progress * 25;
        typographyTrackRef.current.style.transform = `translate3d(${translateX}%, 0, 0)`;
      }

      // Calculate dynamic skew derived from scroll velocity
      const skewX = gsap.utils.clamp(
        -galleryConfig.velocitySkewLimit, 
        galleryConfig.velocitySkewLimit, 
        (velocity || 0) * 0.03
      );
      if (stageRef.current) {
        stageRef.current.style.transform = `skewX(${skewX}deg)`;
      }

      // Update card transforms directly via DOM style mutation (0 React re-renders!)
      projects.forEach((project, index) => {
        const cardEl = cardRefs.current[index];
        if (!cardEl) return;

        const props = calculateCard3DProps(
          index,
          projects.length,
          progress,
          width,
          height,
          isMobile
        );

        const cardTransform = `translate3d(${props.x}px, ${props.y}px, ${props.z}px) rotateX(${props.rotateX}deg) rotateY(${props.rotateY}deg) rotateZ(${props.rotateZ}deg) scale(${props.scale})`;

        cardEl.style.transform = cardTransform;
        cardEl.style.zIndex = props.zIndex;
      });
    };

    const ctx = gsap.context(() => {
      // Smooth scroll setup
      initSmoothScroll((scroll, velocity) => {
        // Ticker update
      });

      // Pin gallery section for 3D scroll movement
      ScrollTrigger.create({
        trigger: gallerySectionRef.current,
        start: 'top top',
        end: 'bottom bottom',
        pin: true,
        scrub: galleryConfig.scrubDuration,
        onUpdate: (self) => {
          updateTransforms(self.progress, self.getVelocity() * 0.01);
        }
      });

      // Initial frame update
      updateTransforms(0, 0);
    }, gallerySectionRef);

    return () => {
      ctx.revert();
      destroySmoothScroll();
    };
  }, [viewportSize, isMobile]);

  return (
    <section 
      ref={gallerySectionRef} 
      className="gallery-section" 
      id="gallery"
    >
      {/* Background Typography Layer with Parallax Scrub */}
      <HeroTypography trackRef={typographyTrackRef} />

      {/* 3D Perspective Stage Container */}
      <div 
        ref={stageRef} 
        className="gallery-stage"
        style={{
          perspective: isMobile ? '900px' : `${galleryConfig.perspective}px`,
          transformStyle: 'preserve-3d'
        }}
      >
        {projects.map((project, index) => (
          <TrionnProjectCard
            key={project.id}
            ref={(el) => (cardRefs.current[index] = el)}
            project={project}
            onCardHover={onCardHover}
            onCardLeave={onCardLeave}
            onSelectProject={onSelectProject}
          />
        ))}
      </div>
    </section>
  );
}
