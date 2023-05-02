//requires
const path = require("path");
const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const http = require("http");
const WebSocket = require("ws");
const jwt = require("jsonwebtoken");

//dotenv config
dotenv.config({ path: path.join(__dirname, ".env") });

//secret key jwt
const secretKeyServer = process.env.SECRET_KEY_JWT_SERVER;
const secretKeyClient = process.env.SECRET_KEY_JWT_CLIENT;

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
    return response.status(200).send("<h1>Web Socket Server Test</h1>");
  } catch (error) {
    return response.status(400).send(error.message);
  }
});

//constants
const port = process.env.APP_PORT_SERVER;
const host = process.env.APP_HOST_SERVER;

//server listening ...
server.listen(port, () => {
  console.log("------------------------------------------------------------");
  console.log(`Server inicialized. | Execution in the port: ${port}`);
  console.log(`url: http://${host}:${port}`);
  console.log("------------------------------------------------------------");
  console.log(`Websocket server inicialized. | Execution in the port: ${port}`);
  console.log(`url: ws://${host}:${port}`);
  console.log("------------------------------------------------------------");
});

//web socket connection ...
wss.on("connection", (ws, request) => {
  console.log("============================================================");
  console.log("New client connected!");
  console.log("============================================================");

  ws.on("error", (error) => {
    console.log("============================================================");
    console.error(error.message);
    console.log("============================================================");
  });

  router.get("/api/account_status", (request, response) => {
    try {
      const payloadServer = {
        user: process.env.PAYLOAD_JWT_SERVER_USER,
        password: process.env.PAYLOAD_JWT_SERVER_PASSWORD,
        ip: process.env.PAYLOAD_JWT_SERVER_IP,
        port: process.env.PAYLOAD_JWT_SERVER_PORT,
        service: process.env.PAYLOAD_JWT_SERVER_SERVICE,
      };
      const tokenServer = jwt.sign(payloadServer, secretKeyServer, {
        expiresIn: process.env.EXPIRES_IN_JWT_SERVER,
      });
      const object = {
        id: process.env.OBJECT_COMMAND_ID,
        name: process.env.OBJECT_COMMAND_NAME,
        tokenServer: tokenServer,
        parameters: {
          command: process.env.OBJECT_COMMAND_SQL,
          field: process.env.OBJECT_COMMAND_FIELD,
          filter: process.env.OBJECT_COMMAND_FILTER,
          status: process.env.OBJECT_COMMAND_STATUS,
        },
      };
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(object));
          return response
            .status(200)
            .json({ message: "JSON object sent successfully." });
        }
      });
    } catch (error) {
      return response.status(400).json({ error: error });
    }
  });

  ws.on("message", (data, isBinary) => {
    const dataString = JSON.parse(data.toString());
    if (dataString) {
      const decodedClient = jwt.verify(dataString.tokenClient, secretKeyClient);
      console.log(
        "============================================================"
      );
      console.log("COMMAND RECEPTION:");
      console.log(
        "============================================================"
      );
      console.log({
        id: dataString.id,
        //tokenClientPayload: decodedClient, //=== serverPayload
        started: dataString.started,
        status: dataString.status,
      });
      console.log(
        "============================================================"
      );
    }
  });

  ws.on("close", (code) => {
    console.log("============================================================");
    console.log(`[ID:${code}] - Disconnected client!`);
    console.log("============================================================");
  });
});
