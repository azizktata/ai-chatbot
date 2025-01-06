"use client";

import React from "react";
import { formulatePrompte } from "../../utils/getPrompt";
import RequestForm from "./RequestForm";

export default function Wrapper() {
  const [showChat, setShowChat] = React.useState(false);
  const [intialText, setInitialText] = React.useState("");
  const [loading, setloading] = React.useState(false);
  const [userPreferanceData, setUserPreferanceData] = React.useState({
    county: "",
    time: "",
    purpose: "",
    budget: "",
  });
  React.useEffect(() => {
    const startChatting = async () => {
      const messageToSend = await formulatePrompte(userPreferanceData);
      const response = await fetch(
        `http://localhost:3000/api/search?question=${messageToSend}`
      );

      setInitialText(await response.text()); // Append the new content to the UI
    };
    if (loading) {
      startChatting().then(() => {
        setloading(false);
        setShowChat(true);
      });
    }
  }, [loading, userPreferanceData]);

  return (
    <div>
      <h1>Start Chatting with SI Hbib, a travel guide expert</h1>
      {!showChat ? (
        <div>
          <RequestForm
            userPreferanceData={userPreferanceData}
            setUserPreferanceData={setUserPreferanceData}
            setIsLoading={setloading}
          />
          {loading && <p>Loading...</p>}
        </div>
      ) : (
        // <Chat userPreferanceData={userPreferanceData} />
        <div className="text-black">{intialText}</div>
      )}
    </div>
  );
}
