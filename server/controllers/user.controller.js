import UserModel from "../models/user.Model.js";

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
