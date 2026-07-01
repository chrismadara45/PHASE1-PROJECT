const mongoose = require('mongoose');
const crypto = require('crypto');

const deviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  latitude: {
    type: Number,
    default: null
  },
  longitude: {
    type: Number,
    default: null
  },
  apiKey: {
    type: String,
    default: () => crypto.randomBytes(32).toString('hex')
  }
}, { timestamps: true });

module.exports = mongoose.model('Device', deviceSchema);