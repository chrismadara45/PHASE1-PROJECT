const express = require('express');
const router = express.Router();
const Measurement = require('../models/Measurement');
const Observation = require('../models/Observation');

// GET /ambiance/:location/history?last=3h
router.get('/:location/history', async (req, res) => {
  try {
    const { location } = req.params;
    const { last = '3h' } = req.query;

    const hours = parseInt(last) || 3;
    const since = new Date(Date.now() - hours * 60 * 60 * 1000);

    const measurements = await Measurement.find({
      location,
      timestamp: { $gte: since }
    }).sort({ timestamp: 1 });

    const observations = await Observation.find({
      location,
      timestamp: { $gte: since }
    }).sort({ timestamp: 1 });

    res.json({
      location,
      period: `last ${hours}h`,
      measurements,
      observations
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /ambiance/:location/quiet-hours
router.get('/:location/quiet-hours', async (req, res) => {
  try {
    const { location } = req.params;

    const measurements = await Measurement.find({ location });

    const hourlyAvg = {};
    measurements.forEach(m => {
      const hour = new Date(m.timestamp).getHours();
      if (!hourlyAvg[hour]) hourlyAvg[hour] = { total: 0, count: 0 };
      hourlyAvg[hour].total += m.value;
      hourlyAvg[hour].count += 1;
    });

    const quietHours = Object.entries(hourlyAvg)
      .map(([hour, data]) => ({
        hour: parseInt(hour),
        avgDecibels: Math.round(data.total / data.count)
      }))
      .filter(h => h.avgDecibels < 60)
      .sort((a, b) => a.avgDecibels - b.avgDecibels);

    res.json({ location, quietHours });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /ambiance/:location/current
router.get('/:location/current', async (req, res) => {
  try {
    const { location } = req.params;
    const since = new Date(Date.now() - 30 * 60 * 1000); // 30 dernières minutes

    const measurements = await Measurement.find({
      location,
      timestamp: { $gte: since }
    });

    const observations = await Observation.find({
      location,
      timestamp: { $gte: since }
    }).sort({ timestamp: -1 }).limit(1);

    const avgDecibels = measurements.length
      ? Math.round(measurements.reduce((sum, m) => sum + m.value, 0) / measurements.length)
      : null;

    let noiseLevel = 'unknown';
    if (avgDecibels !== null) {
      if (avgDecibels < 50) noiseLevel = 'calme';
      else if (avgDecibels < 65) noiseLevel = 'modéré';
      else if (avgDecibels < 80) noiseLevel = 'animé';
      else noiseLevel = 'bruyant';
    }

    res.json({
      location,
      avgDecibels,
      noiseLevel,
      vibe: observations[0]?.vibe || 'unknown',
      proximity: observations[0]?.proximity || 'unknown',
      basedOn: {
        measurements: measurements.length,
        observations: observations.length
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;