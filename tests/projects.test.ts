import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { openDatabase, type Db } from "../src/server/db.js";
import {
  createProject,
  deleteProject,
  getProject,
  listProjects,
  updateProject,
} from "../src/server/projects.js";

const temporaryDirectories: string[] = [];
const connections: Db[] = [];

function testDatabase(): Db {
  const directory = mkdtempSync(join(tmpdir(), "hawk-app-projects-"));
  temporaryDirectories.push(directory);
  const connection = openDatabase(directory);
  connections.push(connection);
  return connection;
}

afterEach(() => {
  for (const connection of connections.splice(0)) connection.close();
  for (const directory of temporaryDirectories.splice(0))
    rmSync(directory, { recursive: true, force: true });
});

describe("project repository", () => {
  it("creates, reads, filters, updates, and deletes a project", () => {
    const connection = testDatabase();
    const created = createProject(
      {
        name: "Safety checklist",
        description: "Before each event",
        status: "planned",
      },
      connection,
    );

    expect(getProject(created.id, connection)).toMatchObject({
      name: "Safety checklist",
      status: "planned",
    });
    expect(listProjects("planned", connection)).toHaveLength(1);
    expect(listProjects("done", connection)).toHaveLength(0);

    const updated = updateProject(
      created.id,
      { ...created, status: "done" },
      connection,
    );
    expect(updated?.status).toBe("done");
    expect(deleteProject(created.id, connection)).toBe(true);
    expect(getProject(created.id, connection)).toBeUndefined();
  });

  it("returns a clear result when a record does not exist", () => {
    const connection = testDatabase();
    expect(
      updateProject(
        999,
        { name: "Missing", description: "", status: "active" },
        connection,
      ),
    ).toBeUndefined();
    expect(deleteProject(999, connection)).toBe(false);
  });
});
