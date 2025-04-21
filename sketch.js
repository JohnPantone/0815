let newsList = ["Nachrichten werden geladen..."]; // Initialtext
let currentText = "";       // aktuell angezeigte Nachricht
let typedText = "";         // aktueller Tippprozess
let newsIndex = 0;          // Index in der Nachrichtenliste
let frameCounter = 0;       // für Timing und Animation
let cursorVisible = true;   // blinkender Cursor

function setup() {
  createCanvas(windowWidth, windowHeight);      // voller Bildschirm
  background(0);                                // schwarzer Hintergrund
  textFont("Courier New");                      // Retro-Schriftart
  textSize(20);                                 // HIER: Schriftgröße ändern
  fill(0, 255, 0);                               // grün wie VC-20
  noStroke();
  frameRate(30);                                // Bildrate
  fetchNews();                                  // RSS abrufen
}

function draw() {
  background(0); // Bildschirm löschen

  let x = 20;                  // linker Rand
  let y = height / 2;          // mittig vertikal

  text(typedText, x, y);       // aktuellen Text anzeigen

  if (cursorVisible) {
    let tw = textWidth(typedText);
    text("▌", x + tw, y);      // blinkender Cursor direkt danach
  }

  frameCounter++;

  // Cursor blinkt alle 30 Frames (ca. 1 Sekunde)
  if (frameCounter % 30 === 0) {
    cursorVisible = !cursorVisible;
  }

  // Tippe Zeichen für Zeichen (alle 2 Frames)
  if (frameCounter % 2 === 0) {
    if (typedText.length < currentText.length) {
      typedText += currentText[typedText.length];
    }
    // Wenn komplett getippt → warte, dann nächste Nachricht
    else if (frameCounter > 100) {
      nextMessage();
    }
  }
}

function nextMessage() {
  frameCounter = 0;
  newsIndex = (newsIndex + 1) % newsList.length;
  currentText = newsList[newsIndex];
  typedText = "";
  cursorVisible = true;
}

// RSS-Feed laden
async function fetchNews() {
  const url = 'https://api.rss2json.com/v1/api.json?rss_url=https://rss.orf.at/news.xml';

  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.items && data.items.length > 0) {
      newsList = data.items.map(item => item.title);
      currentText = newsList[0];
    } else {
      newsList = ["Keine Nachrichten gefunden."];
      currentText = newsList[0];
    }
  } catch (err) {
    console.error("Fehler beim Laden der Nachrichten:", err);
    newsList = ["Fehler beim Laden der Nachrichten."];
    currentText = newsList[0];
  }
}

// Fenstergröße anpassen
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}