const express = require('express');
const app = express();
const fs = require('fs');

const chalk = require('chalk');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const bodyparser = require('body-parser');

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

const messages = {
    connected: 'a user connected',
    disconnected: 'a user disconnected'
}

io.sockets.on('connection', function (socket) {
    connect(socket);
});

function connect(socket) {

    registerUser(socket);
    addEventListeners(socket);

    io.sockets.emit('users', users);
    log(chalk.green(messages.connected));
    log(chalk.blue('users: ' + users.length));

}

function disconnect(socket) {

    unregisterUser(socket)
    resetUncompletedFrames(socket);

    io.sockets.emit('users', users);
    log(chalk.red('a user disconnected'));

}

function addEventListeners(socket) {

    socket.on('disconnect', function () {
        disconnect(socket);
    });

    socket.on('requestFrame', function () {
        handleRequestFrame(socket);
    });

    socket.on('frameComplete', function (id) {
        handleFrameComplete(socket, id);
    });

}

function registerUser(socket) {
    users.push({ id: socket.id, handshake: socket.handshake });
}

function unregisterUser(socket) {
    users = users.filter(s => socket.id !== s.id);
}

function handleRequestFrame(socket) {
    const frame = getUnrenderedFrame();
    if (frame) {
        frame.rendering = true;
        frame.socket = socket;
        socket.emit('frame', frame.id);
    }
}

function handleFrameComplete(socket, id) {
    log(chalk.magenta(`frame complete: ${id}`));
    const frame = getFrameByID(id);
    frames.map((frame) => {
        if (frame.id === id) {
            frame.rendering = false;
            frame.rendered = true;
        }
    })
    handleRequestFrame(socket);
}

function resetUncompletedFrames(socket) {
    const frames = getFramesBySocketID(socket.id);
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

function getFrameByID(id) {
    return frames.filter(frame => frame.id === id)[0];
}

function getFramesBySocketID(id) {
    return frames.filter(frame => frame.socket ? frame.socket.id === id : false);
}

function log(message) {
    console.log(`[${new Date().toISOString()}] ${message}`)
}


app.use(bodyparser.json({ limit: "1000mb" }));
app.use(bodyparser.urlencoded({ extended: false, limit: '1000mb', parameterLimit: 1000000 }));

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.post('/upload', function (req, res, next) {

    var filename = req.body.filename;
    var data = req.body.data.replace(/^data:image\/png;base64,/, "");
    var path = `${__dirname}/../uploads/${filename}`;
    fs.writeFile(path, data, "base64", function (err) {
        if (err) {
            console.log(err);
            res.send(500)
        } else {
            res.send(200);
        }
    });

})

http.listen(3000, function () {
    log(chalk.blue('listening on *:3000'));
});
