# Begrenzter Polly-Abnahmetest

Start im Repository: `python3 -m http.server 4183 --bind 127.0.0.1 --directory tools/polly-controlled`

Keine PWA-Integration und kein Deployment. Manifest enthält jedes verwendete SSML, Anbieterparameter und Dateihashes. 15 erfolgreiche Syntheseaufträge. Drei vorausgehende lokale CLI-Parameterfehler erzeugten kein Audio. Keine nachträgliche Audioänderung. Alte ma-Dateien unter baseline/; sämtliche neuen ma-Dateien sind bytegleich.

Chrome und WebKit: alle 15 Dateien decodiert, Kern-/Optionalgruppen, persistente Bewertungen, Export, Reset, exklusives Abspielen und Mobilbreite geprüft. Keine Änderungen an Produktcode; deshalb keine erneute App-Testsuite erforderlich.

Lokale Authentifizierung über AWS-Profil außerhalb des Repositories; Zugangsdaten sind nicht Teil dieses Pakets. Bewertungen werden nur unter dem eigenen LocalStorage-Schlüssel a2-polly-controlled-v1 gespeichert.
