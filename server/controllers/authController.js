const prisma = require("../prismaClient");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
  data: {
    name,
    email,
    password: hashedPassword,
    role: role.toLowerCase().trim(), // 🔥 FIX
  },
});

    res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
  {
    id: user.id,
    role: user.role.toLowerCase().trim(), // 🔥 FIX
  },
  process.env.JWT_SECRET,
  { expiresIn: "7d" }
);

    res.status(200).json({
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};
const getWorkers = async (
  req,
  res
) => {

  try {

    const workers =
      await prisma.user.findMany({

        where: {
          role: "worker",
        },

        select: {
          id: true,
          name: true,
          email: true,
        },
      });

    res.json(workers);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message:
        "Failed to fetch workers",
    });
  }
};
module.exports = {
  register,
  login,
  getWorkers,
};