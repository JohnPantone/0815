const COLS = 40;
const ROWS = 25;
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

let CHAR_SIZE;
let screen = [];
let newsList = ["Nachrichten werden geladen..."];
let newsIndex = 0;
let displayRow = 12;

let scrollPos = 0;
let frameCounter = 0;

function setup() {
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  const charWidth = CANVAS_WIDTH / COLS;
  const charHeight = CANVAS_HEIGHT / ROWS;
  CHAR_SIZE = Math.min(charWidth / 0.6, charHeight / 1.2);

  textFont('Courier New');
  textSize(CHAR_SIZE);
  fill(0, 255, 0);
  noStroke();
  background(0);

  initScreen();
  fetchNewsHeadlines();
  setInterval(fetchNewsHeadlines, 600000); // alle 10 Minuten
}

function initScreen() {
  for (let y = 0; y < ROWS; y++) {
    screen[y] = [];
    for (let x = 0; x < COLS; x++) {
      screen[y][x] = " ";
    }
  }
}

function clearLine(row) {
  for (let x = 0; x < COLS; x++) {
    screen[row][x] = " ";
  }
}

function writeScrollLine(col, row, fullText, offset) {
  let view = fullText.padEnd(fullText.length + COLS, " ").slice(offset, offset + COLS);
  for (let i = 0; i < COLS; i++) {
    screen[row][i] = view[i] || " ";
  }
}

function drawScreen() {
  background(0);
  for (let y = 0; y < ROWS; y++) {
    let line = screen[y].join('');
    text(line, 5, (y + 1) * CHAR_SIZE * 1.1);
  }
}

function draw() {
  drawScreen();

  frameCounter++;
  if (frameCounter % 3 === 0) {
    let currentText = newsList[newsIndex];

    writeScrollLine(0, displayRow, currentText, scrollPos);
    scrollPos++;

    if (scrollPos > currentText.length + COLS) {
      scrollPos = 0;
      newsIndex = (newsIndex + 1) % newsList.length;
    }
  }
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