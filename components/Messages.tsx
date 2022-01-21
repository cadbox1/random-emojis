import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { message } from "./messageSlice";
import { randomEmoji } from "./randomEmoji";
import { RootState } from "./store";
import { setupWebsocket, websocketSend } from "./websocketClient";

export function Messages() {
  const messages = useSelector((state: RootState) => state.message.messages);
  const dispatch = useDispatch();

  useEffect(() => {
    setupWebsocket();
  }, []);

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
      {/* https://stackoverflow.com/questions/18614301/keep-overflow-div-scrolled-to-bottom-unless-user-scrolls-up */}
      <div
        style={{
          height: `400px`,
          overflow: `auto`,
          display: `flex`,
          flexDirection: `column-reverse`,
        }}
      >
        <div>
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
      </div>
      <form onSubmit={handleSubmit} style={{ marginTop: `1rem` }}>
        <button type="submit">Add Emoji</button>
      </form>
    </div>
  );
}
