import { NextResponse } from "next/server";
import { data } from "../../../lib/data";
import {store} from '../../../utils/storeData';

export async function POST(){
    try {
         await store(data);
        // if (dataToStore.res === 200) {
        //     return NextResponse.json({ message: "Data stored successfully" });
        // } else {
        //     throw new Error(" Couldn't store data");
        // }

        return NextResponse.json({ message: "Data stored successfully" });
    } catch (e) {
        return NextResponse.json({message: e.message}, {status: 500});
    }

}