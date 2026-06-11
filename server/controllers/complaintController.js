
const prisma = require("../prismaClient");

// =========================
// CREATE COMPLAINT
// =========================

const createComplaint = async (
  req,
  res
) => {

  try {

    const {
      title,
      description,
      latitude,
      longitude,
    } = req.body;

    let priority = "Low";

    const text =
      (
        title +
        " " +
        description
      ).toLowerCase();

    if (
      text.includes("fire") ||
      text.includes("accident") ||
      text.includes("death")
    ) {

      priority = "Critical";

    } else if (
      text.includes("water") ||
      text.includes("road")
    ) {

      priority = "Medium";
    }

    const complaint =
      await prisma.complaint.create({

        data: {

          title,

          description,
          timeline:
  "Complaint Created",

          latitude: latitude
            ? parseFloat(latitude)
            : null,

          longitude: longitude
            ? parseFloat(longitude)
            : null,

          priority,

          image: req.file
            ? req.file.filename
            : null,

          userId: req.user.id,
        },
      });

    res.json(complaint);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message:
        "Failed to create complaint",
    });
  }
};

// =========================
// GET ALL COMPLAINTS
// ADMIN
// =========================

const getComplaints =
  async (req, res) => {

    try {

      const complaints =
        await prisma.complaint.findMany({

          include: {

            user: true,

            assignedWorker: true,
          },

          orderBy: {
            createdAt: "desc",
          },
        });

      res.status(200).json(
        complaints
      );

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message:
          "Server Error",
      });
    }
  };

// =========================
// GET USER COMPLAINTS
// =========================

const getMyComplaints =
  async (req, res) => {
    try {
      const complaints =
        await prisma.complaint.findMany({
          where: {
            userId:
              req.user.id,
          },

          include: {
            assignedWorker: true,
          },

          orderBy: {
            createdAt: "desc",
          },
        });

      res.json(
        complaints
      );
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message:
          "Failed to fetch complaints",
      });
    }
  };
// =========================
// WORKER DASHBOARD
// =========================

const getWorkerComplaints =
  async (req, res) => {

    try {

      if (
        req.user.role !==
        "worker"
      ) {

        return res.status(403).json({
          message:
            "Access denied",
        });
      }

      const complaints =
        await prisma.complaint.findMany({

          where: {

            assignedWorkerId:
              Number(req.user.id),
          },

          include: {
            user: true,
          },

          orderBy: {
            createdAt: "desc",
          },
        });

      res.json(complaints);

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message:
          "Failed to fetch worker complaints",
      });
    }
  };

// =========================
// ASSIGN WORKER
// =========================

const assignWorker = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    const { workerId } = req.body;

    const complaint =
      await prisma.complaint.update({
        where: {
          id: Number(req.params.id),
        },

        data: {
          assignedWorkerId: Number(workerId),

          status: "In Progress",

          timeline:
            "Complaint Created → Worker Assigned",
        },
      });

    res.json({
      message:
        "Worker assigned successfully",

      complaint,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message:
        "Failed to assign worker",
    });
  }
};
// =========================
// UPDATE STATUS
// =========================
// =========================
// UPDATE STATUS
// =========================

const updateComplaintStatus =
  async (req, res) => {
    try {
      const {
        status,
        rejectionReason,
      } = req.body;

      const complaint =
        await prisma.complaint.findUnique({
          where: {
            id: Number(
              req.params.id
            ),
          },
        });

      if (!complaint) {
        return res.status(404).json({
          message:
            "Complaint not found",
        });
      }

      if (
        complaint.status ===
          "Resolved" &&
        status !== "Resolved"
      ) {
        return res.status(400).json({
          message:
            "Complaint already resolved",
        });
      }

      // ADMIN APPROVES

      if (
        status ===
        "Resolved"
      ) {
        if (
          complaint.status !==
          "Work Submitted"
        ) {
          return res.status(400).json({
            message:
              "Worker has not submitted work yet",
          });
        }

        const updatedComplaint =
          await prisma.complaint.update({
            where: {
              id: Number(
                req.params.id
              ),
            },

            data: {
              status:
                "Resolved",

              timeline:
                "Complaint Created → Worker Assigned → Work Submitted → Resolved",
            },
          });

        return res.json(
          updatedComplaint
        );
      }

      // ADMIN REJECTS

      if (
        status ===
        "Rejected"
      ) {
        if (
          complaint.status !==
          "Work Submitted"
        ) {
          return res.status(400).json({
            message:
              "No submitted work to reject",
          });
        }

        const updatedComplaint =
          await prisma.complaint.update({
            where: {
              id: Number(
                req.params.id
              ),
            },

            data: {
              status:
                "Rejected",

              rejectionReason,

              timeline:
                "Complaint Created → Worker Assigned → Work Submitted → Rejected",
            },
          });

        return res.json(
          updatedComplaint
        );
      }

      const updatedComplaint =
        await prisma.complaint.update({
          where: {
            id: Number(
              req.params.id
            ),
          },

          data: {
            status,
          },
        });

      res.json(
        updatedComplaint
      );
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message:
          "Server Error",
      });
    }
  };
// =========================
// COMPLETE WORK
// =========================

const completeWork = async (
  req,
  res
) => {
  try {
    const complaint =
      await prisma.complaint.findUnique({
        where: {
          id: Number(
            req.params.id
          ),
        },
      });

    if (!complaint) {
      return res.status(404).json({
        message:
          "Complaint not found",
      });
    }

    if (
      !complaint.assignedWorkerId
    ) {
      return res.status(400).json({
        message:
          "Complaint not assigned yet",
      });
    }

    if (
      complaint.status ===
      "Resolved"
    ) {
      return res.status(400).json({
        message:
          "Already resolved",
      });
    }

    const updatedComplaint =
      await prisma.complaint.update({
        where: {
          id: Number(
            req.params.id
          ),
        },

        data: {
          status:
            "Work Submitted",

          timeline:
            "Complaint Created → Worker Assigned → Work Submitted",

          workNote:
            req.body.workNote,

          workImage:
            req.file
              ? req.file.filename
              : complaint.workImage,

          rejectionReason:
            null,
        },
      });

    res.json({
      message:
        "Work submitted successfully",

      updatedComplaint,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message:
        "Failed to complete work",
    });
  }
};
  

module.exports = {

  createComplaint,

  getComplaints,

  updateComplaintStatus,

  assignWorker,

  getWorkerComplaints,

  completeWork,

  getMyComplaints,
};
