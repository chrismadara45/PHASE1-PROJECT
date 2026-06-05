const Device = require('../models/Device');

const auth = async (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey) {
    return res.status(401).json({ error: 'Clé API manquante' });
  }

  const device = await Device.findOne({ apiKey });
  
  if (!device) {
    return res.status(403).json({ error: 'Clé API invalide' });
  }

  req.device = device;
  next();
};

module.exports = auth;