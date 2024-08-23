import { Hono } from "hono";
const connectionRouter = new Hono();
const {
  updateConnection,
  newConnection,
  getConnectionById,
} = require("../../controllers/ConnectionController");
const { authenticateUser } = require("../../middleware/auth.js");

connectionRouter.get("/:id", getConnectionById);
connectionRouter.post("", authenticateUser, newConnection);
connectionRouter.put("/:id", authenticateUser, updateConnection);

export default connectionRouter;
