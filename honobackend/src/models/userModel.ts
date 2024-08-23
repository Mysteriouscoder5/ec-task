import { Document, Model, model, Schema, Types } from "mongoose";
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: number;
  profileImage: string;
  coverImage: string;
  headline: string;
  connections: any[];
  location: { country: string; state: string; city: string };
  education: any[];
  skills: any[];
}

interface IUserMethods {
  generateAuthToken(): string;
  comparePassword(): boolean;
}
type UserModel = Model<IUser, {}, IUserMethods>;
const userSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    username: {
      type: String,
      trim: true,
      required: [true, "PLEASE ENTER YOUR NAME"],
      default: "user",
      minlength: [2, "NAME SHOULD HAVE MORE THAN 2 CHARACTERS "],
    },

    email: {
      type: String,
      trim: true,
      validate: [validator.isEmail, "PLEASE ENTER A VALID EMAIL"],
      index: { unique: true, sparse: true },
    },

    phone: {
      type: Number,
      trim: true,
      minlength: [10, "CONTACT NUMBER SHOULD BE MINIMUM 10 DIGITS"],
      index: { unique: true, sparse: true },
    },

    password: {
      type: String,
      // select: false,
    },

    confirmPassword: {
      type: String,
      // select: false,
    },

    profileImage: {
      type: String,
      default: "placeholderURI",
    },

    coverImage: {
      type: String,
      default: "",
    },

    headline: {
      type: String,
      default: "",
    },

    connections: [
      {
        connectionId: {
          type: Types.ObjectId,
          ref: "Connection",
        },
      },
    ],
    location: {
      country: {
        type: String,
      },
      state: {
        type: String,
      },
      city: {
        type: String,
      },
    },

    education: [
      {
        institute: {
          type: String,
        },
        degree: {
          type: String,
        },
      },
    ],

    skills: [
      {
        name: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

userSchema.method("generateAuthToken", async function () {
  try {
    const token = await jwt.sign(
      { _id: this._id?.toString() },
      process.env.JWT_SECRET
    );
    return token;
  } catch (e) {
    console.log(e);
  }
});

userSchema.method("comparePassword", async function (password: string) {
  const checkPass = await bcrypt.compare(password, this.password);
  return checkPass;
});

// userSchema.methods.generateAuthToken = async function () {
//   try {
//     const token = await jwt.sign(
//       { _id: this._id.toString() },
//       process.env.JWT_SECRET
//     );
//     return token;
//   } catch (e) {
//     console.log(e);
//   }
// };

// userSchema.methods.comparePassword = async function (password: string) {
//   const checkPass = await bcrypt.compare(password, this.password);
//   return checkPass;
// };

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

const User = model<IUser>("User", userSchema);

export default User;
