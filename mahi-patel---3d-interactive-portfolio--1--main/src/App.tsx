import React, { useCallback, useEffect, useState } from 'react';
import { DisciplineMode, CursorState, PageRoute } from './types';
import { CustomCursor } from './components/CustomCursor';
import { Preloader } from './components/Preloader';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { WorkPage } from './pages/WorkPage';
import { SpacesPage } from './pages/SpacesPage';
import { SpaceDetailPage } from './pages/SpaceDetailPage';
import { RoyceProjectPage } from './pages/RoyceProjectPage';
import { UrbenHatchProjectPage } from './pages/UrbenHatchProjectPage';
import { VillaProjectPage } from './pages/VillaProjectPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { LayoutGroup } from 'motion/react';
import { FEATURED_PROJECTS } from './data/featuredProjects';

const getInitialRoute = (): PageRoute => {
  if (typeof window !== 'undefined') {
    const hash = window.location.hash.toLowerCase().replace(/^#\/?/, '');
    const path = window.location.pathname.toLowerCase();

    if (hash === 'work' || hash === 'content' || path.includes('/work')) {
      return { name: 'work' };
    }
    if (hash === 'spaces' || path.includes('/spaces')) {
      return { name: 'spaces' };
    }
    if (hash === 'about' || path.includes('/about')) {
      return { name: 'about' };
    }
    if (hash === 'contact' || path.includes('/contact')) {
      return { name: 'contact' };
    }
    if (
      hash === 'royce' ||
      hash === 'work/royce' ||
      hash === 'work/royce-store' ||
      path === '/royce' ||
      path.includes('/royce')
    ) {
      return { name: 'royce' };
    }
    if (
      hash === 'urben-hatch' ||
      hash === 'urbenhatch' ||
      path === '/urben-hatch' ||
      path.includes('/urben-hatch')
    ) {
      return { name: 'work-detail', slug: 'urben-hatch' };
    }
    if (hash === 'villa' || path === '/villa') {
      return { name: 'work-detail', slug: 'villa' };
    }
    if (hash.startsWith('work/') || hash.startsWith('spaces/')) {
      const parts = hash.split('/');
      if (parts[1]) {
        if (parts[1] === 'royce' || parts[1] === 'royce-store') {
          return { name: 'royce' };
        }
        return { name: 'work-detail', slug: parts[1] };
      }
    }
    if (hash === 'home' || path === '/home') {
      return { name: 'home' };
    }
    try {
      const saved = sessionStorage.getItem('mahi_portfolio_route');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.name) return parsed;
      }
    } catch (e) {}
  }
  // Land on Home; the Content page (project selector) is reached from the navigation
  return { name: 'home' };
};

