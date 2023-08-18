const mongoose = require("mongoose");

const userScheme = mongoose.Schema({
  name: { type: String, require: true },
  role: { type: String, enum: ["manager", "employee"], default: "employee" },
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
  isDeleted: { type: Boolean, enum: [true, false], default: false },
});

const User = mongoose.model("User", userScheme);

module.exports = User;
