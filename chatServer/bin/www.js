#!/usr/bin/env node
const app = require("../app");
const debug = require("debug")("message-analyzer:server");
const http = require("http");
const axios = require("axios");

const logHelper = require("./logHelper");
const analysisHelper = require("./analysisHelper");

logHelper.ensureLogFileExists();

const port = normalizePort(process.env.PORT || "3010");
app.set("port", port);

const httpServer = http.createServer(app);
const io = require("socket.io")(httpServer, {
    cors: {
        origin: ["http://localhost:3000", "http://localhost:3001"],
        methods: ["GET", "POST"]
    }
});

httpServer.listen(port);
httpServer.on("error", onError);
httpServer.on("listening", onListening);

io.on("connection", async socket => {
    console.log("new connection", socket.id);

    socket.on("message", async (data) => {
        const {
            editedMessage,
            metadata,
            originalMessage
        } = data;

        const analyzedEditedMessage = await analysisHelper.getWordLevelAnalysis(editedMessage);
        const sentenceValencePredictions = await analysisHelper.getSentenceValencePredictions(editedMessage);
        const messageToBroadcast = {
            commentMetadata: metadata,
            words: analyzedEditedMessage,
            sentenceValencePredictions
        };
        const dataToLog = {
            commentMetadata: metadata,
            words: analyzedEditedMessage,
            originalMessage,
            sentenceValencePredictions
        }

        io.emit("message", messageToBroadcast);
        logHelper.handleMessageLogging(dataToLog);
    });

    socket.on("disconnect", () => {
        console.log("client disconnected", socket.id);
    });
});

function normalizePort(val) {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

function onError(error) {
    if (error.syscall !== "listen") {
        throw error;
    }

    const bind = typeof port === "string"
        ? "Pipe " + port
        : "Port " + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case "EACCES":
            console.error(bind + " requires elevated privileges");
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.error(bind + " is already in use");
            process.exit(1);
            break;
        default:
            throw error;
    }
}

function onListening() {
    const addr = httpServer.address();
    const bind = typeof addr === "string"
        ? "pipe " + addr
        : "port " + addr.port;
    debug("Listening on " + bind);
}
