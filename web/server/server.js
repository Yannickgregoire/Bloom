const app = require('express')();
const chalk = require('chalk');
const http = require('http').Server(app);
const io = require('socket.io')(http);

let users = [];

let frames = [];
for (let i = 0; i < 10; i++) {
    frames.push({
        id: i,
        rendered: false,
        rendering: false,
        image: '',
        socket: undefined
    })
}

const file = {
    title: '~/Movie_final-def_02_(edited)-final_export.mp4'
};

let chunk = 0;
let progress = 0;

const messages = {
    connected: 'a user connected',
    disconnected: 'a user disconnected'
}

io.sockets.on('connection', function (socket) {
    connect(socket);
});

function connect(socket) {

    socket.on('disconnect', function () {
        disconnect(socket);
    });

    socket.on('progress', function () {
        onProgress(socket);
    });

    socket.on('requestFrame', function () {
        onRequestFrame(socket);
    });

    socket.on('frameComplete', function (id) {
        onFrameComplete(socket, id);
    });

    registerUser(socket);

    io.sockets.emit('users', users);

    log(chalk.green(messages.connected));
    log(chalk.blue('users: ' + users.length));
    log(chalk.green(socket.id));

}

function disconnect(socket) {

    unregisterUser(socket)
    io.sockets.emit('users', users);

    log(chalk.red('a user disconnected'));

    onUncompleteFrame(socket.id);

}

function registerUser(socket) {
    users.push({ id: socket.id, handshake: socket.handshake });
}

function unregisterUser(socket) {
    users = users.filter(s => socket.id !== s.id);
}

function onProgress(socket) {
    progress += increment;
    if (progress > 100) {
        chunk++;
        progress = 0;
        file.image = getGradient();

        io.sockets.emit('file', file);
        io.sockets.emit('chunk', chunk);
    }
}

function onRequestFrame(socket) {
    const frame = getUnrenderedFrame();

    if (frame) {
        frame.rendering = true;
        frame.socket = socket.id;
        socket.emit('frame', frame.id);
    }

}

function onFrameComplete(socket, id) {
    
    const frame = getFrameByID(id);

    frames.map((frame) => {
        if (frame.id === id) {
            frame.rendering = false;
            frame.rendered = true;
        }
    })

    onRequestFrame(socket);

}

function onUncompleteFrame(id) {

    const frames = getFramesBySocket(id);

    if (frames) {
        frames.map(frame => {

            if (frame.rendering) {
                frame.rendering = false;
                frame.rendered = false;
                frame.socket = undefined;
            }

        })
    }

}

function getUnrenderedFrame() {
    return frames.filter(frame => frame.rendered === false && frame.rendering === false)[0];
}

function getIndexForFrameID(id) {
    return frames.map(frame => {
        if (frame.id === id) return id;
    })
}

function getFrameByID(id) {
    return frames.filter(frame => frame.id === id)[0];
}

function getFramesBySocket(socket) {
    return frames.filter(frame => frame.socket === socket);
}

function log(message) {
    console.log(`[${new Date().toISOString()}] ${message}`)
}

http.listen(3000, function () {
    log(chalk.blue('listening on *:3000'));
});
