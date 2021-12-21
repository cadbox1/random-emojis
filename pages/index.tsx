import Head from "next/head";
import { App } from "../components/App";

export default function Index() {
  return (
    <div>
      <Head>
        <title>cloudflare-websockets-redux</title>
      </Head>
      <h1>cloudflare-websockets-redux</h1>
      <App />
    </div>
  );
}
