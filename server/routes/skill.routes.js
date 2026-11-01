import express from "express";
import { isAuth } from "../middleWare/isAuth.js";
import upload from "../middleWare/multer.js";
import {
  addSkill,
  // deleteSkill,
  getAllSkillByAdmin,
  getPublicSkills,
  updateSkill,
} from "../controllers/skill.controllers.js";
const skillRoute = express.Router();

// add skill:
// http://localhost:3000/api/skill/add-skill
// https://kayesbackend.vercel.app/api/skill/add-skill
skillRoute.post("/add-skill", isAuth, upload.single("skillImage"), addSkill);
skillRoute.get("/public", getPublicSkills);
skillRoute.patch(
  "/update-skill/:skillId",
  isAuth,
  upload.single("skillImage"),
  updateSkill,
);

// delete skill:
// http://localhost:3000/api/skill/delete-skill/:id
// https://kayesbackend.vercel.app/api/skill/delete-skill/:id
// skillRoute.delete(
//   "/delete-skill/:id",
//   isAuth,
//   upload.single("skillImage"),
//   deleteSkill,
// );

// get Admin skill:
// http://localhost:3000/api/skill/get-all-skill
// https://kayesbackend.vercel.app/api/skill/get-all-skill
skillRoute.get("/get-all-skill", isAuth, getAllSkillByAdmin);

export default skillRoute;
