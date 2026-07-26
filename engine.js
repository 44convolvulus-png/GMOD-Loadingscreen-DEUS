/* =============================================================================
   ENGINE.JS — Moteur du loading screen. Tu n'as normalement pas besoin d'y
   toucher : toute la personnalisation se fait dans config.js.
   ============================================================================= */

(function applyConfig(){
  const root = document.documentElement.style;
  if (CONFIG.bloodColor) root.setProperty('--blood-bright', CONFIG.bloodColor);
  if (CONFIG.goldColor)  root.setProperty('--gold', CONFIG.goldColor);

  document.getElementById('serverName').textContent = CONFIG.serverName;
  document.getElementById('serverTagline').textContent = CONFIG.serverTagline;
  document.getElementById('motto').textContent = CONFIG.motto;
  document.getElementById('specThreat').textContent = CONFIG.threatLevel;

  if (CONFIG.logoUrl){
    const logo = document.getElementById('logo');
    logo.style.backgroundImage = `url("${CONFIG.logoUrl}")`;
    logo.style.display = 'block';
  }
  if (CONFIG.centerLogoUrl){
    const sigilLogo = document.getElementById('sigilLogo');
    sigilLogo.src = CONFIG.centerLogoUrl;
    sigilLogo.style.display = 'block';
    document.documentElement.style.setProperty('--logo-spin-duration', CONFIG.centerLogoSpinDuration + 's');
    if (!CONFIG.centerLogoSpin) sigilLogo.style.animation = 'none';
  } else {
    document.getElementById('sigilLogoWrap').style.display = 'none';
  }
  if (CONFIG.backgroundImage){
    const bg = document.getElementById('bg-image');
    bg.style.backgroundImage = `url("${CONFIG.backgroundImage}")`;
    bg.style.display = 'block';
  }
  if (CONFIG.showClassification){
    const c = document.getElementById('classification');
    c.style.display = 'block';
    c.innerHTML = CONFIG.classificationText.replace(/\n/g,'<br>');
  }
  if (!CONFIG.showEmbers) document.getElementById('bg-embers').style.display = 'none';
  if (!CONFIG.showCrtFlicker) document.getElementById('crt-flicker').style.display = 'none';

  const linksWrap = document.getElementById('links');
  CONFIG.links.forEach(l=>{
    const a = document.createElement('a');
    a.href = l.url; a.textContent = l.label; a.target = "_blank"; a.rel = "noopener";
    linksWrap.appendChild(a);
  });

  // Génération des braises montantes
  if (CONFIG.showEmbers){
    const layer = document.getElementById('bg-embers');
    for(let i=0;i<18;i++){
      const e = document.createElement('div');
      e.className = 'ember';
      const left = Math.random()*100;
      const dur = 6 + Math.random()*8;
      const delay = Math.random()*10;
      const drift = (Math.random()*40-20)+'px';
      e.style.left = left+'%';
      e.style.setProperty('--drift', drift);
      e.style.animationDuration = dur+'s';
      e.style.animationDelay = delay+'s';
      layer.appendChild(e);
    }
  }

  // Génération des runes autour du sigil
  const runesGroup = document.getElementById('runes');
  const n = CONFIG.runeCount;
  for(let i=0;i<n;i++){
    const angle = (i / n) * Math.PI * 2 - Math.PI/2;
    const x = 100 + Math.cos(angle) * 78;
    const y = 100 + Math.sin(angle) * 78;
    const glyph = CONFIG.runeGlyphs[i % CONFIG.runeGlyphs.length];
    const text = document.createElementNS("http://www.w3.org/2000/svg","text");
    text.setAttribute("x", x); text.setAttribute("y", y);
    text.setAttribute("class","rune"); text.setAttribute("data-index", i);
    text.textContent = glyph;
    runesGroup.appendChild(text);
  }
})();

/* =============================================================================
   MOTEUR DE PROGRESSION
   (Gmod ne fournit pas de % global — on le déduit des libellés de statut réels
   + du téléchargement des ressources, comme pour tout loading screen custom.)
   ============================================================================= */
const STATUS_PROGRESS_MAP = [
  { match: /sending client info/i,         percent: 8  },
  { match: /requesting client info/i,      percent: 12 },
  { match: /receiving server info/i,       percent: 20 },
  { match: /precaching world resources/i,  percent: 35 },
  { match: /decompressing/i,               percent: 45 },
  { match: /awaiting.*snapshot/i,          percent: 70 },
  { match: /connected/i,                   percent: 100 }
];

// Traduction "en jeu" -> texte thématique affiché (purement cosmétique)
const STATUS_FLAVOR_MAP = [
  { match: /sending client info/i,         text: "Transmission du sceau personnel…" },
  { match: /requesting client info/i,      text: "Vérification de l'identité…" },
  { match: /receiving server info/i,       text: "Lecture du dossier de site…" },
  { match: /precaching world resources/i,  text: "Consécration du terrain…" },
  { match: /decompressing/i,               text: "Déchiffrement des archives…" },
  { match: /awaiting.*snapshot/i,          text: "Stabilisation de la brèche…" },
  { match: /connected/i,                   text: "Sceau refermé. Entrée autorisée." }
];

