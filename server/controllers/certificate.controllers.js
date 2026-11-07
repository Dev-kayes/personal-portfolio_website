import certModel from "../models/cert.Model.js";
import UserModel from "../models/user.Model.js";
import uploadOnCloudinary from "../utils/uploadOnCloudinary.js";

export const addCert = async (req, res) => {
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
      title,
      topicsCovered,
      startDate,
      endDate,
      isCurrentlyStudying,
      link,
    } = req.body;
    const topics = Array.isArray(topicsCovered)
      ? topicsCovered
      : typeof topicsCovered === "string"
        ? topicsCovered.split(",")
        : [];
    const normalizedTopics = topics
      .map((topic) => topic.trim())
      .filter(Boolean);

    if (
      !institution ||
      !title ||
      !normalizedTopics.length ||
      !link ||
      !startDate
    ) {
      return res
        .status(400)
        .json({
          success: false,
          message: "All required fields must be provided.",
        });
    }
    if (!req.file) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Please upload a certificate image.",
        });
    }

    let image;
    try {
      image = await uploadOnCloudinary(
        req.file.buffer,
        "portfolio_certificates",
      );
    } catch (error) {
      return res
        .status(500)
        .json({
          success: false,
          message: "Error uploading certificate image.",
        });
    }

    const cert = await certModel.create({
      userId,
      institution: institution.trim(),
      image,
      title: title.trim(),
      topicsCovered: normalizedTopics,
      startDate,
      endDate: endDate || null,
      isCurrentlyStudying: isCurrentlyStudying === "true",
      link: link.trim(),
    });
    return res.status(201).json({
      success: true,
      message: "Certificate is created successfully",
      cert,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    return res
      .status(500)
      .json({
        success: false,
        message: "Internal server error while saving certificate.",
      });
  }
};

export const getAdminCert = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await UserModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const getAdminCert = await certModel
      .find({ userId })
      .sort({ startDate: -1 });
    return res.status(200).json({
      success: true,
      message: "Certificates fetched successfully",
      getAdminCert,
    });
  } catch (error) {
    return res.status(500).json("Internal Server Error!");
  }
};

export const getPublicCert = async (_req, res) => {
  try {
    const portfolioOwner = await UserModel.findOne({ role: "admin" }).select(
      "_id",
    );
    if (!portfolioOwner) {
      return res
        .status(404)
        .json({ success: false, message: "Portfolio owner not found." });
    }

    const certificates = await certModel
      .find({ userId: portfolioOwner._id })
      .select(
        "institution image title topicsCovered startDate endDate isCurrentlyStudying link",
      )
      .sort({ startDate: -1 });

    return res.status(200).json({ success: true, certificates });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Unable to load certificates." });
  }
};
