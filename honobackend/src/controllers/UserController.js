import { HonoRequest } from "hono";
import { Context } from "hono/jsx";
import { Handler, HandlerInterface } from "hono/types";
import User from "../models/userModel";
import { deleteCookie } from "hono/cookie";

export const getUserById = async (c) => {
  try {
    const id = c.req.param("id");

    const user = await User.findById(id).populate("connections.connectionId");
    if (!user) {
      return c.json(
        {
          success: false,
          message: "User not found",
        },
        400
      );
    }
    return c.json(
      {
        success: true,
        user,
      },
      400
    );
  } catch (error) {
    console.log(error);
    return c.json(
      {
        message: "Internal server error",
      },
      500
    );
  }
};

export const getLoggedInUserDetails = async (c) => {
  try {
    const userId = c.req?.user?._id;
    const user = await User.findById(userId).populate([
      { path: "connections.connectionId" },
    ]);
    if (!user) {
      return c.json(
        {
          success: false,
          message: "User not found",
        },
        400
      );
    }
    return c.json(
      {
        success: true,
        user,
        token: c.req.token,
      },
      200
    );
  } catch (error) {
    console.log(error);
    return c.json(
      {
        message: "Internal server error",
      },
      500
    );
  }
};

export const createUser = async (c) => {
  try {
    const body = await c.req.json();
    const user = await User.create(body);
    if (!user) {
      return c.json(
        {
          success: false,
          message: "User not found",
        },
        400
      );
    }
    return c.json(
      {
        success: true,
        user,
      },
      201
    );
  } catch (error) {
    console.log(error);
    return c.json(
      {
        message: "Internal server error",
      },
      500
    );
  }
};

export const userLogOut = async (c) => {
  try {
    deleteCookie(c, "token");
    return c.json(
      {
        success: true,
        message: "User logged out",
      },
      200
    );
  } catch (error) {
    console.log(error);
    return c.json(
      {
        message: "Internal server error",
      },
      500
    );
  }
};

const userSignIn = async (c) => {
  try {
    const body = await c.req.json();
    const user = new User(body);
    const token = await user.generateAuthToken();
    await user.save();
    if (!user) {
      return c.json(
        {
          success: false,
          message: "User not found",
        },
        400
      );
    }
    return c.json(
      {
        success: true,
        user,
        token,
      },
      201
    );
  } catch (error) {
    console.log(error);
    return c.json(
      {
        message: "Internal server error",
      },
      500
    );
  }
};

const userLogIn = async (c) => {
  try {
    const { email, password } = await c.req.valid("json");
    const user = await User.findOne({ email });
    if (!user) {
      return c.json(
        {
          success: false,
          message: "User not found",
        },
        400
      );
    }
    const checkPass = await user.comparePassword(password);
    if (!checkPass) {
      return c.json({ success: false, message: "Invalid credentials" }, 401);
    }
    const token = await user.generateAuthToken();
    return c.json(
      {
        success: true,
        user,
        token,
      },
      200
    );
  } catch (error) {
    console.log(error);
    return c.json(
      {
        message: "Internal server error",
      },
      500
    );
  }
};

const userUpdateProfile = async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    const user = await User.findByIdAndUpdate(id, body, { new: true });
    if (!user) {
      return c.json(
        {
          success: false,
          message: "User not updated",
        },
        400
      );
    }
    return c.json(
      {
        success: true,
        message: "User updated",
      },
      201
    );
  } catch (error) {
    console.log(error);
    return c.json(
      {
        message: "Internal server error",
      },
      500
    );
  }
};

module.exports = {
  userLogIn,
  userSignIn,
  getUserById,
  userLogOut,
  getLoggedInUserDetails,
  createUser,
  userUpdateProfile,
};
