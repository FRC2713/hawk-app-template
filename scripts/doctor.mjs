import { existsSync } from "node:fs";
import { access, constants, mkdir, readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";
import { loadEnvFile } from "node:process";
import net from "node:net";

const localEnvironment = resolve(".env");
if (existsSync(localEnvironment)) loadEnvFile(localEnvironment);

const problems = [];
const notes = [];
const major = Number(process.versions.node.split(".")[0]);
if (major < 24) {
  problems.push(
    `Node ${process.versions.node} is too old. Install Node 24 LTS or newer.`,
  );
} else {
  notes.push(`Node ${process.versions.node}`);
}

try {
  const pkg = JSON.parse(
    await readFile(new URL("../package.json", import.meta.url), "utf8"),
  );
  notes.push(`${pkg.name} ${pkg.version}`);
} catch {
  problems.push(
    "package.json could not be read. Run this command from the repository.",
  );
}

try {
  await access(resolve("node_modules/astro/package.json"), constants.R_OK);
  notes.push("Dependencies are installed");
} catch {
  problems.push("Dependencies are missing. Run npm install, then try again.");
}

try {
  const migrations = (await readdir(resolve("migrations"))).filter((name) =>
    /^\d{4}_[a-z0-9_]+\.sql$/.test(name),
  );
  if (migrations.length === 0) throw new Error("none found");
  notes.push(`${migrations.length} database migrations found`);
} catch {
  problems.push(
    "Database migrations are missing. Restore the migrations folder from the repository.",
  );
}

if (process.env.APP_URL) {
  try {
    new URL(process.env.APP_URL);
    notes.push(`Application URL: ${process.env.APP_URL}`);
  } catch {
    problems.push(
      "APP_URL must be a complete URL such as http://localhost:3000.",
    );
  }
}

const allowedLogLevels = new Set(["debug", "info", "warn", "error"]);
if (process.env.LOG_LEVEL && !allowedLogLevels.has(process.env.LOG_LEVEL)) {
  problems.push("LOG_LEVEL must be debug, info, warn, or error.");
}

const dataDirectory = resolve(process.env.DATA_DIR ?? "./data");
try {
  await mkdir(dataDirectory, { recursive: true });
  await access(dataDirectory, constants.R_OK | constants.W_OK);
  notes.push(`Writable data directory: ${dataDirectory}`);
} catch {
  problems.push(`The data directory is not writable: ${dataDirectory}`);
}

const port = Number(process.env.PORT ?? 3000);
if (!Number.isInteger(port) || port < 1 || port > 65_535) {
  problems.push("PORT must be a whole number between 1 and 65535.");
} else {
  await new Promise((done) => {
    const server = net.createServer();
    server.once("error", () => {
      problems.push(
        `Port ${port} is already in use. Stop the other app or set PORT to another value.`,
      );
      done();
    });
    server.listen(port, "127.0.0.1", () => {
      server.close(() => {
        notes.push(`Port ${port} is available`);
        done();
      });
    });
  });
}

for (const note of notes) console.log(`✓ ${note}`);
if (problems.length) {
  for (const problem of problems) console.error(`✗ ${problem}`);
  process.exitCode = 1;
} else {
  console.log("✓ Ready for npm run dev");
}
