import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  phone: { type: String },
  whatsAppNumber: { type: String },
  address: {
    type: String,
  },
  city: {
    type: String,
  },
  state: {
    type: String,
  },
  country: {
    type: String,
  },
  PostalCode: {
    type: String,
  },
  title: {
    type: String,
  },
  intro: {
    type: String,
  },
  description: {
    type: String,
  },
  github: {
    type: String,
  },
  linkedIn: {
    type: String,
  },
  instagram: {
    type: String,
  },
  facebook: {
    type: String,
  },
  twitter: {
    type: String,
  },
  youtube: {
    type: String,
  },
  profilePic: {
    type: String,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
});
const UserModel = mongoose.model("user", userSchema);
export default UserModel;
