require("dotenv").config();
require("./schedulerService");
const express = require("express");
const cors = require("cors");
const userController = require("./user/userController");
const girlController = require("./girl/girlController");
const adminController = require("./admin/adminController");
const subscriptionController = require("./subscription/subscriptionController");
const { initializeBanner } = require("./admin/adminService");

const app = express();

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
