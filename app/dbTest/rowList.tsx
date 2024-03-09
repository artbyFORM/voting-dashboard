"use client";
import { useLiveQuery } from "dexie-react-hooks";
import { VoteRow, db } from "@/db/db.model";

export function RowList() {
    const rows = useLiveQuery(() => db.rows.toArray());

    return (
        <div>
            <button className="btn ml-10" onClick={() => db.rows.clear()}>CLEAR DATABASE</button>
            <div className="px-10 py-5">
                <table className="table table-xs">
                    <thead>
                        <tr>
                            <th style={{ width: "1%" }}></th>
                            <th style={{ width: "1%" }}>ID</th>
                            <th style={{ width: "100px" }}>Title</th>
                            <th style={{ width: "100px" }}>Artists</th>
                            <th style={{ width: "100px" }}>Votes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows?.sort(function(a, b) {
                            var x = a["row"];
                            var y = b["row"];
                            return x < y ? -1 : x > y ? 1 : 0;
                        }).map((row: VoteRow) => (
                            <tr key={row.row}>
                                <th>{row.row}</th>
                                <td>{row.id}</td>
                                <td>{row.title}</td>
                                <td>{row.artists}</td>
                                <td>{row.votes && row.votes.join(" ")}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
                        }