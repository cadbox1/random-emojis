import { store } from "./store";
import { message } from "./messageSlice";

const hostname = "https://cloudflare-websockets-redux.pages.dev";

let ws;

export function setupWebsocket() {
  const url = new URL(hostname);
  url.protocol = "wss";
  url.pathname = "/ws";
  ws = new WebSocket(url);

  if (!ws) {
    throw new Error("server didn't accept ws");
  }

  ws.addEventListener("open", () => {
    console.log("Opened websocket");
  });

  ws.addEventListener("message", ({ data }) => {
    const action = JSON.parse(data);
    console.log(action);
    store.dispatch(action);
  });

  ws.addEventListener("close", () => {
    console.log("Closed websocket");
  });
}

const closeConnection = () => ws.close();

export function websocketSend(data) {
    ws.send(JSON.stringify(data));
}