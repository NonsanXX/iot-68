import { Hono } from "hono";
import { cors } from "hono/cors";
import { serve } from "@hono/node-server";
import apiRouter from "./routes/api.js";

const app = new Hono().basePath("/api");

app.use(
  "*",
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })
);

app.route("/v1", apiRouter);

// Health check endpoint
app.get("/health", (c) => {
  return c.json({ status: "healthy", timestamp: new Date().toISOString() });
});

const port = parseInt(process.env.PORT || "3000");

console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
