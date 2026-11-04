import express from "express";
import multer from "multer";
import { addTopic, getAdminTopic } from "../controllers/topics.controllers.js";
import { isAuth } from "../middleWare/isAuth.js";
import upload from "../middleWare/multer.js";

const topicRoute = express.Router();

const uploadTopicImage = (req, res, next) => {
  upload.single("image")(req, res, (error) => {
    if (!error) {
      next();
      return;
    }

    if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "Topic image must be 5 MB or smaller.",
      });
    }

    if (error instanceof multer.MulterError) {
      return res.status(400).json({ success: false, message: error.message });
    }

    console.error("Error processing topic image:", error);
    return res.status(400).json({
      success: false,
      message: "Topic image could not be uploaded.",
    });
  });
};

topicRoute.post("/add-topic", isAuth, uploadTopicImage, addTopic);
topicRoute.get("/get-admin-topic", isAuth, getAdminTopic);

export default topicRoute;
