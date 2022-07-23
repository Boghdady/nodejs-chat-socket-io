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

server.listen(port, () => {
  console.log(`Server running at: http://localhost:${port}`);
});
