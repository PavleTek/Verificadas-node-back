require("dotenv").config();
const express = require("express");
const cors = require("cors");
const userController = require("./user/userController");
const girlController = require("./girl/girlController");
const adminController = require("./admin/adminController");
const multimediaController = require("./multimedia/multimediaController");
const subscriptionController = require("./subscription/subscriptionController");
const { initializeBanner } = require("./admin/adminService");
const path = require("path");

const app = express();

const multimediaImageFolder = process.env.MULTIMEDIA_IMAGES_FOLDER;
const pendingMultimediaImageFolder = process.env.PENDING_MULTIMEDIA_IMAGES_FOLDER;

const corsOptions = {
  origin: "*", // Replace with the actual URL of your Angular app
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // Enable credentials (cookies, authorization headers) if needed
};

app.use(cors(corsOptions));

app.use(express.json());
app.use("/user-api", userController);
app.use("/girl-api", girlController);
app.use("/admin-api", adminController);
app.use("/subscription-api", subscriptionController);
app.use("/multimedia-api", multimediaController);

// multimedia
app.use("/images", express.static(path.join(__dirname, "..", multimediaImageFolder)));
app.use("/pending-images", express.static(path.join(__dirname, "..", pendingMultimediaImageFolder)));

const hostName = "127.0.0.1";
const port = process.env.PORT || 3000; // Fallback to 3000 if process.env.PORT is not defined
initializeBanner()
  .then(() => {
    app.listen(port, hostName, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Error initializing banner:", error);
  });
