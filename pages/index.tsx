import Head from "next/head";
import { App } from "../components/App";

export default function Index() {
  return (
    <div>
      <Head>
        <title>Random Emojis with Cloudflare, Websockets and Redux</title>
      </Head>
      <h1>Random Emojis with Cloudflare, Websockets and Redux</h1>
      <App />
    </div>
  );
}
