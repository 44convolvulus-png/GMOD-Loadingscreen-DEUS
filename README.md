# Deus Interfectorem — Loading Screen V3

Ouvrez `index.html` pour voir la maquette.

## Modifier les liens et la preview
Éditez `config.js`.

## Informations GMod disponibles nativement
- nom du serveur ;
- carte actuelle ;
- nombre maximal de joueurs ;
- SteamID64 du joueur ;
- gamemode ;
- progression des fichiers.

Le nombre actuel de joueurs et le nom RP ne sont pas transmis directement au loading screen. La maquette accepte deux API optionnelles dans `config.js` :
- `serverStatusApiUrl` pour joueurs/carte/gamemode ;
- `playerApiUrl` pour retrouver le nom RP depuis le SteamID64.

Sans ces API, la carte et le maximum de joueurs fonctionneront dans GMod, tandis que le compteur actuel affichera un tiret et le nom affichera « Agent ».
