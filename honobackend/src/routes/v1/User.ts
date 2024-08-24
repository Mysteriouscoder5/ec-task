import { Hono } from "hono";
const userRouter = new Hono();
const {
  getUserById,
  createUser,
  getLoggedInUserDetails,
  userLogOut,
  userSignIn,
  userLogIn,
  userUpdateProfile,
} = require("../../controllers/UserController");
const { authenticateUser } = require("../../middleware/auth");
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(2),
});

userRouter.post("", createUser);
userRouter.post("/sign-in", userSignIn);
userRouter.post("/login", zValidator("json", loginSchema), userLogIn);
userRouter.put("", authenticateUser, userUpdateProfile);
userRouter.get("/logout", authenticateUser, userLogOut);
userRouter.get("/details", authenticateUser, getLoggedInUserDetails);
userRouter.get("/:id", getUserById);

userRouter.get("/auth/details", (c) => {
  const payload = c.get("jwtPayload");
  return c.json(payload);
});

export default userRouter;
