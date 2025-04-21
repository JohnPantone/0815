let newsList = ["Nachrichten werden geladen..."];
let allText = "";             // gesamter Text als Ticker
let currentIndex = 0;         // aktueller Buchstabe
let xPos = 00;                // Startposition
let typedText = "";
let frameCounter = 0;
let cursorVisible = true;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  textFont("Courier New");
  textSize(32);
  fill(0, 255, 0);
  noStroke();
  frameRate(30);
  fetchNews();
}

function draw() {
  background(0);

  // Text schreiben
  text(typedText, 20, height / 2);

  // Blinkender Cursor
  if (cursorVisible) {
    let tw = textWidth(typedText);
    text("▌", 20 + tw, height / 2);
  }

  // Animation: Zeichen für Zeichen aufbauen
  if (frameCounter % 2 === 0 && currentIndex < allText.length) {
    typedText += allText[currentIndex];
    currentIndex++;
  }

  // Cursor-Blink
  if (frameCounter % 30 === 0) {
    cursorVisible = !cursorVisible;
  }

  frameCounter++;
}

async function fetchNews() {
  const url = 'https://api.rss2json.com/v1/api.json?rss_url=https://rss.orf.at/news.xml';
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.items && data.items.length > 0) {
      newsList = data.items.map(item => item.title);
      allText = newsList.join("  //  "); // Trennung zwischen Nachrichten
    } else {
      allText = "Keine Nachrichten gefunden.";
    }
  } catch (err) {
    console.error("Fehler beim Laden der Nachrichten:", err);
    allText = "Fehler beim Laden der Nachrichten.";
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}