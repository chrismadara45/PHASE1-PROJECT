# Projet IFT3225 — Phase 1 : Infrastructure de collecte

Infrastructure de collecte d'ambiance en quasi temps réel pour un lieu public (McDo Berri-UQAM). Le système capte le niveau sonore via un iPhone  by Phyphox, l'achemine vers un serveur Express, et expose des endpoints HTTP pour interroger l'ambiance actuelle, l'historique et les heures calmes.

## Prérequis

- Node.js v18+
- Compte MongoDB Atlas
- Phyphox (app mobile, iOS ou Android)
- Postman (pour tester les routes protégées)

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
npm start

# 5.  Peupler la base avec des données de démo
node seed.js


## Variables d'environnement

```env
PORT=3000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/ift3225?appName=Cluster0
PHYPHOX_IP=<ip_locale_de_ton_telephone>


`PHYPHOX_IP` est l'adresse affichée par Phyphox quand tu actives "Allow remote access" dans l'expérience Audio Amplitude . Chaque membre de l'équipe doit mettre sa propre IP dans son `.env` local.

## Lancer la collecte (bridge)

Le bridge interroge Phyphox toutes les 5 secondes et envoie les mesures au serveur.

```bash
# Terminal 1
npm start

# Terminal 2
node bridge.js


Le téléphone et l'ordinateur doivent être sur le même réseau Wi-Fi .

## Endpoints

| Méthode | Endpoint                              | Auth      | Description              |
| ------- | -------------------------------------- | --------- | ------------------------ |
| POST    | `/devices`                             | Non       | Enregistrer un device    |
| GET     | `/devices`                             | Non       | Lister les devices       |
| POST    | `/measurements`                        | x-api-key | Ajouter une mesure audio |
| GET     | `/measurements`                        | Non       | Lister les mesures       |
| POST    | `/observations`                        | x-api-key | Ajouter une observation  |
| GET     | `/observations`                        | Non       | Lister les observations  |
| GET     | `/ambiance/:location/current?window=N` | Non       | Ambiance actuelle (N minutes, défaut 30) |
| GET     | `/ambiance/:location/history?last=Nh`  | Non       | Historique sur N heures  |
| GET     | `/ambiance/:location/quiet-hours`      | Non       | Heures calmes typiques   |

## Authentification

Les endpoints POST (sauf `/devices`) requièrent un header `x-api-key` :

1. Créer un device via `POST /devices`
2. Récupérer la `apiKey` retournée
3. L'inclure dans chaque requête d'écriture

Le bridge récupère automatiquement la `apiKey` du device correspondant au lieu configuré — aucune clé à coller manuellement dans le code.

## Tests avec Postman

1. `POST /devices` — créer un device, noter l'apiKey
2. `POST /measurements` — envoyer une mesure avec x-api-key
3. `POST /observations` — envoyer une observation avec x-api-key
4. `GET /ambiance/McDo Berri/current` — voir l'ambiance actuelle