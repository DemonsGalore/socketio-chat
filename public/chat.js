// make connection
const socket = io.connect('http://localhost:5000');

const message = document.getElementById('message');
const username = document.getElementById('username');
const send = document.getElementById('send');
const output = document.getElementById('output');
const feedback = document.getElementById('feedback');

// emit events
send.addEventListener('click', () => {
  socket.emit('chat', {
    message: message.value,
    username: username.value
  });
});

message.addEventListener('keypress', () => {
  socket.emit('typing', username.value);
});

// listen for events
socket.on('chat', (data) => {
  console.log("LISTEN", data);
  feedback.innerHTML = '';
  output.innerHTML += '<p><strong>' + data.username + ':</strong> ' + data.message + '</p>'
});

socket.on('typing', (username) => {
  feedback.innerHTML = '<p><em>' + username + ' is typing</em></p>';
});
