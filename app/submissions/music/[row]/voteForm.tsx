"use client";
import React, { useState } from 'react';
//import updateSubmissionData from '@/app/api/submissions/music/updateMusicSubmissionData';

const VoteForm = (props:any) => {
    const [vote, setVote] = useState('');

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const body = {
            vote,
            col: 2,
            row: props.row
        }

        const response = fetch('/api/submissions/music', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className='flex min-h-screen flex-col items-center space-y-5 p-15'>
                 <p>Submit your vote:</p>
                 <input
                    type="text"
                    value={vote}
                    onChange={(event) => setVote(event.target.value)}
                />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default VoteForm;
