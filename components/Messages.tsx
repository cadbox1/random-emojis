import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { message } from "./messageSlice";
import { RootState } from "./store";
import { setupWebsocket, websocketSend } from "./websocketClient";

export function Messages() {
  const messages = useSelector((state: RootState) => state.message.messages);
  const dispatch = useDispatch();

  useEffect(() => {
    setupWebsocket();
  }, []);

  const handleClick = () => {
    const action = message({
      value: "Tik",
      timestamp: new Date().toISOString(),
    });
    dispatch(action);
    websocketSend(action);
  };

  return (
    <div>
      <button onClick={handleClick}>Tik</button>
      <h2>Messages</h2>
      <div>
        {messages.map((message, index) => (
          <p key={index}>{`${message.value} - ${new Date(
            message.timestamp
          ).toLocaleString()}`}</p>
        ))}
      </div>
    </div>
  );
}
