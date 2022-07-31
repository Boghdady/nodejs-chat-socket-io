const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

//  server static files
app.use(express.static('public'));

// serve template engine
app.set('view engine', 'ejs');

const users = {};
io.on('connection', (socket) => {
  socket.on('client_join', (userData) => {
    users[socket.id] = userData;
    console.log(users);
    // user joined to specific room
    socket.join(userData.room);
    // send joined message to specific chat room
    // we using io instead of socket to appear join message in the current open session in the browser
    // io send the event also the the user who send the event
    io.to(userData.room).emit('server_join', {
      username: userData.username,
      message: `${userData.username} joined to ${userData.room} chatroom`,
    });
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`server running on : http://localhost:${port}`);
});
