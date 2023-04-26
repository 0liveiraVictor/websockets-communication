//requires
const express = require("express");
const cors = require("cors");
const http = require("http");
const WebSocket = require("ws");

//servers configuration
const app = express();
const router = express.Router();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server: server });

//app configuration
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(router);

//routes
router.get("/", (request, response) => {
  try {
    return response.status(200).send("<h2>Web Socket Server Test</h2>");
  } catch (error) {
    return response.status(400).send(error.message);
  }
});

//constants
const port = 3000;
const host = "localhost";

//server listening ...
server.listen(port, () => {
  console.log("------------------------------------------------------------");
  console.log(`server inicialized. | execution in the port: ${port}`);
  console.log(`url: http://${host}:${port}`);
  console.log("------------------------------------------------------------");
  console.log(`websocket server inicialized. | execution in the port: ${port}`);
  console.log(`url: ws://${host}:${port}`);
  console.log("------------------------------------------------------------");
});

//broadcast function
function broadcast(object) {
  if (!this.clients) return;
  this.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      const jsonObject = JSON.stringify(object);
      client.send(jsonObject);
    }
  });
}

wss.broadcast = broadcast;

//random number function
function number() {
  let number;
  number = Math.floor(Math.random() * 100000000000000001);
  return number;
}

//random binary function
function binary() {
  let binary = "";
  for (let i = 0; i < 10; i++) {
    binary += Math.floor(Math.random() * 2);
  }
  return binary;
}

//web socket connection ...
wss.on("connection", (ws, request) => {
  console.log("============================================================");
  console.log("new client connected!");
  console.log("============================================================");

  ws.on("error", (error) => {
    console.error(error.message);
  });

  ws.on("message", (data, isBinary) => {
    const option = parseInt(data.toString());
    if (option === 1) {
      //transmission
      setInterval(() => {
        const object = { randomNumber: number() };
        wss.broadcast(object);
      }, 500);
    } else if (option === 2) {
      //transmission
      setInterval(() => {
        const object = { randomBinary: binary() };
        wss.broadcast(object);
      }, 500);
    } else if (option === 3) {
      //transmission
      setInterval(() => {
        const object = { randomNumber: number(), randomBinary: binary() };
        wss.broadcast(object);
      }, 500);
    }
  });

  ws.on("close", (code) => {
    console.log("============================================================");
    console.log(`[ID:${code}] - disconnected client!`);
    console.log("============================================================");
  });
});
