const express = require('express');
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/auth');
const Item = require('../models/Item');
const User = require('../models/User');
const router = express.Router();

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Add new item
router.post('/', auth, upload.array('images', 5), async (req, res) => {
  try {
    const { title, description, category, size, condition, tags, pointsValue } = req.body;

    // ✅ Convert backslashes to forward slashes
    const images = req.files.map(file => file.path.replace(/\\/g, '/'));

    const item = new Item({
      title,
      description,
      category,
      size,
      condition,
      tags: tags.split(',').map(tag => tag.trim()),
      images,
      owner: req.user.id,
      pointsValue: pointsValue || 50
    });

    await item.save();
    res.status(201).json(item);
  } catch (error) {
    console.error('Add item error:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Get all items
router.get('/', async (req, res) => {
  try {
    const items = await Item.find({ status: 'available' }).populate('owner', 'name');
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Get user's items
router.get('/my-items', auth, async (req, res) => {
  try {
    const items = await Item.find({ owner: req.user.id });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Get single item
router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('owner', 'name email');
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

module.exports = router;
