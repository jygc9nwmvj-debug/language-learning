import { ui } from '../../../core/i18n/de';
export function Worksheet() {
  return <section className="worksheet" aria-label={ui.sheetTitle}><p className="eyebrow">Mandarin · 01</p><h1>{ui.sheetTitle}</h1><p>{ui.sheetIntro}</p>
    <h2>{ui.sheetObserve}</h2><p className="sheetCharacter" lang="zh">好</p>
    <h2>{ui.sheetTrace}</h2><div className="sheetGrid">{[.3, .14, .05, 0, 0, 0].map((opacity, i) => <span key={i}><b style={{ opacity }}>好</b></span>)}</div>
    <h2>{ui.sheetRecall}</h2><div className="sheetGrid">{[0, 1, 2, 3, 4, 5].map(i => <span key={i} />)}</div>
    <h2>{ui.sheetContext}</h2><p className="sheetCharacter" lang="zh">你好　我　你</p><p>{ui.sheetRating}</p>
  </section>;
}
