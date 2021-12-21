async function handleSession(websocket) {
  websocket.accept();
  websocket.addEventListener("message", async ({ data }) => {
    const actionType = data.type;

    // @todo handle this with redux and store it in durable objects
    if (actionType === "message/message") {

      const TokMessage = {
        type: "message/message",
        payload: {
          value: "Tok", timestamp: new Date().toISOString()
        }
      }
      
      websocket.send(JSON.stringify(TokMessage));
    } else {
      // An unknown message came into the server. Send back an error message
      websocket.send(
        JSON.stringify({ type: "error", payload: "Unknown message received" })
      );
    }
  });

  websocket.addEventListener("close", async (evt) => {
    // Handle when a client closes the WebSocket connection
    console.log(evt);
  });
}

const websocketHandler = async (request) => {
  const upgradeHeader = request.headers.get("Upgrade");
  if (upgradeHeader !== "websocket") {
    return new Response("Expected websocket", { status: 400 });
  }

  // @ts-ignore
  const [client, server] = Object.values(new WebSocketPair());
  await handleSession(server);

  return new Response(null, {
    status: 101,
    // @ts-ignore
    webSocket: client,
  });
};

export const onRequest = async (context) => {
  try {
    return websocketHandler(context.request);
  } catch (err) {
    return new Response(err.toString());
  }
};
