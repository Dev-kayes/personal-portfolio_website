import mongoose from "mongoose";
import UserModel from "../models/user.Model.js";
import experienceModel from "./../models/experience.Model.js";

// Add experience:
// http://localhost:3000/api/experience/add-exp
// https://kayesbackend.vercel.app/api/experience/add-exp
export const addExperience = async (req, res) => {
  try {
    const userId = req.userId;
    const { company, position, description, startDate, endDate } = req.body;
    const requiredFields = [company, position, description, startDate, endDate];

    if (
      requiredFields.some((field) => typeof field !== "string" || !field.trim())
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required." });
    }

    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);
    if (
      Number.isNaN(parsedStartDate.getTime()) ||
      Number.isNaN(parsedEndDate.getTime())
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide valid dates." });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const experience = await experienceModel.create({
      userId,
      company: company.trim(),
      position: position.trim(),
      description: description.trim(),
      startDate: parsedStartDate,
      endDate: parsedEndDate,
    });

    return res.status(201).json({
      success: true,
      message: "Experience added successfully.",
      experience,
    });
  } catch (error) {
    console.error("Error adding experience:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// Get admin experience:
// http://localhost:3000/api/experience/get-admin-exp
// https://kayesbackend.vercel.app/api/experience/get-admin-exp
export const getAdminExperience = async (req, res) => {
  try {
    const experiences = await experienceModel
      .find({ userId: req.userId })
      .sort({ startDate: -1 });

    return res.status(200).json({
      success: true,
      experiences,
    });
  } catch (error) {
    console.error("Error fetching experiences:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// Delete experience:
// http://localhost:3000/api/experience/del-exp/:expId
// https://kayesbackend.vercel.app/api/experience/del-exp/:expId
export const deleteExperience = async (req, res) => {
  try {
    const { expId } = req.params;

    if (!mongoose.isValidObjectId(expId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid experience ID." });
    }

    const experience = await experienceModel.findOneAndDelete({
      _id: expId,
      userId: req.userId,
    });

    if (!experience) {
      return res
        .status(404)
        .json({ success: false, message: "Experience not found." });
    }

    return res.status(200).json({
      success: true,
      message: "Experience deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting experience:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
