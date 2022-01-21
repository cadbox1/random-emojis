import Head from "next/head";
import { App } from "../components/App";

export default function Index() {
  return (
    <div>
      <Head>
        <title>Random Emojis with Cloudflare, WebSockets and Redux</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>
      <h1>Random Emojis with Cloudflare, WebSockets and Redux</h1>
      <App />
    </div>
  );
}
