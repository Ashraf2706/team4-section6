const mongoose = require('mongoose');

const ObstacleSchema = new mongoose.Schema({
  obstacleID: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    enum: ['Construction', 'Closed Path', 'Event'],
    required: true
  },
  description: String,
  affectedArea: {
    type: {
      type: String,
      enum: ['Point', 'LineString', 'Polygon'],
      default: 'Point'
    },
    coordinates: []
  },
  startDate: Date,
  endDate: Date,
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Obstacle', ObstacleSchema);