"use client";
import { useEffect, useState } from 'react';
import { db } from "@/db/db.model";
import { useLiveQuery } from 'dexie-react-hooks';

export default function Submission({ params }: { params: { row: string } }) {

    //FIXME: determine based on logged in account
    const col = 1;
    const colLetter = 'H';

    const [loading, setLoading] = useState(true);

    const rowsQuery = useLiveQuery(() => db.rows.toArray()); //live query of dexie db, rows will updates sorted

    const [row, setRow] = useState<number>(parseInt(params.row));
    const [rows, setRows] = useState<any>([]); //rows should always reflect the local dexie db

    const [vote, setVote] = useState('');

    //sort rows by row number every time rowsQuery updates
    useEffect(() => {
        if (rowsQuery) {
            const sortedRows = [...rowsQuery].sort((a, b) => a.row - b.row);
            setRows(sortedRows);
        }
    }, [rowsQuery]);
    

    //fetch data only on mount
    useEffect(() => {
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
            const data = await response.json();
            setVote(data[row - 1].votes[col]);
            // update local db copy 
            for (const [i, value] of data.entries()) {
                await addRow(value, i);
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    const changeRow = (newRow:number) => {
        //if(newRow < 1) { return; }
        //setRow(newRow);
        setVote(rows[newRow - 1].votes[col])
        setRow(newRow);
    };

    async function addRow(row: any, index: number) {
        const newData = row;
        try {
          await db.rows.add({
            ...newData,
            row: index + 1,
          });
          //console.log(`Added row with data ${newData} to the database!`);
        } catch (error) {
          //console.log(`Row already exists in the database. Attempting update...`);
          try {
            await db.rows.update(newData.id,{
                ...newData,
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
            //adjust vote
            const newVotes: number[] = currRow!.votes; //FIXME: handle potential error instead of unwrapping
            newVotes[col] = parseInt(vote);
            //update votes with new vote
            const newData = currRow!;
            await db.rows.update(newData.id,{
                votes: newVotes
            });
            //console.log(`Updated votes for id ${id}!`);
            //success! reflect change in the UI and also send out a signal to update everyone else's local db.
            setVote(vote);
          } catch (error) {
            console.log(`Failed to update vote for ${row}: ${error}`);
          }
    }
    

    const handleSubmit = async (vote: string) => {
        const abortController = new AbortController();
        const signal = abortController.signal;
    
        const body = {
            vote,
            col: colLetter,
            row: `${row}`,
        };
    
        try {
            const response = await fetch('/api/submissions/music', {
                method: 'POST',
                body: JSON.stringify(body),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                signal
            });
    
            if (response.status === 200) {
                // update vote in local db
                await updateVote(vote, `${rows[row - 1].id}`);
            }
        } catch (error) {
            // check if the error is due to the fetch being aborted
            if ((error as Error).name === 'AbortError') {
                console.log('Fetch aborted:');
            } else {
                console.log(`Failed to update vote for ${row}: ${error}`);
            }
        } finally {
            abortController.abort();
            setVote(vote);
        }
    };
    
    if(loading) {
        return <div>Loading rows...</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center p-15 w-full h-full">
                <button className="btn ml-10" onClick={() => changeRow(row - 1)} disabled={row === 1}>BACK</button>
                <p>{`${row}/${rows.length}`}</p>
                <button className="btn ml-10" onClick={() => changeRow(row + 1)} disabled={row === rows.size}>NEXT</button>
            </div>

            <div className="flex justify-center items-center p-15 w-full h-full">
                <div className="flex flex-col items-center p-15 space-y-15">
                    {rows ? <h1 className="text-4xl font-extrabold pb-5">{rows![row - 1].title}</h1> : "..."}
                    {rows ? <h1 className="text-4xl font-light pb-5">{rows![row - 1].artists}</h1> : "..."}
                    {/*rows ? rows![row - 1].votes.map((vote: any, index: number) => (<p className="text-xl font-light pb-5 justify-center" key={index}>{vote + '\n'}</p>)): "..."*/}

                    <div className="flex">
                        <button className={`btn text-4xl size-24 px-5 mr-10 ${vote == '1' ? 'btn-primary' : 'btn-red'}`} onClick={() => handleSubmit('1')}>1</button>
                        <button className={`btn text-4xl size-24 px-5 mr-10 ${vote == '2' ? 'btn-primary' : 'btn-red'}`} onClick={() => handleSubmit('2')}>2</button>
                        <button className={`btn text-4xl size-24 px-5 mr-10 ${vote == '3' ? 'btn-primary' : 'btn-red'}`} onClick={() => handleSubmit('3')}>3</button>
                    </div>
                </div>
            </div>
        </div>
    );
}