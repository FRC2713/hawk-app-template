import Database from "better-sqlite3";
import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
} from "node:fs";
import { join, resolve } from "node:path";
import { config } from "./config.js";
import { log } from "./logger.js";

export type Db = Database.Database;

type MigrationRow = { name: string; checksum: string };

let cached: Db | undefined;

function migrationsDirectory(): string {
  const configured = process.env.MIGRATIONS_DIR;
  const directory = resolve(configured ?? join(process.cwd(), "migrations"));
  if (!existsSync(directory) || !statSync(directory).isDirectory()) {
    throw new Error(`Migration directory does not exist: ${directory}`);
  }
  return directory;
}

export function migrate(conn: Db): void {
  conn.exec(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      name TEXT PRIMARY KEY,
      checksum TEXT NOT NULL,
      applied_at TEXT NOT NULL
    )
  `);

  const applied = new Map(
    conn
      .prepare<[], MigrationRow>(
        "SELECT name, checksum FROM schema_migrations ORDER BY name",
      )
      .all()
      .map((row) => [row.name, row.checksum]),
  );

  const files = readdirSync(migrationsDirectory())
    .filter((name) => /^\d{4}_[a-z0-9_]+\.sql$/.test(name))
    .sort();

  for (const name of files) {
    const sql = readFileSync(join(migrationsDirectory(), name), "utf8");
    const checksum = createHash("sha256").update(sql).digest("hex");
    const priorChecksum = applied.get(name);
    if (priorChecksum && priorChecksum !== checksum) {
      throw new Error(
        `Migration ${name} was changed after it was applied. Restore the original file and add a new migration.`,
      );
    }
    if (priorChecksum) continue;

    conn.transaction(() => {
      conn.exec(sql);
      conn
        .prepare(
          "INSERT INTO schema_migrations (name, checksum, applied_at) VALUES (?, ?, ?)",
        )
        .run(name, checksum, new Date().toISOString());
    })();
    log.info("migration applied", { migration: name });
  }
}

export function openDatabase(dataDirectory = config().DATA_DIR): Db {
  const directory = resolve(dataDirectory);
  mkdirSync(directory, { recursive: true });
  const conn = new Database(join(directory, "app.db"));
  conn.pragma("journal_mode = WAL");
  conn.pragma("foreign_keys = ON");
  conn.pragma("busy_timeout = 5000");
  migrate(conn);
  return conn;
}

export function db(): Db {
  cached ??= openDatabase();
  return cached;
}

export function closeDatabase(): void {
  if (!cached?.open) return;
  cached.close();
  cached = undefined;
}

process.once("exit", closeDatabase);
