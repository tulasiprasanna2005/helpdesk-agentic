const mongoose = require('mongoose');

const ConfigSchema = new mongoose.Schema({
  autoCloseEnabled: {
    type: Boolean,
    default: true,
  },
  confidenceThreshold: {
    type: Number,
    default: 0.78,
  },
  slaHours: {
    type: Number,
    default: 24,
  },
});

module.exports = mongoose.model('Config', ConfigSchema);