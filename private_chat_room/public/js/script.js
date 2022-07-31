const socket = io('http://localhost:3000');
socket.on('connect', () => {
  console.log('socket.io server connected');
});

// Select elements
const chatBox = document.querySelector('#chat_box');

// getting query string
const url = new URL(location.href);
const username = url.searchParams.get('username');
const room = url.searchParams.get('room');

// send join event to server
socket.emit('client_join', { username, room });

// handle join event
socket.on('server_join', ({ username, message }) => {
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
