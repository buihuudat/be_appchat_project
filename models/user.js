const mongoose = require("mongoose");

const UserModel = new mongoose.Schema(
  {
    fullname: String,
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: String,
    role: {
      type: String,
      default: "user",
    },
    avatar: String,
    active: {
      type: Boolean,
      default: false,
    },
    code: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserModel);
