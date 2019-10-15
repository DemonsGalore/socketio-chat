const express = require('express');
const socket = require('socket.io');
const mongoose = require('mongoose');

const { mongoURI } = require('./config/keys');

const { Chat } = require('./models');
const chat = require('./api/chat');

// express initialization
const app = express();
app.disable('x-powered-by');

// express body-parser middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// use routes
app.use('/api/chat', chat);

// connect to MongoDB
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('MongoDB connected.');
    // start server
    const PORT = process.env.PORT || 5000;
    const server = app.listen(PORT, () => console.log(`Server started at http://localhost:${PORT}`));
    
    // socket initialization
    const io = socket(server);

    io.on('connection', (socket) => {
      socket.on('message', async (data) => {
        const { user, message, topic } = data;

        try {
          await Chat.updateOne(
            { topic },
            { $push: { messages: { user, message } } },
            {}
          );
          io.emit('message', data);
        } catch (error) {
          throw error;
        }
      });

      socket.on('create-new-chat', async (topic) => {
        const newChat = new Chat({
          topic,
        });

        try {
          const result = await newChat.save();
          io.emit('create-new-chat', result);
        } catch (error) {
          throw error;
        }
      });

      socket.on('typing', (data) => {
        socket.broadcast.emit('typing', data);
      });

      socket.on('stopped-typing', (data) => {
        socket.broadcast.emit('stopped-typing', data);
      });

      socket.on('user-joined-chat', async (data) => {
        const { user, topic } = data;
        try {
          await Chat.updateOne(
            { topic },
            { $push: { users: user } },
            {}
          );
          io.emit('user-joined-chat', data);
        } catch (error) {
          throw error;
        }
      });

      socket.on('user-left-chat', async (data) => {
        const { user, topic } = data;
        try {
          await Chat.updateOne(
            { topic },
            { $pull: { users: user } },
            {}
          );
          io.emit('user-left-chat', data);
        } catch (error) {
          throw error;
        }
      });
    });
  })
  .catch(error => console.log("Error", error));
