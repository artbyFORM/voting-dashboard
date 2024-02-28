//import fetchMusicSubmissionData from '@/app/api/submissions/music/fetchMusicSubmissionData';
"use client";
import { useEffect, useState } from 'react';
import VoteForm from './voteForm';

export default function Submission({ params }: { params: { row: string } }) {
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(
                `http://localhost:3000/api/submissions/music?row=${params.row}`,
                {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                }
            );
            const jsonData = await response.json();
            setData(jsonData);
        };

        fetchData();

        const intervalId = setInterval(fetchData, 1000); // FIXME: Should I do this a different way? 

        return () => {
            clearInterval(intervalId); // Clean up the interval on component unmount
        };
    }, [params.row]);

    if (!data) {
        return <div>Loading...</div>;
    }

    const { title, artist, votes } = data;

    return (
        <div className="flex min-h-screen flex-col items-center space-y-5 p-15">
            <h1 className="text-lg font-bold">Title</h1>
            <h1>{title}</h1>
            <h1 className="text-lg font-bold">Artist</h1>
            <h1>{artist}</h1>
            <h1 className="text-lg font-bold">Votes:</h1>
            {votes.map((vote: any, index: number) => (
                <p key={index}>{vote + '\n'}</p>
            ))}
            <VoteForm row={params.row} />
        </div>
    );
}