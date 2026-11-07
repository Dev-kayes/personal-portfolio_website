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
import certRoute from "./routes/cert.routes.js";
import reviewRoute from "./routes/review.routes.js";
import topicRoute from "./routes/topic.routes.js";
import contactRoute from "./routes/contact.routes.js";

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

app.use("/api/skill", skillRoute);

app.use("/api/projects", projectRoute);

app.use("/api/experience", experienceRoute);

app.use("/api/cert", certRoute);

app.use("/api/topic", topicRoute);

app.use("/api/rev", reviewRoute);

app.use("/api/contact", contactRoute);

if (process.env.NODE_ENV === "development") {
  app.listen(process.env.PORT || 9000, () => {});
}

export default app;
