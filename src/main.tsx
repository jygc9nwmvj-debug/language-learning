import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './app/app.css';
import { prepareOffline } from './core/offline/prepare';
const harnessRoute = window.location.pathname.replace(/\/$/, '') === '/__test/a1';
if (!harnessRoute && import.meta.env.PROD) {
  if (document.readyState === 'complete') prepareOffline();
  else window.addEventListener('load', () => prepareOffline(), { once: true });
} else document.documentElement.dataset.offline = 'development';
const root = createRoot(document.getElementById('root')!);
if (harnessRoute) {
  if (import.meta.env.DEV || import.meta.env.MODE === 'test') {
    const { A1Harness } = await import('./test/A1Harness');
    root.render(<StrictMode><A1Harness /></StrictMode>);
  } else root.render(<p>Diese Testseite ist in der normalen App nicht verfügbar.</p>);
} else {
  const { App } = await import('./app/App');
  root.render(<StrictMode><App /></StrictMode>);
}
