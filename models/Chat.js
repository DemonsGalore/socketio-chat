const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatSchema = new Chat({
  topic: {
    type: String,
    default: 'Room',
    required: true,
  },
  messages: [
    {
      from: {
        type: String,
      },
      message: {
        type: String,
      }
    }
  ],
  typing: [{
    type: String,
  }],
  users: [{
    type: String,
  }],
  password: {
    type: String,
  }
}, { timestamps: true });

module.exports = Chat = mongoose.model('chats', chatSchema);
