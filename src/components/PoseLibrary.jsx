import React, { useState } from 'react';
import { YOGA_POSES } from '../data/yogaData';
import { Sparkles, Info, X } from 'lucide-react';

export default function PoseLibrary() {
  const [activeDiff, setActiveDiff] = useState('All');
  const [selectedPose, setSelectedPose] = useState(null);

  const levels = ['All', 'Beginner', 'Intermediate'];
  const filteredPoses = YOGA_POSES.filter(p => activeDiff === 'All' || p.difficulty === activeDiff);

  return (
    <section id="poses" className="section" style={{ background: '#FFFFFF' }}>
      <div className="container">
        <div className="section-title-wrap">
          <div className="section-tag"><Sparkles size={16} /> Asana Sanctuary</div>
          <h2>Yoga Pose & Alignment Guide</h2>
          <p>Explore essential physical postures (Asanas) with Sanskrit terminology, target benefits, and alignment breakdowns.</p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.8rem', marginBottom: '3rem' }}>
          {levels.map(lvl => (
            <button key={lvl} onClick={() => setActiveDiff(lvl)} className={`pill-skeuo ${activeDiff === lvl ? 'active' : ''}`}>
              {lvl} Level
            </button>
          ))}
        </div>

        <div className="grid-2" style={{ maxWidth: '1020px', margin: '0 auto' }}>
          {filteredPoses.map((pose) => (
            <div
              key={pose.id}
              onClick={() => setSelectedPose(pose)}
              className="skeuo-card"
              style={{ overflow: 'hidden', display: 'grid', gridTemplateColumns: '150px 1fr', cursor: 'pointer' }}
            >
              <img src={pose.image} alt={pose.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ padding: '1.4rem 1.6rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-sage-700)', textTransform: 'uppercase' }}>{pose.category}</span>
                  <span className="pill-skeuo" style={{ padding: '0.15rem 0.6rem', fontSize: '0.7rem', fontWeight: 700 }}>{pose.difficulty}</span>
                </div>

                <h3 style={{ fontSize: '1.35rem', marginBottom: '0.2rem', color: 'var(--color-sage-900)' }}>{pose.name}</h3>
                <div style={{ fontSize: '0.88rem', fontStyle: 'italic', color: 'var(--color-terracotta-600)', marginBottom: '0.6rem', fontWeight: 600 }}>{pose.sanskrit}</div>
                <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.5 }}>{pose.benefits}</p>

                <div style={{ marginTop: '0.9rem', fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-sage-700)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Info size={15} /> View Alignment Steps
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedPose && (
          <div className="modal-overlay" onClick={() => setSelectedPose(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '620px', padding: '2.2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.2rem' }}>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-sage-700)', fontWeight: 800, textTransform: 'uppercase' }}>{selectedPose.category} • {selectedPose.difficulty}</span>
                  <h3 style={{ fontSize: '1.9rem', marginTop: '0.2rem', color: 'var(--color-sage-900)' }}>{selectedPose.name}</h3>
                  <div style={{ fontSize: '1.05rem', fontStyle: 'italic', color: 'var(--color-terracotta-600)', fontWeight: 600 }}>{selectedPose.sanskrit}</div>
                </div>
                <button onClick={() => setSelectedPose(null)} className="btn-skeuo-secondary" style={{ width: '36px', height: '36px', borderRadius: '50%', padding: 0 }}><X size={20} /></button>
              </div>

              <div className="skeuo-card" style={{ padding: '0.5rem', marginBottom: '1.8rem' }}>
                <img src={selectedPose.image} alt={selectedPose.name} style={{ width: '100%', height: '260px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }} />
              </div>

              <div className="skeuo-inset" style={{ padding: '1.2rem', marginBottom: '1.8rem' }}>
                <h4 style={{ fontSize: '1rem', marginBottom: '0.4rem', color: 'var(--color-sage-900)' }}>Key Benefits:</h4>
                <p style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)' }}>{selectedPose.benefits}</p>
              </div>

              <h4 style={{ fontSize: '1.15rem', marginBottom: '0.9rem', color: 'var(--color-sage-900)' }}>Step-by-Step Instructions:</h4>
              <ol style={{ paddingLeft: '1.3rem', fontSize: '0.98rem', color: 'var(--color-text-main)', display: 'flex', flexDirection: 'column', gap: '0.7rem', lineHeight: 1.6 }}>
                {selectedPose.instructions.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ol>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
