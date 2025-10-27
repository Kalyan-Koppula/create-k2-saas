import { Hono } from "hono";
import { PostPayloadSchema, PostResponseSchema } from "@k2-saas/shared-types";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello from K2-Sass!");
});

app.post("/post", async (c) => {
  try {
    const json = await c.req.json();
    const payload = PostPayloadSchema.parse(json);

    const resp = {
      ok: true,
      echo: {
        name: payload.name,
        message: payload.message ?? null,
      },
    };

    // Validate response shape as a sanity check
    PostResponseSchema.parse(resp);

    return c.json(resp);
  } catch (err: any) {
    const message = err?.message ?? "Invalid request";
    return c.json({ ok: false, error: message }, 400);
  }
});

export default app;