export default function App() {
  const [preloaderComplete, setPreloaderComplete] = useState(false);
  const [route, setRoute] = useState<PageRoute>(getInitialRoute);
  const [mode, setMode] = useState<DisciplineMode>('interior');
  const [cursorState, setCursorState] = useState<CursorState>('default');
  const [cursorText, setCursorText] = useState<string | undefined>(undefined);

  // Scroll to top on navigation change & sync document title
  const handleNavigate = (newRoute: PageRoute) => {
    setRoute(newRoute);
    window.scrollTo({ top: 0, behavior: 'instant' });
    setCursorState('default');
    setCursorText(undefined);

    try {
      sessionStorage.setItem('mahi_portfolio_route', JSON.stringify(newRoute));
      if ('slug' in newRoute && newRoute.slug) {
        window.location.hash = `#/${newRoute.name}/${newRoute.slug}`;
      } else if (newRoute.name !== 'home') {
        window.location.hash = `#/${newRoute.name}`;
      } else {
        window.location.hash = '';
      }
    } catch (e) {}
  };

  // Sync back/forward button via hashchange
  useEffect(() => {
    const handleHashChange = () => {
      const updated = getInitialRoute();
      setRoute(updated);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    switch (route.name) {
      case 'home':
        document.title = 'Mahi Patel — Interior & Spatial Design Portfolio';
        break;
      case 'work':
        document.title = 'Academic Projects — Mahi Patel';
        break;
      case 'royce':
        document.title = 'ROYCE’ Chocolate Retail Interior — Mahi Patel';
        break;
      case 'spaces':
        document.title = 'Spatial Explorations — Mahi Patel';
        break;
      case 'work-detail':
        if ('slug' in route && (route.slug === 'urben-hatch' || route.slug === 'urbenhatch')) {
          document.title = 'URBEN HATCH — Adaptive Reuse Hostel Hotel — Mahi Patel';
        } else if ('slug' in route && route.slug === 'villa') {
          document.title = 'Villa — Residential Interior Design — Mahi Patel';
        } else {
          document.title = 'Project Detail — Mahi Patel';
        }
        break;
      case 'space-detail':
        document.title = 'Project Detail — Mahi Patel';
        break;
      case 'about':
        document.title = 'About & Academic Studios — Mahi Patel';
        break;
      case 'contact':
        document.title = 'Contact & Inquiries — Mahi Patel';
        break;
    }
  }, [route]);

  const handleReplayPreloader = () => {
    sessionStorage.removeItem('mahi_portfolio_visited');
    setPreloaderComplete(false);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleCursorChange = useCallback((state: CursorState, text?: string) => {
    setCursorState(state);
    setCursorText(text);
  }, []);

  return (
    <LayoutGroup id="mahi-patel-brand">
      <div className="min-h-screen bg-[#FFFFFF] text-[#141413] selection:bg-[#9A773E] selection:text-[#FFFFFF] relative font-sans overflow-x-hidden">
        {/* Custom Contextual Cursor */}
        <CustomCursor cursorState={cursorState} cursorText={cursorText} />

        {/* 3D Wireframe Assembly Preloader */}
        {!preloaderComplete && (
          <Preloader
            onComplete={() => setPreloaderComplete(true)}
            onCursorChange={handleCursorChange}
          />
        )}

        {/* Minimal Editorial Navigation */}
        <Navbar
          currentRoute={route}
          onNavigate={handleNavigate}
          mode={mode}
          onModeToggle={setMode}
          onCursorChange={handleCursorChange}
        />

        {/* Page Routing */}
        <main className="relative z-10">
          {route.name === 'home' && (
            <HomePage
              mode={mode}
              onModeToggle={setMode}
              onNavigate={handleNavigate}
              onCursorChange={handleCursorChange}
            />
          )}

          {route.name === 'work' && (
            <WorkPage
              onNavigate={handleNavigate}
              onCursorChange={handleCursorChange}
            />
          )}

          {route.name === 'spaces' && (
            <SpacesPage
              onNavigate={handleNavigate}
              onCursorChange={handleCursorChange}
            />
          )}

          {(route.name === 'royce' || (route.name === 'work-detail' && (route.slug === 'royce' || route.slug === 'royce-store'))) && (
            <RoyceProjectPage
              onNavigate={handleNavigate}
              onBack={() => handleNavigate({ name: 'work' })}
              onOpenProject={(i) => {
                const slug = FEATURED_PROJECTS[i]?.slug;
                if (slug === 'royce-store') {
                  handleNavigate({ name: 'royce' });
                } else if (slug === 'urben-hatch') {
                  handleNavigate({ name: 'work-detail', slug: 'urben-hatch' });
                } else if (slug === 'villa') {
                  handleNavigate({ name: 'work-detail', slug: 'villa' });
                } else {
                  handleNavigate({ name: 'work' });
                }
              }}
              onCursorChange={handleCursorChange}
            />
          )}

          {route.name === 'work-detail' && (route.slug === 'urben-hatch' || route.slug === 'urbenhatch') && (
            <UrbenHatchProjectPage
              onNavigate={handleNavigate}
              onBack={() => handleNavigate({ name: 'work' })}
              onOpenProject={(i) => {
                const slug = FEATURED_PROJECTS[i]?.slug;
                if (slug === 'royce-store') {
                  handleNavigate({ name: 'royce' });
                } else if (slug === 'urben-hatch') {
                  handleNavigate({ name: 'work-detail', slug: 'urben-hatch' });
                } else if (slug === 'villa') {
                  handleNavigate({ name: 'work-detail', slug: 'villa' });
                } else {
                  handleNavigate({ name: 'work' });
                }
              }}
              onCursorChange={handleCursorChange}
            />
          )}

          {route.name === 'work-detail' && route.slug === 'villa' && (
            <VillaProjectPage
              onNavigate={handleNavigate}
              onBack={() => handleNavigate({ name: 'work' })}
              onOpenProject={(i) => {
                const slug = FEATURED_PROJECTS[i]?.slug;
                if (slug === 'royce-store') {
                  handleNavigate({ name: 'royce' });
                } else if (slug === 'urben-hatch') {
                  handleNavigate({ name: 'work-detail', slug: 'urben-hatch' });
                } else if (slug === 'villa') {
                  handleNavigate({ name: 'work-detail', slug: 'villa' });
                } else {
                  handleNavigate({ name: 'work' });
                }
              }}
              onCursorChange={handleCursorChange}
            />
          )}

          {(route.name === 'space-detail' || (route.name === 'work-detail' && route.slug !== 'royce' && route.slug !== 'royce-store' && route.slug !== 'urben-hatch' && route.slug !== 'urbenhatch' && route.slug !== 'villa')) && (
            <SpaceDetailPage
              slug={'slug' in route ? route.slug : 'house-of-seven-lightwells'}
              onNavigate={handleNavigate}
              onCursorChange={handleCursorChange}
            />
          )}

          {route.name === 'about' && (
            <AboutPage
              onNavigate={handleNavigate}
              onCursorChange={handleCursorChange}
            />
          )}

          {route.name === 'contact' && (
            <ContactPage
              onNavigate={handleNavigate}
              onCursorChange={handleCursorChange}
            />
          )}
        </main>

        {/* Editorial Footer */}
        <Footer
          onNavigate={handleNavigate}
          onReplayPreloader={handleReplayPreloader}
          onCursorChange={handleCursorChange}
        />
      </div>
    </LayoutGroup>
  );
}

