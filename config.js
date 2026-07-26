/* =============================================================================
   CONFIG.JS — LE SEUL FICHIER À MODIFIER POUR PERSONNALISER LE LOADING SCREEN
   Ne touche pas à index.html ni engine.js sauf si tu veux changer la structure
   ou le comportement. Tout ce qui est "look & feel" et "texte" se règle ici.
   ============================================================================= */
const CONFIG = {
  // --- Identité (surchargée automatiquement par GameDetails si le jeu l'envoie) ---
  serverName:     "DEUS INTERFECTOREM",
  serverTagline:  "Opération de confinement — Zone rouge",
  logoUrl:        "",              // logo en haut à côté du nom (petit encart) — vide = masqué
  backgroundImage:"",              // ex: "background.jpg"

  // --- Logo central (dans le sigil circulaire) ---
  centerLogoUrl:          "logo.png", // le fichier doit être dans html/ et déclaré dans le .lua
  centerLogoSpin:         true,       // rotation continue du logo
  centerLogoSpinDuration: 70,         // durée d'un tour complet, en secondes (plus grand = plus lent)

  // --- Thème / couleurs ---
  bloodColor:     "",              // ex: "#8a1c1c" — laisser vide = défaut
  goldColor:      "",              // ex: "#a8863a"
  motto:          "VIGILANTIA · FIDES · DISCIPLINA", // devise affichée en haut
  classificationText: "CLASSIFICATION : SCELLÉ\nACCÈS RESTREINT — NIV. 4",
  showClassification: true,

  // --- Dossier tactique (panneau de droite) ---
  threatLevel:    "CRITIQUE",      // ex: FAIBLE / MODÉRÉ / ÉLEVÉ / CRITIQUE

  // --- Sigil circulaire ---
  runeCount: 8,                    // nombre de glyphes autour du cercle
  runeGlyphs: ["✟","☾","✠","Ϟ","☥","✡","Ω","†","Δ","✦"], // piochés dans cet ordre

  // --- Liens footer ---
  links: [
    { label: "Discord",     url: "https://discord.gg/tonserveur" },
    { label: "Dossiers",    url: "https://tonsite.fr/lore" },
    { label: "Recrutement", url: "https://tonsite.fr/recrutement" }
  ],

  // --- Notes de terrain qui défilent ---
  tips: [
    "« Ce qui a été scellé une fois peut être scellé à nouveau. » — Manuel de l'exorciste, §12",
    "Toujours vérifier trois fois la ligne de sel avant d'ouvrir un site de confinement.",
    "Le signalement d'anomalie se fait via /signaler une fois en jeu.",
    "Ne jamais prononcer un nom entendu derrière la porte scellée.",
    "Le poste de chapelain recrute — les âmes solides sont rares."
  ],
  tipRotationMs: 6000,

  // --- Ambiance ---
  showEmbers: true,
  showCrtFlicker: true,
  showPlayerFeed: true,

  // --- Mode démo (prévisualisation hors-jeu, désactive-le si tu veux tester en jeu uniquement) ---
  demoIfNoGameHooks: true
};
