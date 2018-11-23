const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const port = process.env.PORT || 4001;
const app = express();

const server = http.createServer(app);
const io = socketIo(server);

const SerialPort = require('serialport');
const Readline = SerialPort.parsers.Readline

const serialPort = new SerialPort("COM6", {
    baudRate: 9600,
});
const parser = new Readline()

serialPort.pipe(parser)

io.on("connection", socket => {
    console.log("Client connected - reading serial port data");

    readAndEmitFromSerialPort(parser, socket);

    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
});

function readAndEmitFromSerialPort(serialPort, socket) {
    serialPort.on('readable', function (data) {
        var data = serialPort.read();
        if (!data) {
            logger.error(`Error reading serial port data - data: (${data})`);
        } else {
            console.log('Data:', data);
            socket.emit("test", data);
        }
    });
}

server.listen(port, () => console.log(`Listening on port ${port}`));