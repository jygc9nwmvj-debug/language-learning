// One geometric SVG vocabulary for transport controls; no font/emoji dependence.
export type IconName = 'play' | 'pause' | 'stop' | 'replay' | 'mic' | 'close' | 'back' | 'forward' | 'info' | 'eye' | 'stroke' | 'paper' | 'print';
export function Icon({ name }: { name: IconName }) {
  return <svg className="controlIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    {name === 'play' && <path d="m9 5 11 7-11 7Z" fill="currentColor" stroke="none" />}
    {name === 'pause' && <path d="M9 5v14M15 5v14" strokeWidth="3" />}
    {name === 'stop' && <rect x="6" y="6" width="12" height="12" rx="1" fill="currentColor" stroke="none" />}
    {name === 'replay' && <><path d="M4 10a8 8 0 1 1 1 8M4 4v6h6" /></>}
    {name === 'mic' && <><rect x="9" y="3" width="6" height="12" rx="3" /><path d="M6 11v1a6 6 0 0 0 12 0v-1M12 18v3M9 21h6" /></>}
    {name === 'back' && <path d="m14 5-7 7 7 7M7 12h13" />}
    {name === 'forward' && <path d="m10 5 7 7-7 7M4 12h13" />}
    {name === 'info' && <><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/></>}
    {name === 'eye' && <><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></>}
    {name === 'stroke' && <><path d="m6 18 3-1 10-10-3-3L6 14v4ZM14 6l3 3M4 21h16"/></>}
    {name === 'paper' && <><path d="M6 3h8l4 4v14H6ZM14 3v5h4M9 12h6M9 16h6"/></>}
    {name === 'print' && <><path d="M7 8V3h10v5M7 17H4V8h16v9h-3M7 14h10v7H7Z"/><path d="M17 11h.01"/></>}
    {name === 'close' && <path d="m6 6 12 12M6 18 18 6" />}
  </svg>;
}
