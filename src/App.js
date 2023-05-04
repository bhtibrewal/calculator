import "./App.css";
import PubNub from "pubnub";
import { PubNubProvider } from "pubnub-react";
import Chat from "./Chat";

const pubnub = new PubNub({
  publishKey: "pub-c-c7ce2ee4-7ac5-4d80-aed0-41f36500536b",
  subscribeKey: "sub-c-8c3f480c-6475-461d-b51e-e59c57bf59d8",
  uuid: "myUniqueUUID",
});

function App() {
  return (
    <PubNubProvider client={pubnub}>
      <Chat />
    </PubNubProvider>
  );
}

export default App;
