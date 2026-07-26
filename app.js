(function () {
  "use strict";

  var cfg = window.DEUS_CONFIG || {};
  var statusText = document.getElementById("statusText");
  var detailText = document.getElementById("detailText");
  var percentText = document.getElementById("percentText");
  var progressBar = document.getElementById("progressBar");
  var logLines = document.getElementById("logLines");
  var footerMap = document.getElementById("footerMap");
  var serverName = document.getElementById("serverName");
  var cornerMap = document.getElementById("cornerMap");
  var cornerGamemode = document.getElementById("cornerGamemode");
  var playerCount = document.getElementById("playerCount");
  var maxPlayers = document.getElementById("maxPlayers");
  var playerName = document.getElementById("playerName");
  var playerNameWrap = document.getElementById("playerNameWrap");

  var totalFiles = 0;
  var neededFiles = 0;
  var currentPercent = 0;
  var receivedGameDetails = false;
  var currentSteamId = "";
  var knownPlayers = null;

  function setLink(id, url) {
    var el = document.getElementById(id);
    if (!el) return;
    el.href = url && url !== "#" ? url : "javascript:void(0)";
    if (!url || url === "#") el.classList.add("placeholder");
  }

  function setServerInfo(data) {
    if (data.map) {
      cornerMap.textContent = data.map;
      footerMap.textContent = "Carte : " + data.map;
    }
    if (data.gamemode) cornerGamemode.textContent = data.gamemode;
    if (data.players !== undefined && data.players !== null && data.players !== "") {
      knownPlayers = data.players;
      playerCount.textContent = data.players;
    }
    if (data.maxPlayers !== undefined && data.maxPlayers !== null && data.maxPlayers !== "") {
      maxPlayers.textContent = data.maxPlayers;
    }
  }

  function setPlayerName(name) {
    var clean = String(name || "").trim();
    if (!clean) {
      playerName.textContent = "";
      playerNameWrap.hidden = true;
      return;
    }
    playerName.textContent = clean;
    playerNameWrap.hidden = false;
  }
  // Prêt pour une future API ou un appel manuel.
  window.SetPlayerName = setPlayerName;

  function addLog(text) {
    if (!text) return;
    var row = document.createElement("div");
    row.className = "log-line";
    row.textContent = text;
    logLines.appendChild(row);
    while (logLines.children.length > 4) logLines.removeChild(logLines.firstChild);
  }

  function fetchJson(url, onSuccess) {
    if (!url || typeof fetch !== "function") return;
    fetch(url, { cache: "no-store" })
      .then(function (response) {
        if (!response.ok) throw new Error("HTTP " + response.status);
        return response.json();
      })
      .then(onSuccess)
      .catch(function () { addLog("SOURCE EXTERNE INDISPONIBLE"); });
  }

  function setProgress(value) {
    currentPercent = Math.max(currentPercent, Math.min(100, Math.round(Number(value) || 0)));
    progressBar.style.width = currentPercent + "%";
    percentText.textContent = currentPercent + "%";
  }

  function translateStatus(raw) {
    var value = String(raw || "");
    var rules = [
      [/sending client info/i, "Transmission du sceau personnel…", 8],
      [/requesting client info/i, "Vérification de l'identité…", 12],
      [/receiving server info/i, "Lecture du dossier du site…", 20],
      [/precaching world resources/i, "Consécration du terrain…", 35],
      [/decompressing/i, "Déchiffrement des archives…", 48],
      [/awaiting.*snapshot/i, "Stabilisation de la brèche…", 72],
      [/connected/i, "Accès autorisé", 100]
    ];
    for (var i = 0; i < rules.length; i++) {
      if (rules[i][0].test(value)) {
        setProgress(rules[i][2]);
        return rules[i][1];
      }
    }
    return value;
  }

  function applyStatus(raw) {
    var translated = translateStatus(raw);
    if (translated) {
      detailText.textContent = translated;
      addLog(translated.toUpperCase());
    }
  }

  setLink("discordLink", cfg.discord);
  setLink("steamLink", cfg.steam);
  setLink("siteLink", cfg.website);
  setLink("rulesLink", cfg.rules);
  serverName.textContent = cfg.serverName || "DEUS INTERFECTOREM";

  // Valeurs de démonstration, remplacées automatiquement par GMod en jeu.
  setServerInfo({
    map: cfg.previewMap || "gm_construct",
    gamemode: cfg.previewGamemode || "DarkRP",
    players: cfg.previewPlayers !== undefined ? cfg.previewPlayers : "—",
    maxPlayers: cfg.previewMaxPlayers !== undefined ? cfg.previewMaxPlayers : "—"
  });
  setPlayerName(cfg.previewPlayerName || "");

  var messages = cfg.messages || ["Analyse des archives", "Vérification des protocoles", "Accès autorisé"];
  var messageIndex = 0;
  function rotateMessage() {
    var message = messages[messageIndex % messages.length];
    statusText.style.opacity = 0;
    setTimeout(function () {
      statusText.textContent = message;
      statusText.style.opacity = 1;
      addLog(message.toUpperCase());
    }, 220);
    messageIndex++;
  }
  statusText.style.transition = "opacity .22s ease";
  rotateMessage();
  setInterval(rotateMessage, 3100);

  // Fonction native appelée automatiquement par Garry's Mod.
  // Elle donne notamment la map, le gamemode et le nombre maximal de slots.
  window.GameDetails = function (server, url, map, max, steamId, gamemode) {
    receivedGameDetails = true;
    currentSteamId = String(steamId || "");
    serverName.textContent = server || cfg.serverName || "DEUS INTERFECTOREM";

    // Le compteur courant n'est pas fourni par GameDetails : on retire la valeur de preview.
    knownPlayers = null;
    playerCount.textContent = "—";
    setServerInfo({ map: map, maxPlayers: max, gamemode: gamemode });

    detailText.textContent = gamemode ? "Protocole : " + gamemode : "Établissement d'une liaison sécurisée";
    addLog("IDENTITÉ SERVEUR CONFIRMÉE");

    if (cfg.playerApiUrl && currentSteamId) {
      var joiner = cfg.playerApiUrl.indexOf("?") === -1 ? "?" : "&";
      fetchJson(cfg.playerApiUrl + joiner + "steamid=" + encodeURIComponent(currentSteamId), function (data) {
        if (data && data.name) setPlayerName(data.name);
      });
    } else {
      setPlayerName("");
    }

    if (cfg.serverStatusApiUrl) fetchJson(cfg.serverStatusApiUrl, setServerInfo);
  };

  // Hooks modernes utilisés par les loading screens GMod.
  window.SetFilesTotal = function (total) {
    totalFiles = Number(total) || 0;
  };
  window.SetFilesNeeded = function (needed) {
    neededFiles = Number(needed) || 0;
    if (totalFiles > 0) setProgress(((totalFiles - neededFiles) / totalFiles) * 100);
  };
  window.DownloadingFile = function (fileName) {
    if (fileName) detailText.textContent = "Transfert : " + fileName;
  };
  window.SetStatusChanged = applyStatus;

  // Compatibilité avec l'ancien loading screen et certains wrappers.
  window.SetStatusText = applyStatus;
  window.SetFilterText = function () {};
  window.NetworkCountChanged = function (current, total) {
    current = Number(current) || 0;
    total = Number(total) || 0;
    if (total > 0) setProgress((current / total) * 100);
  };
  window.PlayerConnect = function (name) {
    addLog((name ? name.toUpperCase() + " — " : "") + "CONNEXION DÉTECTÉE");
    if (typeof knownPlayers === "number") setServerInfo({ players: knownPlayers + 1 });
  };
  window.PlayerDisconnect = function (name) {
    addLog((name ? name.toUpperCase() + " — " : "") + "DÉCONNEXION DÉTECTÉE");
    if (typeof knownPlayers === "number") setServerInfo({ players: Math.max(0, knownPlayers - 1) });
  };

  if (cfg.simulatedLoading !== false) {
    var simulation = setInterval(function () {
      if (receivedGameDetails || totalFiles > 0) {
        clearInterval(simulation);
        return;
      }
      var step = currentPercent < 68 ? Math.random() * 4.5 : Math.random() * 1.7;
      setProgress(Math.min(94, currentPercent + step));
    }, 850);
  }

  var canvas = document.getElementById("dust");
  var ctx = canvas.getContext && canvas.getContext("2d");
  if (ctx) {
    var particles = [];
    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = [];
      var count = Math.min(80, Math.floor(canvas.width * canvas.height / 22000));
      for (var i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 1.2 + 0.25,
          vy: -(Math.random() * 0.12 + 0.025),
          vx: (Math.random() - 0.5) * 0.08,
          a: Math.random() * 0.26 + 0.04
        });
      }
    }
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -4) p.y = canvas.height + 4;
        if (p.x < -4) p.x = canvas.width + 4;
        if (p.x > canvas.width + 4) p.x = -4;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(222, 205, 170," + p.a + ")";
        ctx.fill();
      }
      requestAnimationFrame(draw);
    }
    resize();
    draw();
    window.addEventListener("resize", resize);
  }
})();
