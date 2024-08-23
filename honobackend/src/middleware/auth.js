const jwt = require("jsonwebtoken");
const { default: User } = require("../models/userModel");
import { jwt as honoJWT } from "hono/jwt";
const authenticateUser = async (c, next) => {
  try {
    const authorization = c.req.header("authorization")?.split(" ")[1];
    const secret = process.env.JWT_SECRET;
    if (!authorization) {
      return c.json(
        { success: false, message: "Please login to access data" },
        401
      );
    }
    const verifyUser = jwt.verify(authorization, secret);
    const user = await User.findById(verifyUser._id);
    c.req.user = user;
    c.req.token = authorization;
    return next();
  } catch (error) {
    console.log("auth", error);
    return c.json({ success: false, message: "Invalid token" }, 401);
  }
};

const authMiddleware = async (c, next) => {
  try {
    const payload = c.get("jwtPayload");
    const userId = payload._id;
    const user = await User.findById(userId);
    c.req.user = user;
    return next();
  } catch (error) {
    console.log("auth", error);
    return c.json({ success: false, message: "Invalid token" }, 401);
  }
};

module.exports = {
  authenticateUser,
  authMiddleware,
};
