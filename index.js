const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

// serve static files
app.use(express.static('public'));
// serve template engine
app.set('view engine', 'ejs');

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.render('index');
});

io.on('connection', (socket) => {
  // on: receive data from client
  socket.on('btnData', (data) => {
    // emit: send data to client
    socket.emit('serverEvent', 'data from the server');
  });
});

server.listen(port, () => {
  console.log(`Server running at: http://localhost:${port}`);
});
