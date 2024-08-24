import { Document, model, ObjectId, Schema, Types } from "mongoose";
const mongoose = require("mongoose");
interface IConnection extends Document {
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
  status: string;
}
const connectionSchema = new Schema<IConnection>(
  {
    sender: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    receiver: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["pending", "accepted"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const Connection = model<IConnection>("Connection", connectionSchema);

export default Connection;
