import { NextResponse } from "next/server";
import { google } from 'googleapis';

export async function GET(req:any){
    const url = new URL(req.url);
    const row = url.searchParams.get('row');

    const auth = await google.auth.getClient({scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']});
    const sheets = google.sheets({version: 'v4', auth});

    const parsedRow = parseInt(row!) + 1; // +1 is because the first row is the header
    const infoRange = `A${parsedRow}:E${parsedRow}`;
    const voteRange = `G${parsedRow}:P${parsedRow}`; //FIXME: hardcoded, needs to calculate for arbitrary number of voters

    const infoResponse = await sheets.spreadsheets.values.get({
        spreadsheetId: process.env.SHEET_ID,
        range: infoRange
    });

    const voterResponse = await sheets.spreadsheets.values.get({
        spreadsheetId: process.env.SHEET_ID,
        range: voteRange
    });

    console.log(infoResponse.data);

    const [id, title, artists, listenLink, fullInfoLink] = infoResponse.data.values?.[0] ?? [];
    const votes = voterResponse.data.values ?? [];

    const data = { id, artists, title, listenLink, fullInfoLink, votes };
    return NextResponse.json(data);
}

export async function POST(req: any, res: any){
    const data  = await req.json();
    const row = parseInt(data.row) + 1;
    const vote = data.vote;

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
            range: `G${row}`,
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