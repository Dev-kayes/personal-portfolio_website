import express from "express";
import { sendContactMessage } from "../controllers/contact.controllers.js";

const contactRoute = express.Router();

// Service:
// http://localhost:3000/api/contact/send-message
// https://kayesbackend.vercel.app/api/contact/send-message
contactRoute.post("/send-message", sendContactMessage);

export default contactRoute;
