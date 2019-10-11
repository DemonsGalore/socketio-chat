const express = require('express');
const socket = require('socket.io');

// express initialization
const app = express();
app.disable('x-powered-by');

// express body-parser middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(`Server started at http://localhost:${PORT}`));

// socket initialization
const io = socket(server);

io.on('connection', (socket) => {
  socket.on('message', (message) => {
    io.emit('message', message);
  });

  socket.on('typing', (data) => {
    socket.broadcast.emit('typing', data);
  });

  socket.on('stopped-typing', (data) => {
    socket.broadcast.emit('stopped-typing', data);
  });
});
