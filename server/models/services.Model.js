import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
    },
    serviceImage: {
      type: String,
      trim: true,
      required: true,
    },
    price: {
      type: Number,
    },
    deliveryTime: {
      type: Number,
      required: true,
    },
    technologies: [
      {
        type: String,
      },
    ],
    features: {
      type: [{ type: String, trim: true }],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

const serviceModel =
  mongoose.models.Service || mongoose.model("Service", serviceSchema);
export default serviceModel;
