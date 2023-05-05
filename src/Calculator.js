import { usePubNub } from "pubnub-react";
import { useEffect, useState } from "react";

const buttons = [9, 8, 7, "C", 6, 5, 4, "/", 3, 2, 1, "*", 0, "+", "-", "="];
function Calculator({ channels }) {
  const pubnub = usePubNub();

  const [calculation, setCalculation] = useState([]);

  const handleMessage = (event) => {
    const value = event.message;
    console.log(value);
    setCalculation(value);
  };

  useEffect(() => {
    pubnub.fetchMessages(
      {
        channels,
        end: "15343325004275466",
        count: 25,
      },
      function (status, response) {
        const initialCalculation =
          response.channels[channels[0]].at(-1).message;
        console.log(response.channels);

        setCalculation(initialCalculation);
      }
    );
  }, [channels, pubnub]);

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
    let computedMsg;

    if (typeof message === "number") {
      computedMsg = [...calculation, message];
    } else if (message === "C") {
      computedMsg = [];
    } else if (message === "=") {
      if (typeof calculation.at(-1) === "number") {
        const answer = Number(
         /* eslint-disable-next-line */
          parseFloat(eval(calculation.join(""))).toFixed(2)
        );
        computedMsg = [answer];
      } else computedMsg = [...calculation];
    } else {
      if (typeof calculation.at(-1) === "number")
        computedMsg = [...calculation, message];
      else computedMsg = [...calculation.slice(0, -1), message];
    }

    console.log(computedMsg);

    pubnub.publish({ channel: channels[0], message: computedMsg });
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
                key={index}
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
