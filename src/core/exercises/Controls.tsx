import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Icon, type IconName } from './Icon';
// Native button/details semantics with one shared visual vocabulary.
export function IconButton({ icon, label, children, className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { icon: IconName; label: string }) {
  return <button type="button" {...props} className={`utilityButton iconButton ${className}`} aria-label={label} title={label}><Icon name={icon}/>{children}</button>;
}
export function InfoDisclosure({ label, children, className = '' }: { label: string; children: ReactNode; className?: string }) {
  return <details className={`infoDisclosure ${className}`}><summary aria-label={label} title={label}><Icon name="info"/><span className="srOnly">{label}</span></summary><div className="infoContent">{children}</div></details>;
}
export function AnswerSummary({ value }: {value:string}) {
  return <div className="answerSummary"><span className="controlLabel">Deine Antwort</span><span>{value}</span></div>;
}

// The same continuation affordance in every learning state; callbacks stay with callers.
export function ContinueButton({ children = 'Weiter', className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type="button" {...props} className={`continueButton ${className}`}><span>{children}</span><Icon name="forward"/></button>;
}
