import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import { config } from "../src/server/config.js";

const source = resolve(config().DATA_DIR, "app.db");
const backupDirectory = resolve(config().DATA_DIR, "backups");
mkdirSync(backupDirectory, { recursive: true });
const stamp = new Date()
  .toISOString()
  .replaceAll(":", "-")
  .replaceAll(".", "-");
const target = join(backupDirectory, `app-${stamp}.db`);

const conn = new Database(source, { readonly: true, fileMustExist: true });
await conn.backup(target);
conn.close();
console.log(`Backup written to ${basename(target)} in ${backupDirectory}`);
