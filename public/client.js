    const socket = io();

    const startButton = document.getElementById('startButton');
    const hangupButton = document.getElementById('hangupButton');
    const muteButton = document.getElementById('muteButton');
    const chatButton = document.getElementById('chatButton');
    const sendButton = document.getElementById('sendButton');
    const uploadButton = document.getElementById('uploadButton');
    const fileInput = document.getElementById('fileInput');
    const messageInput = document.getElementById('messageInput');
    const messages = document.getElementById('messages');
    const statusDiv = document.getElementById('status');
    const userCount = document.getElementById('userCount');
    const chatBox = document.getElementById('chatBox');
    const chatBoxall = document.getElementById('chatBoxall');
    const notificationCount = document.getElementById('notificationCount');
    const loader = document.getElementById('loader');
    const timerDiv = document.getElementById('timer');
    const container = document.querySelector('.container');
    let timer;
    let seconds = 0;

    let localStream;
    let remoteStream = new MediaStream();
    let peerConnection;
    let isMuted = false;
    let unreadMessages = 0;

    const servers = {
        iceServers: [
            { urls: 'stun:stun.l.google.com:19302' }
        ]
    };

    socket.on('activeUsers', (count) => {
        userCount.textContent = `Active users: ${count}`;
    });

    startButton.onclick = () => {
        startButton.style.display = 'none';
        loader.style.display = 'block';
        statusDiv.textContent = 'Looking for a stranger...';
        startChat();
    };

    
