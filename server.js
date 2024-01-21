require("dotenv").config();
const express = require("express");
const userController = require("./user/userController"); // Adjust the path as needed
const girlController = require("./girl/girlController"); // Adjust the path as needed
const adminController = require("./admin/adminController"); // Adjust the path as needed

const app = express();

app.use(express.json());
app.use("/user-api", userController);
app.use("/girl-api", girlController);
app.use("/admin-api", adminController);

const port = process.env.PORT || 3000; // Fallback to 3000 if process.env.PORT is not defined
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
