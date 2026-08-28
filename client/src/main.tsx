import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AdminApp } from './admin/AdminApp';
import { SiteApp } from './public/SiteApp';
import { routeFor, type Route } from './lib/routes';
import './base.css';

function Router() {
  const [route, setRoute] = useState<Route>(() => routeFor(window.location.pathname));

  useEffect(() => {
    const onPop = () => setRoute(routeFor(window.location.pathname));
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  return route === 'admin' ? <AdminApp /> : <SiteApp />;
}

const root = document.getElementById('root');
if (!root) throw new Error('#root introuvable');

createRoot(root).render(
  <StrictMode>
    <Router />
  </StrictMode>,
);
