# Projet IFT3225 — Phase 1 : Infrastructure de collecte

Système de collecte et d'analyse d'ambiance en quasi temps réel pour un lieu public (McDo Berri-UQAM). Les données audio sont captées via Phyphox et envoyées à une API REST Express/MongoDB.

## Prérequis

- Node.js v18+
- Compte MongoDB Atlas
- Phyphox (app mobile)
- Postman (pour tester)

## Installation

```bash
# 1. Cloner le repo
git clone https://github.com/chrismadara45/PHASE1-PROJECT.git
cd PHASE1-PROJECT

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
cp .env.example .env
# Remplir les valeurs dans .env

# 4. Lancer le serveur
node index.js

# 5.  Peupler la base avec des données de démo
node seed.js
```

## Variables d'environnement

```env
PORT=3000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/ift3225?appName=Cluster0
```

## Endpoints

| Méthode | Endpoint | Auth | Description |
|---------|----------|------|-------------|
| POST | `/devices` | Non | Enregistrer un device |
| GET | `/devices` | Non | Lister les devices |
| POST | `/measurements` | x-api-key | Ajouter une mesure audio |
| GET | `/measurements` | Non | Lister les mesures |
| POST | `/observations` | x-api-key | Ajouter une observation |
| GET | `/observations` | Non | Lister les observations |
| GET | `/ambiance/:location/current` | Non | Ambiance actuelle |
| GET | `/ambiance/:location/history?last=Nh` | Non | Historique sur N heures |
| GET | `/ambiance/:location/quiet-hours` | Non | Heures calmes typiques |

## Authentification

Les endpoints POST (sauf `/devices`) requièrent un header `x-api-key` :

1. Créer un device via `POST /devices`
2. Récupérer la `apiKey` retournée
3. L'inclure dans chaque requête d'écriture

## Tests avec Postman

1. `POST /devices` — créer un device, noter l'apiKey
2. `POST /measurements` — envoyer une mesure avec x-api-key
3. `POST /observations` — envoyer une observation avec x-api-key
4. `GET /ambiance/McDo Berri/current` — voir l'ambiance actuelle