require("dotenv").config();
const express = require("express");
const cors = require("cors");
const userController = require("./user/userController"); // Adjust the path as needed
const girlController = require("./girl/girlController"); // Adjust the path as needed
const adminController = require("./admin/adminController"); // Adjust the path as needed

const app = express();

const corsOptions = {
  origin: "http://localhost:4200", // Replace with the actual URL of your Angular app
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // Enable credentials (cookies, authorization headers) if needed
};

app.use(cors(corsOptions));

app.use(express.json());
app.use("/user-api", userController);
app.use("/girl-api", girlController);
app.use("/admin-api", adminController);

const port = process.env.PORT || 3000; // Fallback to 3000 if process.env.PORT is not defined
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
