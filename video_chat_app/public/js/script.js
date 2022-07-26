// connect to socket server
const socket = io('http://localhost:3000');
socket.on('connect', () => console.log('socket client connected'));

let localVideo = document.getElementById('localVideo');
let remoteVideo = document.getElementById('remoteVideo');

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
      localVideo.onloadedmetadata = () => {
        localVideo.play();
        socket.emit('client_join_room', room);
      };
    });
}

// accessing room name from url
const url = new URL(location.href);
const room = url.searchParams.get('room');

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
    startPeerConnection();
    // send offer
    rtcPeerConnection.createOffer().then((offer) => {
      rtcPeerConnection.setLocalDescription(offer);
      socket.emit('client_offer', offer, room);
    });
  }
});

socket.on('server_offer', (offer) => {
  if (!isCreated) {
    startPeerConnection();
    // send answer
    rtcPeerConnection.setRemoteDescription(offer);
    rtcPeerConnection.createAnswer().then((answer) => {
      rtcPeerConnection.setLocalDescription(answer);
      socket.emit('client_answer', answer, room);
    });
  }
});

socket.on('server_answer', (answer) => {
  if (isCreated) {
    rtcPeerConnection.setRemoteDescription(answer);
  }
});

socket.on('candidate', (candidate) => {
  const Candidate = new RTCIceCandidate(candidate);
  rtcPeerConnection.addIceCandidate(Candidate);
});

function startPeerConnection() {
  rtcPeerConnection = new RTCPeerConnection(iceServers);
  rtcPeerConnection.onicecandidate = OnIceCandidateFunction;
  // start video streaming on remote video
  rtcPeerConnection.ontrack = onTrackFunction;
  // sending media stream (audio,video) to other users on the chatroom
  rtcPeerConnection.addTrack(userStream.getTracks()[0], userStream);
  rtcPeerConnection.addTrack(userStream.getTracks()[1], userStream);
}

function OnIceCandidateFunction(event) {
  if (event.candidate) {
    socket.emit('candidate', event.candidate, room);
  }
}

function onTrackFunction(event) {
  remoteVideo.srcObject = event.streams[0];
  remoteVideo.onloadedmetadata = () => {
    remoteVideo.play();
  };
}
