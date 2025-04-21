// Liste der geladenen Nachrichten (wird von fetchNews befüllt)
let newsList = ["Nachrichten werden geladen..."];

// Zusammengesetzter Text aus allen Nachrichten – hieraus wird getippt
let allText = "";

let currentText = "";      // aktuelle Nachricht
let typedText = "";        // Zeichen für Zeichen aufgebaut
let newsIndex = 0;         // aktuelle Position in newsList

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

background(0);

text(typedText, xPos, height / 2);

// Blinkender Cursor
if (cursorVisible) {
  let tw = textWidth(typedText);
  text("▌", xPos + tw, height / 2);
}

frameCounter++;

// Cursor blinkt alle 30 Frames
if (frameCounter % 30 === 0) {
  cursorVisible = !cursorVisible;
}

// Zeichenweise aufbauen
if (frameCounter % 2 === 0) {
  if (typedText.length < currentText.length) {
    typedText += currentText[typedText.length];
  } else if (frameCounter > 100) { // Pause nach vollständigem Satz
    nextMessage();
  }
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