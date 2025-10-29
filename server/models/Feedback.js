const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  issueType: {
    type: String,
    enum: ['Wrong Location', 'Missing Building', 'Route Error', 'Accessibility Issue', 'Other'],
    required: true
  },
  locationID: String,
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['New', 'Reviewed', 'Resolved'],
    default: 'New'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Feedback', FeedbackSchema);