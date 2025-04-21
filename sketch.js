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
  fetchNewsHeadlines(); // Start: erste Headlines laden
  setInterval(fetchNewsHeadlines, 600000); // alle 10 Minuten neu laden
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
// NACHRICHTEN-TICKER
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

  