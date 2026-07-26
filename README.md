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
