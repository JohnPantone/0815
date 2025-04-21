// 1) Schlagwörter zum Hervorheben mit komplettem Style
const highlightMap = {
  "Moskau":    { color:"#ff0000", font:"Courier New",    size:"24px" },
  "Trump":     { color:"#ff0000", font:"", size:"55px" },
  "Papst":     { color:"#00ff00", font:"DM Serif Display", size:"22px" },
  "Inflation": { color:"#00ffff", font:"Special Elite",  size:"10px" }
};

// 2) Konfiguration für 30 deutschsprachige Feeds
const feedConfigs = [
  { url:"https://rss.orf.at/news.xml",                     speed:8, pause:60, font:"Special Elite",           color:"#00ff00", size:"44px" },
  { url:"https://www.tagesschau.de/xml/rss2",              speed:4, pause:80, font:"DM Serif Display",        color:"#ffcc00", size:"22px" },
  { url:"https://www.spiegel.de/schlagzeilen/tops/index.rss", speed:6, pause:50, font:"Press Start 2P",         color:"#00ffff", size:"16px" },
  { url:"https://www.zeit.de/index.rss",                    speed:3, pause:70, font:"Rubik Mono One",          color:"#ff4444", size:"18px" },
  { url:"https://www.sueddeutsche.de/news/rss",             speed:3, pause:60, font:"Anton",                   color:"#ff99cc", size:"24px" },
  { url:"https://www.faz.net/rss/aktuell/",                speed:7, pause:75, font:"Special Elite",           color:"#ffffff", size:"16px" },
  { url:"https://www.derstandard.at/rss",                   speed:5, pause:90, font:"Bungee",                  color:"#ff6600", size:"20px" },
  { url:"https://www.handelsblatt.com/contentexport/feed/news", speed:4, pause:80, font:"Orbitron",                color:"#9999ff", size:"18px" },
  { url:"https://www.welt.de/feeds/latest.rss",             speed:3, pause:60, font:"Major Mono Display",      color:"#66ffcc", size:"20px" },
  { url:"https://www.taz.de/!service/xml/rss2",             speed:2, pause:75, font:"League Gothic",           color:"#eeeeee", size:"18px" },
  
  { url:"https://www.deutschlandfunk.de/podcast-weltpolitisches-tagebuch.256.de.rss", speed:5, pause:60, font:"DM Serif Display", color:"#ff5500", size:"20px" },
  { url:"https://www.faz.net/rss/aktuell/wirtschaft.xml",   speed:6, pause:70, font:"Press Start 2P",         color:"#00aa00", size:"46px" },
  { url:"https://www.tagesspiegel.de/rss/alle-beitraege.rss", speed:3, pause:80, font:"Rubik Mono One",        color:"#ffaa33", size:"50px" },
  { url:"https://www.morgenpost.de/home/feed/rss/all",       speed:5, pause:90, font:"Anton",                  color:"#cc00cc", size:"84px" },
  { url:"https://rss.focus.de/digital/rss.xml",             speed:5, pause:60, font:"Bungee",                  color:"#0099ff", size:"18px" },
  
  { url:"https://www.stern.de/feed/topnews.rss",             speed:4, pause:50, font:"Orbitron",                color:"#ffff00", size:"16px" },
  { url:"https://www.spiegel.de/sport/index.rss",            speed:3, pause:70, font:"Major Mono Display",      color:"#33ff33", size:"20px" },
  { url:"https://www.heise.de/rss/heise-atom.xml",           speed:2, pause:80, font:"League Gothic",           color:"#ff3333", size:"18px" },
  { url:"https://www.zdf.de/rss/servlet/content/12057810",   speed:3, pause:60, font:"Special Elite",           color:"#00ffff", size:"22px" },
  { url:"https://www.nzz.ch/international/rss",              speed:4, pause:90, font:"DM Serif Display",        color:"#ff00ff", size:"20px" },
  
  { url:"https://www.rnd.de/politik.rss",                    speed:5, pause:50, font:"Press Start 2P",         color:"#ffffff", size:"16px" },
  { url:"https://rss.dw.com/rdf/rss-de-top",                 speed:3, pause:70, font:"Rubik Mono One",          color:"#00ff99", size:"18px" },
  { url:"https://www.ksta.de/koeln/rss",                     speed:7, pause:80, font:"Anton",                   color:"#ff4444", size:"24px" },
  { url:"https://www.berliner-zeitung.de/rssfeed",           speed:4, pause:60, font:"Bungee",                  color:"#aaaa00", size:"20px" },
  { url:"https://rss.zeit.de/wirtschaft/index",              speed:3, pause:75, font:"Orbitron",                color:"#00aaee", size:"18px" },
  
  { url:"https://rss.nzz.ch/schweiz/moderne-medien/rss",     speed:5, pause:90, font:"Major Mono Display",      color:"#ff0066", size:"22px" },
  { url:"https://www.wiwo.de/unternehmen-maerkte.rss",       speed:2, pause:50, font:"League Gothic",           color:"#99ff99", size:"20px" },
  { url:"https://rss.sueddeutsche.de/rss/Topthemen",         speed:3, pause:80, font:"Special Elite",           color:"#ffcc00", size:"48px" },
  { url:"https://www.derwesten.de/ruhr/rss",                 speed:4, pause:60, font:"DM Serif Display",        color:"#00ccff", size:"20px" },
  { url:"https://www.rhein-zeitung.de/politik/regional/rss",  speed:2, pause:70, font:"Press Start 2P",         color:"#ffffff", size:"16px" }
];

