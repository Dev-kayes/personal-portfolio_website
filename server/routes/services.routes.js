import express from "express";
import {
  addService,
  deleteService,
  getAdminService,
} from "./../controllers/service.controllers.js";
import { isAuth } from "../middleWare/isAuth.js";
const serviceRouter = express.Router();

// Add-service:
// http://localhost:3000/api/service/add-service
// https://kayesbackend.vercel.app/api/service/add-service
serviceRouter.post("/add-service", isAuth, addService);

// Delete-service:
// http://localhost:3000/api/service/del-service/:serviceId
// https://kayesbackend.vercel.app/api/service/del-service/:serviceId
serviceRouter.delete("/del-service/:serviceId", isAuth, deleteService);

// Get-Admin-service:
// http://localhost:3000/api/service/get-admin-service
// https://kayesbackend.vercel.app/api/service/get-admin-service
serviceRouter.get("/get-admin-service", isAuth, getAdminService);

export default serviceRouter;
