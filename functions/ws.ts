async function handleErrors(request, func) {
  try {
    return await func();
  } catch (err) {
    if (request.headers.get("Upgrade") == "websocket") {
      // Annoyingly, if we return an HTTP error in response to a WebSocket request, Chrome devtools
      // won't show us the response body! So... let's send a WebSocket response with an error
      // frame instead.
      let pair = new WebSocketPair();
      // @ts-ignore
      pair[1].accept();

      const errorPayload = {
        type: "message/message",
        payload: {
          value: "error",
          error: err.stack,
          timestamp: new Date().toISOString(),
        },
      };

      pair[1].send(JSON.stringify(errorPayload));
      pair[1].close(1011, "Uncaught exception during session setup");
      return new Response(null, { status: 101, webSocket: pair[0] });
    } else {
      return new Response(err.stack, { status: 500 });
    }
  }
}

async function handleSession(websocket, env) {
  websocket.accept();
  websocket.addEventListener("message", async ({ data }) => {
    const action = JSON.parse(data);
    const actionType = action.type;

    // @todo handle action with redux and update durable object state
    if (actionType === "message/message") {
      const downloadCounterId = "test";
      const downloadCounter = env.DOWNLOAD_COUNTER.get(
        env.DOWNLOAD_COUNTER.idFromString(downloadCounterId)
      );

      await downloadCounter.fetch("https://images.pages.dev/increment");

      // This isn't a real internet request, so the host is irrelevant (https://developers.cloudflare.com/workers/platform/compatibility-dates#durable-object-stubfetch-requires-a-full-url).
      const downloadCountResponse = await downloadCounter.fetch(
        "https://images.pages.dev/"
      );

      // @ts-ignore
      const downloadCount = await downloadCountResponse.json<number>();

      const TokMessage = {
        type: "message/message",
        payload: {
          value: `Count: ${downloadCount}`,
          timestamp: new Date().toISOString(),
        },
      };

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

const websocketHandler = async (request, env) => {
  const upgradeHeader = request.headers.get("Upgrade");
  if (upgradeHeader !== "websocket") {
    return new Response("Expected websocket", { status: 400 });
  }

  // @ts-ignore
  const [client, server] = Object.values(new WebSocketPair());
  await handleSession(server, env);

  return new Response(null, {
    status: 101,
    // @ts-ignore
    webSocket: client,
  });
};

export const onRequest: PagesFunction<{
  DOWNLOAD_COUNTER: DurableObjectNamespace;
}> = async ({ request, env }) => {
  return await handleErrors(request, async () => {
    return await websocketHandler(request, env);
  });
};
