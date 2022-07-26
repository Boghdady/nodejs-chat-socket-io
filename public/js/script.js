const socket = io('http://localhost:3000');

// selecting elements
const chatBox = document.querySelector('#chat_box');
const input = document.querySelector('input');
const button = document.querySelector('button');

// check socket connection
socket.on('connect', () => {
  console.log('connected to socket io server');
});

// asking user for the username
const username = prompt('username');

// Emitting or sending data to the server
socket.emit('client_join_event', username);

// Handling events that comes from the server
socket.on('server_join_event', (username) => {
  displayMessage(username, `${username} joined to chat`);
});

// send chat message event to the server
button.addEventListener('click', () => {
  if (input.value == '') {
    alert('Please type a message');
  } else {
    socket.emit('client_chat_message', input.value);

    // to show my message
    displayMessage(username, input.value);
  }
});

// Handling chat message event
socket.on('server_chat_message', (data) => {
  displayMessage(data.username, data.message);
});

socket.on('server_left_chat', (data) => {
  displayMessage(data.username, data.message);
});

// display chat message
function displayMessage(user, msg) {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `
          <p class="user">${user}</p>
          <p class="chat_message">${msg}</p>`;

  chatBox.appendChild(div);
}
