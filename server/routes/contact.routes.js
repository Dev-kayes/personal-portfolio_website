import express from "express";
import { sendContactMessage } from "../controllers/contact.controllers.js";

const contactRoute = express.Router();

contactRoute.post("/send-message", sendContactMessage);

export default contactRoute;
