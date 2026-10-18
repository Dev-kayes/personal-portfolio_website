import dotenv from "dotenv";
dotenv.config();
import express from "express";
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

// Auth:
// http://localhost:3000/api/auth
app.use("/api/auth", authRouter);
// User:
// http://localhost:3000/api/user
app.use("/api/user", userRoute);

if (process.env.NODE_ENV === "development") {
  app.listen(process.env.PORT || 9000, () => {
    console.log("Server is running");
  });
}

export default app;
