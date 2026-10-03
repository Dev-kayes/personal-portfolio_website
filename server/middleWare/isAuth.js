import jwt from "jsonwebtoken";

export const isAuth = (req, res, next) => {
  console.log("is middleware work?");
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token)
      return res
        .status(404)
        .json({ success: false, message: "Token not found" });
    const decode = jwt.verify(token, process.env.JWT_SECRET); // verify token
    if (!decode)
      return res.status(404).json({ success: false, message: "Unauthorized" });
    req.userId = decode.id;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
