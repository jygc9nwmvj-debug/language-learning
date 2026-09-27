import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './app/app.css';
const harnessRoute = window.location.pathname.replace(/\/$/, '') === '/__test/a1';
if (!harnessRoute && import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const status = (value: string) => { document.documentElement.dataset.offline = value; window.dispatchEvent(new Event('offline-ready')); };
    const timeout = window.setTimeout(() => status('failed'), 45000);
    void navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' }).then(registration => {
      // Check on each app load; an update never reloads an in-progress exercise.
      void registration.update().catch(() => {});
      return navigator.serviceWorker.ready;
    }).then(() => { clearTimeout(timeout); status('ready'); }).catch(() => { clearTimeout(timeout); status('failed'); });
  });
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
