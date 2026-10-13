# Lernzeit

Deine Lern-App ohne Installation von Paketen: HTML, CSS und JavaScript, ohne Konto, Werbung oder externe Bibliotheken.

## Auf GitHub hochladen

1. ZIP entpacken und bei GitHub ein neues Repository namens `lernzeit` anlegen.
2. Den **Inhalt** des Ordners `lernzeit` hochladen. `index.html` muss direkt im Repository liegen, nicht in einem weiteren Unterordner. Auch `icon.png`, `sw.js` und die übrigen Dateien hochladen.
3. Im Repository **Settings → Pages** öffnen. Unter **Build and deployment** die Quelle **Deploy from a branch** wählen, anschließend **main** und **/(root)** auswählen und speichern.
4. Nach der Veröffentlichung die dort angezeigte Adresse öffnen, normalerweise `https://DEIN-NAME.github.io/lernzeit/`.

Offizielle Anleitung: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

Es wurde noch kein Repository angelegt und nichts in deinem GitHub-Konto veröffentlicht. Lernstände und private Lernzettel gehören nicht ins öffentliche Repository: Importiere sie direkt in der App.

## Auf dem iPhone

Die GitHub-Pages-Adresse in Safari öffnen. Über **Teilen → Zum Home-Bildschirm** hinzufügen. Einmal online laden; anschließend stehen die App-Dateien offline zur Verfügung. Die App speichert Daten pro Browser und Adresse: Desktop, Safari und Home-Bildschirm können getrennte Datenbestände haben. Über JSON kannst du diese übertragen.

Zum schnellen Ausprobieren am Computer kannst du `index.html` öffnen. Für zuverlässige Speicherung und Offline-Installation bitte die HTTPS-Adresse über GitHub Pages verwenden.

## Lernen

- **Fokus:** Thema eintragen, Stoppuhr oder 25-Minuten-Fokus wählen, starten. Pausieren hält die Zeit an. **Abschließen** speichert die Sitzung und lässt den Garten wachsen.
- Die Stoppuhr rechnet anhand der Zeitstempel weiter, auch bei gesperrtem Bildschirm. Der Fokusblock endet nach 25 Minuten. iOS kann Webseiten im Hintergrund anhalten; es gibt deshalb keinen garantierten Alarm bei gesperrtem Bildschirm. Beim Zurückkehren wird die korrekte Zeit angezeigt.
- Tagesziele sind von 15 bis 120 Minuten einstellbar. Ab fünf Minuten zählt ein Lerntag. Alle 25 gespeicherten Minuten gibt es eine Pflanze, jede Stunde ein neues Level.
- **Lernwerkstatt:** Eigene Sets erstellen oder Dateien importieren. Im Editor pro Zeile `Frage | Antwort` schreiben. Der Lernzettel darf normaler Text sein.
- **Karteikarten:** Erst erinnern, dann aufdecken und ehrlich bewerten. Drei richtige Bewertungen in Folge markieren eine Karte als sicher. „Noch üben“ setzt diese Serie zurück.
- **Selbsttest:** Antwort eintippen und selbst mit der Musterlösung vergleichen. Es findet keine automatische Bewertung statt.
- Pro Runde erscheinen bis zu zehn Karten, nach Wiederholungszeit sortiert. Richtige Antworten werden nach 1, 3, 7, 14 und 30 Tagen fällig; schwierige Karten nach zehn Minuten. Auch noch nicht fällige Karten dürfen vorgezogen geübt werden.
- Der Timer startet beim Öffnen einer Karte nicht automatisch. Starte ihn im Fokusbereich, wenn du die Lernrunde zeitlich erfassen möchtest.
- **Fortschritt:** Wochenübersicht, Abzeichen und die letzten 50 Sitzungen. Alle Sitzungen bleiben in der Sicherung enthalten.
- Der Tag-/Nacht-Button wechselt das Design; die erste Ansicht folgt deinem System.

## V3: Vollständige Lernwerkstätten mit eigenem Menü

