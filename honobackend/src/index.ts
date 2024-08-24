import { serve } from "@hono/node-server";
import { configDotenv } from "dotenv";
import { Hono } from "hono";
import { jwt } from "hono/jwt";
import type { JwtVariables } from "hono/jwt";
import { cors } from "hono/cors";
import { csrf } from "hono/csrf";
import { logger } from "hono/logger";
import { serveStatic } from "@hono/node-server/serve-static";
import userRouter from "./routes/v1/User";
import connectionRouter from "./routes/v1/Connection";
const { authMiddleware } = require("./middleware/auth.js");
configDotenv({ path: "./src/config/config.env" });
require("./db/connection");

type Variables = JwtVariables & {
  user: any;
  token: any;
};
const app = new Hono<{ Variables: Variables }>().basePath("/api/v1");

app.use(logger());
app.use(csrf({ origin: "*" }));
app.use(
  "/api/*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(
  "/*/auth/*",
  (c, next) => {
    const jwtMiddleware = jwt({
      secret: process.env.JWT_SECRET as string,
    });
    return jwtMiddleware(c, next);
  },
  (c, next) => {
    return authMiddleware(c, next);
  }
);

app.use("/", serveStatic({ root: "./frontend/dist" }));

app.route("/user", userRouter);
app.route("/connection", connectionRouter);

const port = process.env.PORT as number | undefined;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
