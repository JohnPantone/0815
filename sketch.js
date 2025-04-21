let newsList = ["Nachricht wird geladen..."];
let newsIndex = 0;
let charIndex = 0;
let frameCounter = 0;
let state = "typing"; // oder "pause", "next"
let displayText = "";
let displayDuration = 180; // 3 Sekunden Pause nach vollständiger Nachricht

function setup() {
  createCanvas(800, 600);
  textFont("Courier New");
  textSize(24);
  fill(0, 255, 0);
  noStroke();
  background(0);
  frameRate(30);
  fetchNews();
}

function draw() {
  background(0);

  let headline = newsList[newsIndex];
  let typedText = headline.slice(0, charIndex);

  textAlign(CENTER, CENTER);
  text(typedText, width / 2, height / 2);

  frameCounter++;

  if (state === "typing") {
    if (frameCounter % 2 === 0 && charIndex < headline.length) {
      charIndex++;
    } else if (charIndex >= headline.length) {
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
    } else {
      newsList = ["Keine Nachrichten gefunden."];
    }
  } catch (err) {
    console.error("Fehler beim Laden der Nachrichten:", err);
    newsList = ["Fehler beim Laden der Nachrichten."];
  }
}