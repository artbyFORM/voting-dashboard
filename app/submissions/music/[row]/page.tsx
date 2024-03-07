"use client";
import { useEffect, useState } from 'react';
import { db } from "@/db/db.model";
import { useLiveQuery } from 'dexie-react-hooks';

export default function Submission({ params }: { params: { row: string } }) {

    const rows = useLiveQuery(() => db.rows.toArray());

    const [row, setRow] = useState<number>(parseInt(params.row));
    const [data, setData] = useState<any>(null);
    const [vote, setVote] = useState('');

    //fetch data only on mount
    useEffect(() => {
        db.rows.clear();
        //fetch entire sheet on mount
        const fetchData = async () => {
            const response = await fetch(
                `http://localhost:3000/api/submissions/music`,
                {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                }
            );
            const jsonData = await response.json();
            
            // update local db copy 
            jsonData.forEach((row: any) => {
                //console.log(row);
                addRow(row);
            })

            setData(jsonData);
            setVote(jsonData[row].votes[0]) //FIXME: should be dynamic based on user's column
        };
        fetchData();
    }, []);

    const changeRow = (newRow:number) => {
        if(newRow < 1) {
            return;
        }
        setRow(newRow);
        setVote(data[newRow].votes[0]) //FIXME: should be dynamic based on user's column
    };

    async function addRow(row: any) {
        try {
          const newData = row;
          await db.rows.add({
            id: newData.id,
            title: newData.title,
            artists: newData.artists,
            listenLink: newData.listenLink,
            infoLink: newData.infoLink,
            votes: newData.votes
          });
          //console.log(`Added row with data ${newData} to the database!`);
        } catch (error) {
          //console.log(`Row already exists in the database. Attempting update...`);
          try {
            const newData = row;
            await db.rows.update(newData.id,{
              title: newData.title,
              artists: newData.artists,
              listenLink: newData.listenLink,
              infoLink: newData.infoLink,
              votes: newData.votes
            });
            //console.log(`Updated row with data ${newData} to the database!`);
          } catch (error) {
            console.log(`Failed to add ${row}: ${error}`);
          }
        }
    }

    async function updateVote(vote: string, id: string) {
        try {
            //grab current votes
            const currRow = await db.rows.get(id);
            //console.log(currRow);

            //adjust vote
            const newVotes: number[] = currRow!.votes; //FIXME: handle potential error instead of unwrapping
            newVotes[0] = parseInt(vote);

            //update votes with new vote
            const newData = currRow!;
            await db.rows.update(newData.id,{
                votes: newVotes
            });

            //console.log(`Updated votes for id ${id}!`);
          } catch (error) {
            console.log(`Failed to update vote for ${row}: ${error}`);
          }
    }

    const handleSubmit = async (vote:string) => {
        const body = {
            vote,
            col: 'G',
            row: `${row}`
        }
        const response = fetch('/api/submissions/music', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        updateVote(vote, `${data[row - 1].id}`);
        setVote(vote);
    };

    return (
        <div>
            <div className="flex justify-between items-center p-15 w-full h-full">
                <button className="btn ml-10" onClick={() => changeRow(row - 1)}>BACK</button>
                <p>{row}</p>
                <button className="btn ml-10" onClick={() => changeRow(row + 1)}>NEXT</button>
            </div>

            <div className="flex justify-center items-center p-15 w-full h-full">
                <div className="flex flex-col items-center p-15 space-y-15">
                    {data ? <h1 className="text-4xl font-extrabold pb-5">{data[row - 1].title}</h1> : "..."}
                    {data ? <h1 className="text-4xl font-light pb-5">{data[row - 1].artists}</h1> : "..."}
                    {/*data ? data[parseInt(row) + 1].votes.map((vote: any, index: number) => (<p key={index}>{vote + '\n'}</p>)): "..."*/}

                    <div className="flex">
                        <button className={`btn text-4xl size-24 px-5 mr-10 ${vote === '1' ? 'btn-primary' : 'btn-red'}`} onClick={() => handleSubmit('1')}>1</button>
                        <button className={`btn text-4xl size-24 px-5 mr-10 ${vote === '2' ? 'btn-primary' : 'btn-red'}`} onClick={() => handleSubmit('2')}>2</button>
                        <button className={`btn text-4xl size-24 px-5 mr-10 ${vote === '3' ? 'btn-primary' : 'btn-red'}`} onClick={() => handleSubmit('3')}>3</button>
                    </div>
                </div>
            </div>
        </div>
    );
}