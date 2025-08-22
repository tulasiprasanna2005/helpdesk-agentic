const express = require('express');
const router = express.Router();
const Article = require('../models/Article'); // Assuming you have an Article model
const { auth, adminAuth } = require('../middleware/auth'); // Import auth middleware

// @route   GET /api/kb?query=...
// @desc    Search for knowledge base articles
// @access  Public
router.get('/', async (req, res) => {
  const { query } = req.query;
  try {
    let articles;
    if (query) {
      // Simple keyword search on title and body
      articles = await Article.find({
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { body: { $regex: query, $options: 'i' } }
        ]
      });
    } else {
      articles = await Article.find();
    }
    res.json(articles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/kb
// @desc    Create a new KB article
// @access  Admin
router.post('/', [auth, adminAuth], async (req, res) => {
  const { title, body, tags, status } = req.body;
  try {
    const newArticle = new Article({
      title,
      body,
      tags,
      status,
    });
    const article = await newArticle.save();
    res.status(201).json(article);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }

});

// @route   PUT /api/kb/:id
// @desc    Update a KB article
// @access  Admin
router.put('/:id', [auth, adminAuth], async (req, res) => {
  const { title, body, tags, status } = req.body;
  try {
    let article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ msg: 'Article not found' });
    
    // Update fields
    article.title = title || article.title;
    article.body = body || article.body;
    article.tags = tags || article.tags;
    article.status = status || article.status;
    article.updatedAt = Date.now();
    
    await article.save();
    res.json(article);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/kb/:id
// @desc    Delete a KB article
// @access  Admin
router.delete('/:id', [auth, adminAuth], async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article) return res.status(404).json({ msg: 'Article not found' });
    res.json({ msg: 'Article removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;