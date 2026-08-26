import React, { useState } from 'react';
import { X, ShieldCheck, Sparkles, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function EarlyAccessModal({ tier, onClose, showToast }) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    showToast(`You're on the waitlist for the ${tier.name}!`);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px', padding: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={22} color="var(--color-terracotta-600)" />
            <h3 style={{ fontSize: '1.4rem' }}>{tier.name} Early Access</h3>
          </div>
          <button onClick={onClose} style={{ color: 'var(--color-text-muted)' }}><X size={20} /></button>
        </div>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--color-sage-100)', color: 'var(--color-sage-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.2rem auto' }}>
              <Check size={32} />
            </div>
            <h4 style={{ fontSize: '1.4rem', marginBottom: '0.6rem' }}>You are on the VIP Waitlist!</h4>
            <p style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)', marginBottom: '1.8rem', lineHeight: 1.6 }}>
              Thank you {name || 'yogi'}! As soon as subscriptions launch, you will receive a 20% early-bird discount directly at <strong>{email}</strong>.
            </p>
            <button onClick={onClose} className="btn-skeuo-primary" style={{ width: '100%' }}>Close & Continue Exploring</button>
          </div>
        ) : (
          <div>
            <p style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              Subscriptions are launching soon! Reserve your spot now for founding member pricing and exclusive bonus meditation downloads.
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--color-sage-900)' }}>Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Subina Aacharya"
                  style={{
                    width: '100%',
                    padding: '0.85rem 1.2rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-sand-300)',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--color-sage-900)' }}>Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  style={{
                    width: '100%',
                    padding: '0.85rem 1.2rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-sand-300)',
                    outline: 'none'
                  }}
                />
              </div>

              <button type="submit" className="btn-skeuo-primary" style={{ width: '100%', padding: '0.95rem', marginTop: '0.5rem' }}>
                Join Membership Waitlist <Sparkles size={16} />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
