import mongoose from "mongoose";
import ReviewModel from "../models/review.Model.js";

export const addReview = async (req, res) => {
  try {
    const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";
    const content =
      typeof req.body?.content === "string" ? req.body.content.trim() : "";
    const image =
      typeof req.body?.image === "string" ? req.body.image.trim() : "";

    if (!name || !content || name.length > 100 || content.length > 2000) {
      return res.status(400).json({
        success: false,
        message:
          "Name and testimonial are required; name must be 100 characters or fewer and testimonial 2,000 characters or fewer.",
      });
    }

    const review = await ReviewModel.create({
      name,
      content,
      ...(image ? { image } : {}),
    });
    return res
      .status(201)
      .json({ success: true, message: "Review added successfully", review });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const getAllReview = async (_req, res) => {
  try {
    const reviews = await ReviewModel.find().sort({ createdAt: -1 });
    return res
      .status(200)
      .json({ success: true, message: "Reviews found", reviews });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { revId } = req.params;
    if (!mongoose.isValidObjectId(revId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid review ID" });
    }

    const review = await ReviewModel.findByIdAndDelete(revId);
    if (!review) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
