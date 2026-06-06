require('dotenv').config();
const http = require('http');

const PHYPHOX_URL = 'http://192.168.0.102';
const SERVER_URL = 'http://localhost:3000';
const API_KEY = 'c1279d7b764bd1104737cef5adbbf87d1d1af246cc0c9929dc489deedfb6573e';
const LOCATION = 'McDo Berri';
const INTERVAL_MS = 5000;

const fetchPhyphox = () => {
  return new Promise((resolve, reject) => {
    http.get(`${PHYPHOX_URL}/get?dB`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const value = json.buffer?.dB?.buffer?.[0];
          resolve(value);
        } catch (err) {
          reject(err);
        }
      });
    }).on('error', reject);
  });
};

const sendMeasurement = (value) => {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      type: 'audio',
      value,
      location: LOCATION,
      timestamp: new Date().toISOString()
    });

    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/measurements',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'Content-Length': Buffer.byteLength(body)
      }
    };

    const req = http.request(options, (res) => {
      res.on('data', () => {});
      res.on('end', resolve);
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
};

const run = async () => {
  console.log('Bridge démarré — collecte toutes les 5 secondes');
  console.log(`Phyphox: ${PHYPHOX_URL}`);
  console.log(`Serveur: ${SERVER_URL}`);
  console.log(`Lieu: ${LOCATION}`);

  setInterval(async () => {
    try {
      const value = await fetchPhyphox();
      if (value !== undefined && value !== null) {
        await sendMeasurement(value);
        console.log(`[${new Date().toISOString()}] Envoyé: ${value.toFixed(2)} dB`);
      } else {
        console.log('Valeur nulle reçue de Phyphox');
      }
    } catch (err) {
      console.error('Erreur bridge:', err.message);
    }
  }, INTERVAL_MS);
};

run();