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

export const onRequest: PagesFunction<{
  DOCUMENT: DurableObjectNamespace;
}> = async ({ request, env }) => {
  return await handleErrors(request, async () => {
    const documentId = "my-cool-document";
    const document = env.DOCUMENT.get(env.DOCUMENT.idFromName(documentId));
    return document.fetch(request);
  });
};
