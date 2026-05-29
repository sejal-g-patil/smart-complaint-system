const express = require("express");

const router = express.Router();

const authMiddleware =
  require("../middleware/authMiddleware");

const roleMiddleware =
  require("../middleware/roleMiddleware");

const {
  register,
  login,
  getWorkers
} = require("../controllers/authController");

router.post("/register", register);

router.post("/login", login);

router.get(
  "/workers",
  authMiddleware,
  roleMiddleware("admin"),
  getWorkers
);

module.exports = router;