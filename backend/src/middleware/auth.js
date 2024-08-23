const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const authenticateUser = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization?.split(" ")[1];
    const secret = process.env.SECRET_KEY;
    if (!authorization) {
      return res
        .status(401)
        .json({ success: false, message: "Please login to access data" });
    }
    const verifyUser = jwt.verify(authorization, secret);
    const user = await User.findById(verifyUser._id);
    req.user = user;
    req.token = authorization;
    next();
  } catch (error) {
    console.log(error, "auth");
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};

module.exports = {
  authenticateUser,
};
