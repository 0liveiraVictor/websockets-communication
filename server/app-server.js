//requires
const path = require("path");
const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const WebSocket = require("ws");
const jwt = require("jsonwebtoken");

//dotenv config
dotenv.config({ path: path.join(__dirname, ".env") });

//servers configuration
const app = express();
const router = express.Router();

//app configuration
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(router);

//port and host
const port = process.env.APP_PORT_SERVER;
const host = process.env.APP_HOST_SERVER;

//http server listening ...
const server = app.listen(port, () => {
  console.log("============================================================");
  console.log(`HTTP SERVER INICIALIZED.`);
  console.log(`URL: http://${host}:${port}`);
  console.log("============================================================");
});

//websocket server instance
const wss = new WebSocket.Server({ server: server });

//websocket server informations
if (wss) {
  console.log("============================================================");
  console.log(`WEBSOCKET SERVER INICIALIZED.`);
  console.log(`URL: ws://${host}:${port}`);
  console.log("============================================================");
}

//http routes
router.get("/", (request, response) => {
  try {
    return response.status(200).send("<h1>Web Socket Server</h1>");
  } catch (error) {
    return response.status(400).send(error.message);
  }
});

//secret key jwt
const secretKeyServer = process.env.SECRET_KEY_JWT_SERVER;
const secretKeyClient = process.env.SECRET_KEY_JWT_CLIENT;

//websocket clients
const clients = new Map();

//websocket connection ...
wss.on("connection", (ws, request) => {
  console.log("============================================================");
  console.log("New client connected!");
  console.log("============================================================");

  ws.on("error", (error) => {
    console.log("============================================================");
    console.error(error.message);
    console.log("============================================================");
  });

  const clientName = getNameFromRequest(request);
  clients.set(clientName, ws);

  router.post("/api/account_status", (req, res) => {
    const { name } = req.body;
    const websocket = clients.get(name);
    try {
      if (websocket) {
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
        websocket.send(JSON.stringify(object));
        return res
          .status(200)
          .json({ message: "JSON object sent successfully." });
      } else {
        return res.status(400).json({ message: "Client not connected." });
      }
    } catch (error) {
      return res.status(400).json({ error: error });
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

  function getNameFromRequest(request) {
    const clientName = request.url.split("=")[1];
    return clientName;
  }

  function getSocketIdFromRequest(request) {
    const socketId = request.headers["sec-websocket-key"];
    return socketId;
  }

  ws.on("close", (code) => {
    console.log("============================================================");
    console.log(`[Close code:${code}] - Disconnected client!`);
    console.log("============================================================");
  });
});
