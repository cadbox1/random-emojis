import { useDispatch, useSelector } from "react-redux";
import { message } from "./messageSlice";
import { RootState } from "./store";

export function Messages() {
  const messages = useSelector((state: RootState) => state.message.messages);
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(message({ value: "Tik", timestamp: new Date() }));
  };

  return (
    <div>
      <button onClick={handleClick}>Tik</button>
      <h2>Messages</h2>
      <div>
        {messages.map((message) => (
          <p>{`${message.value} - ${message.timestamp.toLocaleString()}`}</p>
        ))}
      </div>
    </div>
  );
}
