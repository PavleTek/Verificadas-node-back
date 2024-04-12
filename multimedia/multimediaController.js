require("dotenv").config();
const express = require("express");
const userService = require("../user/userService");
const multimediaService = require("./mutlimediaService");
const path = require("path");
const multer = require("multer");
const router = express.Router();
const crypto = require("crypto");

const beforeApprovalFolderPath = "../" + process.env.BEFORE_APPROVAL_IMAGES_FOLDER_PATH;
const imagesFolderPath = "../" + process.env.IMAGES_FOLDER_PATH;

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, beforeApprovalFolderPath));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + "-" + crypto.randomBytes(4).toString("hex");
    const newName = `image_girlId${req.params.girlId}_${uniqueSuffix}${ext}`;
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

// POST route for uploading a profile picture request
router.post("/profilePictureRequest/:girlId", userService.authenticate, upload.array("images"), async (req, res) => {
  try {
    const girlId = Number(req.params.girlId);
    const response = await multimediaService.saveProfilePictureRequestToGirl(req.files, girlId);
    res.status(response.status).send(response);
  } catch (error) {}
});

// POST route for uploading an image request
router.post("/videoRequest/:girlId", userService.authenticate, upload.array("images"), async (req, res) => {
  try {
    const girlId = Number(req.params.girlId);
    const response = await multimediaService.saveImagesRequestToGirl(req.files, girlId);
    res.status(response.status).send(response);
  } catch (error) {}
});

// PUT Route for putting the watermark on the pictures
router.put("/approve/:girlId", userService.authenticate, async (req, res) => {
  try {
    const girlId = Number(req.params.girlId);
    const response = await multimediaService.approveImageRequestForGirl(girlId);
    res.status(response.status).send(response);
  } catch (error) {}
});

// PUT Route for putting the watermark on the pictures
router.put("/approveProfilePicture/:girlId", userService.authenticate, async (req, res) => {
  try {
    const girlId = Number(req.params.girlId);
    const response = await multimediaService.approveProfilePictureForGirl(girlId);
    res.status(response.status).send(response);
  } catch (error) {}
});

module.exports = router;
