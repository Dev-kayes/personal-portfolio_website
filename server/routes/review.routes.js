import express from "express";

import upload from "./../middleWare/multer.js";
import { isAuth } from "./../middleWare/isAuth.js";
import {
  addReview,
  deleteReview,
  getAllReview,
} from "../controllers/review.controllers.js";

const reviewRoute = express.Router();

reviewRoute.post("/add-rev", isAuth, upload.single("rev-Image"), addReview);

reviewRoute.get("/get-all-rev", getAllReview);

reviewRoute.delete("/del-rev/:revId", isAuth, deleteReview);

export default reviewRoute;
