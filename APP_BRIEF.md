# Application brief

This file is the source of truth for what the application should become. Replace the example answers with your own before changing the sample project feature.

## One-sentence purpose

Help a small team track internal projects without a spreadsheet.

## People who use it

- Team members create and update projects.
- The Hawk Suite proxy will eventually identify signed-in people. Local development has no authentication.

## Essential tasks

1. See all projects and filter them by status.
2. Create a project with a name, description, and status.
3. Edit or delete a project with clear confirmation and errors.

## Information stored

- Project name
- Optional description
- Status: planned, active, or done
- Created and updated timestamps

## Explicitly not included

- Public sign-up or user accounts
- Browser-offline operation or multi-device synchronization
- Multiple organizations in one deployment
- Real-time collaboration, notifications, or file uploads

## Success looks like

A new user can complete the essential tasks without instructions, and an operator can back up and restore the single SQLite file.

## Open questions

- What should replace the sample project feature?
- Which Hawk Suite roles may view or change each kind of record?
