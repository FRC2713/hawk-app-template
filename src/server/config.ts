import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { loadEnvFile } from "node:process";
import { z } from "zod";

const localEnvironment = resolve(".env");
if (existsSync(localEnvironment)) loadEnvFile(localEnvironment);

const schema = z.object({
  DATA_DIR: z.string().trim().min(1).default("./data"),
  APP_URL: z.url().default("http://localhost:3000"),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
});

export type AppConfig = z.infer<typeof schema>;

let cached: AppConfig | undefined;

export function config(): AppConfig {
  if (cached) return cached;
  const parsed = schema.safeParse(process.env);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((issue) => `  ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");
    throw new Error(`Invalid environment:\n${issues}`);
  }
  cached = parsed.data;
  return cached;
}

export function resetConfigForTests(): void {
  cached = undefined;
}
