let newsList = ["Nachricht wird geladen..."];
let newsIndex = 0;
let charIndex = 0;
let frameCounter = 0;
let state = "typing"; // oder "pause", "next"
let displayDuration = 180; // ca. 3 Sekunden Pause
let currentText = "";

function setup() {
  createCanvas(800, 600);
  textFont("Courier New");
  textSize(24);
  fill(0, 255, 0);
  frameRate(30);
  textAlign(LEFT, CENTER);
  noStroke();
  background(0);
  fetchNews();
  currentText = newsList[newsIndex];
}

function draw() {
  background(0);

  // Position: zentriert horizontal durch Berechnung der Textbreite
  let visibleText = currentText.slice(0, charIndex);
  let textWidthNow = textWidth(visibleText);
  let x = (width - textWidthNow) / 2;
  let y = height / 2;

  text(visibleText, x, y);

  frameCounter++;

  if (state === "typing" && frameCounter % 2 === 0) {
    if (charIndex < currentText.length) {
      charIndex++;
    } else {
      state = "pause";
      frameCounter = 0;
    }
  }

  else if (state === "pause") {
    if (frameCounter > displayDuration) {
      state = "next";
      frameCounter = 0;
    }
  }

  else if (state === "next") {
    newsIndex = (newsIndex + 1) % newsList.length;
    currentText = newsList[newsIndex];
    charIndex = 0;
    state = "typing";
    frameCounter = 0;
  }
}

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