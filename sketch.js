// Liste der geladenen Nachrichten (wird von fetchNews befüllt)
let newsList = ["Nachrichten werden geladen..."];

// Zusammengesetzter Text aus allen Nachrichten – hieraus wird getippt
let allText = "";

// Aktuelle Position im allText (welcher Buchstabe gerade geschrieben wird)
let currentIndex = 0;

// Position auf der x-Achse (linker Rand), aktuell fest auf 20px
let xPos = 20;

// Der bisher getippte Text (Zeichen für Zeichen zusammengesetzt)
let typedText = "";

// Zähler für Timing (Cursor-Blinken, Schreibgeschwindigkeit)
let frameCounter = 0;

// Sichtbarkeit des Cursors (für Blinken ein/aus)
let cursorVisible = true;

function setup() {
  createCanvas(windowWidth, windowHeight); // Canvas auf gesamte Fenstergröße
  background(0);                           // Schwarzer Hintergrund (VC-20 Stil)
  textFont("Courier New");                // Monospace-Schrift (typisch Retro)
  textSize(20);                           // Schriftgröße – HIER ÄNDERN
  fill(0, 255, 0);                         // Grün wie beim VC-20 – HIER ÄNDERN
  noStroke();                             
  frameRate(25);                          // Bildwiederholrate – HIER ÄNDERN (z. B. 30 für flüssiger)
  fetchNews();                            // RSS-Nachrichten laden
}

function draw() {
  background(0); // Bildschirm jedes Mal schwarz löschen

  // Den aktuellen Text mittig auf der Y-Achse anzeigen (eine Zeile)
  text(typedText, xPos, height / 2);

  // Blinkenden Cursor ▌ zeichnen, wenn er sichtbar sein soll
  if (cursorVisible) {
    let tw = textWidth(typedText);             // Breite des bisherigen Texts
    text("▌", xPos + tw, height / 2);          // Cursor direkt ans Textende setzen
  }

  // Schreibmaschinen-Effekt: alle 2 Frames einen neuen Buchstaben
  if (frameCounter % 2 === 0 && currentIndex < allText.length) {
    typedText += allText[currentIndex];        // nächsten Buchstaben hinzufügen
    currentIndex++;
  }

  // Cursor blinken lassen (alle 30 Frames umschalten)
  if (frameCounter % 30 === 0) {
    cursorVisible = !cursorVisible;
  }

  frameCounter++;
}

async function fetchNews() {
  const url = 'https://api.rss2json.com/v1/api.json?rss_url=https://rss.orf.at/news.xml';

  try {
    const res = await fetch(url);              // RSS abrufen
    const data = await res.json();

    if (data.items && data.items.length > 0) {
      newsList = data.items.map(item => item.title);     // Nur die Titel extrahieren
      currentText = newsList[0];            // Alle Nachrichten  – HIER ÄNDERN
    } else {
      allText = "Keine Nachrichten gefunden.";
    }
  } catch (err) {
    console.error("Fehler beim Laden der Nachrichten:", err);
    allText = "Fehler beim Laden der Nachrichten.";
  }
}

// Wenn das Fenster verändert wird, passe die Canvasgröße an
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}