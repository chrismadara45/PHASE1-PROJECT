const express = require('express');
const router = express.Router();
const Observation = require('../models/Observation');
const authUser = require('../middlewares/authUser');
const auth = require('../middlewares/authUser');

// POST /observations - Ajouter une observation
router.post('/', auth, async (req, res) => {
  try {
    const { location, proximity, vibe, notes } = req.body;
    if (!location || !proximity || !vibe) {
      return res.status(400).json({ error: 'location, proximity et vibe sont requis' });
    }
    const observation = new Observation({
      location,
      proximity,
      vibe,
      notes,
      author:req.user._id
    });
    await observation.save();
    res.status(201).json(observation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /observations - Lister les observations
router.get('/', async (req, res) => {
  try {
    const { location } = req.query;
    const filter = location ? { location } : {};
    const observations = await Observation.find(filter)
    .populate('author', 'username') 
    .sort({ timestamp: -1 })
    .limit(100);
    res.status(200).json(observations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;