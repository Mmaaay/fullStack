import express from "express";
import dotenv from "dotenv";
import connectDB from "./lib/db.js";
import userRoutes from "./routes/userRouter.js";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:8081", "exp://192.168.1.13:8081"],
  })
); // Example route
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(8081, "0.0.0.0", () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
