"use client";

import React from "react";
import { Message, continueConversation } from "../actions";
import { readStreamableValue } from "ai/rsc";
import { formulatePrompte } from "@/utils/getPrompt";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export default function Chat() {
  const [conversation, setConversation] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState<string>("");
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUserPreferanceData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const [showChat, setShowChat] = React.useState(false);
  // const [initialText, setInitialText] = React.useState("");
  const [loading, setloading] = React.useState(false);
  const [userPreferanceData, setUserPreferanceData] = React.useState({
    county: "",
    time: "",
    purpose: "",
    budget: "",
  });
  const startChat = async () => {
    const { messages, newMessage } = await continueConversation([
      ...conversation,
      { role: "user", content: formulatePrompte(userPreferanceData) },
    ]);

    let textContent = "";

    for await (const delta of readStreamableValue(newMessage)) {
      textContent = `${textContent}${delta}`;

      setConversation([
        ...messages,
        { role: "assistant", content: textContent },
      ]);
    }
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setloading(true);
    setShowChat(true);
    await startChat();

    console.log("Form submitted:", userPreferanceData);
  };

  const chatContainer = React.useRef<HTMLDivElement>(null);

  const scroll = () => {
    if (!chatContainer.current) return;
    const { offsetHeight, scrollHeight, scrollTop } =
      chatContainer.current as HTMLDivElement;

    if (scrollHeight >= scrollTop + offsetHeight) {
      chatContainer.current?.scrollTo(0, scrollHeight + 200);
    }
  };
  const [isStreaming, setIsStreaming] = React.useState(false);

  React.useEffect(() => {
    scroll();
  }, [conversation]);
  return (
    <div className="bg-[#0F172A] min-h-screen  flex items-center justify-center">
      {!showChat ? (
        <div className="w-full  flex flex-col items-center p-6 text-white space-y-6">
          <h2 className="text-lg font-semibold text-center mb-4">
            Start your preferences setup
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6 w-[400px]">
            {/* Country */}
            <div>
              <label
                htmlFor="country"
                className="block text-sm font-medium text-orange-400 flex items-center gap-2"
              >
                🌍 Country
              </label>
              <input
                type="text"
                id="country"
                name="county"
                value={userPreferanceData.county}
                onChange={handleInputChange}
                placeholder="Enter your country"
                className="mt-2  block w-full rounded-lg bg-gray-800 text-white border-0 shadow-md py-3 px-4 placeholder-gray-500 text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none"
              />
            </div>

            {/* Time */}
            <div>
              <label
                htmlFor="time"
                className="block text-sm font-medium text-pink-400 flex items-center gap-2"
              >
                ⏳ Time (Season)
              </label>
              <select
                id="time"
                name="time"
                value={userPreferanceData.time}
                onChange={handleInputChange}
                className="mt-2 block w-full rounded-lg bg-gray-800 text-white border-0 shadow-md py-3 px-4 placeholder-gray-500 text-sm focus:ring-2 focus:ring-pink-400 focus:outline-none"
              >
                <option value="" disabled>
                  Select a season
                </option>
                <option value="Spring">Spring</option>
                <option value="Summer">Summer</option>
                <option value="Autumn">Autumn</option>
                <option value="Winter">Winter</option>
              </select>
            </div>

            {/* Purpose */}
            <div>
              <label
                htmlFor="purpose"
                className="block text-sm font-medium text-yellow-400 flex items-center gap-2"
              >
                🎯 Purpose
              </label>
              <input
                type="text"
                id="purpose"
                name="purpose"
                value={userPreferanceData.purpose}
                onChange={handleInputChange}
                placeholder="Enter purpose"
                className="mt-2 block w-full rounded-lg bg-gray-800 text-white border-0 shadow-md py-3 px-4 placeholder-gray-500 text-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none"
              />
            </div>

            {/* Budget */}
            <div>
              <label
                htmlFor="budget"
                className="block text-sm font-medium text-green-400 flex items-center gap-2"
              >
                💰 Budget
              </label>
              <input
                type="text"
                id="budget"
                name="budget"
                value={userPreferanceData.budget}
                onChange={handleInputChange}
                placeholder="Enter your budget"
                className="mt-2 block w-full rounded-lg bg-gray-800 text-white border-0 shadow-md py-3 px-4 placeholder-gray-500 text-sm focus:ring-2 focus:ring-green-400 focus:outline-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white py-3 px-6 rounded-lg shadow-lg hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-400 focus:ring-offset-2"
            >
              ⚡ {loading ? "Loading..." : "Submit Preferences"}
            </button>
          </form>
        </div>
      ) : (
        <>
          <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-6 space-y-4">
            <div
              ref={chatContainer}
              className="overflow-y-auto h-[80vh] space-y-4 p-4 bg-gray-50"
            >
              {conversation.map((message, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg shadow-md space-y-2 ${
                    index % 2 === 0
                      ? "bg-black text-white rounded-lg p-4 text-right w-auto self-end"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  {index !== 0 ? (
                    <>
                      <p className="leading-relaxed">
                        {message.content.split("\n").map((line, i) => (
                          <span key={i}>
                            {line.split(/(\*\*.*?\*\*)/g).map((part, j) => {
                              // If the part is wrapped in **, render it as bold
                              if (/^\*\*(.*?)\*\*$/.test(part)) {
                                return (
                                  <strong key={j} className="font-bold">
                                    {part.replace(/\*\*/g, "")}
                                  </strong>
                                );
                              }
                              // Otherwise, render it as plain text
                              return part;
                            })}
                            <br />
                          </span>
                        ))}
                      </p>
                    </>
                  ) : null}
                </div>
              ))}
            </div>
            <div className="relative flex items-center bg-gray-100 p-2 rounded-full shadow-sm">
              {/* Attachment Icon */}
              <button
                type="button"
                className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 12.803V8.297a5.297 5.297 0 10-10.594 0v7.406a3.594 3.594 0 007.188 0V9.703a1.797 1.797 0 00-3.594 0v6.594"
                  />
                </svg>
              </button>

              {/* Input Field */}
              <input
                type="text"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Send a message..."
                className="flex-1 bg-transparent outline-none px-4 text-sm text-gray-700 placeholder-gray-500"
              />

              {/* Send Button */}
              <button
                onClick={async () => {
                  setInput("");
                  setIsStreaming(true);
                  const { messages, newMessage } = await continueConversation([
                    ...conversation,
                    { role: "user", content: input },
                  ]);

                  let textContent = "";

                  for await (const delta of readStreamableValue(newMessage)) {
                    textContent = `${textContent}${delta}`;

                    setConversation([
                      ...messages,
                      { role: "assistant", content: textContent },
                    ]);
                  }
                  setIsStreaming(false);
                }}
                className="p-2 bg-gray-200 text-gray-500 rounded-full hover:bg-indigo-600 hover:text-white focus:outline-none"
              >
                {!isStreaming ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5.25 12h13.5m0 0l-6.75-6.75m6.75 6.75l-6.75 6.75"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <rect
                      x="6"
                      y="6"
                      width="12"
                      height="12"
                      rx="2"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// import { fetchAIResponse } from "@/utils/fetchAIResponse";
// import { formulatePrompte } from "@/utils/getPrompt";
// import React from "react";

// type aiMessage = {
//   role: string;
//   content: string;
// };

// type ChatProps = {
//   initialText?: string;
//   userPreferanceData: {
//     county: string;
//     time: string;
//     purpose: string;
//     budget: string;
//   };
// };
// type Message = {
//   author: string;
//   text: string;
//   type: string;
//   timestamp: number;
// };
// const Chat: React.FC<ChatProps> = ({ initialText, userPreferanceData }) => {
//   const [input, setInput] = React.useState("");
//   const initialMessage = {
//     author: "Si Hbib",
//     text:
//       initialText ??
//       "Hello, I am Si Hbib the travel guide. How can I help you?",
//     type: "text",
//     timestamp: +new Date(),
//   };
//   const formulatedMessage = {
//     role: "user",
//     content: formulatePrompte(userPreferanceData),
//   };
//   const initialAiMessage = {
//     role: "assistant",
//     content:
//       initialText ??
//       "Hello, I am Si Hbib the travel guide. How can I help you?",
//   };
//   const [chatMessages, setChatMessages] = React.useState<Message[]>([
//     initialMessage,
//   ]);
//   const [aiMessages, setAiMessages] = React.useState<aiMessage[]>([
//     formulatedMessage,
//     initialAiMessage,
//   ]);
//   const chatContainer = React.useRef<HTMLDivElement>(null);

//   const scroll = () => {
//     const { offsetHeight, scrollHeight, scrollTop } =
//       chatContainer.current as HTMLDivElement;
//     if (scrollHeight >= scrollTop + offsetHeight) {
//       chatContainer.current?.scrollTo(0, scrollHeight + 200);
//     }
//   };

//   React.useEffect(() => {
//     scroll();
//   }, [chatMessages]);

//   const handleOnSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     const message = e.currentTarget["input-field"].value;
//     setInput("");

//     setChatMessages((messages) => [
//       ...messages,
//       {
//         author: "aziz",
//         text: message,
//         type: "text",
//         timestamp: +new Date(),
//       },
//       {
//         author: "AI",
//         text: "...",
//         type: "text",
//         timestamp: +new Date(),
//       },
//     ]);

//     const messageToSend = [...aiMessages, { role: "user", content: message }];

//     const response = await fetchAIResponse({
//       messages: messageToSend,
//       setMessage: (msg) =>
//         setChatMessages((messages) => [
//           ...messages.slice(0, messages.length - 1),
//           {
//             author: "AI",
//             text: msg,
//             type: "text",
//             timestamp: +new Date(),
//           },
//         ]),
//     });
//     setAiMessages((messages) => [
//       ...messages,
//       { role: "user", content: message },
//       { role: "assistant", content: response },
//     ]);
//   };

//   const renderResponse = () => {
//     return (
//       <div ref={chatContainer} className="response">
//         {chatMessages.map((m, index) => (
//           <div
//             key={index}
//             className={`chat-line ${
//               m.author === "AI" ? "ai-chat" : "user-chat"
//             }`}
//           >
//             {/* <Image className="avatar" alt="avatar" src={m.author.avatarUrl} width={32} height={32} /> */}
//             <div style={{ width: 592, marginLeft: "16px" }}>
//               <div className="message">
//                 {/* <MarkdownRenderer> */}
//                 {m.text}

//                 {/* </MarkdownRenderer> */}
//               </div>
//               {index < chatMessages.length - 1 && (
//                 <div className="horizontal-line" />
//               )}
//             </div>
//           </div>
//         ))}
//       </div>
//     );
//   };

//   return (
//     <div className="chat">
//       {renderResponse()}
//       <form onSubmit={handleOnSendMessage} className="chat-form">
//         <input
//           name="input-field"
//           type="text"
//           placeholder="Say anything"
//           onChange={(e) => setInput(e.target.value)}
//           value={input}
//         />
//         <button type="submit" className="send-button" />
//       </form>
//     </div>
//   );
// };

// export default Chat;
