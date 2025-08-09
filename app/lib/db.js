import Database from "better-sqlite3";
const db = new Database("links.db");
db.prepare(`
  CREATE TABLE IF NOT EXISTS links (
    code TEXT PRIMARY KEY,
    long TEXT
  )
`).run();
export { db };
