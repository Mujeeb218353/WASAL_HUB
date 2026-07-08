import multer from "multer";
import path from "path";

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      const dir = path.resolve("public/temp");
      cb(null, dir);
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
  limits: { 
    fileSize: 10 * 1024 * 1024  // 10 MB

  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/") || file.mimetype === "application/pdf" ) {
      cb(null, true);
    } else {
      cb(new Error("Only image and pdf files are allowed!"), false);
    }
  },
});

export default upload;