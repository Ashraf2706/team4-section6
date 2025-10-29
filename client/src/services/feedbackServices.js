import api from './api';

export const submitFeedback = async (feedbackData) => {
  const response = await api.post('/feedback', feedbackData);
  return response.data;
};

export const submitObstacleReport = async (obstacleData) => {
  const response = await api.post('/admin/obstacles', obstacleData);
  return response.data;
};