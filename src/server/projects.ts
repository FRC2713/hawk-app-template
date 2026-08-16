import type { Db } from "./db.js";
import { db } from "./db.js";

export const PROJECT_STATUSES = ["planned", "active", "done"] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export type Project = {
  id: number;
  name: string;
  description: string;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
};

export type ProjectInput = Pick<Project, "name" | "description" | "status">;

type ProjectRow = {
  id: number;
  name: string;
  description: string;
  status: ProjectStatus;
  created_at: string;
  updated_at: string;
};

const selectColumns = `
  id, name, description, status, created_at, updated_at
`;

function fromRow(row: ProjectRow): Project {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function listProjects(
  status?: ProjectStatus,
  conn: Db = db(),
): Project[] {
  const rows = status
    ? conn
        .prepare<[ProjectStatus], ProjectRow>(
          `SELECT ${selectColumns} FROM projects WHERE status = ? ORDER BY updated_at DESC, id DESC`,
        )
        .all(status)
    : conn
        .prepare<[], ProjectRow>(
          `SELECT ${selectColumns} FROM projects ORDER BY updated_at DESC, id DESC`,
        )
        .all();
  return rows.map(fromRow);
}

export function getProject(id: number, conn: Db = db()): Project | undefined {
  const row = conn
    .prepare<[number], ProjectRow>(
      `SELECT ${selectColumns} FROM projects WHERE id = ?`,
    )
    .get(id);
  return row ? fromRow(row) : undefined;
}

export function createProject(input: ProjectInput, conn: Db = db()): Project {
  const now = new Date().toISOString();
  const result = conn
    .prepare(
      `INSERT INTO projects (name, description, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?)`,
    )
    .run(input.name, input.description, input.status, now, now);
  return getProject(Number(result.lastInsertRowid), conn)!;
}

export function updateProject(
  id: number,
  input: ProjectInput,
  conn: Db = db(),
): Project | undefined {
  const result = conn
    .prepare(
      `UPDATE projects
       SET name = ?, description = ?, status = ?, updated_at = ?
       WHERE id = ?`,
    )
    .run(
      input.name,
      input.description,
      input.status,
      new Date().toISOString(),
      id,
    );
  return result.changes === 0 ? undefined : getProject(id, conn);
}

export function deleteProject(id: number, conn: Db = db()): boolean {
  return conn.prepare("DELETE FROM projects WHERE id = ?").run(id).changes > 0;
}

export function seedDemoProjects(conn: Db = db()): number {
  const count = conn
    .prepare<[], { count: number }>("SELECT count(*) AS count FROM projects")
    .get()!.count;
  if (count > 0) return 0;

  const insert = conn.transaction(() => {
    createProject(
      {
        name: "Describe your application",
        description:
          "Open APP_BRIEF.md with Codex or Claude and replace this example with your idea.",
        status: "active",
      },
      conn,
    );
    createProject(
      {
        name: "Try the complete project flow",
        description:
          "Create, edit, filter, and delete a project to see the template conventions in action.",
        status: "planned",
      },
      conn,
    );
  });
  insert();
  return 2;
}
