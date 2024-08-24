const Connection = require("../models/connectionModel.js");
const User = require("../models/userModel.js");

const getConnectionById = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await Connection.findById(id).populate([
      {
        path: "sender",
        select: "username email",
      },
      { path: "receiver", select: "username email" },
    ]);
    if (!connection) {
      return res.status(400).json({
        success: false,
        message: "Connection not found",
      });
    }
    return res.status(200).json({
      success: true,
      connection,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const newConnection = async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;
    const connection = await Connection.create({
      sender: senderId,
      receiver: receiverId,
    });
    if (!connection) {
      return res
        .status(400)
        .json({ message: "Connection not created", success: false });
    }

    const sender = await User.findById(senderId);
    if (!sender) {
      return res.status(404).json({ message: "User not found" });
    }
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: "User not found" });
    }
    sender.connections.push(connection._id);
    receiver.connections.push(connection._id);
    await sender.save();
    await receiver.save();

    return res.status(201).json({
      success: true,
      connection,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const acceptConnection = async (req, res) => {
  const { id } = req.params;

  try {
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
      return res.status(404).json({ message: "Connection not found" });
    }
    return res.status(200).json({
      success: true,
      message: "Connection status updated",
      connection,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateConnection = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    if (status === "accepted") {
      return acceptConnection(req, res);
    } else if (status === "rejected") {
      const deleteConnection = await Connection.findByIdAndDelete(id);
      if (!deleteConnection) {
        return res.status(404).json({ message: "Connection not found" });
      }
      return res.status(200).json({
        success: true,
        message: "Connection rejected",
      });
    }
  } catch (e) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  newConnection,
  updateConnection,
  acceptConnection,
  getConnectionById,
};
