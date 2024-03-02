import { NextResponse } from "next/server";
import { google } from 'googleapis';

export async function GET(req:any){
    const url = new URL(req.url);
    const row = url.searchParams.get('row');
    const col = url.searchParams.get('col');

    const auth = await google.auth.getClient({scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']});
    const sheets = google.sheets({version: 'v4', auth});

    const parsedRow = parseInt(row!) + 1; // +1 is because the first row is the header
    const voteRange = `${col}${parsedRow}`;
    const voteResponse = await sheets.spreadsheets.values.get({
        spreadsheetId: process.env.SHEET_ID,
        range: voteRange
    });

    const vote = voteResponse.data.values![0][0]
    return NextResponse.json(vote);
}
