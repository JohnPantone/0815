let newsList = ["Nachricht wird geladen..."];
let currentText = "";
let typedText = "";
let newsIndex = 0;
let charIndex = 0;
let frameCounter = 0;
let state = "typing";
let cursorVisible = true;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  textFont("Courier New");
  textSize(24);
  fill(0, 255, 0);
  noStroke();
  frameRate(30);
  fetchNews();
}

function draw() {
  background(0);


  let y = height / 2;
  let textWidthNow = textWidth(typedText);
  let x = (width - textWidthNow) / 2;
  text(typedText, x, y);

  text("▌", x + textWidth(typedText), y);

  }

  frameCounter++;

  if (frameCounter % 30 === 0) {
    cursorVisible = !cursorVisible;
  }

  if (state === "typing" && frameCounter % 2 === 0) {
    if (charIndex < currentText.length) {
      typedText += currentText[charIndex];
      charIndex++;
    } else {
      state = "pause";
      frameCounter = 0;
    }
  }

  if (state === "pause" && frameCounter > 90) {
    showNextMessage();
  }
}

function showNextMessage() {
  newsIndex = (newsIndex + 1) % newsList.length;
  currentText = newsList[newsIndex];
  typedText = "";
  charIndex = 0;
  frameCounter = 0;
  state = "typing";
  cursorVisible = true;
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
      currentText = newsList[0];
    }
  } catch (err) {
    newsList = ["Fehler beim Laden der Nachrichten."];
    currentText = newsList[0];
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}