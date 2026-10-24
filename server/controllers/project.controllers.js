import UserModel from "../models/user.Model.js";
import uploadOnCloudinary from "../utils/uploadOnCloudinary.js";
import projectModel from "./../models/project.Model.js";

// http://localhost:3000/api/projects/add
// https://kayesbackend.vercel.app/api/projects/add
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
    console.error(error, "error in add Project");
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
// http://localhost:3000/api/projects/delete-projects
// https://kayesbackend.vercel.app/api/projects/delete-projects/:projectId
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
    const project = await projectModel.findByIdAndDelete({ _id: projectId });
    if (!project) {
      res.status(404).json({ success: false, message: "Project Not Found!" });
    }
    res
      .status(200)
      .json({ success: true, message: "Project Deleted Successfully" });
  } catch (error) {
    console.error(error, "error in deleteProject");
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// http://localhost:3000/api/projects/get-admin-projects
// https://kayesbackend.vercel.app/api/projects/get-admin-projects
export const getAdminProject = async (req, res) => {
  try {
    const userId = req.userId;
    console.log(userId);
    const user = await UserModel.findById(userId);
    console.log(user);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const projects = await projectModel.find({ userId });
    console.log(projects);
    return res.status(200).json({ success: true, projects });
  } catch (error) {
    console.error(error, "error in getAdminProject");
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
