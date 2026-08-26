import React, { useState } from 'react';
import { UPCOMING_SCHEDULE } from '../data/yogaData';
import { Calendar, Clock, Video, Users, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ScheduleSection({ showToast }) {
  const [reservedIds, setReservedIds] = useState([]);

  const handleReserveSpot = (id, title) => {
    if (reservedIds.includes(id)) {
      showToast("Spot already reserved for this class!");
      return;
    }

    setReservedIds([...reservedIds, id]);
    confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
    showToast(`Spot reserved for ${title}! Zoom link sent.`);
  };

  return (
    <section id="schedule" className="section" style={{ background: '#FFFFFF' }}>
      <div className="container">
        <div className="section-title-wrap">
          <div className="section-tag"><Calendar size={16} /> Live Zoom Gatherings</div>
          <h2>Upcoming Workshops & Live Classes</h2>
          <p>Practice live in real-time with Subina and our global yoga sangha from anywhere in the world.</p>
        </div>

        <div className="grid-2" style={{ maxWidth: '980px', margin: '0 auto' }}>
          {UPCOMING_SCHEDULE.map((item) => {
            const isReserved = reservedIds.includes(item.id);
            return (
              <div key={item.id} className="skeuo-card" style={{ padding: '2.2rem', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <span className="pill-skeuo" style={{ padding: '0.2rem 0.8rem', fontSize: '0.75rem', fontWeight: 700 }}>{item.type}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-terracotta-600)', fontWeight: 800 }}>{item.level}</span>
                </div>

                <h3 style={{ fontSize: '1.45rem', marginBottom: '1.2rem', color: 'var(--color-sage-900)' }}>{item.title}</h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.8rem', fontSize: '0.92rem', color: 'var(--color-text-muted)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Calendar size={16} color="var(--color-sage-700)" /> {item.date}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Clock size={16} color="var(--color-sage-700)" /> {item.time}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Video size={16} color="var(--color-sage-700)" /> Live HD Zoom Stream</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Users size={16} color="var(--color-sage-700)" /> {item.spotsLeft - (isReserved ? 1 : 0)} Spots Remaining</div>
                </div>

                <button
                  onClick={() => handleReserveSpot(item.id, item.title)}
                  className={isReserved ? "btn-skeuo-secondary" : "btn-skeuo-primary"}
                  style={{ marginTop: 'auto', width: '100%' }}
                >
                  {isReserved ? <><CheckCircle2 size={18} color="green" /> Spot Reserved!</> : "Reserve Free Spot"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
