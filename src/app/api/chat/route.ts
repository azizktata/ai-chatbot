// import ollama from "ollama";
// import { ollama } from 'ollama-ai-provider';
// import { streamText } from "ai";
// import { createStreamableValue } from "ai/rsc";

// export async function POST(req: Request) {
//   const { messages } = await req.json();

//   const stream = createStreamableValue();
//   const model = ollama("mistral");




//   (async () => {
//     const { textStream } = await streamText({
//       model: model,
//       messages: messages,
//     });

//     for await (const text of textStream) {
//       stream.update(text);
//     }

//     stream.done();
//   })().then(() => {});
  // const response = await openai.chat.completions.create({
  //   model: "gpt-4o",
  //   messages: [
  //     ...messages,
  //   ],
  //   stream: true,
  //   max_tokens: 1024,
  // });


  // return {

  //   newMessage: stream.value,
  // };
  // const stream = AIStream(response);
  // return new streamText.toDataStreamResponse(stream);

      
      // const openai = new OpenAI({
      //   apiKey: process.env.OPENAI_API_KEY ,
      // });
      // const response = await openai.chat.completions.create({
//     model: "gpt-4o-mini",
//     messages: [
//       {
//         role: "system",
//         content: "You are a helpful and expert travel guide.",
//       },
//       {
//         role: "user",
//         content: "Suggestions about visiting Madina in Saudi Arabia",
//       },
//     ],
//   });
