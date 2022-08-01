// connect to socket server
const socket = io('http://localhost:3000');
socket.on('connect', () => console.log('socket client connected'));

let localVideo = document.getElementById('localVideo');
let userStream;
let created = false;

// Accessing local device camera and audio
function accessAudioAndCamera() {
  navigator.mediaDevices
    .getUserMedia({
      video: true,
      audio: true,
    })
    .then((stream) => {
      userStream = stream;
      localVideo.srcObject = stream;
      localVideo.onloadeddata = () => {
        localVideo.play();
      };
    });
}

// accessing room name from url
const url = new URL(location.href);
const room = url.searchParams.get('room');

socket.emit('client_join_room', room);

socket.on('server_create_room', () => {
  created = true;
  console.log(created);
  accessAudioAndCamera();
});

socket.on('server_join_room', () => {
  created = false;
  console.log(created);
  accessAudioAndCamera();
});

socket.on('server_full_room', () => {
  alert('Room is full');
});
