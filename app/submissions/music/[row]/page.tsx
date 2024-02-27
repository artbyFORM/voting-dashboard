import fetchMusicSubmissionData from '@/app/api/submissions/music/fetchMusicSubmissionData';

export default async function Submission({params} : {params: {row: string}}) {
   
    const submissionData = await fetchMusicSubmissionData(params.row);
    const { title, artist, votes } = submissionData;

    return (
        <div className="flex min-h-screen flex-col items-center space-y-5 p-15">
            <h1 className="text-lg font-bold">Title</h1>
            <h1>{title}</h1>
            <h1 className="text-lg font-bold">Artist</h1>
            <h1>{artist}</h1>
            <h1 className="text-lg font-bold">Votes:</h1>
            {votes.map((vote: any, index: number) => (<p key={index}>{vote + "\n"}</p>))}
        </div>
    )
}