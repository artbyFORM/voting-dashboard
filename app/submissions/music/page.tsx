"use client";
import Link from "next/link";
import { useState } from "react";

export default function VoteHomepage() {
  const [submissionNumber, setSubmissionNumber] = useState("");

  return (
    <main className="flex min-h-screen flex-col items-center space-y-5 p-15">
      <p>Please enter a valid submission number: </p>
      <input className="input input-bordered" type="text" value={submissionNumber} onChange={(e) => setSubmissionNumber(e.target.value)} />
      <Link className="btn btn-primary" href={`/submissions/music/${submissionNumber}`}>Submit</Link>
    </main>
  );
}
