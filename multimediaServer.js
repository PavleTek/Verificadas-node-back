require("dotenv").config();
const express = require("express");
const cors = require("cors");
const adminController = require("./admin/adminController");
const multimediaController = require("./multimedia/multimediaController");
const path = require("path");
const sharp = require('sharp');
const fs = require('fs');

const app = express();

function compressImages(req, res, next) {
  const filePath = path.join(__dirname, '..', multimediaImageFolder, req.path);

  fs.stat(filePath, (err, stats) => {
    if (err) {
      return next(); // File not found, move to next middleware
    }

    // Define a maximum file size in bytes, e.g., 100 KB
    const MAX_SIZE = 10 * 1024;

    if (stats.size > MAX_SIZE) {
      // Resize and compress image if it's larger than the MAX_SIZE
      sharp(filePath)
        .jpeg({ quality: 20 }) // Convert to JPEG with quality 70%
        .toBuffer()
        .then(data => {
          res.contentType('image/jpeg');
          res.send(data);
        })
        .catch(err => {
          res.status(500).send('Error processing image');
        });
    } else {
      // Serve image as is if it's not too large
      next();
    }
  });
}

const multimediaImageFolder = process.env.MULTIMEDIA_IMAGES_FOLDER;
const pendingMultimediaImageFolder = process.env.PENDING_MULTIMEDIA_IMAGES_FOLDER;

const corsOptions = {
  origin: "*", // Replace with the actual URL of your Angular app
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // Enable credentials (cookies, authorization headers) if needed
};

app.use(cors(corsOptions));

app.use(express.json());
app.use("/admin-api", adminController);
app.use("/multimedia-api", multimediaController);

// multimedia
app.use("/images", express.static(path.join(__dirname, "..", multimediaImageFolder)));
app.use("/pending-images", express.static(path.join(__dirname, "..", pendingMultimediaImageFolder)));

const hostName = "127.0.0.1";
const port = process.env.MULTIMEDIA_PORT || 3100; // Fallback to 3000 if process.env.PORT is not defined
app.listen(port, hostName, () => {
  console.log(`Multimedia Server is running on port ${port}`);
});
