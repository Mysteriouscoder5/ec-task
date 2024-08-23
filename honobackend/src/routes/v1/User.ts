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

userRouter.post("", createUser);
userRouter.post("/sign-in", userSignIn);
userRouter.get("/login", userLogIn);
userRouter.put("", authenticateUser, userUpdateProfile);
userRouter.get("/logout", authenticateUser, userLogOut);
userRouter.get("/details", authenticateUser, getLoggedInUserDetails);
userRouter.get("/:id", getUserById);

userRouter.get("/auth/details", (c) => {
  const payload = c.get("jwtPayload");
  return c.json(payload);
});

export default userRouter;
