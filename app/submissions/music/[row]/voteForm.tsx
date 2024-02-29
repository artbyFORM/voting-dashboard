"use client";
import React, { useState } from 'react';

const VoteForm = (props:any) => {
    const [vote, setVote] = useState('');

    const handleSubmit = async (vote:string) => {

        const body = {
            vote,
            col: props.col,
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
                <div className="flex-row">
                    <button className='btn btn-primary px-5' style={{ marginRight: '10pt' }} onClick={() => handleSubmit('1')}>1</button>
                    <button className='btn btn-primary px-5' style={{ marginRight: '10pt' }} onClick={() => handleSubmit('2')}>2</button>
                    <button className='btn btn-primary px-5' style={{ marginRight: '10pt' }} onClick={() => handleSubmit('3')}>3</button>
                </div>
    );
};

export default VoteForm;
