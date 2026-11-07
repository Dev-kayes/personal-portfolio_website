import mongoose from "mongoose";

const skillSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    skillSection: {
      type: String,
      required: true,
      enum: ["FrontEnd", "BackEnd", "Database", "Tools & others"],
    },
    skillName: { type: String, required: true },
    skillImage: { type: String, required: true },
  },
  { timestamps: true },
);
const skillModel = mongoose.model("Skill", skillSchema);

export default skillModel;
