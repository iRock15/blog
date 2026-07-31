const multer = require("multer");
const path = require("path");
const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const fileName = `${Date.now()}-${file.fieldname}${ext}`;
    cb(null, fileName);
  },
});
const momoryStorage = multer.memoryStorage();

const uploadOnDisk = multer({ storage: diskStorage });
const uploadOnMomory = multer({ storage: momoryStorage });

module.exports = { uploadOnDisk, uploadOnMomory };