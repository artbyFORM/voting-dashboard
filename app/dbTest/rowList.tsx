"use client";
import { useLiveQuery } from "dexie-react-hooks";
import { VoteRow, db } from "@/db/db.model";

export function RowList() {
    const rows = useLiveQuery(() => db.rows.toArray());
  
    return (
      <ul>
        {rows?.sort(function(a, b) 
            {
            var x = a["row"]; var y = b["row"];
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
            })
            .map((row: VoteRow) => (
                <li key={row.row}>
                    {row.row}, {row.id}, {row.title}, {row.artists}, {row.votes && row.votes.join(' ')}
                </li>
            ))
        }
      </ul>
    );
}