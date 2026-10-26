import { mongoose } from "mongoose";
const eduSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    institution: {
      type: String,
      required: true,
      trim: true,
    },
    degree: {
      type: String,
      required: true,
      trim: true,
    },
    fieldOfStudy: {
      type: String,
      trim: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      default: null,
    },
    isCurrentlyStudying: {
      type: Boolean,
      default: false,
    },
    grade: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
);
const eduModel =
  mongoose.model.eduSchema || mongoose.model("Education", eduSchema);
export default eduModel;
