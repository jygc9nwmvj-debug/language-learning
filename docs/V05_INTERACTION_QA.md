# v0.5 Interaction-Konsolidierung — QA

2026-09-30 · Basis `bebf0f8` / produktiver Code `b482fa6`. Regeln und vollständiges Zustandsinventar: [V05_INTERACTION_RULES.md](V05_INTERACTION_RULES.md).

## Ergebnis

- Produktionsbuild einschließlich Contentvalidator und TypeScript erfolgreich; 154 Funktionstests bestanden.
- 122 Browserfälle (61 Chrome, 61 WebKit) bestanden. Anschließend zwölf gezielte Transferfälle nach Entfernung der redundanten Kopfzeile erneut bestanden.
- 320 / 390 / 1280 Pixel; zusätzlich bestehende 768-Pixel-Startprüfung und Druckansicht. Screenshots unter `work/consolidation/`, lokale Galerie `work/consolidation/index.html` sowie vorhandene `work/v05-*`, `work/focus-*` und `work/ui1-*`-Aufnahmen. Dateien sind lokale QA-Artefakte, kein produktiver Testbereich.
- Visuell geprüft: Einstieg/Einstellungen; kurze und längere Phrase samt Entdeckung; richtige/unterstützte und fehlerhafte Textantwort; fehlende/falsche Töne; Gesamtvergleich; Zahlenfolge; Tonbeispiele/Quiz/Notation; Schreib-Fading und Abschluss; Transferfrage, Vergleich und Transkript. Layoutvergleich zwischen 320/390/Desktop und Chrome/WebKit, keine neue visuelle Designsprache.
- Details bewahren Position und Größe ihrer Phrase; Escape/Schließen stellt Fokus zurück. Kein horizontaler Überlauf in den geprüften Ansichten. Reduced Motion, sichtbarer Tastaturfokus und bestehende Touch-Ziele geprüft.
- Schreiben durchläuft alle vier Scaffold-Stufen, hält echte Ink-Geometrie und optionale Wiederholung. Papiervergleich vor Bildschirmantwort bleibt unterstützt. Reload erhält Antworten/Feedback und verhindert doppelte Transferbewertung.
- Aufnahmeprüfung ist Bedienungs-QA mit kontrollierter Medienfixture: Aufnahme/Stop/Replay/Retake, Referenzzuordnung und Weiter-Sperre. Keine Aussage zu echter Mikrofonqualität oder Safari-Pegel.

## Umfang und Grenzen

Geschützte fachliche Dateien sind gegenüber der Basis unverändert: Contentdaten, Antworten/Diagnose, Fortschrittsmodell, Scheduler, Transfer-Evidenz und Audio-Capture. In den UI-Komponenten bleiben Bewertungs-, Speicher- und Medienhandler unverändert; die Änderungen betreffen Darstellung, Texte, gemeinsame Controls und Fokus beim Schließen.

Die existierenden UI-Regressionen wurden auf bereits produktive Beschriftungen (Lernen starten, freiwillige Aufnahme), den vorhandenen Gesamtvergleich und vollständige Einführungsvoraussetzungen der Testfixtures angepasst. Veraltete künstliche Rundenabschlüsse werden nicht wiederhergestellt oder als Designziel getestet. Die drei späteren `tone-recall`-Definitionen sind keine neu eingeplanten Continuous-Aufgaben; ihre Logik bleibt unberührt.

Automatisierte UI-Prüfung ersetzt keine neue didaktische Wirksamkeitsbehauptung. Nach Veröffentlichung ist der Block abgeschlossen; weitere Veränderungen entstehen aus normaler Pilotnutzung, nicht aus einer weiteren automatischen Optimierungsrunde.
