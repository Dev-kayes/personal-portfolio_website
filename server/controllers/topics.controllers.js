import mongoose from "mongoose";
import UserModel from "../models/user.Model.js";
import topicModel from "../models/topic.Model.js";
import uploadOnCloudinary from "../utils/uploadOnCloudinary.js";

export const addTopic = async (req, res) => {
  try {
    const { topic, description, status } = req.body;
    if (
      typeof topic !== "string" ||
      !topic.trim() ||
      typeof description !== "string" ||
      !description.trim() ||
      description.trim().length > 300
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Topic and description are required; description must be 300 characters or fewer.",
      });
    }

    const validStatuses = topicModel.schema.path("status").enumValues;
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Please choose a valid topic status.",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a topic image.",
      });
    }

    const user = await UserModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    let image;
    try {
      image = await uploadOnCloudinary(req.file.buffer, "portfolio_topics");
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error uploading topic image.",
      });
    }

    const newTopic = await topicModel.create({
      userId: req.userId,
      topic: topic.trim(),
      description: description.trim(),
      status,
      image,
    });

    return res.status(201).json({
      success: true,
      message: "Topic added successfully.",
      topic: newTopic,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

export const getAdminTopic = async (req, res) => {
  try {
    const getAdminTopic = await topicModel
      .find({ userId: req.userId })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      getAdminTopic,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

export const deleteTopic = async (req, res) => {
  try {
    const { topicId } = req.params;
    if (!mongoose.isValidObjectId(topicId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid topic ID.",
      });
    }

    const user = await UserModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const topic = await topicModel.findOneAndDelete({
      _id: topicId,
      userId: req.userId,
    });
    if (!topic) {
      return res.status(404).json({
        success: false,
        message: "Topic not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Topic deleted successfully.",
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid topic ID.",
      });
    }
    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

export const getPublicTopics = async (_req, res) => {
  try {
    const portfolioOwner = await UserModel.findOne({ role: "admin" }).select(
      "_id",
    );

    if (!portfolioOwner) {
      return res.status(404).json({
        success: false,
        message: "Portfolio owner not found",
      });
    }

    const topics = await topicModel
      .find({ userId: portfolioOwner._id })
      .select("topic description status image")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      topics,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
