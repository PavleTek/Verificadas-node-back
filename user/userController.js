const express = require("express");
const userService = require("./userService");

const router = express.Router();

// POST endpoint for girl user registration #Missing email code sending and validation
router.post("/register/girl", async (req, res) => {
  const response = await userService.registerGirlUser(req);
  res.status(response.status).send(response.data);
});

// POST endpoint for user login
router.post("/login", userService.login);

router.post("/verifyTokenAdmin", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).send("No Bearer token provided");
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).send("Token not provided");
  }

  const response = await userService.verifyTokenAdmin(token);

  if (response.status === 200) {
    res.status(200).send({ valid: true, data: response.data });
  } else {
    return res.status(200).send({ valid: false, data: response.data });
  }
});

router.post("/verifyTokenGirl", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).send("No Bearer token provided");
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).send("Token not provided");
  }

  const response = await userService.verifyTokenGirl(token);

  if (response.status === 200) {
    res.status(200).send({ valid: true, data: response.data });
  } else {
    return res.status(401).send({ valid: false, data: response.data });
  }
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
