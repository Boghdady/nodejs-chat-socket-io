const socket = io('http://localhost:3000');
socket.on('connect', () => {
  console.log('socket.io server connected');
});

// Select elements
const chatBox = document.querySelector('#chat_box');
const input = document.querySelector('input');
const button = document.querySelector('button');

// getting query string
const url = new URL(location.href);
const username = url.searchParams.get('username');
const room = url.searchParams.get('room');

button.addEventListener('click', () => {
  socket.emit('client_chat_message', input.value);
  input.value = '';
});

// send join event to server
socket.emit('client_join', { username, room });

// handle join event
socket.on('server_join', ({ username, message }) => {
  displayMessage(username, message);
});

// handling chat message event
socket.on('server_chat_message', ({ username, message }) => {
  displayMessage(username, message);
});

// handle user left chat event
socket.on('server_left_chat', ({ username, message }) => {
  console.log(username, message);
  displayMessage(username, message);
});

// display chat message
function displayMessage(username, msg) {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `
          <p class="user">${username}</p>
          <p class="chat_message">${msg}</p>`;

  chatBox.appendChild(div);
}
