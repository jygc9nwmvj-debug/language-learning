# Taiwan-Lernstrecke: veröffentlichter Stand

20. Oktober 2026 · Merge und Veröffentlichung ausdrücklich durch Nutzer freigegeben.

- Integration: `02140dc`; Freigabevermerk: `4c89dc2` auf `implement/taiwan-text`.
- Zusammengeführt und ausgeliefert: `d2884de8a606b6aabb971fce6afafdac9647ce3e` auf `main`. Produktquellen sind identisch zum getesteten Integrationsstand; keine Merge-Konflikte.
- Checkout: `/Users/wolframhuke/.codex/.chatgpt-projects/g-p-6ab9048710f881919c6db293a9c2c198/china-travel-curriculum`, aktuell `main`.
- Live: https://language-learning-abk.pages.dev/
- Cloudflare-Deployment: `4e582a54-576c-4001-abc8-a5c7828534cc`, GitHub-Check „Cloudflare Pages“ abgeschlossen mit `success`.
- Unveränderliches Deployment: https://4e582a54.language-learning-abk.pages.dev/

## Ausgeführte technische Nachweise

Vor dem Merge: `npm test` mit 247/247 bestandenen Node-Tests, darin UI-Textinventar und Resolution-Vertrag; `npm run build` erfolgreich. 22/22 repräsentative Chrome-/WebKit-Fälle, einschließlich echter Satz-/Wortwiedergabe, Text-Hilfe, Wiederherstellung, Laut–Hanzi-Matching sowie Dialog normal/langsam. Umfang, Auswahl und Grenzen stehen in [POLLY_AUDIO.md](POLLY_AUDIO.md). Der Merge hat keine Produktdateien gegenüber diesem getesteten Stand geändert; keine weitere allgemeine QA-Runde.

Nach der Veröffentlichung einmal im frischen Chrome-Kontext auf der Live-Adresse geprüft: App-Bundle und Service Worker stimmen mit lokalem Produktionsbuild überein; Taiwan-Lernstrecke erreichbar; echte Wiedergabe samt Abschluss funktioniert; keine JavaScript-Seitenfehler. Fünf repräsentative ausgelieferte Audiodateien (Wort, Satz normal/langsam, G07 normal/langsam) stimmen bytegenau mit ihren Manifest-Prüfsummen überein. Die ausgelieferte Offline-Dateiliste enthält 572/572 neue Audios. Das ist eine Auslieferungsprobe, kein vollständiger Geräte-/Flugmodus- oder muttersprachlicher Test.

## Übergabe und verbleibende Grenze

Manifest: [POLLY_AUDIO_MANIFEST.json](POLLY_AUDIO_MANIFEST.json). Exakter Umfang: [POLLY_AUDIO_COUNTS.json](POLLY_AUDIO_COUNTS.json). Integrationsbericht und technische/representative Abdeckung: [POLLY_AUDIO.md](POLLY_AUDIO.md). Kanon: [editorial/editorial.json](editorial/editorial.json); unverändert `a3a76c9943691bcdc59420da9a41b72cbf818134402341d26f25e1fc11cee7d7`.

Keine menschliche oder muttersprachliche Audioabnahme verfügbar. Nutzer hat die Veröffentlichung mit dieser offen dokumentierten Grenze freigegeben. Manifeststatus bleibt `needs_human_review`. AWS Zhiyu/cmn-CN spricht sämtliche Rollen; keine Taiwan-Akzent- oder Mehrstimmenzertifizierung. Taiwan-Wortwahl bleibt erhalten. Es wurden keine weiteren akustischen oder redaktionellen Freigaben erfunden. Der andere Feature-Worktree und dessen vorläufige Materialien bleiben unverändert und isoliert.

Das folgende Live-Ergebnis stammt aus dem einzelnen Auslieferungstest:

```json
{
  "origin": "https://language-learning-abk.pages.dev",
  "bundle": "/assets/index-C4Xj9jAa.js",
  "appLoaded": true,
  "newCourseReachable": true,
  "realPlayback": true,
  "audioSamplesVerified": 5,
  "offlineInventory": 572,
  "serviceWorkerMatches": true,
  "consoleErrors": []
}
```
