const mongoose = require('mongoose');

const observationSchema = new mongoose.Schema({
  location: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId, // Le type est un ID unique d'objet MongoDB
    ref: 'User',                           
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
    enum: ['calm', 'moderate', 'busy', 'insanely busy']
  },
  notes: {
    type: String,
    default: ''
  },
  auteur: {
    type: String,
    default: 'anonyme'
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