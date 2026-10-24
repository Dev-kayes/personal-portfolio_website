import UserModel from "../models/user.Model.js";
import SkillModel from "./../models/skill.Model.js";
import uploadOnCloudinary from "../utils/uploadOnCloudinary.js";

// http://localhost:3000/api/skill/add-skill
// https://kayesbackend.vercel.app/api/skill/add-skill
export const addSkill = async (req, res) => {
  try {
    const userId = req.userId;
    const skillLevel = parseInt(req.body.skillLevel);
    const skillName = req.body.skillName;
    let skillImage;
    const user = await UserModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    if (!skillName || !skillLevel) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }
    try {
      skillImage = await uploadOnCloudinary(
        req.file.buffer,
        "portfolio_profiles",
      );
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: "error in uploading image" });
    }

    const skill = await SkillModel.create({
      skillName,
      skillLevel,
      skillImage,
      userId,
    });
    res
      .status(200)
      .json({ success: true, message: "Skill added successfully", skill });
  } catch (error) {
    console.error(error, "error in add skill");
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// http://localhost:3000/api/skill/delete-skill
// https://kayesbackend.vercel.app/api/skill/delete-skill/:id
export const deleteSkill = async (req, res) => {
  try {
    const userId = req.userId;
    const skillId = req.params.id;
    const user = await UserModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const skill = await SkillModel.findByIdAndDelete({ _id: skillId });
    if (!skill) {
      res
        .status(404)
        .json({ success: false, message: "Skill not found", skill });
    }
    res
      .status(200)
      .json({ success: true, message: "Skill deleted successfully", skill });
  } catch (error) {
    console.error(error, "error in delete skill");
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// http://localhost:3000/api/skill/get-all-skill
// https://kayesbackend.vercel.app/api/skill/get-all-skill
export const getAllSkillByAdmin = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await UserModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const skills = await SkillModel.find({ userId });
    if (!skills) {
      return res
        .status(404)
        .json({ success: false, message: "Skill not found", skills });
    }
    res.status(200).json({ success: true, message: "Skills found", skills });
  } catch (error) {
    console.error(error, "error in delete skill");
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
