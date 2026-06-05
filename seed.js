require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./src/config/db');
const Device = require('./src/models/Device');
const Measurement = require('./src/models/Measurement');
const Observation = require('./src/models/Observation');

const seed = async () => {
  await connectDB();

  // Nettoyer la base
  await Device.deleteMany({});
  await Measurement.deleteMany({});
  await Observation.deleteMany({});
  console.log('Base nettoyée');

  // Créer un device
  const device = await Device.create({
    name: 'Téléphone Chris',
    location: 'McDo Berri'
  });
  console.log('Device créé — apiKey:', device.apiKey);

  // Créer des mesures sur 24h
  const now = new Date();
  const measurements = [];
  for (let i = 0; i < 48; i++) {
    const timestamp = new Date(now - i * 30 * 60 * 1000); // toutes les 30 min
    const hour = timestamp.getHours();
    // Plus calme la nuit, plus bruyant le midi
    let baseValue = 45;
    if (hour >= 11 && hour <= 14) baseValue = 75;
    else if (hour >= 17 && hour <= 20) baseValue = 70;
    else if (hour >= 7 && hour <= 10) baseValue = 60;

    measurements.push({
      type: 'audio',
      value: baseValue + Math.random() * 10 - 5,
      location: 'McDo Berri',
      timestamp,
      deviceId: device._id
    });
  }
  await Measurement.insertMany(measurements);
  console.log('48 mesures créées');

  // Créer des observations
  const vibes = ['calm', 'moderate', 'busy', 'chaotic'];
  const proximities = ['low', 'medium', 'high'];
  const observations = [];
  for (let i = 0; i < 10; i++) {
    observations.push({
      location: 'McDo Berri',
      proximity: proximities[Math.floor(Math.random() * proximities.length)],
      vibe: vibes[Math.floor(Math.random() * vibes.length)],
      notes: `Session de collecte #${i + 1}`,
      timestamp: new Date(now - i * 2 * 60 * 60 * 1000)
    });
  }
  await Observation.insertMany(observations);
  console.log('10 observations créées');

  console.log('Seed terminé !');
  process.exit(0);
};

seed().catch(err => {
  console.error(err);
  process.exit(1);
});