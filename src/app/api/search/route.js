import { NextResponse } from 'next/server';
import {findNearestMatch,generateEmbedding} from '../../../utils/storeData';


export async function GET(req){
    const {searchParams} = new URL(req.url)

    const question = searchParams.get('question');
    if(!question){
        return NextResponse.json(
            { message: "Ask a question via the 'question' parameter." },
            { status: 400 }
          );
    } 
    const query_embeded = await generateEmbedding(question);
    const result = await findNearestMatch(query_embeded);
    // const response = await getChatCompletion(result, question);
    // console.log(result);
    return NextResponse.json(result);

    
}