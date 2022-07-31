const socket = io('http://localhost:3000');
socket.on('connect', () => {
  console.log('socket.io server connected');
});

// getting query string
const url = new URL(location.href);
const username = url.searchParams.get('username');
const room = url.searchParams.get('room');

console.log(username, room);
