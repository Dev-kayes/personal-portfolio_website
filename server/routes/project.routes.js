import express from "express";
import { isAuth } from "../middleWare/isAuth.js";
import upload from "./../middleWare/multer.js";
import {
  addProject,
  deleteProject,
  getAdminProject,
} from "../controllers/project.controllers.js";
const projectRoute = express.Router();

// Add projects:
// http://localhost:3000/api/projects/add
projectRoute.post("/add", isAuth, upload.single("projectImage"), addProject);
// Delete projects:
// http://localhost:3000/api/projects/delete-projects
projectRoute.delete(
  "/delete-projects/:projectId",
  isAuth,
  upload.single("projectImage"),
  deleteProject,
);
//GET-admin-projects:
// http://localhost:3000/api/projects/get-admin-projects
projectRoute.get(
  "/get-admin-projects",
  isAuth,
  upload.single("projectImage"),
  getAdminProject,
);

export default projectRoute;
