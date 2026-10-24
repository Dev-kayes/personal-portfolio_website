import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      //   required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    projectImage: {
      type: String,
      required: true,
    },
    gitHub: {
      type: String,
    },
    live: {
      type: String,
    },
  },
  { timestamps: true },
);
const projectModel =
  mongoose.model.Project || mongoose.model("Project", projectSchema);
export default projectModel;
