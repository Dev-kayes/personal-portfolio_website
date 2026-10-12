import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import connectDb from "./config/mongoDb.connec.js";
import authRouter from "./routes/auth.routes.js";
import userRoute from "./routes/user.routes.js";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://personal-portfolio-website-ashy-two.vercel.app",
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDb();

app.use("/api/auth", authRouter);
app.use("/api/user", userRoute);

if (process.env.NODE_ENV === "development") {
  app.listen(process.env.PORT || 9000, () => {
    console.log("Server is running");
  });
}

export default app;
