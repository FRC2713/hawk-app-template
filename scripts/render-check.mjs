/**
 * Does the running app actually render, or does it only return 200?
 *
 * `npm run check` builds for production and the browser tests run against that
 * build, so both can pass while `npm run dev` -- the thing a person is actually
 * looking at -- serves a page whose styles the browser refuses to apply. This
 * checks the server that is running right now, in the mode it is running in.
 *
 * No browser and no dependencies: a blocked stylesheet is visible in the
 * Content-Security-Policy alone.
 */
import { argv, env, exit } from "node:process";

const urlArgument = argv.indexOf("--url");
const base = (
  urlArgument !== -1 && argv[urlArgument + 1]
    ? argv[urlArgument + 1]
    : (env.APP_URL ?? `http://127.0.0.1:${env.PORT ?? 3000}`)
).replace(/\/$/, "");

const problems = [];
const notes = [];

const explain = (error) =>
  error?.cause?.code === "ECONNREFUSED"
    ? "nothing is listening there. Start the app with npm run dev first."
    : (error?.message ?? String(error));

/** Astro's node adapter sends CSP as a response header; a static build uses a meta tag. */
function readPolicy(response, html) {
  const header = response.headers.get("content-security-policy");
  if (header) return { policy: header, source: "response header" };
  const meta = html.match(
    /<meta[^>]+http-equiv=["']content-security-policy["'][^>]+content=["']([^"']*)["']/i,
  );
  return meta ? { policy: meta[1], source: "<meta> tag" } : { policy: null };
}

function directive(policy, name) {
  for (const part of policy.split(";")) {
    const tokens = part.trim().split(/\s+/);
    if (tokens[0]?.toLowerCase() === name) return tokens.slice(1);
  }
  return null;
}

let response;
let html;
try {
  const health = await fetch(`${base}/health`);
  const body = await health.text();
  if (!health.ok) problems.push(`/health answered ${health.status}, not 200.`);
  else if (!body.includes('"ok"'))
    problems.push(`/health answered 200 but said ${body.trim()}.`);
  else notes.push("The server is up and its database answers.");

  response = await fetch(`${base}/`);
  html = await response.text();
  if (!response.ok)
    problems.push(`The home page answered ${response.status}, not 200.`);
} catch (error) {
  console.error(`Could not reach ${base}: ${explain(error)}`);
  exit(1);
}

// --- would the browser apply what we just sent it? ---------------------------

const { policy, source } = readPolicy(response, html);
const inlineStyles = (html.match(/<style[\s>]/gi) ?? []).length;
const inlineScripts = (html.match(/<script(?![^>]*\bsrc=)[\s>]/gi) ?? [])
  .length;

if (!policy) {
  notes.push("No Content-Security-Policy, so nothing on the page is blocked.");
} else {
  notes.push(`Content-Security-Policy present (${source}).`);
  for (const [name, count, thing, consequence] of [
    [
      "style-src",
      inlineStyles,
      "style",
      "the page will look like unformatted text",
    ],
    [
      "script-src",
      inlineScripts,
      "script",
      "anything interactive on the page will not run",
    ],
  ]) {
    const values = directive(policy, name);
    if (!values || count === 0) continue;
    const allowed =
      values.includes("'unsafe-inline'") ||
      values.some((value) => value.startsWith("'sha256-"));
    if (!allowed) {
      problems.push(
        `The page contains ${count} inline ${thing} block${count === 1 ? "" : "s"}, ` +
          `but its ${name} policy is "${values.join(" ")}" -- no 'unsafe-inline' ` +
          `and no sha256 hashes. The browser will block every one of them, so ` +
          `${consequence}. Astro computes those hashes only when it builds, so ` +
          `this is what a dev server does with CSP left switched on.`,
      );
    }
  }
}

// --- do the linked stylesheets actually arrive? ------------------------------

const sheets = [...html.matchAll(/<link[^>]+rel=["']stylesheet["'][^>]*>/gi)]
  .map((tag) => tag[0].match(/href=["']([^"']+)["']/i)?.[1])
  .filter(Boolean);

for (const href of sheets) {
  const target = new URL(href, `${base}/`).href;
  try {
    const sheet = await fetch(target);
    const type = sheet.headers.get("content-type") ?? "";
    const length = (await sheet.text()).length;
    if (!sheet.ok)
      problems.push(`The stylesheet ${href} answered ${sheet.status}.`);
    else if (!type.includes("css"))
      problems.push(`The stylesheet ${href} came back as ${type}, not CSS.`);
    else if (length < 200)
      problems.push(
        `The stylesheet ${href} is only ${length} bytes; it looks empty.`,
      );
    else notes.push(`Stylesheet ${href} loaded (${length} bytes).`);
  } catch (error) {
    problems.push(
      `The stylesheet ${href} could not be fetched: ${explain(error)}`,
    );
  }
}

if (inlineStyles === 0 && sheets.length === 0)
  problems.push("The page carries no styles at all, inline or linked.");

// --- report ------------------------------------------------------------------

console.log(`Render check for ${base}\n`);
if (notes.length) {
  console.log("Ready:");
  for (const note of notes) console.log(`  ✓ ${note}`);
  console.log("");
}
if (problems.length) {
  console.log("Needs attention:");
  for (const problem of problems) console.log(`  ! ${problem}`);
  console.log("");
  console.log(
    "The app answers requests, but a person opening it would see a broken page.",
  );
  exit(1);
}
console.log("The page should render correctly in a browser.");
