import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app/App';
import './app/app.css';
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
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
createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);
