const express = require("express");
const userService = require("../user/userService");
const subcsriptionService = require("./subscriptionService");

const router = express.Router();

// PUT endpoint for updating a girl active status
router.put("/girlStatus", userService.authenticateAdmin, async (req, res) => {
  const response = await subcsriptionService.changeGirlStatus(req);
  res.status(response.status).send(response);
});

module.exports = router;
