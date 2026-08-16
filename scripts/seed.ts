import { openDatabase } from "../src/server/db.js";
import { seedDemoProjects } from "../src/server/projects.js";

const conn = openDatabase();
const created = seedDemoProjects(conn);
conn.close();
console.log(
  created ? `Added ${created} demo projects.` : "Demo data already exists.",
);
