const express = require("express");
const userService = require("../user/userService");
const subscriptionService = require("./subscriptionService");

const router = express.Router();

// PUT endpoint for updating a girl active status
router.put("/girlStatus", userService.authenticateAdmin, async (req, res) => {
  const response = await subscriptionService.changeGirlStatus(req);
  res.status(response.status).send(response);
});

// PUT endpoint Registering a pause in a girls subscription
router.put("/pause", userService.authenticate, async (req, res) => {
  const response = await subscriptionService.registerSubscriptionPause(req);
  res.status(response.status).send(response);
});

// GET endpoint for fetching all payments made by a girl by subscription ID
router.get("/payment/:subscriptionId", userService.authenticateAdmin, async (req, res) => {
  const subscriptionId = Number(req.params.subscriptionId);
  const response = await subscriptionService.getAllPaymentsBySubscriptionId(subscriptionId);
  res.status(response.status).send(response);
});

// GET endpoint for fetching the most recent registered payment of a girl by the subscription Id
router.get("/lastPayment/:subscriptionId", userService.authenticate, async (req, res) => {
  const subscriptionId = Number(req.params.subscriptionId);
  const response = await subscriptionService.getMostRecentPaymentBySubscriptionId(subscriptionId);
  res.status(response.status).send(response);
});

// DELETE endpoint for deleting a payment
router.delete("/payment/:paymentId", userService.authenticateAdmin, async (req, res) => {
  const paymentId = Number(req.params.paymentId);
  const response = await subscriptionService.deletePaymentById(paymentId);
  res.status(response.status).send(response);
});

// PUT endpoint for updating a girl subscription data
router.put("/girlSubscription", userService.authenticateAdmin, async (req, res) => {
  const response = await subscriptionService.updateGirlSubscription(req);
  res.status(response.status).send(response);
});

// POST endpoint for registering a payment and handling the subscription based on it
router.post("/payment", userService.authenticateAdmin, async (req, res) => {
  const response = await subscriptionService.registerPayment(req);
  res.status(response.status).send(response);
});

// PUT endpoint for editing a payment that was already registered
router.put("/payment", userService.authenticateAdmin, async (req, res) => {
  const response = await subscriptionService.updatePayment(req);
  res.status(response.status).send(response);
});

module.exports = router;
