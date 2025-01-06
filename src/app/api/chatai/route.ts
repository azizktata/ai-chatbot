import { NextRequest } from "next/server";
// import OpenAI from "openai";
// import { pipeline } from '@huggingface/transformers';
// const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');

import {data} from '../../../lib/data'
import {store} from '../../../utils/storeData'

export async function POST(req: Request) {
  try {
      
      const res = await store(data)
      return new Response(JSON.stringify(res), {
              status: 200,
              headers: { "Content-Type": "application/json" },
            });
       
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: "Internal server error ya aziz." }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        
      }
        
  }
      
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
