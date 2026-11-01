import express from "express";
import {
  addCert,
  // deleteEduction,
  getAdminCert,
} from "../controllers/certificate.controllers.js";
import { isAuth } from "../middleWare/isAuth.js";
const certRoute = express.Router();

// Add Education
// http://localhost:3000/api/education/add-cert
// https://kayesbackend.vercel.app/api/education/add-cert
certRoute.post("/add-cert", isAuth, addCert);
// Delete Education
// http://localhost:3000/api/education/delete-edu/:eduId
// https://kayesbackend.vercel.app/api/education/delete-edu/:eduId
// authRouter.delete("/delete-edu/:eduId", isAuth, deleteEduction);
// Get Admin Education
// http://localhost:3000/api/education/get-admin-cert
// https://kayesbackend.vercel.app/api/education/get-admin-cert
certRoute.get("/get-admin-cert", isAuth, getAdminCert);

export default certRoute;
