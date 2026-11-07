import nodemailer from "nodemailer";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const recipient = "dev.kayes27@gmail.com";

export const sendContactMessage = async (req, res) => {
  const { name, email, subject, message, website } = req.body || {};

  if (typeof website === "string" && website.trim()) {
    return res.status(400).json({
      success: false,
      message: "Unable to send your message.",
    });
  }

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof subject !== "string" ||
    typeof message !== "string"
  ) {
    return res.status(400).json({
      success: false,
      message: "Please complete all contact form fields.",
    });
  }

  const cleanName = name.trim();
  const cleanEmail = email.trim();
  const cleanSubject = subject.trim();
  const cleanMessage = message.trim();

  if (
    !cleanName ||
    cleanName.length > 100 ||
    !emailPattern.test(cleanEmail) ||
    cleanEmail.length > 254 ||
    !cleanSubject ||
    cleanSubject.length > 150 ||
    !cleanMessage ||
    cleanMessage.length > 5000
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Please provide a valid email and ensure the name, subject, and message are within the allowed length.",
    });
  }

  const {
    SMTP_USER,
    SMTP_PASS,
    SMTP_HOST = "smtp.gmail.com",
    SMTP_PORT = "465",
    SMTP_SECURE,
  } = process.env;
  const smtpPort = Number(SMTP_PORT);
  if (
    !SMTP_USER ||
    !SMTP_PASS ||
    !Number.isInteger(smtpPort) ||
    smtpPort <= 0
  ) {
    return res.status(503).json({
      success: false,
      message: "The contact form is temporarily unavailable.",
    });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: smtpPort,
      secure: SMTP_SECURE ? SMTP_SECURE === "true" : smtpPort === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Portfolio Contact" <${SMTP_USER}>`,
      to: recipient,
      replyTo: {
        name: cleanName,
        address: cleanEmail,
      },
      subject: `Portfolio contact: ${cleanSubject}`,
      text: [
        `Name: ${cleanName}`,
        `Email: ${cleanEmail}`,
        `Subject: ${cleanSubject}`,
        "",
        cleanMessage,
      ].join("\n"),
    });

    return res.status(200).json({
      success: true,
      message: "Your message has been sent successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to send your message right now. Please try again later.",
    });
  }
};
