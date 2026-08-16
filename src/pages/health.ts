import type { APIRoute } from "astro";
import { db } from "../server/db.js";

export const prerender = false;

export const GET: APIRoute = () => {
  try {
    const result = db().prepare<[], { ok: number }>("SELECT 1 AS ok").get();
    if (result?.ok !== 1) throw new Error("database did not answer");
    return Response.json(
      { status: "ok" },
      { headers: { "cache-control": "no-store" } },
    );
  } catch {
    return Response.json(
      { status: "unavailable" },
      { status: 503, headers: { "cache-control": "no-store" } },
    );
  }
};
