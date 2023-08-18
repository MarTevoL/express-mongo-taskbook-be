const mongoose = require("mongoose");

const taskSchema = mongoose.Schema({
  name: { type: String, require: true },
  description: { type: String, require: true },
  status: {
    type: String,
    enum: ["pending", "working", "review", "done", "archive"],
    default: "pending",
    require: true,
  },
  assignee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  isDeleted: { type: Boolean, enum: [true, false], default: false },
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
