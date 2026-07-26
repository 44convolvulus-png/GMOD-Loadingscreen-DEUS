# Deus Interfectorem — Loading Screen GMod V6

Cette version corrige le décalage horizontal du logo et de tout le bloc central dans le navigateur intégré de Garry's Mod.

## Correctif appliqué

- bloc principal ancré directement au viewport avec `position: absolute` ;
- centrage horizontal avec `left: 50%` et `translateX(-50%)` ;
- suppression du déplacement `left: 50%` sur `.seal-wrap` ;
- centrage du logo avec `margin: 0 auto` ;
- barre, navigation et pied de page centrés indépendamment ;
- compatibilité renforcée avec `-webkit-transform` pour le moteur HTML de GMod.

## Installation

Remplace les fichiers présents à la racine de ton dépôt GitHub Pages par ceux de ce dossier, puis valide avec **Commit changes**.

L'URL reste :

```cfg
sv_loadingurl "https://44convolvulus-png.github.io/GMOD-Loadingscreen-DEUS/loading_dark.html"
```

Après la publication GitHub Pages, redémarre GMod. En cas de cache persistant, ouvre d'abord l'URL avec `?v=6` dans un navigateur ou utilise temporairement :

```cfg
sv_loadingurl "https://44convolvulus-png.github.io/GMOD-Loadingscreen-DEUS/loading_dark.html?v=6"
```


## V8 — Audio

- `music.mp3` est la musique du loading screen.
- Lecture automatique et boucle activées.
- Fondu d'entrée de 5 secondes jusqu'à 25 % de volume.
- Bouton discret `Son / Muet` en haut à droite.
- Le choix du joueur est conservé avec `localStorage`.
- Si GMod bloque l'autoplay, le premier clic ou la première touche relance la lecture.

Pour forcer le rechargement après publication GitHub Pages :

```cfg
sv_loadingurl "https://44convolvulus-png.github.io/GMOD-Loadingscreen-DEUS/loading_dark.html?v=7"
```


## Contrôle audio V8
- La musique démarre à volume nul puis monte progressivement pendant 5 secondes.
- Appuyez sur **ESPACE** pour couper la musique avec un fondu court.
- Appuyez de nouveau sur **ESPACE** pour la réactiver avec un fondu.
- Aucun bouton audio n’est affiché à l’écran.
