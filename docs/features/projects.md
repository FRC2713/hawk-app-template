# Projects reference feature

Status: implemented example

## Goal

Demonstrate the complete repository pattern with a small feature that a template owner can safely replace.

## Visible behavior

- The home page lists projects and filters by planned, active, or done.
- A user can create and edit a project with inline validation.
- A detail page shows the stored fields and timestamps.
- Delete requires explicit confirmation and returns to a clear success message.
- Missing records have a useful 404 response.

## Non-goals

- Assignment, comments, due dates, history, permissions, and real-time updates

## Acceptance examples

- Given a valid name, creating a project opens its detail page and shows success.
- Given a blank name, the form stays open and explains the error next to the field.
- Given an active project, selecting the active filter includes it and selecting done excludes it.
- Given delete confirmation, the project disappears and a success message is shown.

## Data

The `projects` table is owned by ordered migrations. Repository functions in `src/server/projects.ts` are the only normal access path.
