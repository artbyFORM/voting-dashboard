import { google } from 'googleapis';

export default async function fetchSubmissionData(row: string) {
    const auth = await google.auth.getClient({scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']});
    const sheets = google.sheets({version: 'v4', auth});

    const parsedRow = parseInt(row) + 1; // +1 is because the first row is the header
    const infoRange = `A${parsedRow}:B${parsedRow}`;
    const voteRange = `C${parsedRow}:E${parsedRow}`; //FIXME: hardcoded, needs to calculate for arbitrary number of voters

    const infoResponse = await sheets.spreadsheets.values.get({
        spreadsheetId: process.env.SHEET_ID,
        range: infoRange
    });

    const voterResponse = await sheets.spreadsheets.values.get({
        spreadsheetId: process.env.SHEET_ID,
        range: voteRange
    });

    console.log(infoResponse.data);

    const [title, artist] = infoResponse.data.values?.[0] ?? [];
    const votes = voterResponse.data.values ?? [];

    return { title, artist, votes };
}