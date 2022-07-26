const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

// serve static files (css/images)
app.use(express.static('public'));
// serve template engine
app.set('view engine', 'ejs');

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.render('index');
});

const users = {};

io.on('connection', (socket) => {
  // 1. User joined to chat
  socket.on('client_join_event', (username) => {
    users[socket.id] = username;
    socket.broadcast.emit('server_join_event', username);
  });

  // 2. User send message to chatroom
  socket.on('client_chat_message', (message) => {
    socket.broadcast.emit('server_chat_message', {
      username: users[socket.id],
      message,
    });
  });

  // 3. User left the chat
  socket.on('disconnect', () => {
    socket.broadcast.emit('server_left_chat', {
      username: users[socket.id],
      message: `${users[socket.id]} left the chatroom`,
    });
    // delete username
    delete users[socket.id];
  });
});

server.listen(port, () => {
  console.log(`Server running at: http://localhost:${port}`);
});
