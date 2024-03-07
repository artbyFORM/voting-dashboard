"use client";
import { useLiveQuery } from "dexie-react-hooks";
import { VoteRow, db } from "@/db/db.model";

export function RowList() {
    const rows = useLiveQuery(() => db.rows.toArray());
  
    return (
      <ul>
        {rows?.map((row: VoteRow) => (
            <li key={row.id}>
                {row.id}, {row.title}, {row.artists}, {row.votes && row.votes.join(' ')}
            </li>
        ))}
      </ul>
    );
}