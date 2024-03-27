require("dotenv").config();
const express = require("express");
const path = require("path");

const app = express();
const PORT = 3001; // Use port 3000 or a port specified in the environment variable

const beforeApprovalFolderPath = process.env.BEFORE_APPROVAL_IMAGES_FOLDER_PATH;
const imagesFolderPath = process.env.IMAGES_FOLDER_PATH;

// Serve static files from a directory
app.use("/images", express.static(path.join(__dirname, imagesFolderPath)));
app.use("/pending-images", express.static(path.join(__dirname, beforeApprovalFolderPath)));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
