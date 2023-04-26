const WebSocket = require("ws");

const ws = new WebSocket("wss://stream.binance.com:9443/ws/btcbusd@bookTicker");

ws.onmessage = (event) => {
  process.stdout.write("\033c");
  const obj = JSON.parse(event.data);
  console.log(`Symbol: ${obj.s}`);
  console.log(`Best ask: ${obj.a}`);
  console.log(`Best bid: ${obj.b}`);
};
