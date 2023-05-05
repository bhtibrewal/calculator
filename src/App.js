import "./App.css";
import PubNub from "pubnub";
import { PubNubProvider } from "pubnub-react";
import Calculator from "./Calculator";

const pubnub = new PubNub({
  publishKey: "pub-c-c7ce2ee4-7ac5-4d80-aed0-41f36500536b",
  subscribeKey: "sub-c-8c3f480c-6475-461d-b51e-e59c57bf59d8",
  uuid: "myUniqueUUID",
});

function App() {
  const calculatorChannel = "awesome-channel";

  return (
    <PubNubProvider client={pubnub}>
      <Calculator channels={[calculatorChannel]} />
    </PubNubProvider>
  );
}

export default App;
