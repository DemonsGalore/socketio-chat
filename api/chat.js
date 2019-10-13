const express = require('express');
const router = express.Router();

// load models
const { Chat } = require('../models');

// @route       GET api/chat/all
// @description get all chats
// @access      public
router.get('/all', async (req, res) => {
  try {
    const chats = await Chat.find();
    if (!chats) {
      return res.status(404).json({ nochats: 'There are no active chats.' });
    }
    return res.status(200).json(chats);
  } catch (error) {
    return res.status(404).json({ nochats: 'There are no active chats.' });
  }
});

module.exports = router;
