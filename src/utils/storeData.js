import { HfInference } from '@huggingface/inference'
import {supabase} from '../lib/supabaseClient'
import ollama from "ollama";


const hf = new HfInference(process.env.HF_TOKEN)
const modelName = 'sentence-transformers/all-MiniLM-L6-v2'
// const textGenerationModelName = 'Xenova/distilbert-base-cased-distilled-squad'
// const modelName = 'sentence-transformers/paraphrase-distilroberta-base-v1'
export async function store(input) {
  try {
    const data = await Promise.all(
      input.map( async (textChunk) => {
        const embeddingResponse = await hf.featureExtraction({
            model: modelName,
            inputs: textChunk,
            options: {
                normalize: true ,
                pooling: 'mean'
            }
          });
         return { 
            content: textChunk, 
            embedding: embeddingResponse
          }
        })    
    );
    // store data in single batch
    const {error} = await supabase.from('documents').insert(data);
    if(error){
        throw new Error('Issue inserting data into database.');
    }
    
  } catch (error) {
    console.error('ERROR:' + error.message);
  }
  }

export async function generateEmbedding(input) {
    
    const data = await hf.featureExtraction({
        model: modelName,
        inputs: input,
        options: {
            normalize: true ,
            pooling: 'mean'
        }
    });
    return data;
}

  //measure the similiarity between vector algorithm: cosine similarity
export async function findNearestMatch(query_embeded) {
    
       const res = await supabase.rpc('match_documents',{
          query_embedding: query_embeded,
          match_threshold: 0.2,
          match_count: 1
       });
       return res.data[0] ? res.data[0].content : "";
}

const chatMessages = [{
  role: 'system',
  content: `You are an enthusiastic podcast expert who loves recommending podcasts to people. You will be given two pieces of information - some context about podcasts episodes and a question.  Your main job is to formulate a short answer to the question using the provided context.If the answer is not given in the context, find the answer in the conversation history if possible. If you are unsure and cannot find the answer in the context, say, "Sorry, I don't know the answer." Please do not make up the answer.` 
}]

export async function getChatCompletion(text, query){
  chatMessages.push({
    role: 'user', content: text ? `Context: ${text} Question: ${query}` : `Question: ${query}`
  });

  const response = await ollama.chat({
    model: 'mistral',
    messages: chatMessages
  })

  //saving chat history for longer memory
  chatMessages.push(
   response.message
  );
  console.log(chatMessages);
  return response.message.content;
}