import React, { forwardRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';

const TrionnProjectCard = forwardRef(({ 
  project, 
  onCardHover, 
  onCardLeave,
  onSelectProject 
}, ref) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (onCardHover) onCardHover(project);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (onCardLeave) onCardLeave();
  };

  return (
    <div 
      ref={ref}
      className={`project-card-wrapper paper-design-card ${isHovered ? 'hovered' : ''}`}
      style={{
        willChange: 'transform'
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => onSelectProject(project)}
    >
      <article 
        className="project-card-inner paper-card-surface"
        style={{
          aspectRatio: project.aspectRatio || '16 / 10',
          backgroundColor: project.accentColor || '#dedede'
        }}
      >
        <div className="paper-grain-texture" aria-hidden="true" />

        {/* Card Header Metadata */}
        <div className="card-top-bar">
          <span className="card-category-badge paper-pill">{project.category}</span>
          <span className="card-year-stamp">{project.year}</span>
        </div>

        {/* Project Editorial Image Frame */}
        <div className="card-image-container paper-image-frame">
          <img 
            src={project.image} 
            alt={project.title}
            loading="lazy"
            decoding="async"
            className="card-media main-content-focused"
          />
          <div className="card-image-overlay paper-shadow-overlay" />
        </div>

        {/* Card Footer Title & Editorial Typography */}
        <div className="card-bottom-info paper-footer">
          <div className="card-title-group">
            <h3 className="card-title paper-title">{project.title}</h3>
            <p className="card-editorial-tag paper-subtitle">{project.editorialTag}</p>
          </div>
          <div className="card-arrow-pill paper-action-btn">
            <ArrowUpRight size={18} className="card-arrow-icon" />
          </div>
        </div>

        {/* Hover metadata reveal */}
        <div className="card-hover-reveal">
          <span className="hover-client">CLIENT: {project.client}</span>
          <span className="hover-action">VIEW PROJECT →</span>
        </div>
      </article>
    </div>
  );
});

export default TrionnProjectCard;
