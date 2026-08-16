import { openDatabase } from "../src/server/db.js";

const conn = openDatabase();
conn.close();
console.log("Database migrations are current.");
