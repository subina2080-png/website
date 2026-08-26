import React, { useState } from 'react';
import { BLOG_POSTS, BLOG_CATEGORIES } from '../data/yogaData';
import { Search, Clock, Bookmark, ArrowRight, BookOpen } from 'lucide-react';

export default function BlogSection({ onSelectPost, bookmarkedIds, toggleBookmark }) {
  const [activeCategory, setActiveCategory] = useState('All Articles');
  const [searchQuery, setSearchQuery] = useState('');
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);

  const filteredPosts = BLOG_POSTS.filter((post) => {
    const matchesCategory = activeCategory === 'All Articles' || post.category === activeCategory;
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesBookmark = showBookmarksOnly ? bookmarkedIds.includes(post.id) : true;

    return matchesCategory && matchesSearch && matchesBookmark;
  });

  const featuredPost = BLOG_POSTS.find(p => p.featured) || BLOG_POSTS[0];

  return (
    <section id="blogs" className="section" style={{ background: '#FFFFFF' }}>
      <div className="container">
        <div className="section-title-wrap">
          <div className="section-tag">
            <BookOpen size={16} /> Mindful Library
          </div>
          <h2>Yoga Journal & Philosophical Reflections</h2>
          <p>Explore physical vinyasa alignment, pranayama breath science, chakra energy, and daily mindful living practices.</p>
        </div>

        <div 
          className="skeuo-inset"
          style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            gap: '1.2rem',
            marginBottom: '3rem',
            padding: '1.4rem 1.8rem'
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
            {BLOG_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setShowBookmarksOnly(false); }}
                className={`pill-skeuo ${activeCategory === cat && !showBookmarksOnly ? 'active' : ''}`}
              >
                {cat}
              </button>
            ))}

            <button
              onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
              className={`pill-skeuo ${showBookmarksOnly ? 'active' : ''}`}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <Bookmark size={14} /> Saved Bookmarks ({bookmarkedIds.length})
            </button>
          </div>

          <div className="search-input-skeuo">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              placeholder="Search articles, breathwork, postures..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {!searchQuery && activeCategory === 'All Articles' && !showBookmarksOnly && (
          <div 
            onClick={() => onSelectPost(featuredPost)}
            className="skeuo-card featured-blog-card"
          >
            <div className="featured-blog-image-wrap">
              <img 
                src={featuredPost.coverImage} 
                alt={featuredPost.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
              <div className="featured-blog-badge">
                FEATURED JOURNAL ENTRY
              </div>
            </div>

            <div className="featured-blog-content">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                <span className="pill-skeuo active" style={{ fontSize: '0.75rem', padding: '0.2rem 0.7rem' }}>
                  {featuredPost.category}
                </span>
                <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Clock size={14} /> {featuredPost.readTime}
                </span>
                <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                  • {featuredPost.date}
                </span>
              </div>

              <h3 style={{ fontSize: 'clamp(1.35rem, 2.5vw, 1.85rem)', marginBottom: '1rem', lineHeight: 1.25 }}>
                {featuredPost.title}
              </h3>

              <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.6, marginBottom: '1.8rem' }}>
                {featuredPost.excerpt}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <button className="btn-skeuo-primary">
                  Read Full Journal Entry <ArrowRight size={16} />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); toggleBookmark(featuredPost.id); }}
                  className={`btn-skeuo-secondary ${bookmarkedIds.includes(featuredPost.id) ? 'active' : ''}`}
                  style={{ width: '42px', height: '42px', borderRadius: '50%', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  title="Save Bookmark"
                >
                  <Bookmark size={18} fill={bookmarkedIds.includes(featuredPost.id) ? "currentColor" : "none"} />
                </button>
              </div>
            </div>
          </div>
        )}

        {filteredPosts.length === 0 ? (
          <div className="skeuo-card" style={{ textAlign: 'center', padding: '4rem 1.5rem' }}>
            <p style={{ fontSize: '1.2rem', color: 'var(--color-text-muted)', marginBottom: '1.2rem' }}>No articles found matching your criteria.</p>
            <button onClick={() => { setActiveCategory('All Articles'); setSearchQuery(''); setShowBookmarksOnly(false); }} className="btn-skeuo-secondary">Reset Filters</button>
          </div>
        ) : (
          <div className="grid-3">
            {filteredPosts.map((post) => {
              const isBookmarked = bookmarkedIds.includes(post.id);
              return (
                <div
                  key={post.id}
                  onClick={() => onSelectPost(post)}
                  className="skeuo-card"
                  style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', cursor: 'pointer' }}
                >
                  <div style={{ position: 'relative', height: '210px', overflow: 'hidden' }}>
                    <img src={post.coverImage} alt={post.title} loading="lazy" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', top: '0.9rem', left: '0.9rem' }}>
                      <span className="pill-skeuo" style={{ fontSize: '0.75rem', fontWeight: 700 }}>{post.category}</span>
                    </div>

                    <button
                      onClick={(e) => { e.stopPropagation(); toggleBookmark(post.id); }}
                      title="Bookmark Article"
                      style={{
                        position: 'absolute',
                        top: '0.9rem',
                        right: '0.9rem',
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: isBookmarked ? 'linear-gradient(180deg, #D29A64 0%, #B8733A 100%)' : 'linear-gradient(180deg, #FFFFFF 0%, #FAF7F2 100%)',
                        color: isBookmarked ? '#FFFFFF' : 'var(--color-sage-900)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.4)',
                        border: '1px solid rgba(255,255,255,0.8)'
                      }}
                    >
                      <Bookmark size={16} />
                    </button>
                  </div>

                  <div style={{ padding: '1.6rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.8rem', color: 'var(--color-text-light)', marginBottom: '0.6rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}><Clock size={13} /> {post.readTime}</span>
                      <span>• {post.date}</span>
                    </div>

                    <h3 style={{ fontSize: '1.3rem', marginBottom: '0.7rem', color: 'var(--color-sage-900)', lineHeight: 1.3 }}>{post.title}</h3>
                    <p style={{ fontSize: '0.92rem', color: 'var(--color-text-muted)', marginBottom: '1.4rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.6 }}>{post.excerpt}</p>

                    <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--color-sand-200)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                        {post.tags.slice(0, 2).map(tag => (
                          <span key={tag} style={{ fontSize: '0.72rem', background: 'var(--color-sand-200)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)', color: 'var(--color-sage-700)', fontWeight: 600 }}>#{tag}</span>
                        ))}
                      </div>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-sage-700)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>Read <ArrowRight size={14} /></span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
