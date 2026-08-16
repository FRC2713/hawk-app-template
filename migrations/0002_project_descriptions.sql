ALTER TABLE projects
  ADD COLUMN description TEXT NOT NULL DEFAULT ''
  CHECK (length(description) <= 2000);
