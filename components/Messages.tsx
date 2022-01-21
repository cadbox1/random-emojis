import { useEffect, useLayoutEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { message } from "./messageSlice";
import { randomEmoji } from "./randomEmoji";
import { RootState } from "./store";
import { setupWebsocket, websocketSend } from "./websocketClient";

export function Messages() {
  const messages = useSelector((state: RootState) => state.message.messages);
  const dispatch = useDispatch();
  const containerRef = useRef(null);

  useEffect(() => {
    setupWebsocket();
  }, []);

  useLayoutEffect(() => {
    const container = containerRef.current;
    // allow 60px inaccuracy by adding 60
    const isScrolledToBottom =
      container.scrollHeight - container.clientHeight <=
      container.scrollTop + 60;

    // scroll to bottom if isScrolledToBottom is true or forced
    if (isScrolledToBottom) {
      container.scrollTop = container.scrollHeight - container.clientHeight;
    }
  }, [messages.length]);

  const handleSubmit = (evt) => {
    evt.preventDefault();
    const action = message({
      value: randomEmoji(),
      timestamp: new Date().toISOString(),
    });
    dispatch(action);
    websocketSend(action);
  };

  return (
    <div>
      <div
        style={{
          height: `400px`,
          overflow: `auto`,
        }}
        ref={containerRef}
      >
        {messages.map((message, index) => (
          <p
            key={index}
            title={`${new Date(message.timestamp).toLocaleString()}`}
            style={{ fontSize: `2rem`, margin: `0.5rem 0` }}
          >
            {message.value}
          </p>
        ))}
      </div>
      <form onSubmit={handleSubmit} style={{ marginTop: `1rem` }}>
        <button
          type="submit"
          style={{
            fontSize: `1rem`,
            padding: `0.5rem 0.75rem`,
            WebkitAppearance: `none`,
          }}
        >
          Add Emoji
        </button>
      </form>
    </div>
  );
}
