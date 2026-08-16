import { config } from "./config.js";

type Level = "debug" | "info" | "warn" | "error";
type Fields = Record<string, unknown>;

const weights: Record<Level, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

function write(level: Level, message: string, fields: Fields = {}): void {
  if (weights[level] < weights[config().LOG_LEVEL]) return;
  const line = JSON.stringify({
    time: new Date().toISOString(),
    level,
    message,
    ...fields,
  });
  if (level === "warn" || level === "error") console.error(line);
  else console.log(line);
}

export const log = {
  debug: (message: string, fields?: Fields) => write("debug", message, fields),
  info: (message: string, fields?: Fields) => write("info", message, fields),
  warn: (message: string, fields?: Fields) => write("warn", message, fields),
  error: (message: string, fields?: Fields) => write("error", message, fields),
};
