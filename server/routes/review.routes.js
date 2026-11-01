import express from "express";

import upload from "./../middleWare/multer.js";
import { isAuth } from "./../middleWare/isAuth.js";
import {
  addReview,
  deleteReview,
  getAllReview,
} from "../controllers/review.controllers.js";

const reviewRoute = express.Router();

// Add-Review:
// http://localhost:3000/api/rev/add-rev
// https://kayesbackend.vercel.app/api/rev/add-rev
reviewRoute.post("/add-rev", upload.single("rev-Image"), addReview);

// Get-All-Review:
// http://localhost:3000/api/rev/get-all-rev
// https://kayesbackend.vercel.app/api/rev/get-all-rev
reviewRoute.get("/get-all-rev", getAllReview);

// Delete-Review:
// http://localhost:3000/api/rev/del-rev/:revId
// https://kayesbackend.vercel.app/api/rev/del-rev/:revId
reviewRoute.delete(
  "/del-rev/:revId",
  upload.single("rev-Image"),
  isAuth,
  deleteReview,
);

export default reviewRoute;
