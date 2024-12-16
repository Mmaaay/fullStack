import bcrypt from "bcryptjs";
import createSecretToken from "../middleware/authMiddleWare.js";
import {
  createUser,
  findUserByEmail,
  findUserById,
} from "../queries/userQueries.js";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  console.log(req.body);
  const { username, email, password } = req.body;

  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await createUser({
      username,
      email,
      password: hashedPassword,
    });

    const token = createSecretToken(user._id);

    res.status(201).json({
      message: "User registered successfully",
      user: {
        username: user.username,
        email: user.email,
        password: user.password,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = createSecretToken(user._id);
    console.log(user);

    res.status(200).json({
      message: "User logged in successfully",
      user: {
        username: user.username,
        email: user.email,
        password: user.password,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logoutUser = async (req, res) => {
  console.log(req.user);
  if (!req.user) {
    return res.status(400).json({ message: "User not logged in" });
  }

  user = await findUserById(req.user);

  if (createSecretToken(user._id) !== req.cookies.token) {
    return res.status(400).json({ message: "Invalid token" });
  }

  res.clearCookie("token");
  res.status(200).json({ message: "User logged out successfully" });
};

export const validateToken = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await findUserById(decoded.id);

    // Token is valid, return success response
    res.status(200).json({ message: "Token is valid", user: user });
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired token" });
  }
};
