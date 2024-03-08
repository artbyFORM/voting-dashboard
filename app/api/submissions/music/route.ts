import { NextResponse } from "next/server";
import { google } from 'googleapis';

interface VoteData {
    id: string;
    title: string;
    artists: string;
    listenLink: string;
    infoLink: string;
    votes: number[];
}

export async function GET(req:any){
    const auth = await google.auth.getClient({scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']});
    const sheets = google.sheets({version: 'v4', auth});
    const range = `A${2}:P${1000}`; // entire sheet, maybe make max size dynamic?

    const response = await sheets.spreadsheets.values.get({
        spreadsheetId: process.env.SHEET_ID,
        range
    });

    const responseArr = response.data.values as Array<any>;
    const objs: VoteData[] = responseArr.map(([id, title, artists, listenLink, infoLink, , ...votes]) => {
        const votesArray = Array<number>(10).fill(0); //FIXME: make length dynamic based on how many voters we have
        votes.forEach((vote: string, index: number) => {
            if (vote !== "") {
                votesArray[index] = parseInt(vote);
            }
        });
        return {
            id,
            title,
            artists,
            listenLink,
            infoLink,
            votes: votesArray as number[]
        };
    });

    //console.log("Sheet Fetched!")
    //console.log(objs)
    
    //example: find by row in sheet: console.log(objs[0])
    //example: find by ID: console.log(objs.find(x => x.id === '264'))
    return NextResponse.json(objs);
}

export async function POST(req: any, res: any){
    const data  = await req.json();
    
    const row = parseInt(data.row) + 1;
    const vote = data.vote;
    const column = data.col;

    try {
        const auth = await google.auth.getClient({
            credentials: {
                client_email: process.env.CLIENT_EMAIL,
                private_key: process.env.PRIVATE_KEY
            },
            scopes: [
                'https://www.googleapis.com/auth/drive',
                'https://www.googleapis.com/auth/drive.file',
                'https://www.googleapis.com/auth/spreadsheets'
            ]
        });
        const sheets = google.sheets({version: 'v4', auth});
        const response = await sheets.spreadsheets.values.update({
            spreadsheetId: process.env.SHEET_ID,
            range: `${column}${row}`,
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [
                    [vote]
                ]
            }
        });

        return NextResponse.json(data);
    } catch (e) {
        //console.error(e);
        return NextResponse.json(data);
    }
}