Die ursprüngliche `LF5-Lernapp-GitHub.zip` unter **Lernwerkstatt → Lernmaterial hochladen** erneut importieren. Sie erscheint jetzt unter **Deine vollständigen Lernwerkstätten → Werkstatt öffnen**. Die aus V2 vorhandenen flachen Lernsets bleiben zur Sicherheit erhalten. Bereits als sicher gelernte, identische Karten werden beim ersten vollständigen Import übernommen. Die Original-ZIP oder `content.js` ist erforderlich, weil in den flachen V2-Karten die interaktiven Aufgabentypen nicht mehr vollständig gespeichert waren. Alternativ `LF5-Lernwerkstatt-v3.json` verwenden.

Das eigene Werkstatt-Menü enthält:

- **Übersicht:** Modul-, Karten- und Rechenfortschritt sowie der nächste Lernschritt.
- **Lernmodule:** Alle acht Module mit Erklärungen, Formeln, Quellen und Abschluss-Häkchen. Passende Karten, Aufgaben und Modul-Wissenschecks sind direkt erreichbar.
- **Karteikarten:** Die 32 ursprünglichen Karten, nach Modul, Fälligkeit oder Unsicherheit filterbar; mit Aufdecken, Bewertung und Wiederholung nach einem bzw. drei Tagen.
- **Rechentraining:** 20 echte Rechenaufgaben mit Zahleneingabe, automatischer Prüfung, Toleranzen und Lösungsweg. Komma, Punkt und das Minuszeichen „−“ werden unterstützt.
- **Probetest:** Bis zu zwölf zufällige Aufgaben; bei LF5 sechs Theoriefragen und sechs Rechnungen. Automatische Auswertung, Fehlerliste, gezieltes Wiederholen und gespeicherte Ergebnisse. Ein laufender Test wird nach Neuladen fortgesetzt. Modul-Wissenschecks verwenden die Quizfragen des jeweiligen Moduls.
- **Lernplan:** Startdatum und Klausurdatum festlegen oder einen Termin aus dem Kalender übernehmen. Es entstehen Tagesaufgaben für Module, Karten, Rechnungen und Tests mit separat gespeicherten Häkchen. Der Plan wird aus den importierten Modulen neu erstellt; er ist nicht an den fest einprogrammierten Starttag der alten LF5-App gebunden. Bei weniger Tagen als Modulen weist die App auf zusätzliche Lerneinheiten hin.

Fortschritt und vollständige Werkstattinhalte sind in **Meine Daten → JSON-Sicherung** enthalten. **Werkstatt exportieren** exportiert nur die gewählte Werkstatt samt Fortschritt. Ein identischer Reimport überschreibt den vorhandenen Fortschritt nicht; zur vollständigen Wiederherstellung eine Gesamtsicherung verwenden. Die Werkstätten führen ihren eigenen Lernfortschritt; die Stoppuhr wird weiter im Fokusbereich gestartet.

Geprüft mit der Original-ZIP: alle sechs Menüpunkte, richtige Zahleneingabe, Probetest mit Zahlen- und Auswahlantworten, Fortsetzen nach Neuladen, Modulabschluss, Karteikarten, Kalenderdatum im Lernplan und Tageshäkchen. Automatisiert geprüft: exakte Inhaltsanzahl, numerische Toleranzen, Fehlerliste, einmalige Testauswertung, Lernplan und Backup-Roundtrip samt Werkstattfortschritt.

## Importformate und Klausurkalender

In **Lernwerkstatt → Lernmaterial hochladen** kannst du die Datei `LF5-Lernapp-GitHub.zip` direkt auswählen. Die App liest die enthaltene `content.js` als Daten, ohne hochgeladenen Programmcode auszuführen. Unterstützt werden ZIPs im Format dieser LF5-Lernwerkstatt mit `modules` und optional `exercises`, sowie ZIPs mit einem Lernset-JSON. Andere beliebige Website-ZIPs werden nicht als ausführbare Apps eingebettet.

Die LF5-Werkstatt bleibt strukturiert: **8 Module, 32 Karteikarten, 32 Quizfragen und 20 Rechenaufgaben**. Erklärungen, Formeln und Quellen stehen in den Lernmodulen. Quizfragen und Rechnungen behalten ihre eigenen interaktiven Lernmodi.

Nach dem Import kannst du über **Werkstatt öffnen** sofort beginnen. Inhalte bleiben nach dem Neuladen erhalten und werden in der vollständigen JSON-Sicherung mitgesichert. Identische Inhalte werden beim erneuten Import erkannt. ZIP maximal 10 MB, enthaltene Lerndatei maximal 5 MB. Sollte ein älterer Browser ZIP nicht unterstützen: ZIP in der Dateien-App entpacken und `dist/content.js` auswählen; alternativ die separat bereitgestellte `LF5-Lernwerkstatt-v3.json` importieren.

