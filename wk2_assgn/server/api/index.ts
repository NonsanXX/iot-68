import { Hono } from "hono"
import { cors } from "hono/cors"
import apiRouter from "./routes/api.js"
import { handle } from "hono/vercel"

const app = new Hono().basePath("/api")

app.use(
  "*",
  cors({
    origin: (origin) => {
      if (!origin) return "*" // for curl / Postman without Origin header

      // allow local dev
      if (origin === "http://localhost:5173") return origin

      // allow all Vercel frontend deployments
      if (origin.endsWith(".vercel.app")) return origin

      // fallback: only allow your own production domain
      return "https://iotwk2-server.vercel.app"
    },
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true, // if you want cookies / auth headers
  })
)

app.route("/v1", apiRouter)

export const config = {
  runtime: "edge",
}

export default handle(app)
