import twshui from './data/shui.json' with { type: 'json' };
import twbei from './data/bei.json' with { type: 'json' };
import twyuan from './data/yuan.json' with { type: 'json' };
import twbai from './data/bai.json' with { type: 'json' };
import twqu from './data/qu.json' with { type: 'json' };
import twdao from './data/dao.json' with { type: 'json' };
import twda from './data/da.json' with { type: 'json' };
import twxiao from './data/xiao.json' with { type: 'json' };
import twzuo_dir from './data/zuo-dir.json' with { type: 'json' };
import twyou_dir from './data/you-dir.json' with { type: 'json' };
import hao from './data/hao.json' with { type: 'json' };
import ni from './data/ni.json' with { type: 'json' };
import wo from './data/wo.json' with { type: 'json' };
import ren from './data/ren.json' with { type: 'json' };
import yi from './data/yi.json' with { type: 'json' };
import er from './data/er.json' with { type: 'json' };
import san from './data/san.json' with { type: 'json' };
import ten from './data/shi-number.json' with { type: 'json' };
type Level = { id: string; category: string; title: string; instruction: string; alpha: number; nextStroke?: boolean; preview?: boolean };
const guided: Level = { id: 'full_guided', category: 'guided_trace', title: 'Mit voller Vorlage', instruction: 'Ziehe die Striche nach. Die kleine Zahl zeigt den Anfang; der nächste Strich wird vorgemacht.', alpha: .38, nextStroke: true };
const reduced: Level = { id: 'full_reduced', category: 'reduced_scaffold', title: 'Mit weniger Hilfe', instruction: 'Die Vorlage bleibt. Finde die Strichfolge jetzt selbst.', alpha: .28 };
const faint: Level = { id: 'faint_outline', category: 'reduced_scaffold', title: 'Mit blasser Vorlage', instruction: 'Schreibe noch einmal. Die blasse Form hilft dir beim Aufbau.', alpha: .12 };
const memory: Level = { id: 'brief_recall', category: 'free_recall', title: 'Kurz merken, dann schreiben', instruction: 'Schreibe jetzt aus dem Gedächtnis. Hilfe ist jederzeit möglich.', alpha: 0, preview: true };
export const delayed: Level = { id: 'delayed_recall', category: 'free_recall', title: 'Aus dem Gedächtnis', instruction: 'Schreibe ohne Vorlage. Wenn du sie brauchst, kannst du sie einblenden.', alpha: 0 };
// Authored starting hypothesis, not an adaptive engine or an optimal repetition count.
export const writingTargets = {
  'shui': {character:'水',data:twshui,levels:[guided,reduced,memory],intro:'Schau auf die Strichfolge. Schreibe dann mit und anschließend ohne Vorlage.'},
  'bei': {character:'杯',data:twbei,levels:[guided,reduced,memory],intro:'Schau auf die Strichfolge. Schreibe dann mit und anschließend ohne Vorlage.'},
  'yuan': {character:'元',data:twyuan,levels:[guided,reduced,memory],intro:'Schau auf die Strichfolge. Schreibe dann mit und anschließend ohne Vorlage.'},
  'bai': {character:'百',data:twbai,levels:[guided,reduced,memory],intro:'Schau auf die Strichfolge. Schreibe dann mit und anschließend ohne Vorlage.'},
  'zuo-dir': {character:'左',data:twzuo_dir,levels:[guided,reduced,memory],intro:'Schau auf die Strichfolge. Schreibe dann mit und anschließend ohne Vorlage.'},
  'you-dir': {character:'右',data:twyou_dir,levels:[guided,reduced,memory],intro:'Schau auf die Strichfolge. Schreibe dann mit und anschließend ohne Vorlage.'},
  'qu': {character:'去',data:twqu,levels:[guided,reduced,memory],intro:'Schau auf die Strichfolge. Schreibe dann mit und anschließend ohne Vorlage.'},
  'dao': {character:'到',data:twdao,levels:[guided,reduced,memory],intro:'Schau auf die Strichfolge. Schreibe dann mit und anschließend ohne Vorlage.'},
  'da': {character:'大',data:twda,levels:[guided,reduced,memory],intro:'Schau auf die Strichfolge. Schreibe dann mit und anschließend ohne Vorlage.'},
  'xiao': {character:'小',data:twxiao,levels:[guided,reduced,memory],intro:'Schau auf die Strichfolge. Schreibe dann mit und anschließend ohne Vorlage.'},

  hao: { character: '好', data: hao, levels: [guided, reduced, faint, memory], intro: 'Schau auf Reihenfolge und Richtung. Danach schreibst du selbst – erst mit viel, dann mit weniger Hilfe.' },
  ni: { character: '你', data: ni, levels: [{ ...guided, instruction: 'Die Schreibweise kennst du jetzt: erst nachziehen, dann mit weniger Hilfe schreiben.' }, faint, memory], intro: 'Dasselbe Vorgehen für „du“. Schau zuerst auf die sieben Striche.' },
  wo: { character: '我', data: wo, levels: [guided, { ...faint, alpha: .18, instruction: 'Achte auf die Kreuzungen und den langen gebogenen Strich. Die blasse Vorlage bleibt.' }, memory], intro: 'Jetzt „ich“. Achte besonders auf Richtungen, Kreuzungen und Haken.' },
  'ren': {character:'人',data:ren,levels:[guided,memory],intro:'Schau kurz auf die Strichrichtung. Einmal geführt, dann aus dem Gedächtnis.'},
  'yi': {character:'一',data:yi,levels:[guided,memory],intro:'Schau kurz auf die Strichrichtung. Einmal geführt, dann aus dem Gedächtnis.'},
  'er': {character:'二',data:er,levels:[guided,memory],intro:'Schau kurz auf die Strichrichtung. Einmal geführt, dann aus dem Gedächtnis.'},
  'san': {character:'三',data:san,levels:[guided,memory],intro:'Schau kurz auf die Strichrichtung. Einmal geführt, dann aus dem Gedächtnis.'},
  'shi-number': {character:'十',data:ten,levels:[guided,memory],intro:'Schau kurz auf die Strichrichtung. Einmal geführt, dann aus dem Gedächtnis.'},
};
