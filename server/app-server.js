//requires
const path = require("path");
const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const WebSocket = require("ws");
const jwt = require("jsonwebtoken");

//dotenv config
dotenv.config({ path: path.join(__dirname, ".env") });

//port and host
const port = process.env.APP_PORT_SERVER;
const host = process.env.APP_HOST_SERVER;

//secret key jwt
const secretKeyServer = process.env.SECRET_KEY_JWT_SERVER;
const secretKeyClient = process.env.SECRET_KEY_JWT_CLIENT;

//servers configuration
const app = express();
const router = express.Router();

//app configuration
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(router);

//http server listening ...
const server = app.listen(port, () => {
  console.log("============================================================");
  console.log(`HTTP SERVER INICIALIZED.`);
  console.log(`URL: http://${host}:${port}`);
  console.log("============================================================");
});

//http routes
router.get("/", (request, response) => {
  try {
    return response.status(200).send("<h1>Web Socket Server</h1>");
  } catch (error) {
    return response.status(400).send(error.message);
  }
});
router.get("/api/commandList", (request, response) => {
  try {
    return response.status(200).json({ commandList });
  } catch (error) {
    return response.status(400).json({ error: error });
  }
});

//websocket clients map and command list
const clients = new Map();
const commandList = [];

//client connection function
function connectionWebsocketServer() {
  //websocket server instance
  const wss = new WebSocket.Server({ server: server });

  //websocket server informations
  if (wss) {
    console.log("============================================================");
    console.log(`WEBSOCKET SERVER INICIALIZED.`);
    console.log(`URL: ws://${host}:${port}`);
    console.log("============================================================");
  }

  //websocket connection ...
  wss.on("connection", (ws, request) => {
    console.log("============================================================");
    console.log("New client connected!");
    console.log("============================================================");

    ws.on("error", (error) => {
      console.log(
        "============================================================"
      );
      console.error(error.message);
      console.log(
        "============================================================"
      );
    });

    const clientName = getNameFromRequest(request);
    clients.set(clientName, ws);

    router.post("/api/account_status", (req, res) => {
      const { user, client } = req.body; //'user' <=> server user name | 'client' <=> client name
      const websocket = clients.get(client);
      try {
        if (websocket) {
          const id = commandList.length + 1;
          const payloadServer = {
            id: id,
            name: process.env.OBJECT_COMMAND_NAME,
            parameters: {
              command: process.env.OBJECT_COMMAND_SQL,
              field: process.env.OBJECT_COMMAND_FIELD,
              filter: process.env.OBJECT_COMMAND_FILTER,
              status: process.env.OBJECT_COMMAND_STATUS,
            },
          };
          const tokenServer = jwt.sign(payloadServer, secretKeyServer, {
            expiresIn: process.env.EXPIRES_IN_JWT_SERVER,
          });
          websocket.send(tokenServer);
          commandList.push({
            id: id,
            created_by: user,
            client: client,
            message_send: tokenServer,
            message_result: null, //change on receipt
            message_status: "sended", //change on receipt
            status: 202, //change on receipt
            started: Date.now(),
            finished: null, //change on receipt
          });
          return res.status(200).json({ message: "Object sent successfully." });
        } else {
          return res.status(400).json({ message: "Client not connected." });
        }
      } catch (error) {
        return res.status(400).json({ error: error });
      }
    });

    ws.on("message", (data, isBinary) => {
      const dataString = data.toString();
      if (dataString) {
        const decodedClient = jwt.verify(dataString, secretKeyClient);
        const index = decodedClient.id - 1;
        commandList[index] = {
          id: commandList[index].id,
          created_by: commandList[index].created_by,
          client: commandList[index].client,
          message_send: commandList[index].message_send,
          message_result: dataString, //changed
          message_status: decodedClient.messageStatus, //changed
          status: decodedClient.status, //changed
          started: commandList[index].started,
          finished: decodedClient.finished, //changed
        };
        console.log(
          "============================================================"
        );
        console.log("COMMAND RECEPTION:");
        console.log(
          "============================================================"
        );
        console.log({
          id: decodedClient.id,
          messageStatus: decodedClient.messageStatus,
          status: decodedClient.status,
          finished: decodedClient.finished,
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

    ws.on("close", (code) => {
      console.log(
        "============================================================"
      );
      console.log(`[Close code:${code}] - Disconnected client!`);
      console.log(
        "============================================================"
      );
    });
  });
}

connectionWebsocketServer();
