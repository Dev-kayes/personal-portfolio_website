import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import connectDb from "./config/mongoDb.connec.js";
import authRouter from "./routes/auth.routes.js";
import userRoute from "./routes/user.routes.js";
import skillRoute from "./routes/skill.routes.js";
import projectRoute from "./routes/project.routes.js";
import experienceRoute from "./routes/experience.routes.js";
import educationRoute from "./routes/education.routes.js";

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
// https://kayesbackend.vercel.app/api/auth
app.use("/api/auth", authRouter);
// User:
// http://localhost:3000/api/user
// https://kayesbackend.vercel.app/api/user
app.use("/api/user", userRoute);

// Skills:
// http://localhost:3000/api/skill
// https://kayesbackend.vercel.app/api/skill
app.use("/api/skill", skillRoute);

// Projects:
// http://localhost:3000/api/projects
// https://kayesbackend.vercel.app/api/projects
app.use("/api/projects", projectRoute);

// Experience:
// http://localhost:3000/api/experience
// https://kayesbackend.vercel.app/api/experience
app.use("/api/experience", experienceRoute);

// Education:
// http://localhost:3000/api/education
// https://kayesbackend.vercel.app/api/education
app.use("/api/education", educationRoute);

//=====================================================================
if (process.env.NODE_ENV === "development") {
  app.listen(process.env.PORT || 9000, () => {
    console.log("Server is running");
  });
}

export default app;
