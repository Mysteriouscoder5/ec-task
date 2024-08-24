import Connection from "../models/connectionModel";
import User from "../models/userModel";

export const getConnectionById = async (c) => {
  try {
    const id = c.req.param("id");
    const connection = await Connection.findById(id).populate([
      {
        path: "sender",
        select: "username email",
      },
      { path: "receiver", select: "username email" },
    ]);
    if (!connection) {
      return c.json(
        {
          success: false,
          message: "Connection not found",
        },
        400
      );
    }
    return c.json(
      {
        success: true,
        connection,
      },
      200
    );
  } catch (error) {
    return c.json({ message: "Internal server error" }, 500);
  }
};

export const newConnection = async (c) => {
  try {
    const { senderId, receiverId } = await c.req.json();
    const connection = await Connection.create({
      sender: senderId,
      receiver: receiverId,
    });
    if (!connection) {
      return c.json({ message: "Connection not created", success: false }, 400);
    }

    const sender = await User.findById(senderId);
    if (!sender) {
      return c.json({ message: "User not found" }, 404);
    }
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return c.json({ message: "User not found" }, 404);
    }
    sender.connections.push(connection._id);
    receiver.connections.push(connection._id);
    await sender.save();
    await receiver.save();

    return c.json(
      {
        success: true,
        connection,
      },
      201
    );
  } catch (e) {
    console.log(e);
    return c.json({ message: "Internal server error" }, 500);
  }
};

export const acceptConnection = async (c) => {
  try {
    const id = c.req.param("id");
    const connection = await Connection.findByIdAndUpdate(
      {
        _id: id,
      },
      {
        status: "accepted",
      },
      {
        new: true,
      }
    );

    if (!connection) {
      return c.json({ message: "Connection not found" }, 404);
    }
    return c.json(
      {
        success: true,
        message: "Connection status updated",
        connection,
      },
      200
    );
  } catch (e) {
    console.log(e);
    return c.json({ message: "Internal server error" }, 500);
  }
};

export const updateConnection = async (c) => {
  const id = c.req.param("id");
  const { status } = await c.req.json();

  try {
    if (status === "accepted") {
      return acceptConnection(c);
    } else if (status === "rejected") {
      const deleteConnection = await Connection.findByIdAndDelete(id);
      if (!deleteConnection) {
        return c.json({ message: "Connection not found" }, 404);
      }
      return c.json(
        {
          success: true,
          message: "Connection rejected",
        },
        200
      );
    }
  } catch (e) {
    return c.json({ message: "Internal server error" }, 500);
  }
};

module.exports = {
  newConnection,
  updateConnection,
  acceptConnection,
  getConnectionById,
};
