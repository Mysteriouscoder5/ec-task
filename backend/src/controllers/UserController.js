const User = require("../models/userModel.js");
const Connection = require("../models/connectionModel.js");
const { default: mongoose } = require("mongoose");

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).populate("connections");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (e) {
    console.log(e);
  }
};

const getLoggedInUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req?.user?._id).populate([
      { path: "connections.connectionId" },
    ]);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "USER NOT FOUND",
      });
    }
    res.status(200).json({
      success: true,
      user,
      token: req.token,
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    if (!user) {
      return res
        .status(400)
        .json({ message: "User not created", success: false });
    }
    return res.status(201).json({
      success: true,
      user,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      success: false,
      error: e,
    });
  }
};

const userLogOut = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({
      success: true,
      message: "LOGGED OUT SUCCESSFULLY",
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

const userSignIn = async (req, res) => {
  try {
    const user = new User(req.body);
    const token = await createUser.generateAuthToken();
    await user.save();
    if (!user) {
      return res
        .status(400)
        .json({ message: "User not created", success: false });
    }
    return res.status(201).json({
      success: true,
      user,
      token,
    });
  } catch (error) {
    return res.status(500).send(error);
  }
};

const userLogIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    const checkPass = await user.comparePassword(password);
    if (!checkPass) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }
    const token = await user.generateAuthToken();
    return res.status(201).json({
      success: true,
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};

module.exports = {
  getUserById,
  createUser,
  getLoggedInUserDetails,
  userLogOut,
  userSignIn,
  userLogIn,
};
