# A2: einmaliger lokaler TTS-Vergleich

Kein Produktbestandteil. Keine Integration in `public/`, keinen Deploy ausführen.

Öffnen: im Repository `python3 -m http.server 4182 --bind 127.0.0.1 --directory tools/audio-bakeoff/page`, danach http://127.0.0.1:4182/. Alle 45 Dateien liegen bei; keine Modelle für die Hörseite nötig. `methodology.md` enthält Ergebnis, Grenzen, Lizenzen und Versuchsaufbau. `page/provenance.json` ordnet Hashes zu Text, Pinyin, Engine und Parametern zu. `page/screening.json` enthält Messungen und ASR.

Die Skripte dokumentieren den begrenzten Versuch, sind keine neue Audio-Pipeline. Für Wiederholung offizielle Repos in `MeloTTS/` bzw. `CosyVoice/` mit Revisionen aus `code-sources.json` klonen (Cosy mit Submodulen), offizielle Gewichte aus `model-sources.json` nach `models/<Modellname>/` laden und die getrennten Python-Umgebungen laut `*-environment.txt` herstellen. Diese Paketlisten sind ein Umgebungsprotokoll, kein plattformunabhängiger Installer; lokale editable-Pfade anpassen. Die beschriebenen Mac-Kompatibilitätskorrekturen stehen in den Generatoren. Modelle, Caches und Umgebungen werden nicht mitgeliefert.

Generatoren schreiben `generated/<engine>/manifest.json`; `screen.py`, `asr.py` und `build-page.py` erzeugen die eingefrorene Vergleichsseite. Nicht bestehende Versuchsergebnisse überschreiben, wenn ein neuer Versuch durchgeführt wird; eigene Kopie/Versuchs-ID verwenden. Alle Quellen und Rohparameter bleiben nachprüfbar, keine nachträgliche Audioveränderung. Die Hörseite speichert ausschließlich optionale Vergleichsnotizen im eigenen LocalStorage-Schlüssel.
