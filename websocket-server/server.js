require("dotenv").config();
const express = require("express");
const WEBSOCKET_APP = express();
const http = require("http");
const cors = require("cors");
const {WebSocketServer} = require("ws");
const { googleBardPalm2Api } = require("./controller/chatbotController");

//BACKEND [ APP PORT NUMBER ]
const PORT = 7777;

WEBSOCKET_APP.use(cors());
WEBSOCKET_APP.options("*", cors());

const server = http.createServer(WEBSOCKET_APP);
const wsServer = new WebSocketServer({server});

wsServer.on("connection", (socket) => {
    console.log("received the connection");

    socket.on("message", async(data) => {
      // If message is a Buffer (binary), convert it to string
      const decodedMessage = data.toString();
      console.log("received message from client -", decodedMessage);
      let response = await googleBardPalm2Api(decodedMessage);
      let tempCount = 0;
      let streamInterval = null;

      streamInterval = setInterval(() => {
        socket.send(response.substring(tempCount,tempCount + 5));
        tempCount += 5;
          if(tempCount >= response.length) {
            clearInterval(streamInterval);
            socket.send("stream-done")
          }
      },100);
      
    });

  // Handle disconnection
  socket.on('close', () => {
    console.log('WebSocket client disconnected');
  });
});

server.listen(PORT, () => {
    console.log(`Server is up and listening on ${PORT}`);
  });