const mongoose = require("mongoose");

const Message = new mongoose.Schema(
  {
    message: {
      text: String,
      image: String,
      file: String,
    },
    users: Array,
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    groupName: {
      type: String,
      default: "",
    },
    group: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", Message);
