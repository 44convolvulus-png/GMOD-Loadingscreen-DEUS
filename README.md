# Deus Interfectorem — Loading Screen GMod V4

Cette version reprend la récupération native de la map utilisée par l'ancien loading screen.

## Installation sur GitHub Pages

1. Décompressez le ZIP.
2. Dans le dépôt GitHub, utilisez **Add file → Upload files**.
3. Envoyez tous les fichiers présents dans ce dossier et validez avec **Commit changes**.
4. Attendez la fin du déploiement GitHub Pages.
5. Faites un rechargement forcé avec `Ctrl + F5`.

Les deux adresses suivantes fonctionnent :

- `/index.html`
- `/loading_dark.html`

Pour votre dépôt actuel :

```cfg
sv_loadingurl "https://44convolvulus-png.github.io/GMOD-Loadingscreen-DEUS/loading_dark.html"
```

## Informations récupérées automatiquement dans GMod

- nom du serveur ;
- map actuelle ;
- gamemode ;
- nombre maximal de joueurs ;
- progression et fichiers en téléchargement ;
- SteamID64 du joueur en cours de connexion.

Le nombre exact de joueurs présents et le nom RP DarkRP ne sont pas transmis directement par la page de chargement. Les emplacements d'API sont déjà prévus dans `config.js` pour les ajouter plus tard.

## Personnalisation

Modifiez uniquement `config.js` pour les liens Discord, Steam, site et règlement.


## Version V5 — bandeau classifié
Cette version ajoute en haut au centre le bandeau « DOSSIER CLASSIFIÉ — NIVEAU IV », avec ornements et glyphes, tout en conservant le logo strictement centré et les fonctions de chargement GMod.
