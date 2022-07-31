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
    socket.join(userData.room);
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`server running on : http://localhost:${port}`);
});
