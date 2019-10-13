const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatSchema = new Schema({
  topic: {
    type: String,
    required: true,
  },
  messages: [
    {
      from: {
        type: String,
        required: true,
      },
      message: {
        type: String,
        required: true,
      }
    }
  ],
  users: [{
    type: String,
    required: true,
  }],
  typing: [{
    type: String,
    required: true,
  }],
  password: {
    type: String,
  }
}, { timestamps: true });

module.exports = Chat = mongoose.model('chats', chatSchema);
