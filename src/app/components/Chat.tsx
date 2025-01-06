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
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  React.useEffect(() => {
    scroll();
  }, [conversation]);
  return (
    <div className="p-6  min-h-screen flex items-center justify-center">
      {!showChat ? (
        <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="county"
                className="block text-sm font-medium text-gray-700"
              >
                Country:
              </label>
              <input
                type="text"
                id="county"
                name="county"
                value={userPreferanceData.county}
                onChange={handleInputChange}
                placeholder="Enter your county"
                className="mt-1 block w-full rounded-md  shadow-sm py-4 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="time"
                className="block text-sm font-medium text-gray-700"
              >
                Time:
              </label>
              <input
                type="text"
                id="time"
                name="time"
                value={userPreferanceData.time}
                onChange={handleInputChange}
                placeholder="Enter time preference"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm py-4 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="purpose"
                className="block text-sm font-medium text-gray-700"
              >
                Purpose:
              </label>
              <input
                type="text"
                id="purpose"
                name="purpose"
                value={userPreferanceData.purpose}
                onChange={handleInputChange}
                placeholder="Enter purpose"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm py-4 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="budget"
                className="block text-sm font-medium text-gray-700"
              >
                Budget:
              </label>
              <input
                type="text"
                id="budget"
                name="budget"
                value={userPreferanceData.budget}
                onChange={handleInputChange}
                placeholder="Enter your budget"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm py-4 sm:text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {loading ? "loading..." : "Start Chat"}
            </button>
          </form>
        </div>
      ) : (
        <>
          <div className="w-full max-w-xl bg-white shadow-lg rounded-lg p-6 space-y-4">
            <div ref={chatContainer} className="overflow-y-auto max-h-60">
              {conversation.map((message, index) => (
                <div
                  key={index}
                  className={`p-2 rounded-md ${
                    index % 2 === 0
                      ? "bg-gray-200 text-gray-800 text-right"
                      : "bg-indigo-100 text-indigo-900"
                  }`}
                >
                  {index !== 0 ? (
                    <>
                      <p className="mb-1 font-bold">{message.role}:</p>
                      <p className="leading-relaxed">
                        {message.content.split("\n").map((line, i) => (
                          <span key={i}>
                            {line}
                            <br />
                          </span>
                        ))}
                      </p>
                    </>
                  ) : null}
                </div>
              ))}
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={input}
                onChange={(event) => {
                  setInput(event.target.value);
                }}
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              <button
                onClick={async () => {
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
                }}
                className="bg-indigo-600 text-white py-4 px-4 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Send Message
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
