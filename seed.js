require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./src/config/db');

//this is important for all our new old models guys 
const Device = require('./src/models/Device');
const Measurement = require('./src/models/Measurement');
const Observation = require('./src/models/Observation');
const User = require('./src/models/User');
const Location = require('./src/models/Location');

const seed = async () => {
  await connectDB();

  //netoyyage totale de la BD
  console.log('Netoyage de la base de données...');
  await User.deleteMany({});
  await Location.deleteMany({});
  await Device.deleteMany({});
  await Measurement.deleteMany({});
  await Observation.deleteMany({});
  
  //on crée un User test, le password sera automatiquemnt haché
  const testUser = await User.create({
    username: 'Chris_test',
    password: 'password123'
  });
  console.log(`Utilisateur créé : ${testUser.username}`);

  //création de 3 lieux geographique(on atttribut des coordonnées de MTL spot)
  const locationsData = [
    { name: 'McDo Berri', coordinates: { lat: 45.5155, lng: -73.5615 } },
    { name: 'Bibliothèque Centrale', coordinates: { lat: 45.5152, lng: -73.5624 } },
    { name: 'Café Campus', coordinates: { lat: 45.5118, lng: -73.5744 } }
  ];

  //on insere 3 lieux dans la base
  const locations = await Location.insertMany(locationsData);
  console.log('Création de ${locations.length} lieux géographiques.')

  // creation des devices et mesures pour chaque lieux 
  const now = new Date();
  const allMeasurements = [];
  const allObservations = [];

  // boucle sur chacun des 3 lieux pour generer une mesure 
  for (const loc of locations) {
    //appareil d'ecoute fictif pour ce lieu
    const device = await Device.create({
      name: `Capteur ${loc.name}`,
      location: loc.name
    });

    //Géneration de 24 mesures cause we can guys lol
    for(let i = 0; i < 24; i++){
      const timestamp = new Date(now - i * 60 * 60 * 1000);
      const hour = timestamp.getHours();

      //Simulation des bruits realiste basé sur des heures 
      // Valeurs négatives comme Phyphox
      let baseValue = -45;
      if (hour >= 11 && hour <= 14) baseValue = -25; // midi bruyant
      else if (hour >= 17 && hour <= 22) baseValue = -20; // soir animé

      // On ajoute un peu d'aléatoire pour que le graphique ne soit pas une ligne droite
      const finalValue = baseValue + Math.random() * 8 - 4;

      allMeasurements.push({
        type: 'audio',
        value: finalValue,
        location: loc.name,
        timestamp: timestamp,
        deviceId: device._id
      });
    };

    // Création d'une observation de test pour chaque lieu
    allObservations.push({
      location: loc.name,
      proximity: 'medium',
      vibe: 'moderate',
      notes: `Observation générée pour ${loc.name}`,
      timestamp: now,
      author: testUser._id 
    });
   
  }

  //insertion en masse des mesures et observations
  await Measurement.insertMany(allMeasurements);
  console.log(`${allMeasurements.length} mesures créées au total.`);

  await Observation.insertMany(allObservations);
  console.log('${allObservations.length} observations créées au total.');

  console.log('Seed terminé !');
  process.exit(0);
};

seed().catch(err => {
  console.error('Erreur lors du seed:',err);
  process.exit(1);
});