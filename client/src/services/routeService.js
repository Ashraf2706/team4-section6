import api from './api';

export const calculateRoute = async (startLat, startLng, endLat, endLng, bikeMode = false) => {
  const response = await api.post('/routes/calculate', {
    startLat,
    startLng,
    endLat,
    endLng,
    bikeMode
  });
  return response.data;
};