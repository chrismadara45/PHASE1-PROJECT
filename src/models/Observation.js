const mongoose = require('mongoose');

const observationSchema = new mongoose.Schema({
  location: {
    type: String,
    required: true
  },
  proximity: {
    type: String,
    required: true,
    enum: ['low', 'medium', 'high']
  },
  vibe: {
    type: String,
    required: true,
    enum: ['calm', 'moderate', 'busy', 'chaotic']
  },
  notes: {
    type: String,
    default: ''
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  receivedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Observation', observationSchema);