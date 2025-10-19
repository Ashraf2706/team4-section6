const axios = require('axios');

const calculateRoute = async (startLat, startLng, endLat, endLng, bikeMode = false) => {
  try {
    const url = 'https://maps.googleapis.com/maps/api/directions/json';
    
    const params = {
      origin: `${startLat},${startLng}`,
      destination: `${endLat},${endLng}`,
      mode: bikeMode ? 'bicycling' : 'walking',
      key: process.env.GOOGLE_MAPS_API_KEY
    };

    // If accessible route requested, add avoid stairs preference
    if (bikeMode) {
      params.avoid = 'stairs';
    }

    const response = await axios.get(url, { params });

    if (response.data.status === 'OK') {
      const route = response.data.routes[0];
      const leg = route.legs[0];

      return {
        success: true,
        route: {
          distance: leg.distance.value, // in meters
          duration: leg.duration.value, // in seconds
          steps: leg.steps.map(step => ({
            instruction: step.html_instructions.replace(/<[^>]*>/g, ''),
            distance: step.distance.text,
            duration: step.duration.text,
            startLocation: step.start_location,
            endLocation: step.end_location
          })),
          polyline: route.overview_polyline.points,
          bikeMode: bikeMode  // Changed from 'accessible'
        }
      };
    } else {
      throw new Error('Route calculation failed');
    }
  } catch (error) {
    console.error('Google Maps API Error:', error);
    throw error;
  }
};

module.exports = { calculateRoute };