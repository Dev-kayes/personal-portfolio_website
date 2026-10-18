import multer from "multer";

const storage = multer.memoryStorage({
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/webp"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const limits = {
  fileSize: 1024 * 1024 * 5,
};
// As we deployed it inside vercel and vercel is a serverless platform, so it is not possible to store the images inside the server. So we have to store the images inside the client side. That's why we are using multer to store the images inside DiskStorage.
// we have to use memoryStorage
const upload = multer({
  storage,
  limits,
  fileFilter,
});
export default upload;
