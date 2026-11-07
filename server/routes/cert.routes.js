import express from "express";
import {
  addCert,
  getAdminCert,
  getPublicCert,
} from "../controllers/certificate.controllers.js";
import { isAuth } from "../middleWare/isAuth.js";
import upload from "../middleWare/multer.js";
import multer from "multer";
const certRoute = express.Router();

const uploadCertificateImage = (req, res, next) => {
  upload.single("image")(req, res, (error) => {
    if (!error) {
      next();
      return;
    }

    if (
      error instanceof multer.MulterError &&
      error.code === "LIMIT_FILE_SIZE"
    ) {
      return res.status(400).json({
        success: false,
        message: "Certificate image must be 5 MB or smaller.",
      });
    }

    if (error instanceof multer.MulterError) {
      return res.status(400).json({ success: false, message: error.message });
    }

    return res.status(400).json({
      success: false,
      message: "Certificate image could not be uploaded.",
    });
  });
};

certRoute.post("/add-cert", isAuth, uploadCertificateImage, addCert);
certRoute.get("/get-admin-cert", isAuth, getAdminCert);
certRoute.get("/public", getPublicCert);

export default certRoute;
