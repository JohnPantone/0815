let feed1 = ["Lade Feed 1..."];
let feed2 = ["Lade Feed 2..."];

let currentText1 = "";
let currentText2 = "";

let typedText1 = "";
let typedText2 = "";

let index1 = 0;
let index2 = 0;

let charIndex1 = 0;
let charIndex2 = 0;

let frameCounter1 = 0;
let frameCounter2 = 0;

let state1 = "typing";
let state2 = "typing";

let cursorVisible = true;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  frameRate(30);
  fetchFeeds();
}

function draw() {
  background(0);

  // Zeile 1 – klassisch VC20
  textFont("Courier New");
  textSize(24);
  fill(0, 255, 0);
  let y1 = height / 2 - 40;
  let x1 = (width - textWidth(typedText1)) / 2;
  text(typedText1, x1, y1);
  if (cursorVisible && state1 === "typing") {
    text("▌", x1 + textWidth(typedText1), y1);
  }

 // Zeile 2 – moderne Gothic-Schrift
textFont("League Gothic");
textSize(22);
fill(255, 220, 100);
let y2 = height / 2 + 40;
let x2 = (width - textWidth(typedText2)) / 2;
text(typedText2, x2, y2);
if (cursorVisible && state2 === "typing") {
  text("▌", x2 + textWidth(typedText2), y2);
}

  // Cursor-Blink
  if (frameCount % 30 === 0) {
    cursorVisible = !cursorVisible;
  }

  // Tippe Feed 1
  if (state1 === "typing" && frameCount % 2 === 0) {
    if (charIndex1 < currentText1.length) {
      typedText1 += currentText1[charIndex1];
      charIndex1++;
    } else if (frameCounter1++ > 90) {
      next1();
    }
  }

  // Tippe Feed 2
  if (state2 === "typing" && frameCount % 2 === 0) {
    if (charIndex2 < currentText2.length) {
      typedText2 += currentText2[charIndex2];
      charIndex2++;
    } else if (frameCounter2++ > 90) {
      next2();
    }
  }
}

function next1() {
  index1 = (index1 + 1) % feed1.length;
  currentText1 = feed1[index1];
  typedText1 = "";
  charIndex1 = 0;
  frameCounter1 = 0;
  state1 = "typing";
}

function next2() {
  index2 = (index2 + 1) % feed2.length;
  currentText2 = feed2[index2];
  typedText2 = "";
  charIndex2 = 0;
  frameCounter2 = 0;
  state2 = "typing";
}

async function fetchFeeds() {
  const url1 = 'https://api.rss2json.com/v1/api.json?rss_url=https://rss.orf.at/news.xml';
  const url2 = 'https://api.rss2json.com/v1/api.json?rss_url=https://www.tagesschau.de/xml/rss2';

  try {
    const [res1, res2] = await Promise.all([fetch(url1), fetch(url2)]);
    const data1 = await res1.json();
    const data2 = await res2.json();

    feed1 = data1.items?.map(item => item.title) || ["Keine Daten von Feed 1"];
    feed2 = data2.items?.map(item => item.title) || ["Keine Daten von Feed 2"];

    currentText1 = feed1[0];
    currentText2 = feed2[0];
  } catch (err) {
    console.error("Fehler beim Laden:", err);
    feed1 = ["Fehler in Feed 1"];
    feed2 = ["Fehler in Feed 2"];
    currentText1 = feed1[0];
    currentText2 = feed2[0];
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}