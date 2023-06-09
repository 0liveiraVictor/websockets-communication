//requires
const path = require("path");
const dotenv = require("dotenv");
const WebSocket = require("ws");
const jwt = require("jsonwebtoken");

//dotenv config
dotenv.config({ path: path.join(__dirname, ".env") });

//secret key jwt
const secretKeyServer = process.env.SECRET_KEY_JWT_SERVER;
const secretKeyClient = process.env.SECRET_KEY_JWT_CLIENT;

//reconnection interval client
const setInterval = process.env.RECONNECTION_INTERVAL;

//client connection function
function connectionWebsocketClient() {
  //websocket client instance
  const ws = new WebSocket(process.env.URL_WS_CLIENT);

  ws.on("open", () => {
    console.log("============================================================");
    console.log("You are connected!");
    console.log("============================================================");
  });

  ws.on("error", (error) => {
    console.log("============================================================");
    console.error(error.message);
    console.log("============================================================");
  });

  ws.on("message", (data, isBinary) => {
    const dataString = data.toString();
    if (dataString) {
      const decodedServer = jwt.verify(dataString, secretKeyServer);
      console.log(
        "============================================================"
      );
      console.log("COMPLETE COMMAND:");
      console.log(
        "============================================================"
      );
      console.log({
        id: decodedServer.id,
        name: decodedServer.name,
        parameters: {
          command: decodedServer.parameters.command,
          field: decodedServer.parameters.field,
          filter: decodedServer.parameters.filter,
          status: decodedServer.parameters.status,
        },
      }); //use to execute some command
      console.log(
        "============================================================"
      );
      const payloadCLient = {
        id: decodedServer.id,
        messageStatus: "finished",
        status: 200,
        finished: Date.now(),
      };
      const tokenClient = jwt.sign(payloadCLient, secretKeyClient, {
        expiresIn: process.env.EXPIRES_IN_JWT_CLIENT,
      });
      ws.send(tokenClient);
    }
  });

  ws.on("close", (code) => {
    console.log("============================================================");
    console.log(`[ID:${code}] - connection closed by server!`);
    console.log("============================================================");
    setTimeout(() => {
      console.log(
        "============================================================"
      );
      console.log("Reconnecting...");
      console.log(
        "============================================================"
      );
      connectionWebsocketClient();
    }, setInterval);
  });
}

connectionWebsocketClient();
