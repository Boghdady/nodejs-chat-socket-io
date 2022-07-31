const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

//  server static files
app.use(express.static('public'));

// serve template engine
app.set('view engine', 'ejs');

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`server running on : http://localhost:${port}`);
});