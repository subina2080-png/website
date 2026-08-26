import React from 'react';

export default function HeroTypography({ trackRef }) {
  return (
    <div className="hero-typography-container" aria-hidden="true">
      <div 
        ref={trackRef}
        className="hero-typography-track"
      >
        <h1 className="hero-big-title">
          <span>DESIGN</span>
          <span className="hero-title-accent">MOTION</span>
        </h1>
      </div>

      {/* Intro descriptive text fixed bottom-left */}
      <div className="hero-intro-box">
        <p className="hero-intro-text">
          Concepts, explorations, and interface experiments shared openly as part of our creative process.
        </p>
        <span className="hero-coord">47.3769° N, 8.5417° E</span>
      </div>
    </div>
  );
}
