import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import BlogSection from './components/BlogSection';
import DesignInMotion from './components/DesignInMotion';
import BlogPostPage from './components/BlogPostPage';
import BreathingToolkit from './components/BreathingToolkit';
import AmbientSoundPlayer from './components/AmbientSoundPlayer';
import PoseLibrary from './components/PoseLibrary';
import SubscriptionSection from './components/SubscriptionSection';
import ScheduleSection from './components/ScheduleSection';
import AboutSection from './components/AboutSection';
import BabaSubinaMelody from './components/BabaSubinaMelody';
import ContactFooter from './components/ContactFooter';
import EarlyAccessModal from './components/EarlyAccessModal';
import Toast from './components/Toast';
import { BLOG_POSTS } from './data/yogaData';

const postFromPath = (path) => {
  const m = path.match(/^\/blog\/([^/]+)\/?$/);
  return m ? BLOG_POSTS.find((p) => p.id === m[1]) || null : null;
};

export default function App() {
  const [activeSection, setActiveSection] = useState('hero');
  const [selectedPost, setSelectedPostState] = useState(() => postFromPath(window.location.pathname));

  // Keep the address bar in sync so each article has its own shareable URL (/blog/<id>)
  const setSelectedPost = (post) => {
    setSelectedPostState(post);
    try {
      window.history.pushState({}, '', post ? `/blog/${post.id}` : '/');
    } catch (e) { }
  };

  // Browser tab title follows the open article
  useEffect(() => {
    const home = 'Subina Aacharya | Yoga, Mindfulness & Peaceful Living Sanctuary';
    document.title = selectedPost ? `${selectedPost.title} | Subina Aacharya` : home;
  }, [selectedPost]);

  // Leave an article page and scroll to a home-page section (used by Navbar and in-article links)
  useEffect(() => {
    const onNavigateHome = (e) => {
      setSelectedPost(null);
      const id = e.detail?.id;
      setTimeout(() => {
        const el = id && document.getElementById(id);
        if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - 24, behavior: 'smooth' });
        else window.scrollTo({ top: 0 });
      }, 120);
    };
    window.addEventListener('navigate-home', onNavigateHome);
    return () => window.removeEventListener('navigate-home', onNavigateHome);
  }, []);

  useEffect(() => {
    const onPop = () => setSelectedPostState(postFromPath(window.location.pathname));
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);
  const [soundModalOpen, setSoundModalOpen] = useState(false);
  const [waitlistTier, setWaitlistTier] = useState(null);
  const [toasts, setToasts] = useState([]);

  const [bookmarkedIds, setBookmarkedIds] = useState(() => {
    try {
      const saved = localStorage.getItem('subina_yoga_bookmarks');
      return saved ? JSON.parse(saved) : ['mindful-flow-breath'];
    } catch (e) {
      return ['mindful-flow-breath'];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('subina_yoga_bookmarks', JSON.stringify(bookmarkedIds));
    } catch (e) { }
  }, [bookmarkedIds]);

  useEffect(() => {
    document.body.classList.add('js-loaded');
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    const makeAllActive = () => {
      revealElements.forEach((el) => el.classList.add('active'));
    };

    if (typeof IntersectionObserver === 'undefined') {
      makeAllActive();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.05 }
    );

    revealElements.forEach((el) => observer.observe(el));
    const fallbackTimer = setTimeout(makeAllActive, 800);

    return () => {
      observer.disconnect();
      clearTimeout(fallbackTimer);
    };
  }, []);

  const toggleBookmark = (id) => {
    if (bookmarkedIds.includes(id)) {
      setBookmarkedIds(bookmarkedIds.filter(b => b !== id));
      showToast("Removed article from saved bookmarks.");
    } else {
      setBookmarkedIds([...bookmarkedIds, id]);
      showToast("Article saved to your personal bookmarks!");
    }
  };

  const showToast = (message) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter(t => t.id !== id));
    }, 3500);
  };

  const scrollTo = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -24;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="app-root">
      <Navbar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        bookmarkedCount={bookmarkedIds.length}
        toggleSoundModal={() => setSoundModalOpen(true)}
      />

      {selectedPost ? (
        <>
          <BlogPostPage
            post={selectedPost}
            onClose={() => window.dispatchEvent(new CustomEvent('navigate-home', { detail: { id: 'blogs' } }))}
            onSelectPost={(p) => setSelectedPost(p)}
            isBookmarked={bookmarkedIds.includes(selectedPost.id)}
            toggleBookmark={toggleBookmark}
            showToast={showToast}
          />
          <ContactFooter showToast={showToast} />
        </>
      ) : (
      <main>
        <div className="scroll-reveal active">
          <Hero
            onExploreBlogs={() => scrollTo('blogs')}
            onOpenBreathing={() => scrollTo('breathing')}
            onExploreSubscription={() => scrollTo('subscription')}
          />
        </div>

        <div className="scroll-reveal">
          <BlogSection
            onSelectPost={(post) => setSelectedPost(post)}
            bookmarkedIds={bookmarkedIds}
            toggleBookmark={toggleBookmark}
          />
        </div>

        <DesignInMotion />

        <div className="scroll-reveal">
          <BreathingToolkit showToast={showToast} />
        </div>

        <div className="scroll-reveal">
          <PoseLibrary />
        </div>

        <div className="scroll-reveal">
          <SubscriptionSection onOpenWaitlistModal={(tier) => setWaitlistTier(tier)} />
        </div>

        <div className="scroll-reveal">
          <ScheduleSection showToast={showToast} />
        </div>

        <div className="scroll-reveal">
          <AboutSection />
        </div>

        <ContactFooter showToast={showToast} />

        <div className="scroll-reveal">
          <BabaSubinaMelody showToast={showToast} />
        </div>
      </main>
      )}

      <AmbientSoundPlayer
        isOpen={soundModalOpen}
        onClose={() => setSoundModalOpen(false)}
      />

      {waitlistTier && (
        <EarlyAccessModal
          tier={waitlistTier}
          onClose={() => setWaitlistTier(null)}
          showToast={showToast}
        />
      )}

      <Toast toasts={toasts} />
    </div>
  );
}
