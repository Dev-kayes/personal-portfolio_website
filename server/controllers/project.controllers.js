import UserModel from "../models/user.Model.js";
import uploadOnCloudinary from "../utils/uploadOnCloudinary.js";
import projectModel from "./../models/project.Model.js";

export const addProject = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await UserModel.findById(userId);
    const { title, description, gitHub, live } = req.body;
    if (!title || !description) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required!" });
    }
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    let projectImage;
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Please upload a file" });
    }
    try {
      projectImage = await uploadOnCloudinary(
        req.file.buffer,
        "portfolio_profiles",
      );
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: "Error in uploading Image!" });
    }
    const project = await projectModel.create({
      userId,
      title,
      description,
      projectImage,
      gitHub,
      live,
    });
    return res
      .status(200)
      .json({ success: true, message: "Project Added!", data: project });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
export const deleteProject = async (req, res) => {
  try {
    const userId = req.userId;
    const projectId = req.params.projectId;
    const user = await UserModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const project = await projectModel.findOneAndDelete({
      _id: projectId,
      userId,
    });
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project Not Found!" });
    }
    res
      .status(200)
      .json({ success: true, message: "Project Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getAdminProject = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await UserModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const projects = await projectModel.find({ userId });
    return res.status(200).json({ success: true, projects });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getPublicProjects = async (_req, res) => {
  try {
    const portfolioOwner = await UserModel.findOne({ role: "admin" }).select(
      "_id",
    );
    if (!portfolioOwner) {
      return res
        .status(404)
        .json({ success: false, message: "Portfolio owner not found." });
    }

    const projects = await projectModel
      .find({ userId: portfolioOwner._id })
      .select("title description projectImage gitHub live createdAt")
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, projects });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Unable to load projects." });
  }
};
