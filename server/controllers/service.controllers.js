import serviceModel from "../models/services.Model";
import UserModel from "../models/user.Model";
import uploadOnCloudinary from "../utils/uploadOnCloudinary";
import serviceModel from "./../models/services.Model";

export const addService = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await UserModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const {
      title,
      description,
      category,
      price,
      deliveryTime,
      technologies,
      features,
      isActive,
      order,
    } = req.body;

    if (
      !title ||
      !description ||
      !category ||
      deliveryTime === undefined ||
      deliveryTime === ""
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Please upload a service image" });
    }

    const serviceImage = await uploadOnCloudinary(
      req.file.buffer,
      "service-images",
    );
    const service = await serviceModel.create({
      userId,
      title,
      description,
      category,
      serviceImage,
      price,
      deliveryTime,
      technologies,
      features,
      isActive,
      order,
    });

    return res
      .status(201)
      .json({ success: true, message: "Service added successfully", service });
  } catch (error) {
    console.error(error, "Error in AddService");
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error!" });
  }
};
export const deleteService = async (req, res) => {
  try {
    const serviceId = req.params.serviceId;
    const userId = req.userId;
    const user = await UserModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const service = await serviceModel.findByIdAndDelete({
      _id: serviceId,
      userId,
    });
    if (!service) return res.status(404).json({ message: "Service not found" });
    return res
      .status(200)
      .json({ success: true, message: "Service Deleted Succesfully" });
  } catch (error) {
    console.error(error, "Error in Delete Service");
    return res.status(500).json("Internal Server Error!");
  }
};
export const getAdminService = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await UserModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const services = await serviceModel.find({ userId });
    if (services) return res.status(200).send("Service Fetched Successfully");
  } catch (error) {
    console.error(error, "Error in get Service");
    return res.status(500).json("Internal Server Error!");
  }
};
