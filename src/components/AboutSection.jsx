import React from 'react';
import { SUBINA_PROFILE, TESTIMONIALS } from '../data/yogaData';
import { User, Award, MapPin, CheckCircle, Star, Quote } from 'lucide-react';

export default function AboutSection() {
  return (
    <section id="about" className="section" style={{ background: '#FFFFFF' }}>
      <div className="container">
        <div className="grid-2" style={{ alignItems: 'center', gap: '3.5rem', marginBottom: '5.5rem' }}>
          
          <div className="skeuo-card" style={{ padding: '0.8rem', position: 'relative' }}>
            <img 
              src={SUBINA_PROFILE.avatar} 
              alt={SUBINA_PROFILE.name}
              loading="lazy"
              decoding="async"
              style={{ width: '100%', height: '480px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }}
            />
            <div 
              style={{
                position: 'absolute',
                bottom: '1.8rem',
                left: '1.8rem',
                right: '1.8rem',
                background: 'rgba(255, 255, 255, 0.94)',
                backdropFilter: 'blur(12px)',
                padding: '1.2rem 1.6rem',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--skeuo-shadow-card)'
              }}
            >
              <h4 style={{ fontSize: '1.25rem', color: 'var(--color-sage-900)', margin: 0 }}>{SUBINA_PROFILE.name}</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-terracotta-600)', fontWeight: 700, margin: '0.2rem 0 0.5rem 0' }}>{SUBINA_PROFILE.title}</p>
              <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <MapPin size={14} color="var(--color-sage-700)" /> {SUBINA_PROFILE.location}
              </div>
            </div>
          </div>

          <div>
            <div className="section-tag"><User size={16} /> Certified RYT-500 Instructor</div>
            <h2 style={{ fontSize: '2.6rem', marginBottom: '1.5rem', lineHeight: 1.2 }}>Dedicated to Mindful Living & Authentic Yoga Practice</h2>
            <p style={{ fontSize: '1.08rem', color: 'var(--color-text-muted)', marginBottom: '1.8rem', lineHeight: 1.7 }}>
              {SUBINA_PROFILE.bio}
            </p>

            <h4 style={{ fontSize: '1.15rem', color: 'var(--color-sage-900)', marginBottom: '1rem' }}>Certifications & Training:</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.8rem', marginBottom: '2.5rem' }}>
              {SUBINA_PROFILE.certifications.map((cert, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.92rem', color: 'var(--color-sage-900)', fontWeight: 600 }}>
                  <CheckCircle size={17} color="var(--color-sage-700)" /> {cert}
                </div>
              ))}
            </div>

            <div className="skeuo-inset" style={{ padding: '1.4rem 1.8rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <Award size={36} color="var(--color-terracotta-600)" />
              <div>
                <h4 style={{ fontSize: '1.1rem', color: 'var(--color-sage-900)', margin: 0 }}>RYT-500 Registered Yoga Teacher</h4>
                <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', margin: '0.2rem 0 0 0' }}>Accredited globally with 500+ hours of advanced training in Vinyasa, Pranayama & Somatics.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="section-title-wrap" style={{ marginBottom: '3rem' }}>
          <h3>Words from Practicing Students</h3>
          <p>Read experiences from students around the globe who practice with Subina.</p>
        </div>

        <div className="grid-2" style={{ maxWidth: '980px', margin: '0 auto' }}>
          {TESTIMONIALS.map((t) => (
            <div key={t.id} className="skeuo-card" style={{ padding: '2.2rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', gap: '0.2rem', marginBottom: '1rem' }}>
                {[...Array(t.stars)].map((_, i) => (
                  <Star key={i} size={16} fill="var(--color-gold-accent)" color="var(--color-gold-accent)" />
                ))}
              </div>

              <p style={{ fontSize: '1.05rem', fontStyle: 'italic', color: 'var(--color-sage-900)', marginBottom: '1.8rem', lineHeight: 1.65, flexGrow: 1 }}>
                "{t.text}"
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', paddingTop: '1.2rem', borderTop: '1px solid var(--color-sand-200)' }}>
                <img src={t.avatar} alt={t.name} style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} />
                <div>
                  <h4 style={{ fontSize: '1rem', color: 'var(--color-sage-900)', margin: 0 }}>{t.name}</h4>
                  <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
