var express = require("express");
var router = express.Router();

const userRouter = require("./user.api");
const taskRouter = require("./task.api");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.status(200).send("Welcome to Express & Mongo project");
});

router.use("/user", userRouter);
router.use("/task", taskRouter);

module.exports = router;
