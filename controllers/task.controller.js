const mongoose = require("mongoose");
const Task = require("../models/Task");
const User = require("../models/User");
const { sendResponse, AppError } = require("../helpers/utils.js");
const { ObjectId } = require("mongodb");
const { validationResult } = require("express-validator");

const taskController = {};

taskController.createTask = async (req, res, next) => {
  try {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      throw new AppError(
        400,
        "Bad Request",
        "Missing require info check by express-validator"
      );
    }
    const { name, description, assignee, status } = req.body;
    // if (!name || !description || !status)
    //   throw new AppError(401, "Bad Request", "Missing require info");

    let newTask = await Task.create({
      name,
      description,
      status,
      assignee,
    });

    sendResponse(
      res,
      200,
      true,
      { data: newTask },
      null,
      "Create task success"
    );
  } catch (err) {
    next(err);
  }
};

taskController.getTasks = async (req, res, next) => {
  const filter = req.query;

  try {
    const listOfFound = await Task.find({
      isDeleted: false,
      ...filter,
    }).populate("assignee");

    sendResponse(
      res,
      200,
      true,
      { data: listOfFound },
      null,
      "Found list of Tasks success"
    );
  } catch (error) {
    next(error);
  }
};

taskController.deleteTask = async (req, res, next) => {
  const targetId = req.params.id;
  try {
    if (!mongoose.isValidObjectId(targetId))
      throw new AppError(404, "Bad Request", "Invalid Task Id");
    const result = await Task.findByIdAndUpdate(
      targetId,
      { isDeleted: true },
      { new: true }
    );

    sendResponse(res, 200, true, { data: result }, null, "Delete task success");
  } catch (error) {
    next(error);
  }
};

taskController.getTaskById = async (req, res, next) => {
  const taskId = req.params.id;
  try {
    if (!mongoose.isValidObjectId(taskId))
      throw new AppError(404, "Bad Request", "Invalid Task Id");

    const foundTask = await Task.findById(taskId).populate("assignee");

    if (!foundTask || foundTask.isDeleted)
      throw new AppError(404, "Task not found", "Search error");

    sendResponse(res, 200, true, { data: foundTask }, null, "Task found");
  } catch (error) {
    next(error);
  }
};

taskController.updateStatus = async (req, res, next) => {
  const status = req.body.status;
  const taskId = req.params.id;

  try {
    if (!mongoose.isValidObjectId(taskId))
      throw new AppError(404, "Bad Request", "Invalid Task Id");

    let updateTask = await Task.findById(taskId);

    if (!updateTask || updateTask.isDeleted)
      throw new AppError(404, "Task not found", "Search error");

    if (updateTask.status === "done" && status !== "archive")
      throw new AppError(
        400,
        "Invalid status update",
        "Cannot update task status from 'done' to anything other than 'archive'!"
      );

    const updateResult = await Task.findByIdAndUpdate(
      taskId,
      { status: status },
      { new: true }
    );

    sendResponse(
      res,
      200,
      true,
      { data: updateResult },
      null,
      "Update Task Success"
    );
  } catch (error) {
    next(error);
  }
};

taskController.assignTask = async (req, res, next) => {
  try {
    const taskId = req.params.id;
    const { userId } = req.body;

    if (!mongoose.isValidObjectId(taskId))
      throw new AppError(400, "Bad Request", "Invalid task id");
    if (!mongoose.isValidObjectId(userId))
      throw new AppError(400, "Bad Request", "Invalid user id");

    const task = await Task.findOne({ _id: taskId });
    const userAssignTask = await User.findOne({ _id: userId });

    if (!task) throw new AppError(404, "Bad Request", "Task not found");
    if (!userAssignTask)
      throw new AppError(404, "Bad Request", "Assignee not found");

    task.assignee = new ObjectId(userId);
    await task.save();
    userAssignTask.tasks.push(new ObjectId(taskId));
    await userAssignTask.save();

    sendResponse(res, 200, true, { data: task }, null, "Task assign success");
  } catch (error) {
    next(error);
  }
};

taskController.unassignTask = async (req, res, next) => {
  try {
    const taskId = req.params.id;

    if (!mongoose.isValidObjectId(taskId))
      throw new AppError(400, "Bad Request", "Invalid task id");
    const task = await Task.findOne({ _id: taskId });

    if (!task) throw new AppError(404, "Bad Request", "Task not found");

    const assignee = new ObjectId(task.assignee).toString();
    const user = await User.findOne({ _id: assignee });

    if (!user)
      throw new AppError(
        404,
        "Bad Request",
        "User not found in when unassign task"
      );

    await User.updateOne({ _id: assignee }, { $pull: { tasks: taskId } });
    await Task.updateOne({ _id: taskId }, { $unset: { assignee: "" } });

    sendResponse(res, 200, true, { data: task }, null, "Task unassign success");
  } catch (error) {
    next(error);
  }
};

module.exports = taskController;
