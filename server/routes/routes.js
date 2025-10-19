const express = require('express');
const router = express.Router();
const { calculateRoute } = require('../services/googleMapsService');

// @route   POST /api/routes/calculate
// @desc    Calculate route between two points
// @access  Public
router.post('/calculate', async (req, res) => {
  try {
    const { startLat, startLng, endLat, endLng, bikeMode } = req.body;

    // Validate inputs
    if (!startLat || !startLng || !endLat || !endLng) {
      return res.status(400).json({ 
        success: false, 
        error: 'Start and end coordinates required' 
      });
    }

    const routeData = await calculateRoute(
      startLat, 
      startLng, 
      endLat, 
      endLng, 
      bikeMode || false
    );

    res.json(routeData);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;