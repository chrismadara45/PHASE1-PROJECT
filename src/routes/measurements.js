const express = require('express');
const router = express.Router();
const Measurement = require('../models/Measurement');
const auth = require('../middlewares/auth');

// POST /measurements - Ajouter une mesure
router.post('/', auth, async (req, res) => {
  try {
    const { type, value, location, timestamp } = req.body;
    if (!type || value === undefined || !location || !timestamp) {
      return res.status(400).json({ error: 'type, value, location et timestamp sont requis' });
    }
    const measurement = new Measurement({
      type,
      value,
      location,
      timestamp: new Date(timestamp),
      deviceId: req.device._id
    });
    await measurement.save();
    res.status(201).json(measurement);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /measurements - Lister les mesures
router.get('/', async (req, res) => {
  try {
    const { location } = req.query;
    const filter = location ? { location } : {};
    const measurements = await Measurement.find(filter).sort({ timestamp: -1 }).limit(100);
    res.status(200).json(measurements);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;