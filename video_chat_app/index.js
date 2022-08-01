const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

// serve static files
app.use(express.static('public'));

io.on('connection', (socket) => {
  socket.on('client_join_room', (roomName) => {
    const rooms = io.sockets.adapter.rooms;
    const room = rooms.get(roomName);

    if (!room) {
      socket.join(roomName);
      socket.emit('server_create_room');
    } else if (room.size == 1) {
      socket.join(roomName);
      socket.emit('server_join_room');
    } else {
      socket.emit('server_full_room');
    }
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server running on: http://localhost:${port}`);
});
