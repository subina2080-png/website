import React, { useState } from 'react';
import { BLOG_POSTS } from '../data/yogaData';
import { X, Bookmark, Share2, Clock, Calendar, User, ArrowLeft, Type, Check } from 'lucide-react';

export default function BlogDetailModal({ post, onClose, onSelectPost, isBookmarked, toggleBookmark, showToast }) {
  const [fontSize, setFontSize] = useState(1.05);
  const [copied, setCopied] = useState(false);

  if (!post) return null;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    showToast("Article link copied to clipboard!");
    setTimeout(() => setCopied(false), 3000);
  };

  const relatedPosts = BLOG_POSTS
    .filter(p => p.id !== post.id && (p.category === post.category || p.tags.some(t => post.tags.includes(t))))
    .slice(0, 2);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: 0 }}>
        <div 
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 10,
            background: 'rgba(255, 255, 255, 0.94)',
            backdropFilter: 'blur(10px)',
            padding: '1rem 1.5rem',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <button onClick={onClose} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', color: 'var(--color-sage-900)', fontWeight: 600 }}>
            <ArrowLeft size={18} /> Back to Library
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: 'var(--color-sand-100)', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-full)' }}>
              <Type size={14} color="var(--color-text-muted)" />
              <button onClick={() => setFontSize(Math.max(0.9, fontSize - 0.1))} style={{ fontSize: '0.8rem', padding: '0.1rem 0.4rem', fontWeight: 700 }}>A-</button>
              <button onClick={() => setFontSize(Math.min(1.3, fontSize + 0.1))} style={{ fontSize: '0.9rem', padding: '0.1rem 0.4rem', fontWeight: 700 }}>A+</button>
            </div>

            <button
              onClick={() => toggleBookmark(post.id)}
              style={{
                padding: '0.45rem',
                borderRadius: '50%',
                background: isBookmarked ? 'var(--color-terracotta-600)' : 'var(--color-sand-100)',
                color: isBookmarked ? '#FFFFFF' : 'var(--color-sage-900)'
              }}
              title="Save to Bookmarks"
            >
              <Bookmark size={18} />
            </button>

            <button
              onClick={handleShare}
              style={{ padding: '0.45rem', borderRadius: '50%', background: 'var(--color-sand-100)', color: 'var(--color-sage-900)' }}
              title="Share Article"
            >
              {copied ? <Check size={18} color="green" /> : <Share2 size={18} />}
            </button>

            <button onClick={onClose} style={{ padding: '0.45rem', borderRadius: '50%', background: 'var(--color-sand-100)', color: 'var(--color-sage-900)' }}>
              <X size={20} />
            </button>
          </div>
        </div>

        <div style={{ position: 'relative', width: '100%', height: '350px' }}>
          <img src={post.coverImage} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          <div style={{ position: 'absolute', bottom: '1rem', left: '1.5rem', background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(8px)', padding: '0.35rem 1rem', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-sage-900)' }}>
            {post.category}
          </div>
        </div>

        <div style={{ padding: '2.5rem 2rem', maxWidth: '740px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.85rem', color: 'var(--color-text-light)', marginBottom: '1rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><User size={15} /> {post.author}</span>
            <span>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Calendar size={15} /> {post.date}</span>
            <span>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Clock size={15} /> {post.readTime}</span>
          </div>

          <h1 style={{ fontSize: '2.4rem', marginBottom: '1.5rem', lineHeight: 1.25 }}>{post.title}</h1>
          <p style={{ fontSize: '1.2rem', fontStyle: 'italic', color: 'var(--color-sage-700)', marginBottom: '2rem', paddingLeft: '1rem', borderLeft: '3px solid var(--color-sage-300)' }}>"{post.excerpt}"</p>

          <div 
            className="article-body"
            style={{ fontSize: `${fontSize}rem`, lineHeight: 1.8, color: 'var(--color-text-main)' }}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>Tags:</span>
            {post.tags.map(t => (
              <span key={t} className="pill-category" style={{ fontSize: '0.8rem' }}>#{t}</span>
            ))}
          </div>

          {relatedPosts.length > 0 && (
            <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '1.2rem' }}>Related Journal Entries</h3>
              <div className="grid-2">
                {relatedPosts.map(rel => (
                  <div
                    key={rel.id}
                    onClick={() => onSelectPost(rel)}
                    style={{ padding: '1rem', borderRadius: 'var(--radius-md)', background: 'var(--color-sand-100)', cursor: 'pointer' }}
                  >
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-sage-700)', fontWeight: 600 }}>{rel.category}</span>
                    <h4 style={{ fontSize: '1.05rem', margin: '0.3rem 0', color: 'var(--color-sage-900)' }}>{rel.title}</h4>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-light)' }}>{rel.readTime}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
