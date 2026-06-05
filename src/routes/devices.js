const express = require('express');
const router = express.Router();
const Device = require('../models/Device');

// POST /devices - Enregistrer un nouveau device
router.post('/', async (req, res) => {
  try {
    const { name, location } = req.body;
    if (!name || !location) {
      return res.status(400).json({ error: 'name et location sont requis' });
    }
    const device = new Device({ name, location });
    await device.save();
    res.status(201).json({ id: device._id, apiKey: device.apiKey });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /devices - Lister tous les devices
router.get('/', async (req, res) => {
  try {
    const devices = await Device.find().select('-apiKey');
    res.status(200).json(devices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;