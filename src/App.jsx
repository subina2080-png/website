import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import BlogSection from './components/BlogSection';
import DesignInMotion from './components/DesignInMotion';
import BlogDetailModal from './components/BlogDetailModal';
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

export default function App() {
  const [activeSection, setActiveSection] = useState('hero');
  const [selectedPost, setSelectedPost] = useState(null);
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
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.1 }
    );

    const revealElements = document.querySelectorAll('.scroll-reveal');
    revealElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
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

      {selectedPost && (
        <BlogDetailModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
          onSelectPost={(p) => setSelectedPost(p)}
          isBookmarked={bookmarkedIds.includes(selectedPost.id)}
          toggleBookmark={toggleBookmark}
          showToast={showToast}
        />
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