let lineStates = [];

// 3) Erzeuge Zeilen und lade Feeds
async function fetchFeeds() {
  const wall = document.getElementById("wall");
  // Für jeden Feed eine Zeile anlegen und State initialisieren
  feedConfigs.forEach(cfg => {
    const el = document.createElement("div");
    el.className = "line";
    el.style.fontFamily = `"${cfg.font}", monospace`;
    el.style.color      = cfg.color;
    el.style.fontSize   = cfg.size;
    wall.appendChild(el);
    lineStates.push({
      el,
      config: cfg,
      headlines: [],
      hIndex: 0,
      cIndex: 0,
      text: "",
      delay: 0,
      skip: 0
    });
  });

  // Alle Feeds parallel laden
  await Promise.all(lineStates.map(async state => {
    try {
      const apiUrl = "https://api.rss2json.com/v1/api.json?rss_url=" 
                     + encodeURIComponent(state.config.url);
      const res = await fetch(apiUrl);
      const data = await res.json();
      state.headlines = data.items.map(it => it.title);
    } catch {
      state.headlines = ["Fehler beim Laden der News."];
    }
  }));
}

function applyHighlights(text) {
  let html = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  for (let [word, style] of Object.entries(highlightMap)) {
    // Erstelle eine RegEx für ganze Wörter, case‑insensitive
    const re = new RegExp(`\\b(${word})\\b`, "gi");
    // Baue den Inline‑Style-String
    const styleStr = `color:${style.color};font-family:'${style.font}';font-size:${style.size};`;
    // Ersetze das Wort durch einen <span> mit all diesen Styles
    html = html.replace(re, `<span style="${styleStr}">$1</span>`);
  }

  return html;
}

// 5) Animation
function animate() {
  lineStates.forEach(state => {
    const { speed, pause } = state.config;
    if (state.delay > 0) {
      state.delay--;
    } else {
      const hl = state.headlines[state.hIndex];
      if (state.cIndex < hl.length) {
        state.skip++;
        if (state.skip >= speed) {
          state.text += hl[state.cIndex++];
          state.skip = 0;
        }
      } else {
        state.delay = pause;
        state.cIndex = 0;
        state.text = "";
        state.hIndex = (state.hIndex + 1) % state.headlines.length;
      }
    }
    state.el.innerHTML = applyHighlights(state.text) + `<span class="cursor">▌</span>`;
  });
  requestAnimationFrame(animate);
}

// 6) Start
window.addEventListener("DOMContentLoaded", async () => {
  await fetchFeeds();
  animate();
});