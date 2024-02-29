"use client";
import { useEffect, useState } from 'react';
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
        //setReload(!reload);
    };

    return (
        <div className="flex justify-between items-center p-15 w-full h-full">
            <Link className="btn" href={`/submissions/music/${parseInt(row) - 1}`}>BACK</Link>
            <div className="flex flex-col items-center p-15 space-y-15">
                {data ? <h1 className="text-4xl font-extrabold pb-5">{data.title}</h1> : "..."}
                {data ? <h1 className="text-4xl font-light pb-5">{data.artists}</h1> : "..."}
                {/*data ? data.votes.map((vote: any, index: number) => (<p key={index}>{vote + '\n'}</p>)): "..."*/}

                <div className="flex">
                    <button className={`btn text-4xl size-24 px-5 mr-10 ${vote === '1' ? 'btn-primary' : 'btn-red'}`} onClick={() => handleSubmit('1')}>1</button>
                    <button className={`btn text-4xl size-24 px-5 mr-10 ${vote === '2' ? 'btn-primary' : 'btn-red'}`} onClick={() => handleSubmit('2')}>2</button>
                    <button className={`btn text-4xl size-24 px-5 mr-10 ${vote === '3' ? 'btn-primary' : 'btn-red'}`} onClick={() => handleSubmit('3')}>3</button>
                </div>
            </div>
            <Link className="btn" href={`/submissions/music/${parseInt(row) + 1}`}>NEXT</Link>
        </div>
    );
}