const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  tags: {
    type: [String],
    default: [],
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft',
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  createdAt:{
    type: Date,
    default:Date.now,
  }
});

module.exports = mongoose.model('Article', ArticleSchema);