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
  socket.on('client_join_event', (username) => {
    users[socket.id] = username;
    console.log(users);
    socket.broadcast.emit('server_join_event', username);
  });

  socket.on('client_chat_message', (message) => {
    socket.broadcast.emit('server_chat_message', {
      username: users[socket.id],
      message,
    });
  });
});

server.listen(port, () => {
  console.log(`Server running at: http://localhost:${port}`);
});
