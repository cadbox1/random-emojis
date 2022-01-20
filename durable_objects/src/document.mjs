export class Document {
  constructor(state) {
    this.state = state;
    this.storage = state.storage;

    // this isn't actually persisted and that's okay because websockets are live connections.
    this.sessions = [];

    // the actual document entries will be stored in this.state.storage
  }

  // main entrypoint
  async fetch(request) {
    if (request.headers.get("Upgrade") != "websocket") {
      return new Response("expected websocket", { status: 400 });
    }

    // To accept the WebSocket request, we create a WebSocketPair (which is like a socketpair,
    // i.e. two WebSockets that talk to each other), we return one end of the pair in the
    // response, and we operate on the other end. Note that this API is not part of the
    // Fetch API standard; unfortunately, the Fetch API / Service Workers specs do not define
    // any way to act as a WebSocket server today.
    const pair = new WebSocketPair();

    // We're going to take pair[1] as our end, and return pair[0] to the client.
    await this.handleSession(pair[1]);

    // Now we return the other end of the pair to the client.
    return new Response(null, { status: 101, webSocket: pair[0] });
  }

  // handle the websocket connection
  async handleSession(webSocket) {
    // Accept our end of the WebSocket. This tells the runtime that we'll be terminating the
    // WebSocket in JavaScript, not sending it elsewhere.
    webSocket.accept();

    // Create our session and add it to the sessions list.
    this.sessions.push(webSocket);

    // welcome the person
    const welcomeAction = {
      type: "message/message",
      payload: {
        value: "Welcome to the party!",
        timestamp: new Date().toISOString(),
      },
    };
    webSocket.send(JSON.stringify(welcomeAction));

    // Load the last 100 entries from the document and send them to the client.
    const storage = await this.storage.list({ reverse: true, limit: 100 });
    const entries = [...storage.values()];
    entries.reverse();

    // this should probably be a separate action that accepts bulk messages but oh well.
    entries.forEach((entryAsString) => {
      const entry = JSON.parse(entryAsString);
      const entryAction = {
        type: "message/message",
        payload: {
          value: entry.value,
          timestamp: entry.timestamp,
        },
      };
      webSocket.send(JSON.stringify(entryAction));
    });

    webSocket.addEventListener("message", async (message) => {
      try {
        const action = JSON.parse(message.data);
        const actionType = action.type;
        const payload = action.payload;

        if (actionType === "message/message") {
          // this is the server side version of a the redux reducer on the client.

          // store the payload in the document.
          const { value, timestamp } = payload;
          const key = new Date(timestamp).toISOString();

          // mainly so I remember the shape of the object.
          const entry = { value, timestamp };
          const entryAsString = JSON.stringify(entry);
          await this.storage.put(key, entryAsString);

          // boradcast the redux action to the other clients.
          this.broadcast(action, webSocket);
        }
      } catch (err) {
        const errorMessagePayload = {
          type: "message/message",
          payload: {
            value: `Error`,
            error: err.stack,
            timestamp: new Date().toISOString(),
          },
        };
        webSocket.send(JSON.stringify(errorMessagePayload));
      }
    });

    // On "close" and "error" events, remove the WebSocket from the sessions list
    let closeOrErrorHandler = (evt) => {
      this.sessions = this.sessions.filter((member) => member !== session);
    };
    webSocket.addEventListener("close", closeOrErrorHandler);
    webSocket.addEventListener("error", closeOrErrorHandler);
  }

  // broadcast() broadcasts a message to all clients.
  broadcast(message, webSocket) {
    // Apply JSON if we weren't given a string to start with.
    if (typeof message !== "string") {
      message = JSON.stringify(message);
    }

    // Iterate over all the sessions sending them messages.
    this.sessions = this.sessions.filter((session) => {
      if (session === webSocket) {
        // don't send messages to ourself
        return true;
      }
      try {
        session.send(message);
        return true;
      } catch (err) {
        return false;
      }
    });
  }
}

export default {
  fetch() {
    return new Response("This Worker creates the Document Durable Object.");
  },
};
