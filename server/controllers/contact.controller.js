import transporter from "../config/nodemailer.js";

export const sendContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message, website } = req.body;

    // Honeypot spam protection
    if (website) {
      return res.status(200).json({
        success: true,
        message: "Your message has been sent!",
      });
    }

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: process.env.CONTACT_EMAIL,
      replyTo: email,
      subject: `Portfolio Contact: ${subject}`,
      text: `
Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message: "Your message has been sent successfully!",
    });
  } catch (error) {
    console.error("CONTACT EMAIL ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to send message. Please try again later.",
    });
  }
};
