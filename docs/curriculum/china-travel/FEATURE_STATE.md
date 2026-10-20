# Vorläufiges Material im bestehenden Feature Branch

20. Oktober 2026 · Abgleich vorhandener Arbeitsdokumente mit dem Dateistand

Die vorhandenen Dokumente docs/mobile-v2/CURRICULUM_REVIEW.md und docs/mobile-v2/IMPLEMENTATION.md im Worktree stable-learning-layout sind die Grundlage dieses Nachweises. Es wurde kein neuer QA-Audit des Prototyps durchgeführt. Der Planungsworktree china-travel-curriculum startet separat auf origin/main f7fbfdb3baa488e7dd931f55c86fba1472455d82.

## Dokumentierter Inhalt und Abgrenzung

- Feature-Branch: feature/mobile-learning-v2; HEAD f7fbfdb3baa488e7dd931f55c86fba1472455d82. Die Arbeiten liegen lokal als nicht committete Änderungen vor.
- Getränkestand: elf kanonische neue Worteinträge, zwölf vorläufige ganze Items. IDs: cha, shui, bei, yao, re, bing, order-tea, hot-or-iced, iced-please, hot-please, price-question, price-thirty. Das JSON bestätigt 11 und 12. Der zusätzliche Wasser-Ausdruck wäre laut Arbeitsdokument nur ein Vorschlag für ein dreizehntes Item.
- Die bestehende Freigabevorlage beschreibt 48 abgeleitete Aufgabendefinitionen, einen siebenteiligen Dialogentwurf, zwölf weitere Matching-Varianten und mobile Layout-/Feedbackversuche. Das sind dokumentierte Entwürfe, keine hier erneut geprüften Produktionsfähigkeiten.
- Die Freigabevorlage dokumentiert null neue Audios, null ergänzte/geänderte Manifesteinträge und einen früheren Dry-Run mit 24 fehlenden Referenzen. In diesem Auftrag wurde auch kein Audio-Dry-Run erneut ausgeführt.
- Der Dateiabgleich ergibt null geänderte versionierte Audiodateien oder Manifestdateien und null unversionierte Lern-Audiodateien. In der vorbereiteten Python-Prüfumgebung liegen 20 SciPy-WAV-Testfixtures; das sind Bibliotheks-Testdaten, keine synthetisierten Lern-Audios. Abgrenzung: Mediendateien im Feature-Worktree, ohne node_modules, .git und dist; die Python-Testfixtures sind gesondert klassifiziert. Daraus wird keine akustische oder Native-Abnahme vorhandener Audios abgeleitet.
- Im Entwurf mechanisch gesetztes source_checked ist laut Freigabevorlage kein Beleg einer abgeschlossenen linguistischen QA. Keine Reviewfreigabe wird übernommen.

## Dateistand

Die erfasste Population sind die zehn gegenüber HEAD geänderten versionierten Dateien und sechs unversionierten Dateien aus dem Git-Status. Alle 16 bleiben am bisherigen Ort. Bibliotheken und Buildausgaben sind nicht Teil dieser Quelländerungspopulation.

| Status | Datei | Umgang in diesem Auftrag |
| --- | --- | --- |
| geändert | src/app/LessonRunner.tsx | bleibt ausschließlich im Feature-Arbeitsstand |
| geändert | src/app/app.css | bleibt ausschließlich im Feature-Arbeitsstand |
| geändert | src/core/exercises/SpeakingPractice.tsx | bleibt ausschließlich im Feature-Arbeitsstand |
| geändert | src/languages/mandarin/components/Exercise.tsx | bleibt ausschließlich im Feature-Arbeitsstand |
| geändert | src/languages/mandarin/components/MatchingExercise.tsx | bleibt ausschließlich im Feature-Arbeitsstand |
| geändert | src/languages/mandarin/components/ProductionFeedback.tsx | bleibt ausschließlich im Feature-Arbeitsstand |
| geändert | src/languages/mandarin/content/index.ts | bleibt ausschließlich im Feature-Arbeitsstand |
| geändert | src/languages/mandarin/displayDiagnosis.ts | bleibt ausschließlich im Feature-Arbeitsstand |
| geändert | src/languages/mandarin/matching.ts | bleibt ausschließlich im Feature-Arbeitsstand |
| geändert | src/languages/mandarin/schema/content.ts | bleibt ausschließlich im Feature-Arbeitsstand |
| unversioniert | docs/mobile-v2/CURRICULUM_REVIEW.md | bleibt ausschließlich im Feature-Arbeitsstand |
| unversioniert | docs/mobile-v2/IMPLEMENTATION.md | bleibt ausschließlich im Feature-Arbeitsstand |
| unversioniert | src/core/exercises/LearningViewport.tsx | bleibt ausschließlich im Feature-Arbeitsstand |
| unversioniert | src/languages/mandarin/components/DialogueExercise.tsx | bleibt ausschließlich im Feature-Arbeitsstand |
| unversioniert | src/languages/mandarin/content/drink-counter.json | bleibt ausschließlich im Feature-Arbeitsstand |
| unversioniert | src/languages/mandarin/dialogue.ts | bleibt ausschließlich im Feature-Arbeitsstand |

Der Planungsbranch enthält diese Änderungen nicht. Insbesondere werden weder drink-counter.json noch Dialog-/Matching-/Layoutcode importiert, verschoben, gestasht oder bereinigt. Der neue Curriculumplan kann später fachlich geeignete Ansätze aufgreifen, ohne den vorläufigen Entwurf dadurch freizugeben.

## Referenzfingerprints

Die Fingerprints binden die Zusammenfassung an den gelesenen Arbeitsstand. Sie sind keine Qualitätsnachweise.

| Referenz im Feature-Worktree | SHA 256 |
| --- | --- |
| docs/mobile-v2/CURRICULUM_REVIEW.md | af943b4d09dd78cc70ee9fa144abebd55b3560be39f8e55a8779489cd270f790 |
| docs/mobile-v2/IMPLEMENTATION.md | 1307c05921b914ebaa2b0b5e4f5da32a1366f04a2c9ce427642d1610ff48cd89 |
| src/languages/mandarin/content/drink-counter.json | 09c50f4d09e6772ddb4aae2af636df5c21618d171474733076ae4cce57ee86c1 |

Die Quellen dieses Nachweises liegen im benachbarten Worktree stable-learning-layout. Die dortigen Arbeitsdokumente waren zum Abgleich unversioniert und sind daher kein Bestandteil von main. Der Abschlussabgleich bestätigt den identischen Git-Status und unveränderte Fingerprints für 16 von 16 erfassten Dateien. Die Isolation beruht auf getrennten Worktrees und einem reinen Dokumentationscommit; der Feature-Branch bleibt unverändert pausiert.
