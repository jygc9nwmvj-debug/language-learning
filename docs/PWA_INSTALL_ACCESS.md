# Optionaler mobiler Installationszugang

2026-10-04 · **implemented, not deployed** · Basis `main` `32bf477` · Branch `codex/pwa-install-hint`.

## Vorhandener Zustand und Lücke

`index.html` bindet das Manifest ein. Es definiert Root-ID/-Scope/-Start-URL, `display: standalone` und 192-/512-Pixel-Icons. Der Produktionsstart registriert den bestehenden Service Worker; der Build erzeugt einen vollständigen, inhaltsadressierten Assetcache. Offline-Status, Reparaturaktion und lokale Speicherung sind auf Home bereits erklärt.

Es gab keine Installationsaktion, kein `beforeinstallprompt`-Handling und keine Safari-Anleitung. Offlinebereitschaft allein beweist keine Chromium-Installierbarkeit. Manifest, Workerstrategie und Offlinevorbereitung benötigen für diesen Auftrag keine Änderung.

## Umsetzung und Entscheidungen

- Eine nachgeordnete Aktion „Zum Home-Bildschirm hinzufügen“ im vorhandenen `homeMeta`, unter den Speicher-/Offlineinformationen. Bestehende Utility-/Disclosure-Kontrollen, Typografie, Farben und 44-px-Bedienziele; keine weitere Karte und kein Overlay.
- Chromium: ein tatsächlich eingehendes Ereignis mit aufrufbarer `prompt()`-Methode wird vor dem Lazy-App-Import abgefangen. Dadurch geht es während App-/IndexedDB-Laden nicht verloren. Der native Dialog wird ausschließlich synchron aus dem bewussten Klick angestoßen. Ein Ereignis wird einmal verbraucht; Ablehnung/Fehler führen zu keinem automatischen Wiederholungsangebot in diesem Dokument.
- Safari auf iOS: native, anfänglich geschlossene `details` mit drei Anweisungsschritten. Seitenmenü/direktes Teilen, Home-Bildschirm-Aktion, gegebenenfalls „Aktionen bearbeiten“, „Als Web-App öffnen“ und abschließendes Hinzufügen. Texte anhand der [aktuellen Apple-Anleitung](https://support.apple.com/de-de/guide/iphone/iphea86e5236/ios) geprüft.
- `display-mode: standalone`, `fullscreen`, iOS `navigator.standalone`, `appinstalled` und spätere Display-Mode-Änderungen unterdrücken den Zugang. Desktop wird unabhängig von Fensterbreite ausgeschlossen.
- Feature Detection: Chromium-Ereignis und Prompt-Methode, Display-Mode-Abfragen, bevorzugt `userAgentData.mobile`. Nur für mobile Eligibility ohne Client Hints und Safari ohne Installations-API dient ein begrenzter UA-Fallback; iPad mit Desktop-UA wird über Plattform plus Touchpunkte berücksichtigt. Andere erkannte iOS-Browser/Webviews erhalten keine Safari-Anleitung.
- Flüchtiger Zustand ausschließlich im aktuellen Dokument; kein IndexedDB-/LocalStorage-Flag, keine Telemetrie, kein neues Paket. Home verlassen entfernt das UI; ein noch unverbrauchtes Ereignis bleibt für die Rückkehr erhalten. Reload wartet erneut auf ein tatsächliches Browserereignis; Safari-Details bleiben geschlossen.

Örtliche UI-Entscheidung: den vorhandenen Systeminformationsbereich nutzen. Die Projektregeln schreiben keinen konkreten Installationsslot vor. Zusätzlich wurde für beide Wege dieselbe Aktionsbezeichnung gewählt. Keine Content-, Planner-, Mastery- oder sonstige didaktische Entscheidung getroffen.

## QA und Coverage

Funktionale/Browser-Coverage **representative**. Population dieser Stichprobe: neue Eligibility- und Installationszustände sowie die unmittelbar betroffenen Home-/Resume-/Offlinewege auf Basis `32bf477` plus diesem Diff. Keine allgemeine Repo-, Content- oder Geräteabnahme.

- `npm test`: 235/235 bestanden, einschließlich fünf neuer Eligibilitytests (Client-Hint-Vorrang, Android/iPhone ohne Hints, Desktop/Touch-Desktop, iPad-Desktop-UA, andere iOS-Browser/Webview).
- `npm run build:test` und `npm run build`: bestanden, einschließlich TypeScript, Contentvalidierung und bestehender Text-/Resolution-Verträge im Produktionsbuild.
- `npx playwright test tests/browser/install.spec.ts --reporter=line`: 24/24 bestanden im Testbuild, zwölf Fälle je Chrome und Playwright WebKit. Native Ereignis vorhanden/fehlend, früh vor App-Laden, bewusster Klick mit User Activation, Annahme/Ablehnung/abgelaufenes Prompt, erneutes Ereignis nach Verbrauch, Safari geschlossen/geöffnet/per Tastatur geschlossen, First Run, Pause/Rückkehr/Reload/Weiterlernen, drei installierte Modi, `appinstalled`, Display-Mode-Wechsel, Desktop auch bei schmalem Fenster. Mobile 320/390 px, Desktop 320/1280 px. Prompt und Plattformzustände sind kontrollierte Simulationen, kein OS-Installationsdialog.
- `npx playwright test tests/browser/hosting.spec.ts tests/browser/continuous-boundaries.spec.ts --reporter=line`: 10/10 bestehende Regressionen bestanden im Produktionsbuild: Offline-Neuöffnung, Workerupdate mit zwei Tabs und erhaltener IndexedDB, unvollständiger Cache/Reparatur, Batch-Fortsetzung/Pause/Resume und Speicherrücknahme bei Fehlern, jeweils Chrome/WebKit.
- Layoutassertionen: mindestens 44 px Bedienziel, sekundäre transparente Aktion unter der Hauptaktion, kein horizontaler Überlauf. Safari-Aufklappen erhält die Position der Hauptaktion innerhalb der Startfläche. Der bestehende zentrierte Home-Container darf sich im Viewport neu ausrichten; kein Layoutumbau. Vier anfängliche Browserfehler betrafen genau diese zu strenge absolute Viewport-Testannahme; danach korrigierte Assertions und 24/24 bestanden.
- Repräsentative Sichtprüfung der erzeugten Screenshots: native Aktion bei 320 px/Chrome, aufgeklappte Safari-Anleitung bei 390 px/WebKit, Desktop bei 1280 px/Chrome. Keine visuelle Vollkombinatorik behauptet.

Text-/Quellinventar **exhaustive strukturell für den Diff**: 30/30 neue/geänderte Kandidaten explizit klassifiziert, einschließlich vier sichtbarer Textfamilien (Aktionslabel und drei Anleitungsschritte), eine ersetzte Komposition entfernt; fünf geänderte/neue Quellgrenzen geprüft. Der bestehende Gesamtledger bleibt mit 71 Quellen / 3.735 Einträgen / 0 unklassifiziert gültig. Das ist kein neuer semantischer Audit des gesamten Altbestands. Resolution-Population und Matching-Inventar unverändert; nur der nach Diffreview erneuerte `LessonRunner`-Fingerprint ändert sich, da ausschließlich ein Import und ein Home-Kind hinzugekommen sind.

## Grenzen und Veröffentlichung

Echte Android-/iPhone-Geräte, native Installationsdialoge, Safari-Systemmenü, Home-Bildschirm-Start und Flugmodus bleiben Geräteprüfungen. Playwright WebKit ersetzt iOS Safari nicht. Chromium entscheidet selbst, wann es `beforeinstallprompt` liefert; ausbleibendes Ereignis wird nicht als Installierbarkeit ausgegeben. Safari kann nicht zuverlässig offenlegen, ob eine Website bereits zum Home-Bildschirm hinzugefügt wurde, wenn sie erneut als normaler Browser-Tab geöffnet wird; versteckt wird der Zugang beim tatsächlichen Standalone-Start.

Kein Merge und kein Deployment. Der Commit erhält das im Projekt dokumentierte `[CF-Pages-Skip]`-Präfix, das laut [Cloudflare Git-Integration](https://developers.cloudflare.com/pages/configuration/git-integration/github-integration/#skipping-a-build-via-a-commit-message) auch ein automatisches Preview-Deployment beim Branch-Push auslässt. Der Implementierungscommit ist über die Branch-Historie nachvollziehbar; keine noch nicht existente Commit-ID in diesem Dokument.

## Betroffene Dateien und eigener Diffreview

App: `src/main.tsx`, `src/core/offline/install.ts`, `src/app/InstallAccess.tsx`, `src/app/LessonRunner.tsx`, `src/app/app.css`.

Tests: `tests/install.test.mjs`, `tests/browser/install.spec.ts`, `playwright.config.ts`.

Verträge/Dokumentation: `qa/ui-text/inventory.json`, `qa/resolution/coverage.json`, `docs/V05_STATUS.md`, `docs/PWA_INSTALL_ACCESS.md`.

Eigener Diffreview: Startup-Capture vor Lazy-App-Import, Click/User-Activation und Einmalverbrauch, installierte/desktop/ereignislose Sibling-Cases, Home-only-Mount, bestehende Lern-/Speicherrouten, CSS-Scope und einzeln klassifizierte Textpfade geprüft. Ledgerformatierung erhalten; kein Vollumbau. Kein offener Befund im begrenzten Diffreview; die genannten realen Gerätegrenzen bleiben bestehen.
