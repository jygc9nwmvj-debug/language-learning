// One geometric SVG vocabulary for transport controls; no font/emoji dependence.
export function Icon({ name }: { name: 'play' | 'pause' | 'stop' | 'replay' | 'mic' | 'close' }) {
  return <svg className="controlIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    {name === 'play' && <path d="m9 5 11 7-11 7Z" fill="currentColor" stroke="none" />}
    {name === 'pause' && <path d="M9 5v14M15 5v14" strokeWidth="3" />}
    {name === 'stop' && <rect x="6" y="6" width="12" height="12" rx="1" fill="currentColor" stroke="none" />}
    {name === 'replay' && <><path d="M4 10a8 8 0 1 1 1 8M4 4v6h6" /></>}
    {name === 'mic' && <><rect x="9" y="3" width="6" height="12" rx="3" /><path d="M6 11v1a6 6 0 0 0 12 0v-1M12 18v3M9 21h6" /></>}
    {name === 'close' && <path d="m6 6 12 12M6 18 18 6" />}
  </svg>;
}
