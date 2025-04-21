let newsList = ["Nachrichten werden geladen..."];
let newsIndex = 0;
let currentText = "";
let charIndex = 0;
let frameCounter = 0;
let state = "typing";
let pauseDuration = 180;
let cursorVisible = true;

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont("Courier New");
  textSize(32);
  fill(0, 255, 0);
  noStroke();
  frameRate(30);
  textAlign(LEFT, CENTER);
  background(0);
  fetchNews();
  currentText = newsList[0];
}

function draw() {
  background(0);

  let visibleText = currentText.slice(0, charIndex);
  let baseX = (width - textWidth(currentText)) / 2;
  let baseY = height / 2;

  text(visibleText, baseX, baseY);

  // Blinkender Cursor ▌
  if (state === "typing" && cursorVisible) {
    let cursorX = baseX + textWidth(visibleText);
    text("▌", cursorX, baseY);
  }

  frameCounter++;

  // Cursor-Blinken
  if (frameCounter % 30 === 0) {
    cursorVisible = !cursorVisible;
  }

  // Schreibanimation
  if (state === "typing" && frameCounter % 2 === 0) {
    if (charIndex < currentText.length) {
      charIndex++;
    } else {
      state = "pause";
      frameCounter = 0;
    }
  }

  // Pause nach kompletter Nachricht
  if (state === "pause" && frameCounter > pauseDuration) {
    state = "next";
    frameCounter = 0;
  }

  // Nächste Nachricht
  if (state === "next") {
    newsIndex = (newsIndex + 1) % newsList.length;
    currentText = newsList[newsIndex];
    charIndex = 0;
    state = "typing";
    cursorVisible = true;
    frameCounter = 0;
  }
}

// RSS abrufen
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
    }
  } catch (err) {
    console.error("Fehler beim Laden der Nachrichten:", err);
    newsList = ["Fehler beim Laden der Nachrichten."];
  }
}

// Reaktion auf Fenstergröße
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}