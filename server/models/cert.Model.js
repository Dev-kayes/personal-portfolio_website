import mongoose from "mongoose";
const certSchema = new mongoose.Schema(
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
    image: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    topicsCovered: {
      type: [{ type: String, trim: true }],
      required: true,
      validate: {
        validator: (topics) => topics.length > 0,
        message: "At least one topic is required",
      },
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
    link: {
      type: String,
      trim: true,
      required: true,
      validate: {
        validator: (value) => {
          try {
            const url = new URL(value);
            return url.protocol === "http:" || url.protocol === "https:";
          } catch {
            return false;
          }
        },
        message: "Certificate link must be a valid HTTP or HTTPS URL",
      },
    },
  },
  { timestamps: true },
);
const certModel =
  mongoose.models.Cert || mongoose.model("Cert", certSchema);
export default certModel;
