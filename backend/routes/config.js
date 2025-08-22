const express = require('express');
const router = express.Router();
const Config = require('../models/Config');
const { auth, adminAuth } = require('../middleware/auth');

// @route   GET /api/config
// @desc    Get the application configuration
// @access  Public
router.get('/', async (req, res) => {
  try {
    const config = await Config.findOne();
    if (!config) return res.status(404).json({ msg: 'Config not found' });
    res.json(config);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/config
// @desc    Update the application configuration
// @access  Admin
router.put('/', [auth, adminAuth], async (req, res) => {
  const { autoCloseEnabled, confidenceThreshold, slaHours } = req.body;
  try {
    let config = await Config.findOne();
    if (!config) {
      // If config doesn't exist, create it.
      config = new Config({ autoCloseEnabled, confidenceThreshold, slaHours });
      await config.save();
      return res.status(201).json(config);
    }
    
    config.autoCloseEnabled = autoCloseEnabled !== undefined ? autoCloseEnabled : config.autoCloseEnabled;
    config.confidenceThreshold = confidenceThreshold || config.confidenceThreshold;
    config.slaHours = slaHours || config.slaHours;

    await config.save();
    res.json(config);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;