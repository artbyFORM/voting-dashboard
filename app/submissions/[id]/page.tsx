import { google } from 'googleapis';

export default async function Submission({params} : {params: {id: string}}) {

    const auth = await google.auth.getClient({
        scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
    });

    const sheets = google.sheets({version: 'v4', auth});

    const id = parseInt(params.id) + 1; // +1 is because the first row is the header
    const range = `A${id}:C${id}`; //FIXME: this is hardcoded for now, needs to be dynamic to any amount of voters

    const response = await sheets.spreadsheets.values.get({
        spreadsheetId: process.env.SHEET_ID,
        range
    });

    const [title, artist, person1] = response.data.values?.[0] ?? []; //FIXME: hardcoded, needs to parse all columns eventually

    return (
        <div>
            <h1>{title}</h1>
            <h1>{artist}</h1>
            <p>{person1}</p>
        </div>
    )
}