import UserModel from "../models/user.Model.js";
import uploadOnCloudinary from "../utils/uploadOnCloudinary.js";

// http://localhost:3000/api/user/current-user
export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await UserModel.findById(userId).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res
      .status(200)
      .json({ success: true, data: user, msg: "User found successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// http://localhost:3000/api/user/update-profile
export const updateProfile = async (req, res) => {
  const user = await UserModel.findById(req.userId);
  try {
    const userId = req.userId;
    let {
      name,
      phone,
      whatsAppNumber,
      address,
      city,
      state,
      country,
      title,
      intro,
      description,
      github,
      linkedIn,
      instagram,
      facebook,
      twitter,
      youtube,
      isAvailable,
    } = req.body;
    await UserModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    let profilePic;
    profilePic = user.profilePic;

    try {
      if (req.file && req.file.buffer) {
        profilePic = await uploadOnCloudinary(req.file.buffer);
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
        error: "Error while uploading Profile picture!",
      });
    }

    await UserModel.findByIdAndUpdate(
      userId,
      {
        name,
        phone,
        whatsAppNumber,
        address,
        city,
        state,
        country,
        title,
        intro,
        description,
        github,
        linkedIn,
        instagram,
        facebook,
        twitter,
        youtube,
        profilePic,
        isAvailable,
        //: isAvailable === true ? true : false,
      },
      { new: true, runValidators: true },
    );
    return res
      .status(200)
      .json({ success: true, message: "Updated successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
