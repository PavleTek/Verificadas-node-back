const express = require("express");
const userService = require("../user/userService");
const subcsriptionService = require("./subscriptionService");

const router = express.Router();

// PUT endpoint for updating a girl active status
router.put("/girlStatus", userService.authenticateAdmin, async (req, res) => {
  const response = await subcsriptionService.changeGirlStatus(req);
  res.status(response.status).send(response);
});

// PUT endpoint for updating a girl subscription data
router.put("/girlSubscription", userService.authenticateAdmin, async (req, res) => {
  const response = await subcsriptionService.updateGirlSubscription(req);
  res.status(response.status).send(response);
});

// PUT endpoint for registering a payment and handling the subscription based on it
router.post("/payment", userService.authenticateAdmin, async (req, res) => {
  const response = await subcsriptionService.registerPayment(req);
  res.status(response.status).send(response);
});

module.exports = router;
