const { sendResponse, AppError } = require("../helpers/utils.js");
const User = require("../models/User.js");
const mongoose = require("mongoose");
const { validationResult } = require("express-validator");

const userController = {};

userController.getAllUsers = async (req, res, next) => {
  const filter = req.query;
  try {
    const found = await User.find({ isDeleted: false, ...filter }).populate(
      "tasks"
    );

    sendResponse(
      res,
      200,
      true,
      { data: found },
      null,
      "Get all users success"
    );
  } catch (error) {
    next(error);
  }
};

userController.searchUser = async (req, res, next) => {
  const userName = req.params.name;
  try {
    const userData = await User.find({ name: userName }).populate("tasks");

    if (!userData || userData.isDeleted)
      throw new AppError(404, "User not found", "Search error");

    sendResponse(res, 200, true, { data: userData }, null, "User found");
  } catch (error) {
    next(error);
  }
};

userController.createUser = async (req, res, next) => {
  try {
    const result = validationResult(req);
    if (!result.isEmpty())
      throw new AppError(
        401,
        "Bad Request",
        "Create User Error check by express-validator"
      );

    const { name } = req.body;
    const checkName = await User.findOne({ name: name });
    if (checkName)
      throw new AppError(
        401,
        "Bad Reqest",
        "User name invalid, please choose other name"
      );

    const userData = req.body;
    const newUser = await User.create(userData);

    sendResponse(
      res,
      200,
      true,
      { data: newUser },
      null,
      "Create user success"
    );
  } catch (error) {
    next(error);
  }
};

userController.updateUserById = async (req, res, next) => {
  const userId = req.params.id;
  const info = req.body;
  try {
    if (!mongoose.isValidObjectId(userId))
      throw new AppError(404, "bad Request", "Invalid Id");

    const updateUser = await User.findByIdAndUpdate(userId, info, {
      new: true,
    });
    if (!updateUser) throw new AppError(404, "Bad Request", "User not found");

    sendResponse(
      res,
      200,
      true,
      { data: updateUser },
      null,
      "Update user success"
    );
  } catch (error) {
    next(error);
  }
};

userController.deleteUserById = async (req, res, next) => {
  const targetId = req.params.id;

  try {
    if (!mongoose.isValidObjectId(targetId))
      throw new AppError(404, "bad Request", "Invalid Id");

    const result = await User.findByIdAndUpdate(
      targetId,
      { isDeleted: true },
      { new: true }
    );

    if (!result) throw new AppError(404, "Bad Request", "User not found");

    sendResponse(res, 200, true, { data: result }, null, "Delete user success");
  } catch (error) {
    next(error);
  }
};

module.exports = userController;
