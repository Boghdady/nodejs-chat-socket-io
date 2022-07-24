const chatBox = document.querySelector('#chat_box');

const socket = io('http://localhost:3000');

// check socket connection
// socket.on('connect', () => {
//   console.log('connected to socket io server');
// });

const username = prompt('username');

// Emitting or sending data to the server
socket.emit('client_join_event', username);

// Handling events that comes from the server
socket.on('server_join_event', (username) => {
  displayMessage(username, `${username} joined to chat`);
});

function displayMessage(user, msg) {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `
          <p class="user">${user}</p>
          <p class="chat_message">${msg}</p>`;

  chatBox.appendChild(div);
}
