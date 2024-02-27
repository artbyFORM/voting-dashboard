import fetchMusicSubmissionData from '@/app/api/submissions/music/fetchMusicSubmissionData';

export default async function Submission({params} : {params: {row: string}}) {
   
    const submissionData = await fetchMusicSubmissionData(params.row);
    const { title, artist, votes } = submissionData;

    return (
        <div>
            <h1>{`Title: ${title}`}</h1>
            <h1>{`Artist: ${artist}`}</h1>
            {votes.map((vote: any, index: number) => (<p key={index}>{vote + "\n"}</p>))}
        </div>
    )
}