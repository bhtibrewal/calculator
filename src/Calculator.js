import { usePubNub } from "pubnub-react";
import { useEffect, useState } from "react";

const buttons = [9, 8, 7, "C", 6, 5, 4, "/", 3, 2, 1, "*", 0, "+", "-", "="];
function Calculator() {
  const pubnub = usePubNub();
  pubnub.fetchMessages(
    {
      channels: ["awesome-channel"],
      end: '15343325004275466',
      count: 100
    },
    function(status, response) {
      console.log(status, response);
    }
  );
  const [channels] = useState(["awesome-channel"]);
  // const [messages, addMessage] = useState([]);
  const [calculation, setCalculation] = useState([]);
  
  const handleMessage = (event) => {
    console.log(channels);
    const value = event.message;
    setCalculation((prev) => {
      if (typeof value === "number") return [...prev, value];
      if (value === "C") return [];
      if (value === "=") return [eval(prev.join(""))];
      else {
        if (typeof prev.at(-1) === "number") return [...prev, value];
        else return [...prev.pop(), value];
      }
    });
  };
  console.log(calculation);
  useEffect(() => {
    const listenerParams = { message: handleMessage };
    pubnub.addListener(listenerParams);
    pubnub.subscribe({ channels, withPresence: true });
    return () => {
      pubnub.unsubscribe({ channels });
      pubnub.removeListener(listenerParams);
    };
  }, [pubnub, channels]);

  const sendMessage = (message) => {
    console.log(message);
    if (message) {
      pubnub.publish({ channel: channels[0], message });
    }
  };
  return (
    <div style={pageStyles}>
      <div style={chatStyles}>
        <div style={headerStyles}>Calculator</div>
        <div style={listStyles}>
          <div key={`calculation`} style={messageStyles}>
            {calculation}
          </div>
        </div>
        <div style={footerStyles}>
          {buttons.map((item, index) => {
            return (
              <button
                style={buttonStyles}
                onClick={(e) => {
                  sendMessage(item);
                }}
              >
                {item}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
export default Calculator;

const pageStyles = {
  alignItems: "center",
  background: "#282c34",
  display: "flex",
  justifyContent: "center",
  minHeight: "100vh",
};

const chatStyles = {
  display: "flex",
  flexDirection: "column",
  width: "24rem",
};

const headerStyles = {
  background: "#323742",
  color: "white",
  fontSize: "1.4rem",
  padding: "10px 15px",
};

const listStyles = {
  alignItems: "flex-start",
  backgroundColor: "white",
  display: "flex",
  justifyContent: "flex-end",
  flexGrow: 1,
  overflow: "auto",
  padding: "10px",
  height: "2rem",
};

const messageStyles = {
  backgroundColor: "#eee",
  borderRadius: "5px",
  color: "#333",
  fontSize: "1.1rem",
  padding: "8px 15px",
};

const footerStyles = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
};

const buttonStyles = {
  fontSize: "1.4rem",
  margin: "5px",
  padding: "8px 15px",
};
