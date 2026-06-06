require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./src/config/db');
const Device = require('./src/models/Device');
const Measurement = require('./src/models/Measurement');
const Observation = require('./src/models/Observation');

const seed = async () => {
  await connectDB();

  await Device.deleteMany({});
  await Measurement.deleteMany({});
  await Observation.deleteMany({});
  console.log('Base nettoyée');

  const device = await Device.create({
    name: 'Téléphone Chris',
    location: 'McDo Berri'
  });
  console.log('Device créé — apiKey:', device.apiKey);

  const now = new Date();
  const measurements = [];
  for (let i = 0; i < 48; i++) {
    const timestamp = new Date(now - i * 30 * 60 * 1000);
    const hour = timestamp.getHours();

    // Valeurs négatives comme Phyphox
    let baseValue = -45;
    if (hour >= 11 && hour <= 14) baseValue = -20; // midi bruyant
    else if (hour >= 17 && hour <= 20) baseValue = -25; // soir animé
    else if (hour >= 7 && hour <= 10) baseValue = -35; // matin modéré

    measurements.push({
      type: 'audio',
      value: baseValue + Math.random() * 6 - 3,
      location: 'McDo Berri',
      timestamp,
      deviceId: device._id
    });
  }
  await Measurement.insertMany(measurements);
  console.log('48 mesures créées');

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