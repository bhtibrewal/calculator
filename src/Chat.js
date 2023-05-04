import { usePubNub } from "pubnub-react";
import { useEffect, useState } from "react";

function Chat() {
  const pubnub = usePubNub();
  const [channels] = useState(["awesome-channel"]);
  const [messages, addMessage] = useState([]);
  const handleMessage = (event) => {
    const message = event.message;

    const text = message.text || message;
    addMessage((messages) => [...messages, text]);
  };

  useEffect(() => {
    const listenerParams = { message: handleMessage };
    pubnub.addListener(listenerParams);
    pubnub.subscribe({ channels });
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
          {messages.map((message, index) => {
            return (
              <div key={`message-${index}`} style={messageStyles}>
                {message}
              </div>
            );
          })}
        </div>
        <div style={footerStyles}>
          {Array(10)
            .fill("")
            .map((item, index) => {
              return (
                <button
                  style={buttonStyles}
                  onClick={(e) => {
                    sendMessage(index);
                  }}
                >
                  {index}
                </button>
              );
            })}
        </div>
      </div>
    </div>
  );
}
export default Chat;
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
  width: "50%",
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

  flexGrow: 1,
  overflow: "auto",
  padding: "10px",
};

const messageStyles = {
  backgroundColor: "#eee",
  borderRadius: "5px",
  color: "#333",
  fontSize: "1.1rem",
  margin: "5px",
  padding: "8px 15px",
};

const footerStyles = {
  display: "flex",
};

const buttonStyles = {
  fontSize: "1.1rem",
  margin: "5px",
  padding: "8px 15px",
};
