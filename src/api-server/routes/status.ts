import { Hono } from "hono";
import { SERVICE_IDS } from "pocket-agent-sdk";
import { pocketNodeBaseUrl } from "@api-server/lib/pocket-node";
import { successResponse } from "@api-server/utils/response";
import { Env, Variables } from "@api-server/types";

export const statusRouter = new Hono<{ Bindings: Env; Variables: Variables }>();

/** GET /status — worker + Pocket Node reachability (public) */
statusRouter.get("/", async (c) => {
  const pocketNodeUrl = pocketNodeBaseUrl(c.env);
  let pocketNodeOnline = false;
  let pocketNodeStatus: Record<string, unknown> | null = null;
  let pocketNodeError: string | null = null;

  try {
    const res = await fetch(`${pocketNodeUrl}/status`, {
      headers: { Accept: "application/json" },
    });
    if (res.ok) {
      const body = (await res.json()) as { data?: Record<string, unknown> };
      pocketNodeStatus = body?.data ?? (body as Record<string, unknown>);
      pocketNodeOnline = true;
    } else {
      pocketNodeError = `HTTP ${res.status}`;
    }
  } catch (error) {
    pocketNodeError = error instanceof Error ? error.message : "Unreachable";
  }

  return c.json(
    successResponse({
      service: SERVICE_IDS.apiWorker,
      environment: c.env.ENVIRONMENT ?? "development",
      pocket_node_url: pocketNodeUrl,
      pocket_node_online: pocketNodeOnline,
      pocket_node_error: pocketNodeError,
      pocket_node: pocketNodeStatus,
      timestamp: new Date().toISOString(),
    })
  );
});
