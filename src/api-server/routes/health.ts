import { Hono } from "hono";
import { SERVICE_IDS } from "pocket-agent-sdk";
import { Env, Variables } from "@api-server/types";

export const healthRouter = new Hono<{ Bindings: Env; Variables: Variables }>();

healthRouter.get("/", (c) => {
  return c.json({
    success: true,
    data: {
      status: "ok",
      timestamp: new Date().toISOString(),
      service: SERVICE_IDS.apiWorker,
    },
  });
});
