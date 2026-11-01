import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true },
);
const reviewModel =
  mongoose.models.Review || mongoose.model("Review", reviewSchema);
export default reviewModel;
