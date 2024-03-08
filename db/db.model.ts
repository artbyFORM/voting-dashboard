import Dexie, { Table } from 'dexie';

// table interface
export interface VoteRow {
  id: number;
  row: number;
  title: string;
  artists: string;
  listenLink: string;
  infoLink: string;
  votes: number[];
}

export class DB extends Dexie {
// table name is student 
  rows!: Table<VoteRow>; 
  constructor() {
    super('myDatabase');
    this.version(1).stores({
      rows: '++id, row, title, artists, listenLink, infoLink, votes'  
    });
  }
}

export const db = new DB(); // export the db