"use client";
import { useEffect, useState } from 'react';
import VoteForm from './voteForm';
import Link from 'next/link';

export default function Submission({ params }: { params: { row: string } }) {

    const [row, setRow] = useState(params.row);
    const [reload, setReload] = useState(true);

    const [data, setData] = useState<any>(null);
    const [vote, setVote] = useState('');

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

        const intervalId = setInterval(fetchData, 60000); // FIXME: Should I do this a different way? 

        return () => {
            clearInterval(intervalId); // Clean up the interval on component unmount
        };
    }, [params.row, reload, row]);

    const handleSubmit = async (vote:string) => {
        const body = {
            vote,
            col: 'G',
            row: params.row
        }

        const response = fetch('/api/submissions/music', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        setVote(vote);
        setReload(!reload);
    };

    return (
        <div className="flex min-h-screen flex-col items-center space-y-5 p-15">
            <div className="grid grid-cols-2 gap-5">
            <Link className="btn btn-primary" href={`/submissions/music/${parseInt(row) - 1}`}>BACK</Link>
            <Link className="btn btn-primary" href={`/submissions/music/${parseInt(row) + 1}`}>NEXT</Link>
            </div>
            <h1 className="text-lg font-bold">Title</h1>
            {data ? <h1>{data.title}</h1> : "..."}
            <h1 className="text-lg font-bold">Artist</h1>
            {data ? <h1>{data.artists}</h1> : "..."}
            <h1 className="text-lg font-bold">Votes:</h1>
            {data ? data.votes.map((vote: any, index: number) => (
                <p key={index}>{vote + '\n'}</p>
            )): "..."}

            <div className="flex-row">
                <button className={`btn  px-5 ${vote === '1' ? 'btn-primary' : 'btn-red'}`} style={{ marginRight: '10pt' }} onClick={() => handleSubmit('1')}>1</button>
                <button className={`btn px-5 ${vote === '2' ? 'btn-primary' : 'btn-red'}`} style={{ marginRight: '10pt' }} onClick={() => handleSubmit('2')}>2</button>
                <button className={`btn px-5 ${vote === '3' ? 'btn-primary' : 'btn-red'}`} style={{ marginRight: '10pt' }} onClick={() => handleSubmit('3')}>3</button>
            </div>
        </div>
    );
}