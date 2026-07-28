const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({
  fullName:      { type: String, required: true, trim: true },
  email:         { type: String, required: true, trim: true, lowercase: true },
  phone:         { type: String, required: true, trim: true },
  inquiryType:   { type: String, required: true },
  message:       { type: String, required: true },
  status:        { type: String, enum: ['new', 'read', 'replied'], default: 'new' },
  adminReply:    { type: String, default: '' },
  repliedAt:     { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Enquiry', enquirySchema);
