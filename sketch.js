let newsList = ["Lade Nachrichten ..."];
let newsIndex = 0;
let currentText = "";
let charIndex = 0;
let state = "typing";
let frameCounter = 0;

function setup() {
  createCanvas(800, 600);
  background(0);
  textFont("Courier New");
  textAlign(LEFT, CENTER);
  fill(0, 255, 0);
  fetchNewsHeadlines();
  setInterval(fetchNewsHeadlines, 600000); // alle 10 Minuten
}

function draw() {
  background(0);
  textSize(getFittingTextSize(currentText.slice(0, charIndex)));

  text(currentText.slice(0, charIndex), 30, height / 2);

  frameCounter++;
  if (state === "typing" && frameCounter % 2 === 0) {
    if (charIndex < currentText.length) {
      charIndex++;
    } else {
      state = "pause";
      frameCounter = 0;
    }
  } else if (state === "pause" && frameCounter > 90) {
    state = "clearing";
    frameCounter = 0;
  } else if (state === "clearing" && frameCounter % 1 === 0) {
    if (charIndex > 0) {
      charIndex--;
    } else {
      newsIndex = (newsIndex + 1) % newsList.length;
      currentText = newsList[newsIndex];
      state = "typing";
      frameCounter = 0;
    }
  }
}

function getFittingTextSize(text) {
  let size = 48;
  while (textWidth(text) > width - 60 && size > 10) {
    size -= 1;
    textSize(size);
  }
  return size;
}

async function fetchNewsHeadlines() {
  const rssUrl = 'https://api.rss2json.com/v1/api.json?rss_url=https://rss.orf.at/news.xml';

  try {
    const response = await fetch(rssUrl);
    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      throw new Error("Keine Artikel gefunden.");
    }

    newsList = data.items.map(item => item.title);
    newsIndex = 0;
    currentText = newsList[newsIndex];
  } catch (error) {
    console.error('Fehler beim Laden der RSS-Nachrichten:', error);
    newsList = ["Fehler beim Laden der Nachrichten."];
    currentText = newsList[0];
  }
}