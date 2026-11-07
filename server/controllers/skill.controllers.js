import UserModel from "../models/user.Model.js";
import SkillModel from "./../models/skill.Model.js";
import uploadOnCloudinary from "../utils/uploadOnCloudinary.js";

export const addSkill = async (req, res) => {
  try {
    const userId = req.userId;
    const skillName = req.body.skillName?.trim();
    const skillSection = req.body.skillSection;
    const user = await UserModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    if (!skillName || !skillSection) {
      return res.status(400).json({
        success: false,
        message: "Skill name and category are required",
      });
    }
    const validSections = SkillModel.schema.path("skillSection").enumValues;
    if (!validSections.includes(skillSection)) {
      return res.status(400).json({
        success: false,
        message: "Please choose a valid skill category",
      });
    }
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }
    let skillImage;
    try {
      skillImage = await uploadOnCloudinary(
        req.file.buffer,
        "portfolio_profiles",
      );
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: "Error in uploading image" });
    }

    const skill = await SkillModel.create({
      skillName,
      skillSection,
      skillImage,
      userId,
    });
    return res
      .status(201)
      .json({ success: true, message: "Skill added successfully", skill });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const updateSkill = async (req, res) => {
  try {
    const userId = req.userId;
    const { skillId } = req.params;
    const skillName = req.body.skillName?.trim();
    const skillSection = req.body.skillSection;
    const user = await UserModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    if (!skillName || !skillSection) {
      return res.status(400).json({
        success: false,
        message: "Skill name and category are required",
      });
    }
    const validSections = SkillModel.schema.path("skillSection").enumValues;
    if (!validSections.includes(skillSection)) {
      return res.status(400).json({
        success: false,
        message: "Please choose a valid skill category",
      });
    }

    const skill = await SkillModel.findOne({ _id: skillId, userId });
    if (!skill) {
      return res
        .status(404)
        .json({ success: false, message: "Skill not found" });
    }

    if (req.file) {
      try {
        skill.skillImage = await uploadOnCloudinary(
          req.file.buffer,
          "portfolio_profiles",
        );
      } catch (error) {
        return res
          .status(500)
          .json({ success: false, message: "Error in uploading image" });
      }
    }

    skill.skillName = skillName;
    skill.skillSection = skillSection;
    await skill.save();

    return res
      .status(200)
      .json({ success: true, message: "Skill updated successfully", skill });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const getAllSkillByAdmin = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await UserModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const skills = await SkillModel.find({ userId }).sort({ createdAt: -1 });
    return res
      .status(200)
      .json({ success: true, message: "Skills found", skills });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const getPublicSkills = async (_req, res) => {
  try {
    const portfolioOwner = await UserModel.findOne({ role: "admin" }).select(
      "_id",
    );
    if (!portfolioOwner) {
      return res
        .status(404)
        .json({ success: false, message: "Portfolio owner not found" });
    }

    const skills = await SkillModel.find({ userId: portfolioOwner._id })
      .select("skillName skillImage skillSection")
      .sort({ createdAt: -1 });
    return res.status(200).json({ success: true, skills });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
