import eduModel from "../models/education.Model.js";
import UserModel from "./../models/user.Model.js";

// Add Education
// http://localhost:3000/api/education/add-edu
// https://kayesbackend.vercel.app/api/education/add-edu
export const addEduction = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await UserModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const {
      institution,
      degree,
      fieldOfStudy,
      startDate,
      endDate,
      isCurrentlyStudying,
      grade,
    } = req.body;
    if (!institution || !degree || !startDate) {
      return res.status(400).json("All field are required!");
    }
    const education = await eduModel.create({
      userId,
      institution,
      degree,
      fieldOfStudy,
      startDate,
      endDate,
      isCurrentlyStudying,
      grade,
    });
    return res.status(201).json({
      success: true,
      message: "Education is created successfully",
      education,
    });
  } catch (error) {
    console.error(error, "Error in Add Education");
    return res.status(500).json("Internal Server Error!");
  }
};

// Delete Education
// http://localhost:3000/api/education/delete-edu/:eduId
// https://kayesbackend.vercel.app/api/education/delete-edu/:eduId
export const deleteEduction = async (req, res) => {
  try {
    const userId = req.userId;
    const educationId = req.params.eduId;
    console.log(educationId);
    const user = await UserModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const education = await eduModel.findOneAndDelete({
      _id: educationId,
      userId,
    });
    return res.status(201).json({
      success: true,
      message: "Education is Deleted successfully",
      education,
    });
  } catch (error) {
    console.error(error, "Error in Delete Education");
    return res.status(500).json("Internal Server Error!");
  }
};

// Get Admin Education
// http://localhost:3000/api/education/get-admin-edu
// https://kayesbackend.vercel.app/api/education/get-admin-edu
export const getAdminEduction = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await UserModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const getAdminEducation = await eduModel
      .find({ userId })
      .sort({ startDate: -1 });
    return res.status(200).json({
      success: true,
      message: "Education fetched successfully",
      getAdminEducation,
    });
  } catch (error) {
    console.error(error, "Error in Getting Admin Education");
    return res.status(500).json("Internal Server Error!");
  }
};