const CIRC = 2 * Math.PI * 88; // périmètre du cercle (r=88)
let currentPercent = 0;
let currentTip = 0;

function setPercent(p){
  currentPercent = Math.max(currentPercent, Math.min(100, p));
  const offset = CIRC - (currentPercent/100) * CIRC;
  document.getElementById('sigilProgress').style.strokeDashoffset = offset;
  document.getElementById('percentValue').textContent = Math.round(currentPercent);

  document.querySelectorAll('.rune').forEach(r=>{
    const idx = parseInt(r.dataset.index,10);
    const threshold = ((idx+1)/CONFIG.runeCount)*100;
    r.classList.toggle('lit', currentPercent >= threshold);
  });

  // Le logo central s'illumine progressivement, puis "se scelle" à 100%
  document.documentElement.style.setProperty('--logo-charge', (currentPercent/100).toFixed(3));
  const sigilLogo = document.getElementById('sigilLogo');
  if (sigilLogo) sigilLogo.classList.toggle('sealed', currentPercent >= 100);
}

function setStatus(rawText){
  const flavor = STATUS_FLAVOR_MAP.find(e => e.match.test(rawText));
  document.getElementById('statusText').textContent = flavor ? flavor.text : rawText;

  const found = STATUS_PROGRESS_MAP.find(e => e.match.test(rawText));
  if (found) setPercent(found.percent);
  else if (currentPercent < 8) setPercent(currentPercent + 2);
}

function rotateTip(){
  const el = document.getElementById('tipText');
  el.style.transition = 'opacity .25s';
  el.style.opacity = 0;
  setTimeout(()=>{
    currentTip = (currentTip + 1) % CONFIG.tips.length;
    el.textContent = CONFIG.tips[currentTip];
    el.style.opacity = 1;
  }, 250);
}

/* =============================================================================
   HOOKS APPELÉS PAR GARRY'S MOD (ne pas renommer)
   ============================================================================= */
window.GameDetails = function(serverName, serverURL, mapName, maxPlayers, steamID, gamemode){
  if (serverName) document.getElementById('serverName').textContent = serverName;
  document.getElementById('specMap').textContent = mapName || '—';
  document.getElementById('specGamemode').textContent = gamemode || '—';
  document.getElementById('specPlayers').textContent = `0 / ${maxPlayers || '?'}`;
  document.getElementById('specIp').textContent = serverURL || '—';
  setStatus("Receiving server info");
};

window.SetStatusText = function(str){ setStatus(str || ''); };
window.SetFilterText = function(str){ /* conservé pour compatibilité, non utilisé */ };

window.NetworkCountChanged = function(current, total){
  if (!total) return;
  const ratio = current / total;
  setStatus("Precaching world resources");
  setPercent(35 + ratio * 30);
};

window.PlayerConnect = function(name){
  if (!CONFIG.showPlayerFeed || !name) return;
  const feed = document.getElementById('playerFeed');
  const entry = document.createElement('div');
  entry.className = 'entry';
  entry.innerHTML = `<b>[+]</b> ${name} affecté au secteur`;
  feed.appendChild(entry);
  while (feed.children.length > 6) feed.removeChild(feed.firstChild);
  const players = document.getElementById('specPlayers').textContent.split(' / ');
  document.getElementById('specPlayers').textContent = `${parseInt(players[0]||0)+1} / ${players[1]||'?'}`;
};

window.PlayerDisconnect = function(name){
  if (!CONFIG.showPlayerFeed || !name) return;
  const feed = document.getElementById('playerFeed');
  const entry = document.createElement('div');
  entry.className = 'entry leave';
  entry.innerHTML = `<b>[-]</b> ${name} retiré du secteur`;
  feed.appendChild(entry);
  while (feed.children.length > 6) feed.removeChild(feed.firstChild);
};

/* =============================================================================
   MODE DÉMO — simulation hors-jeu pour prévisualiser dans un navigateur.
   ============================================================================= */
function runDemo(){
  window.GameDetails("Task Force Solomon — Confinement", "51.68.xxx.xxx:27015", "gm_chapelle_ruines", 32, "STEAM_0:0:0", "Occult Ops");
  const steps = [
    [600,  "Sending client info"],
    [1800, "Receiving server info"],
    [3200, "Precaching world resources"],
    [4600, "Decompressing"],
    [9000, "Awaiting first snapshot"],
    [12500,"Connected"]
  ];
  steps.forEach(([t, label]) => setTimeout(()=> setStatus(label), t));

  let dl = 0;
  const dlTimer = setInterval(()=>{
    dl += 7;
    window.NetworkCountChanged(dl, 140);
    if (dl >= 140) clearInterval(dlTimer);
  }, 260);

  const names = ["Frère Malachie","Cpl. Reyes","Sœur Agathe","Lt. Voss","Chapelain Ibarra"];
  names.forEach((n,i)=> setTimeout(()=> window.PlayerConnect(n), 2000 + i*1500));
}

/* =============================================================================
   INITIALISATION
   ============================================================================= */
setPercent(0);
document.getElementById('tipText').textContent = CONFIG.tips[0];
setInterval(rotateTip, CONFIG.tipRotationMs);

if (CONFIG.demoIfNoGameHooks){
  setTimeout(()=>{ if (currentPercent === 0) runDemo(); }, 800);
}
