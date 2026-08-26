import React, { useState } from 'react';
import { SUBSCRIPTION_TIERS } from '../data/yogaData';
import { ShieldCheck, Check, Sparkles, Star } from 'lucide-react';

export default function SubscriptionSection({ onOpenWaitlistModal }) {
  const [billingCycle, setBillingCycle] = useState('monthly');

  return (
    <section id="subscription" className="section" style={{ background: '#FFFFFF' }}>
      <div className="container">
        <div className="section-title-wrap">
          <div className="section-tag"><ShieldCheck size={16} /> Online Sanctuary Membership</div>
          <h2>Transformative Yoga & Mindfulness Tiers</h2>
          <p>Immerse yourself in unlimited HD video flows, restorative audio meditations, and live Zoom workshops with Subina.</p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '3.5rem' }}>
          <div className="skeuo-inset" style={{ padding: '0.4rem 0.6rem', borderRadius: 'var(--radius-full)' }}>
            <div className="skeuo-toggle-wrap">
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: billingCycle === 'monthly' ? 'var(--color-sage-900)' : 'var(--color-text-light)' }}>Monthly Billing</span>
              <div onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')} className={`skeuo-toggle-track ${billingCycle === 'yearly' ? 'active' : ''}`}>
                <div className="skeuo-toggle-knob" />
              </div>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: billingCycle === 'yearly' ? 'var(--color-sage-900)' : 'var(--color-text-light)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                Annual Billing <span style={{ background: 'linear-gradient(180deg, #F07844 0%, #E2642F 100%)', color: '#FFFFFF', padding: '0.15rem 0.6rem', borderRadius: 'var(--radius-full)', fontSize: '0.72rem', fontWeight: 800 }}>Save 20%</span>
              </span>
            </div>
          </div>
        </div>

        <div className="grid-3" style={{ alignItems: 'stretch' }}>
          {SUBSCRIPTION_TIERS.map((tier) => {
            const price = billingCycle === 'yearly' ? tier.priceYearly : tier.priceMonthly;
            return (
              <div
                key={tier.id}
                className="skeuo-card"
                style={{
                  padding: '2.5rem 2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  border: tier.popular ? '2px solid var(--color-sage-500)' : '1px solid rgba(0,0,0,0.06)',
                  boxShadow: tier.popular ? 'var(--skeuo-shadow-lifted)' : 'var(--skeuo-shadow-card)'
                }}
              >
                {tier.popular && (
                  <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(180deg, #425447 0%, #25332A 100%)', color: '#FFFFFF', fontSize: '0.75rem', fontWeight: 800, padding: '0.3rem 1.2rem', borderRadius: 'var(--radius-full)', textTransform: 'uppercase', letterSpacing: '0.08em', boxShadow: '0 4px 10px rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Sparkles size={13} /> {tier.badge}
                  </div>
                )}

                <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                  <h3 style={{ fontSize: '1.75rem', color: 'var(--color-sage-900)', marginBottom: '0.3rem' }}>{tier.name}</h3>
                  <div style={{ fontSize: '0.88rem', color: 'var(--color-terracotta-600)', fontWeight: 700 }}>{tier.subtitle}</div>
                </div>

                <div style={{ textAlign: 'center', marginBottom: '1.8rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--color-sand-200)' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '0.2rem' }}>
                    <span style={{ fontSize: '1.4rem', fontWeight: 800 }}>$</span>
                    <span style={{ fontSize: '3.4rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--color-sage-900)', lineHeight: 1 }}>{price}</span>
                    <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>/month</span>
                  </div>
                  {billingCycle === 'yearly' && price > 0 && (
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-sage-700)', fontWeight: 600 }}>Billed annually (${price * 12}/yr)</span>
                  )}
                </div>

                <p style={{ fontSize: '0.92rem', color: 'var(--color-text-muted)', marginBottom: '1.8rem', textAlign: 'center', lineHeight: 1.6 }}>{tier.description}</p>

                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.9rem', marginBottom: '2.5rem', flexGrow: 1 }}>
                  {tier.features.map((feat, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', fontSize: '0.92rem', color: 'var(--color-sage-900)' }}>
                      <Check size={18} color="var(--color-sage-700)" style={{ marginTop: '2px', flexShrink: 0 }} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => onOpenWaitlistModal(tier)}
                  className={tier.popular ? "btn-skeuo-primary" : "btn-skeuo-secondary"}
                  style={{ width: '100%', padding: '0.95rem 1.5rem' }}
                >
                  {tier.buttonText}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
