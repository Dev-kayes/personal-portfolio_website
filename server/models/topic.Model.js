import mongoose from "mongoose";

const topicSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    topic: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
    },
    status: {
      type: String,
      enum: ["Learning", "In Progress", "Planned"],
      required: true,
      default: "Planned",
    },
    image: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true },
);

const topicModel =
  mongoose.models.Topic || mongoose.model("Topic", topicSchema);

export default topicModel;
