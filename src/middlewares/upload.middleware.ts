import multer from "multer";

const storage = multer.diskStorage({
  destination: "uploads/products",

  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + file.originalname;
    cb(null, unique);
  },
});

export const upload = multer({ storage });