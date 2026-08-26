import React, { forwardRef } from 'react';
import { Eye, Sparkles, Layers } from 'lucide-react';

const GoldenSpiralCard = forwardRef(({ item, onSelect }, ref) => {
  return (
    <div 
      ref={ref}
      className="golden-spiral-card paper-design-card"
      onClick={() => onSelect(item)}
    >
      <article className="golden-card-inner paper-card-surface">
        {/* Soft Tactile Paper Grain Overlay */}
        <div className="paper-grain-texture" aria-hidden="true" />
        
        {/* Category Header Bar */}
        <div className="golden-card-badge-bar">
          <span className="golden-category-pill paper-pill">{item.category}</span>
          <span className="golden-focal-indicator paper-focal-tag">
            <Sparkles size={12} /> <span className="tag-text">PREVIEW</span>
          </span>
        </div>

        {/* High Focus Main Image Frame */}
        <div className="golden-card-image-wrap paper-image-frame">
          <img 
            src={item.image} 
            alt={item.title} 
            loading="lazy" 
            decoding="async"
            className="golden-card-img main-content-focused"
          />
          <div className="golden-card-overlay paper-shadow-overlay" />
        </div>

        {/* Tactile Paper Footer Details */}
        <div className="golden-card-footer paper-footer">
          <h3 className="golden-card-title paper-title">{item.title}</h3>
          <p className="golden-card-subtitle paper-subtitle">{item.subtitle}</p>
        </div>

        {/* Hover / Action Badge */}
        <div className="golden-card-action paper-action-btn">
          <Eye size={16} />
        </div>
      </article>
    </div>
  );
});

export default GoldenSpiralCard;
