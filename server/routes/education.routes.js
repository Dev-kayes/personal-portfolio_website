import express from "express";
import {
  addEduction,
  deleteEduction,
  getAdminEduction,
} from "../controllers/education.controllers.js";
import { isAuth } from "../middleWare/isAuth.js";
const authRouter = express.Router();

// Add Education
// http://localhost:3000/api/education/add-edu
// https://kayesbackend.vercel.app/api/education/add-edu
authRouter.post("/add-edu", isAuth, addEduction);
// Delete Education
// http://localhost:3000/api/education/delete-edu/:eduId
// https://kayesbackend.vercel.app/api/education/delete-edu/:eduId
authRouter.delete("/delete-edu/:eduId", isAuth, deleteEduction);
// Get Admin Education
// http://localhost:3000/api/education/get-admin-edu
// https://kayesbackend.vercel.app/api/education/get-admin-edu
authRouter.get("/get-admin-edu", isAuth, getAdminEduction);

export default authRouter;
