const express = require("express");
const {
  getUserById,
  createUser,
  getLoggedInUserDetails,
  userLogOut,
  userSignIn,
  userLogIn,
} = require("../../controllers/UserController");
const { createConnection } = require("mongoose");
const { authenticateUser } = require("../../middleware/auth");
const router = express.Router({ mergeParams: true });

router.post("", createUser);
router.get("/sign-in", userSignIn);
router.get("/login", userLogIn);
router.get("/logout", authenticateUser, userLogOut);
router.get("/details", authenticateUser, getLoggedInUserDetails);
router.get("/:id", getUserById);

module.exports = router;
