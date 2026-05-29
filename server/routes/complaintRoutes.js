const express = require("express");

const router = express.Router();

const authMiddleware =
  require("../middleware/authMiddleware");

const roleMiddleware =
  require("../middleware/roleMiddleware");

const upload =
  require("../middleware/upload");

const {
  getMyComplaints,
  createComplaint,
  getComplaints,
  updateComplaintStatus,
  assignWorker,
  getWorkerComplaints,
  completeWork,
} = require(
  "../controllers/complaintController"
);

// =======================
// CREATE COMPLAINT
// =======================

router.post(
  "/create",
  authMiddleware,
  upload.single("image"),
  createComplaint
);

// =======================
// USER - MY COMPLAINTS
// =======================

router.get(
  "/my",
  authMiddleware,
  getMyComplaints
);

// =======================
// ADMIN - GET ALL
// =======================

router.get(
  "/all",
  authMiddleware,
  roleMiddleware("admin"),
  getComplaints
);

// =======================
// ADMIN - ASSIGN WORKER
// =======================

router.put(
  "/assign/:id",
  authMiddleware,
  roleMiddleware("admin"),
  assignWorker
);

// =======================
// WORKER - GET ASSIGNED
// =======================

router.get(
  "/worker",
  authMiddleware,
  roleMiddleware("worker"),
  getWorkerComplaints
);

// =======================
// ADMIN - UPDATE STATUS
// =======================

router.put(
  "/update/:id",
  authMiddleware,
  roleMiddleware("admin"),
  updateComplaintStatus
);

// =======================
// WORKER - COMPLETE WORK
// =======================

router.put(
  "/complete/:id",
  authMiddleware,
  roleMiddleware("worker"),
  upload.single("workImage"),
  completeWork
);

module.exports = router;