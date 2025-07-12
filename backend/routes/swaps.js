const express = require('express');
const auth = require('../middleware/auth');
const Swap = require('../models/Swap');
const Item = require('../models/Item');
const User = require('../models/User');
const router = express.Router();

// Create swap request
router.post('/', auth, async (req, res) => {
  try {
    const { requestedItemId, offeredItemId, pointsOffered } = req.body;
    
    const requestedItem = await Item.findById(requestedItemId);
    if (!requestedItem || requestedItem.status !== 'available') {
      return res.status(400).json({ message: 'Item not available for swap' });
    }

    let offeredItem = null;
    if (offeredItemId) {
      offeredItem = await Item.findById(offeredItemId);
      if (!offeredItem || offeredItem.owner.toString() !== req.user.id) {
        return res.status(400).json({ message: 'Invalid offered item' });
      }
    }

    const swap = new Swap({
      requester: req.user.id,
      recipient: requestedItem.owner,
      requestedItem: requestedItemId,
      offeredItem: offeredItemId,
      pointsOffered: pointsOffered || 0
    });

    await swap.save();
    
    // Update item status if needed
    if (offeredItem) {
      offeredItem.status = 'pending';
      await offeredItem.save();
    }

    requestedItem.status = 'pending';
    await requestedItem.save();

    res.status(201).json(swap);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Get user's swaps
router.get('/my-swaps', auth, async (req, res) => {
  try {
    const swaps = await Swap.find({
      $or: [{ requester: req.user.id }, { recipient: req.user.id }]
    })
    .populate('requester', 'name')
    .populate('recipient', 'name')
    .populate('requestedItem', 'title images')
    .populate('offeredItem', 'title images');

    res.json(swaps);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Update swap status
router.put('/:id', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const swap = await Swap.findById(req.params.id)
      .populate('requestedItem')
      .populate('offeredItem');

    if (!swap) return res.status(404).json({ message: 'Swap not found' });
    if (swap.recipient.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    swap.status = status;
    await swap.save();

    // Update item statuses based on swap outcome
    if (status === 'accepted') {
      swap.requestedItem.status = 'swapped';
      await swap.requestedItem.save();
      
      if (swap.offeredItem) {
        swap.offeredItem.status = 'swapped';
        await swap.offeredItem.save();
      } else if (swap.pointsOffered > 0) {
        // Handle points transfer
        const requester = await User.findById(swap.requester);
        const recipient = await User.findById(swap.recipient);
        
        requester.points -= swap.pointsOffered;
        recipient.points += swap.pointsOffered;
        
        await requester.save();
        await recipient.save();
      }
    } else if (status === 'rejected') {
      swap.requestedItem.status = 'available';
      await swap.requestedItem.save();
      
      if (swap.offeredItem) {
        swap.offeredItem.status = 'available';
        await swap.offeredItem.save();
      }
    }

    res.json(swap);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

module.exports = router;