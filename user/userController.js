const express = require("express");
const userService = require("./userService");

const router = express.Router();

// POST endpoint for girl user registration #Missing email code sending and validation
router.post("/register/girl", async (req, res) => {
  const response = await userService.registerGirlUser(req);
  res.status(response.status).send(response.data);
});

// POST endpoint for user login
router.post("/login", async (req, res) => {
  await userService.login(req, res);
});

// PUT endpoint for changing password
router.put("/change-password/:userId", async (req, res) => {
  const { userId } = req.params;
  const { oldPassword, newPassword } = req.body;
  const response = await userService.changePassword(userId, oldPassword, newPassword);
  res.status(response.success ? 200 : 400).send(response.message);
});

// PUT endpoint to update a user - Admin only ---need to make that only account owner or admin can change stuff
router.put("/user/:userId", userService.authenticateAdmin, async (req, res) => {
  const { userId } = req.params;
  const response = await userService.updateUser(userId, req.body);
  res.status(response.success ? 200 : 400).send(response.message);
});

// GET endpoint for user profile
router.get("/profile", userService.authenticate, async (req, res) => {
  await userService.getProfile(req, res);
});

module.exports = router;
