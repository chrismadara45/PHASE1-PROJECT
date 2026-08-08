const express = require('express');
const router = express.Router();
// On importe notre le nouveau modèle Lieu
const Location = require('../models/Location');

// GET /locations pour Lister tous les lieux avec leurs coordonnées
router.get('/', async (req, res) => {
  try {
    // On va chercher tous les lieux dans la base de données
    const locations = await Location.find();
    
    // On renvoie le tableau de lieux avec un code 200 (OK)
    res.status(200).json(locations);
  } catch (err) {
    // En cas de problème de connexion à la base, on renvoie une erreur 500
    res.status(500).json({ error: err.message });
  }
});

// POST /locations  Pour ajouter facilement un lieu via Postman
router.post('/', async (req, res) => {
  try {
    // On récupère les données envoyées dans le corps de la requête
    const { name, lat, lng } = req.body;
    
    // On vérifie que rien ne manque
    if (!name || lat === undefined || lng === undefined) {
      return res.status(400).json({ error: 'name, lat et lng sont requis' });
    }

    // On crée le nouveau lieu
    const location = new Location({
      name,
      coordinates: { lat, lng }
    });
    
    // On sauvegarde en base de données
    await location.save();
    
    // code 201
    res.status(201).json(location);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;