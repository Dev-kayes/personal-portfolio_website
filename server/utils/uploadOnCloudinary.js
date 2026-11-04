import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

const uploadOnCloudinary = (fileBuffer, folder = "portfolio_profiles") => {
  return new Promise((resolve, reject) => {
    const pipeForStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "auto",
      },
      (error, result) => {
        if (result) {
          return resolve(result.secure_url);
        } else {
          return reject(error);
        }
      },
    );
    streamifier.createReadStream(fileBuffer).pipe(pipeForStream);
  });
};
export default uploadOnCloudinary;
