//requires
const WebSocket = require("ws");
const readlineSync = require("readline-sync");

//websocket client instance
const ws = new WebSocket("ws://localhost:3000");

//client connection function
function connectionClient() {
  ws.on("open", () => {
    console.log("============================================================");
    console.log("You are connected!");
    console.log(
      "============================================================\n"
    );

    let message = readlineSync.question(
      "would you like to start a broadcast? \nobs:. type 'yes' to enable the transmission.\n\n[yes or no (default)]: "
    );

    if (message !== "yes") {
      message = "no";
    }

    console.log();
    ws.send(message);
  });

  ws.on("error", (error) => {
    console.error(error.message);
  });

  ws.on("message", (data, isBinary) => {
    console.log(`server response: ${data}`);
  });

  ws.on("close", (code) => {
    console.log("============================================================");
    console.log(`[ID:${code}] - connection closed by server!`);
    console.log("============================================================");
  });
}

connectionClient();
