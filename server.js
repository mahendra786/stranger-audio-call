const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const axios = require('axios');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const port = process.env.PORT || 3000;

app.use(express.static('public'));

let waitingClient = null;
let activeUsers = 0;

io.on('connection', (socket) => {
    activeUsers++;
    io.emit('activeUsers', activeUsers);
    console.log('New user connected', socket.id);

    socket.on('join', () => {
        if (waitingClient) {
            socket.partner = waitingClient;
            waitingClient.partner = socket;

            socket.emit('matched');
            waitingClient.emit('matched');

            waitingClient = null;
        } else {
            waitingClient = socket;
        }
    });

    socket.on('offer', (offer) => {
        if (socket.partner) {
            socket.partner.emit('offer', offer);
        }
    });

    socket.on('answer', (answer) => {
        if (socket.partner) {
            socket.partner.emit('answer', answer);
        }
    });

    socket.on('candidate', (candidate) => {
        if (socket.partner) {
            socket.partner.emit('candidate', candidate);
        }
    });

    socket.on('message', (message) => {
        if (socket.partner) {
            socket.partner.emit('message', message);
        }
    });

    socket.on('image', (image) => {
        if (socket.partner) {
            socket.partner.emit('image', image);
        }
    });

    socket.on('disconnect', () => {
        activeUsers--;
        io.emit('activeUsers', activeUsers);
        if (socket.partner) {
            socket.partner.emit('partner-disconnected');
            socket.partner.partner = null;
        }
        if (waitingClient === socket) {
            waitingClient = null;
        }
    });

    socket.on('leave', () => {
        if (socket.partner) {
            socket.partner.emit('partner-disconnected');
            socket.partner.partner = null;
        }
    });
});

server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});
