import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello from K2-Sass!");
});

export default app;
