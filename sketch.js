let newsList = ["Nachrichten werden geladen..."];
let currentText = "";
let typedText = "";
let newsIndex = 0;
let frameCounter = 0;
let cursorVisible = true;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  textFont("Courier New");
  textSize(20);
  fill(0, 255, 0);
  noStroke();
  frameRate(30);
  fetchNews();
}

function draw() {
  background(0);

  let x = 20;
  let y = height / 2;

  // Immer Text zeigen, auch wenn leer
  if (typedText.length === 0 && currentText.length > 0) {
    typedText = currentText[0]; // Notlösung für Start
  }

  text(typedText, x, y);

  if (cursorVisible) {
    let tw = textWidth(typedText);
    text("▌", x + tw, y);
  }

  frameCounter++;

  if (frameCounter % 30 === 0) {
    cursorVisible = !cursorVisible;
  }

  if (frameCounter % 2 === 0) {
    if (typedText.length < currentText.length) {
      typedText += currentText[typedText.length];
    } else if (frameCounter > 100) {
      nextMessage();
    }
  }
  console.log("📺:", { currentText, typedText });
}

function nextMessage() {
  frameCounter = 0;
  newsIndex = (newsIndex + 1) % newsList.length;
  currentText = newsList[newsIndex];
  typedText = "";
  cursorVisible = true;
  console.log("🔁 nächste Nachricht:", currentText);
}

async function fetchNews() {
  const url = 'https://api.rss2json.com/v1/api.json?rss_url=https://rss.orf.at/news.xml';

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.items && data.items.length > 0) {
      newsList = data.items.map(item => item.title);
      currentText = newsList[0];
      typedText = ""; // ← wird durch draw() aufgebaut
      console.log("📰 News erhalten:", newsList);
    } else {
      newsList = ["Keine Nachrichten gefunden."];
      currentText = newsList[0];
    }
  } catch (err) {
    console.error("Fehler beim Laden:", err);
    newsList = ["Fehler beim Laden der Nachrichten."];
    currentText = newsList[0];
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}