Unter **Kalender** kannst du Klausuren mit Datum, optionaler Uhrzeit, Ort und Vorbereitungsthemen eintragen. Pfeile wechseln den Monat; „Heute“ kehrt zum aktuellen Monat zurück. Termine lassen sich bearbeiten, als erledigt markieren und löschen. Die letzte Löschung lässt sich vor dem Neuladen über „Löschen rückgängig“ zurücknehmen. Die nächste anstehende Klausur erscheint mit Tagescountdown über den App-Bereichen. Es gibt keine Push-Benachrichtigung oder Synchronisierung mit Apple Kalender.

Klausuren werden ebenfalls lokal und in der JSON-Sicherung gespeichert. Sicherungen der ersten Version ohne Kalender bleiben kompatibel. Vor einem Update eine Sicherung herunterladen, dann die App-Dateien auf derselben GitHub-Pages-Adresse ersetzen. Alle App-Tabs schließen und neu öffnen, damit der aktualisierte Offline-Cache aktiviert wird.

## JSON und Lernzettel

Unter **Meine Daten** findest du Export und Import. `lernzeit-vorlage.json` ist ein direkt importierbares Beispiel.

```json
{
  "title": "Mein Lernset",
  "notes": "Hier steht mein Lernzettel.",
  "cards": [
    {"question": "Was möchte ich lernen?", "answer": "Die passende Antwort."}
  ]
}
```

Mehrere Sets können als Liste oder als `{ "decks": [...] }` importiert werden. TXT und Markdown werden als lesbare Lernzettel übernommen; Markdown bleibt Klartext. PDF, Word, Bilder und handschriftliche Notizen werden nicht automatisch erkannt. Deren Text vorher kopieren oder als TXT speichern. Es wird keine KI oder Cloud zur Verarbeitung aufgerufen.

Eine vollständige **JSON-Sicherung** enthält Lernzeiten, Lernsets, Kartenfortschritt, Klausurtermine und Einstellungen. Ihre Wiederherstellung ersetzt nach Bestätigung die bisherigen Daten. Eine beim Export laufende Sitzung wird beim Import als abgeschlossene Sitzung bis zum Exportzeitpunkt übernommen. Ein gewöhnliches Lernset wird dagegen hinzugefügt. Die LF5-ZIP und deren `content.js` sind direkt kompatibel. Fremde Sicherungsformate müssen ggf. in das dokumentierte Format umgewandelt werden. Die bisherige LF5-App ist in „Meine Daten“ verlinkt.

Importgrenzen: ZIP bis 10 MB, Lerndateien bis 5 MB, bis 200 Lernsets und 2.000 Karten je Set. Browser-Speicher ist begrenzt. Bei Speicherfehlern zeigt die App eine Meldung; dann sofort exportieren. Website-Daten nicht ohne Sicherung löschen. Es gibt keine automatische Gerätesynchronisierung.

## Technik und Prüfung

Statische Dateien, relative Pfade für GitHub-Projektseiten, lokaler Browser-Speicher und Service Worker. Bei Änderungen an den App-Dateien die Cache-Version in `sw.js` erhöhen; alle offenen App-Tabs schließen und neu öffnen.

Geprüft: JavaScript-Syntax; Logik für laufenden/pausierten Timer, Countdown-Begrenzung, Mitternacht, Lernserie, Sicherungsimport und Zurückweisen ungültiger Daten. Im Desktop-Browser geprüft: Start, Pause, Abschluss, Erhalt nach Neuladen, Hell-/Dunkelmodus, Lernkarten und Selbsttest. Zusätzlich: Original-LF5-ZIP importiert, acht Module und 84 Karten geprüft, importierte Karte geöffnet, Klausur gespeichert und nach Neuladen wiedergefunden. Kalender-Validierung sowie Sicherungen mit und ohne Termine automatisiert geprüft. Responsive DOM bei 390 × 844 geprüft. Ein echter iPhone-/Safari-Test und ein Offline-Test auf GitHub Pages stehen noch aus.
