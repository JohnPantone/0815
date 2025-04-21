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
  fetchNewsHeadlines();
  setInterval(fetchNewsHeadlines, 600000); // alle 10 Minuten
}

// -----------------------------
// BILDSCHIRM-FUNKTIONEN
// -----------------------------
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
  
  function writeSingleLineAnimated(col, row, text) {
    let visibleText = text.slice(0, charIndex).slice(0, COLS);
    for (let i = 0; i < COLS; i++) {
      screen[row][i] = visibleText[i] || " ";
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
// NACHRICHTEN-TICKER
// -----------------------------
let newsList = ["Nachrichten werden geladen..."];
let newsIndex = 0;
let displayRow = 12;
let charIndex = 0;
let frameCounter = 0;
let state = "typing"; // "typing", "pause", "clearing"

function draw() {
  drawScreen();

  frameCounter++;

  if (state === "typing" && frameCounter % 2 === 0) {
    if (charIndex < newsList[newsIndex].length) {
      charIndex++;
      writeSingleLineAnimated(0, displayRow, newsList[newsIndex]);
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
    if (charIndex > 0) {
      charIndex--;
      writeSingleLineAnimated(0, displayRow, newsList[newsIndex]);
    } else {
      newsIndex = (newsIndex + 1) % newsList.length;
      state = "typing";
      frameCounter = 0;
    }
  }
}

// -----------------------------
// RSS-NACHRICHTEN LADEN (ORF)
// -----------------------------
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