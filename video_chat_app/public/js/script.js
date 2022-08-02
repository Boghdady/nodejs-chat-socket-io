// connect to socket server
const socket = io('http://localhost:3000');
socket.on('connect', () => console.log('socket client connected'));

let localVideo = document.getElementById('localVideo');
let userStream;
let isCreated = false;
let rtcPeerConnection;
let iceServers = {
  iceServers: [
    { urls: 'stun:stun.1.google.com:19302' },
    { urlsL: 'stun:stun.services.mozilla.com:3478' },
  ],
};

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
  isCreated = true;
  accessAudioAndCamera();
});

socket.on('server_join_room', () => {
  isCreated = false;
  accessAudioAndCamera();
  socket.emit('client_ready', room);
});

socket.on('server_full_room', () => {
  alert('Room is full');
});

socket.on('server_ready', () => {
  if (isCreated) {
    rtcPeerConnection = new RTCPeerConnection(iceServers);
    rtcPeerConnection.onicecandidate = OnIceCandidateFunction;
  }
});

function OnIceCandidateFunction(event) {
  if (event.candidate) {
    socket.emit('candidate', candidate, room);
  }
}
