const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const {
  getTasks,
  getTaskById,
  createTask,
  updateStatus,
  deleteTask,
  assignTask,
  unassignTask,
} = require("../controllers/task.controller");

/**
 * @route GET api/Task
 * @description get list of Tasks
 * @access public
 */
router.get("/", getTasks);

/**
 * @route GET api/Task
 * @description get a task by id
 * @access public
 */
router.get("/:id", getTaskById);

/**
 * @route POST api/Task
 * @description create a Task
 * @access public
 */
router.post(
  "/",
  body("name").notEmpty(),
  body("description").notEmpty(),
  createTask
);

/**
 * @route PUT api/Task
 * @description update reference to a Task
 * @access public
 */
router.put("/:id", updateStatus);

/**
 * @route PUT api/Task
 * @description assign user to a Task
 * @access public
 */
router.put("/assign/:id", assignTask);

/**
 * @route PUT api/Task
 * @description unassign user to a Task
 * @access public
 */
router.put("/unassign/:id", unassignTask);

/**
 * @route Delete api/Task
 * @description delete a Task
 * @access public
 */
router.delete("/:id", deleteTask);

module.exports = router;
