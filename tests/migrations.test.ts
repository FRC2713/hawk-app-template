import Database from "better-sqlite3";
import {
  appendFileSync,
  copyFileSync,
  mkdirSync,
  mkdtempSync,
  rmSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { migrate } from "../src/server/db.js";

const temporaryDirectories: string[] = [];
const originalMigrationsDirectory = process.env.MIGRATIONS_DIR;

function fixture(): {
  root: string;
  migrations: string;
  connection: Database.Database;
} {
  const root = mkdtempSync(join(tmpdir(), "hawk-app-migrations-"));
  temporaryDirectories.push(root);
  const migrations = join(root, "migrations");
  mkdirSync(migrations);
  process.env.MIGRATIONS_DIR = migrations;
  return { root, migrations, connection: new Database(join(root, "app.db")) };
}

afterEach(() => {
  if (originalMigrationsDirectory === undefined)
    delete process.env.MIGRATIONS_DIR;
  else process.env.MIGRATIONS_DIR = originalMigrationsDirectory;
  for (const directory of temporaryDirectories.splice(0))
    rmSync(directory, { recursive: true, force: true });
});

describe("database migrations", { sequential: true }, () => {
  it("upgrades an existing database in order", () => {
    const { migrations, connection } = fixture();
    copyFileSync(
      resolve("migrations/0001_projects.sql"),
      join(migrations, "0001_projects.sql"),
    );
    migrate(connection);
    copyFileSync(
      resolve("migrations/0002_project_descriptions.sql"),
      join(migrations, "0002_project_descriptions.sql"),
    );
    migrate(connection);

    const names = connection
      .prepare<[], { name: string }>(
        "SELECT name FROM schema_migrations ORDER BY name",
      )
      .all()
      .map((row) => row.name);
    expect(names).toEqual([
      "0001_projects.sql",
      "0002_project_descriptions.sql",
    ]);
    expect(
      connection.prepare("SELECT description FROM projects").all(),
    ).toEqual([]);
    connection.close();
  });

  it("refuses to run when an applied migration was edited", () => {
    const { migrations, connection } = fixture();
    const migration = join(migrations, "0001_projects.sql");
    copyFileSync(resolve("migrations/0001_projects.sql"), migration);
    migrate(connection);
    appendFileSync(migration, "\n-- changed later\n");

    expect(() => migrate(connection)).toThrow(
      "was changed after it was applied",
    );
    connection.close();
  });
});
