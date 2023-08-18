const express = require("express");
const router = express.Router();
const {
  createUser,
  getAllUsers,
  searchUser,
  updateUserById,
  deleteUserById,
} = require("../controllers/user.controller");

/**
 * Search for an employee by name
 * @route GET api/users
 * @description Get a list of users
 * @access private
 * @allowedQueries: name
 */
router.get("/", getAllUsers);

/**
 * @route GET api/users/:id
 * @description Get user by id
 * @access public
 */
router.get("/:name", searchUser);

/**
 * @route POST api/users
 * @description Create a new user
 * @access private, manager
 * @requiredBody: name
 */
router.post("/", createUser);

/**
 * @route PUT api/User
 * @description update a User
 * @access public
 */
router.put("/:id", updateUserById);

/**
 * @route DELETE api/User
 * @description delete a User
 * @access public
 */
router.delete("/:id", deleteUserById);

module.exports = router;
