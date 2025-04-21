let newsList = ["Nachrichten werden geladen..."];
let newsIndex = 0;
let timer = 0;
let displayDuration = 5 * 60; // 5 Sekunden bei 60 fps

function setup() {
  createCanvas(800, 600);
  background(0);
  textFont("Courier New");
  textAlign(CENTER, CENTER);
  fill(0, 255, 0);
  fetchNewsHeadlines();
  setInterval(fetchNewsHeadlines, 600000); // alle 10 Minuten
}

function draw() {
  background(0);

  let headline = newsList[newsIndex];
  let size = getFittingTextSize(headline);
  textSize(size);
  text(headline, width / 2, height / 2);

  timer++;
  if (timer > displayDuration) {
    timer = 0;
    newsIndex = (newsIndex + 1) % newsList.length;
  }
}

function getFittingTextSize(text) {
  let size = 48;
  while (textWidth(text) > width - 40 && size > 10) {
    size--;
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
  } catch (error) {
    console.error('Fehler beim Laden der RSS-Nachrichten:', error);
    newsList = ["Fehler beim Laden der Nachrichten."];
  }
}