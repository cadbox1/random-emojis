import { Provider } from "react-redux";
import { Messages } from "./Messages";
import { store } from "./store";

export function App() {
  return (
    <Provider store={store}>
      <Messages />
    </Provider>
  );
}
