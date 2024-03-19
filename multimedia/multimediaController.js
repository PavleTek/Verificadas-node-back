const express = require("express");
const userService = require("../user/userService");
const multimediaService = require("./mutlimediaService");
const path = require("path");
const multer = require("multer");
const router = express.Router();

const imageFolderPath = process.env.IMAGES_FOLDER_PATH;

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, imageFolderPath));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const newName = `image_girlId${req.params.girlId}_${Date.now()}${ext}`;
    cb(null, newName);
  },
});

const upload = multer({ storage: storage });

// POST route for uploading an image request
router.post("/request/:girlId", userService.authenticate, upload.array("images"), async (req, res) => {
  try {
    const girlId = Number(req.params.girlId);
    const response = await multimediaService.saveImagesRequestToGirl(req.files, girlId);
    res.status(response.status).send(response);
  } catch (error) {}
});

// PUT Route for putting the watermark on the pictures

router.put("/approve", userService.authenticate, async (req, res) => {
  const response = await multimediaService.addImageWatermarkCentered(req);
  res.status(response.status).send(response);
});

module.exports = router;
