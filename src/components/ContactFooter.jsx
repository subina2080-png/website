import React, { useState } from 'react';
import { Mail, Send, Heart, Instagram, Youtube, Facebook, MapPin, Phone, Globe } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ContactFooter({ showToast }) {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: 'General Query', message: '' });

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.8 } });
    showToast("Subscribed! Welcome to Subina's weekly Mindful Letters.");
    setNewsletterEmail('');
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.7 } });
    showToast("Thank you! Your message has been sent to Subina.");
    setContactForm({ name: '', email: '', subject: 'General Query', message: '' });
  };

  return (
    <footer id="contact" style={{ background: '#070908', color: '#FFFFFF', paddingTop: '5.5rem', paddingBottom: '3rem', position: 'relative' }}>
      <div className="container">

        <div
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: 'var(--radius-lg)',
            padding: '3rem 2.5rem',
            marginBottom: '5rem',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '3rem',
            alignItems: 'center'
          }}
          className="grid-2"
        >
          <div>
            <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-terracotta-400)', fontWeight: 800 }}>Weekly Zen Letters</span>
            <h3 style={{ fontSize: '2.1rem', color: '#FFFFFF', margin: '0.4rem 0 0.8rem 0' }}>Join Subina’s Mindful Community</h3>
            <p style={{ fontSize: '1rem', color: '#C8D4C8', lineHeight: 1.6 }}>
              Receive weekly guided breathwork exercises, yoga philosophy insights, and early access to workshops directly in your inbox.
            </p>
          </div>

          <form onSubmit={handleNewsletterSubmit} style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            <input
              type="email"
              placeholder="Enter your email address..."
              required
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              style={{
                flexGrow: 1,
                padding: '0.95rem 1.4rem',
                borderRadius: 'var(--radius-full)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(0, 0, 0, 0.25)',
                color: '#FFFFFF',
                outline: 'none',
                fontSize: '0.95rem'
              }}
            />
            <button type="submit" className="btn-skeuo-primary" style={{ padding: '0.95rem 1.8rem', background: 'linear-gradient(180deg, #F07844 0%, #E2642F 100%)' }}>
              Subscribe Free
            </button>
          </form>
        </div>

        <div className="grid-2" style={{ gap: '4rem', marginBottom: '4.5rem' }}>
          <div>
            <h2 style={{ color: '#FFFFFF', fontSize: '2.4rem', marginBottom: '1.2rem' }}>Get in Touch with Subina</h2>
            <p style={{ color: '#C8D4C8', fontSize: '1.05rem', marginBottom: '2.2rem', lineHeight: 1.7 }}>
              Have questions about upcoming membership subscriptions, private 1-on-1 mentorship, or retreat bookings? Send a message below.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', color: '#E4ECE4' }}>
                <Globe color="var(--color-terracotta-400)" size={20} />
                <a href="https://subinaacharya.com.np" target="_blank" rel="noopener noreferrer" style={{ color: '#FFFFFF', textDecoration: 'none', fontWeight: 700 }}>
                  subinaacharya.com.np
                </a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', color: '#E4ECE4' }}>
                <Mail color="var(--color-terracotta-400)" size={20} />
                <span>subina.yoga.mindfulness@gmail.com</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', color: '#E4ECE4' }}>
                <MapPin color="var(--color-terracotta-400)" size={20} />
                <span>Kathmandu Valley, Nepal & Global Zoom Sanctuary</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              {[
                { icon: Instagram, href: "#", label: "Instagram" },
                { icon: Youtube, href: "#", label: "YouTube" },
                { icon: Facebook, href: "#", label: "Facebook" }
              ].map((s, i) => {
                const Icon = s.icon;
                return (
                  <a
                    key={i}
                    href={s.href}
                    title={s.label}
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>

          <form
            onSubmit={handleContactSubmit}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 'var(--radius-lg)',
              padding: '2.5rem'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#C8D4C8', marginBottom: '0.4rem', fontWeight: 600 }}>Your Full Name</label>
                <input
                  type="text"
                  required
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  placeholder="e.g. Subina Aacharya"
                  style={{
                    width: '100%',
                    padding: '0.85rem 1.2rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    background: 'rgba(0,0,0,0.2)',
                    color: '#FFFFFF',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#C8D4C8', marginBottom: '0.4rem', fontWeight: 600 }}>Email Address</label>
                <input
                  type="email"
                  required
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  placeholder="name@example.com"
                  style={{
                    width: '100%',
                    padding: '0.85rem 1.2rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    background: 'rgba(0,0,0,0.2)',
                    color: '#FFFFFF',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#C8D4C8', marginBottom: '0.4rem', fontWeight: 600 }}>Message</label>
                <textarea
                  required
                  rows={4}
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  placeholder="How can Subina assist you on your yoga journey?"
                  style={{
                    width: '100%',
                    padding: '0.85rem 1.2rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    background: 'rgba(0,0,0,0.2)',
                    color: '#FFFFFF',
                    outline: 'none',
                    resize: 'vertical'
                  }}
                />
              </div>

              <button type="submit" className="btn-skeuo-primary" style={{ marginTop: '0.5rem', width: '100%', padding: '0.95rem' }}>
                Send Message <Send size={16} />
              </button>
            </div>
          </form>
        </div>

        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '0.88rem', color: '#9EB097' }}>
          <div>© {new Date().getFullYear()} Subina Aacharya Sanctuary. All rights reserved.</div>
          <a href="https://subinaacharya.com.np" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-terracotta-400)', textDecoration: 'none', fontWeight: 700 }}>
            subinaacharya.com.np
          </a>
        </div>
      </div>
    </footer>
  );
}
