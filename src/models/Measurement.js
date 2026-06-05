const mongoose = require('mongoose');

const measurementSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['audio']
  },
  value: {
    type: Number,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    required: true
  },
  receivedAt: {
    type: Date,
    default: Date.now
  },
  deviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Device'
  }
}, { timestamps: true });

module.exports = mongoose.model('Measurement', measurementSchema);