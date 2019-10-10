const express = require('express');
const socket = require('socket.io');

// ExpressServer initialization
const app = express();
app.disable('x-powered-by');

// express body-parser middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(`Server started at http://localhost:${PORT}`));


// static files
app.use(express.static('public'));

// socket initialization
const io = socket(server);

io.on('connection', (socket) => {
  console.log('Socket connected.', socket.id);

  socket.on('chat', (data) => {
    console.log(data);
    io.emit('chat', data);
  });

  socket.on('typing', (username) => {
    socket.broadcast.emit('typing', username);
  });
});
