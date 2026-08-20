import { Hono } from "hono";
import { proxyToPocketNode } from "@api-server/lib/pocket-node";
import { Env, Variables } from "@api-server/types";

export const settingsRouter = new Hono<{ Bindings: Env; Variables: Variables }>();

/** GET /settings/llm — proxy to Pocket Node */
settingsRouter.get("/llm", async (c) => {
  const upstream = await proxyToPocketNode(c.env, "/settings/llm", {
    method: "GET",
    headers: { Accept: "application/json" },
  });
  const text = await upstream.text();
  return new Response(text, {
    status: upstream.status,
    headers: {
      "Content-Type": upstream.headers.get("Content-Type") ?? "application/json",
    },
  });
});

/** POST /settings/llm — proxy to Pocket Node */
settingsRouter.post("/llm", async (c) => {
  const body = await c.req.raw.text();
  const upstream = await proxyToPocketNode(c.env, "/settings/llm", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });
  const text = await upstream.text();
  return new Response(text, {
    status: upstream.status,
    headers: {
      "Content-Type": upstream.headers.get("Content-Type") ?? "application/json",
    },
  });
});

/** GET /settings/memory — proxy to Pocket Node */
settingsRouter.get("/memory", async (c) => {
  const upstream = await proxyToPocketNode(c.env, "/settings/memory", {
    method: "GET",
    headers: { Accept: "application/json" },
  });
  const text = await upstream.text();
  return new Response(text, {
    status: upstream.status,
    headers: {
      "Content-Type": upstream.headers.get("Content-Type") ?? "application/json",
    },
  });
});

/** POST /settings/memory — proxy to Pocket Node */
settingsRouter.post("/memory", async (c) => {
  const body = await c.req.raw.text();
  const upstream = await proxyToPocketNode(c.env, "/settings/memory", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });
  const text = await upstream.text();
  return new Response(text, {
    status: upstream.status,
    headers: {
      "Content-Type": upstream.headers.get("Content-Type") ?? "application/json",
    },
  });
});
