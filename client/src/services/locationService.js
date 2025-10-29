import api from './api';

export const getAllLocations = async () => {
  const response = await api.get('/locations');
  return response.data;
};

export const searchLocations = async (query) => {
  const response = await api.get(`/locations/search?query=${query}`);
  return response.data;
};

export const getLocationById = async (id) => {
  const response = await api.get(`/locations/${id}`);
  return response.data;
};