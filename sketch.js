// -----------------------------
// GRUNDEINSTELLUNG
// -----------------------------
const COLS = 40;
const ROWS = 25;
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

let CHAR_SIZE;
let screen = [];

function setup() {
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);

  const charWidth = CANVAS_WIDTH / COLS;
  const charHeight = CANVAS_HEIGHT / ROWS;
  CHAR_SIZE = Math.min(charWidth / 0.6, charHeight / 1.2);

  textFont('Courier New');
  textSize(CHAR_SIZE);
  fill(0, 255, 0);
  background(0);
  noStroke();

  initScreen();
  fetchNewsHeadlines(); // beim Start laden
  setInterval(fetchNewsHeadlines, 600000); // alle 10 Minuten
}
// -----------------------------
// BILDSCHIRM
// -----------------------------
function initScreen() {
  for (let y = 0; y < ROWS; y++) {
    screen[y] = [];
    for (let x = 0; x < COLS; x++) {
      screen[y][x] = " ";
    }
  }
}

function writeText(col, row, text) {
  for (let i = 0; i < text.length && col + i < COLS; i++) {
    screen[row][col + i] = text[i];
  }
}

function clearLine(row) {
  for (let x = 0; x < COLS; x++) {
    screen[row][x] = " ";
  }
}

function drawScreen() {
  background(0);
  for (let y = 0; y < ROWS; y++) {
    let line = screen[y].join('');
    text(line, 5, (y + 1) * CHAR_SIZE * 1.1);
  }
}

// -----------------------------
// NEWS-TICKER-LOGIK
// -----------------------------
let newsList = ["Nachrichten werden geladen..."];
let newsIndex = 0;
let currentText = "";
let displayRow = 12;

let state = "typing"; // "typing", "pause", "clearing"
let charIndex = 0;
let frameCounter = 0;

function draw() {
  drawScreen();

  frameCounter++;

  if (state === "typing" && frameCounter % 2 === 0) {
    if (charIndex < newsList[newsIndex].length) {
      currentText += newsList[newsIndex][charIndex];
      charIndex++;
      clearLine(displayRow);
      writeText(0, displayRow, currentText);
    } else {
      state = "pause";
      frameCounter = 0;
    }
  }

  else if (state === "pause" && frameCounter > 90) {
    state = "clearing";
    frameCounter = 0;
  }

  else if (state === "clearing" && frameCounter % 1 === 0) {
    if (currentText.length > 0) {
      currentText = currentText.slice(0, -1);
      clearLine(displayRow);
      writeText(0, displayRow, currentText);
    } else {
      newsIndex = (newsIndex + 1) % newsList.length;
      charIndex = 0;
      currentText = "";
      state = "typing";
      frameCounter = 0;
    }
  }
}

// -----------------------------
// NEWS AUS DEM INTERNET LADEN
// -----------------------------
const NEWS_API_KEY = '29113b11446e4c15b89a9b9ec8d91db4';

async function fetchNewsHeadlines() {
  const url = `https://newsapi.org/v2/top-headlines?country=at&language=de&pageSize=10&apiKey=${NEWS_API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    newsList = data.articles.map(article => article.title);
    newsIndex = 0;
  } catch (error) {
    console.error('Fehler beim Laden:', error);
    newsList = ["Fehler beim Laden der Nachrichten."];
  }
}

