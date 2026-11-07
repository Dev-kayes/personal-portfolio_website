import express from "express";
import { isAuth } from "../middleWare/isAuth.js";
import upload from "../middleWare/multer.js";
import {
  addSkill,
  getAllSkillByAdmin,
  getPublicSkills,
  updateSkill,
} from "../controllers/skill.controllers.js";
const skillRoute = express.Router();

skillRoute.post("/add-skill", isAuth, upload.single("skillImage"), addSkill);
skillRoute.get("/public", getPublicSkills);
skillRoute.patch(
  "/update-skill/:skillId",
  isAuth,
  upload.single("skillImage"),
  updateSkill,
);

skillRoute.get("/get-all-skill", isAuth, getAllSkillByAdmin);

export default skillRoute;
