const express = require("express");
const girlService = require("./girlService");
const userService = require("../user/userService");

const router = express.Router();

// PUT endpoint for updating a girl
router.put("/girl", userService.authenticate, async (req, res) => {
  const response = await girlService.updateGirl(req, res);
  res.status(response.status).send(response);
});

// POST endpoint to create a client review
router.post("/clientReview", userService.authenticate, async (req, res) => {
  try {
    const response = await girlService.createClientReview(req);
    res.status(response.status).send(response);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// GET Endpoint to retriever all cliente reviews that start with a number
router.get("/clientByPhone/:phonePrefix", userService.authenticate, async (req, res) => {
  const { phonePrefix } = req.params;
  try {
    const response = await girlService.getClientsByPhonePrefix(phonePrefix);
    res.status(response.status).send(response.data);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// GET Endpoint to retriever all cliente reviews that start with a number
router.get("/clientReviewByPhone/:phoneNumber", userService.authenticate, async (req, res) => {
  const { phoneNumber } = req.params;
  try {
    const response = await girlService.getClientReviewsByPhoneNumber(phoneNumber);
    res.status(response.status).send(response.data);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// GET Endpoint to retriever all cliente reviews from a specific Girl
router.get("/clientReviewByGirl/:girlId", userService.authenticate, async (req, res) => {
  const { girlId } = req.params;
  try {
    const response = await girlService.getClientReviewsByGirlId(girlId);
    res.status(response.status).send(response.data);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// DELETE Endpoint to delete a specific review
router.delete("/clientReview/:reviewId", userService.authenticate, async (req, res) => {
  const { reviewId } = req.params;
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).send("No Bearer token provided");
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).send("Token not provided");
  }
  try {
    const response = await girlService.deleteReviewById(reviewId, token);
    res.status(response.status).send(response);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// PUT endpoint to edit a specific review
router.put("/clientReview/:reviewId", userService.authenticate, async (req, res) => {
  const { reviewId } = req.params;
  const { updatedReview } = req.body; // Assuming the updated review is sent in the request body
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).send("No Bearer token provided");
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).send("Token not provided");
  }

  try {
    const response = await girlService.updateReviewById(reviewId, token, updatedReview);
    res.status(response.status).send(response.data);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// GET endpoint for fetching girls by city ID
router.get("/girls/city/:cityId", async (req, res) => {
  const { cityId } = req.params;
  const response = await girlService.getGirlsByCityId(cityId);
  res.status(response.status).send(response.data);
});

// GET endpoint for fetching a girl by ID
router.get("/girl/:girlId", async (req, res) => {
  const { girlId } = req.params;
  const response = await girlService.getGirlById(girlId);
  res.status(response.status).send(response);
});

// GET endpoint for fetching all the data bout a girl by ID
router.get("/girlUser/:userId", userService.authenticate, async (req, res) => {
  const { userId } = req.params;
  const response = await girlService.getCompleteGirlUserById(userId);
  res.status(response.status).send(response.data);
});

// GET endpoint for fetching all Services
router.get("/services", async (req, res) => {
  try {
    const services = await girlService.getAllServices();
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET endpoint for fetching all Cities
router.get("/cities", async (req, res) => {
  try {
    const cities = await girlService.getAllCities();
    res.json(cities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET endpoint for fetching all Specific Locations
router.get("/specificLocation", async (req, res) => {
  try {
    const response = await girlService.getAllSpecificLocations();
    res.status(response.status).send(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET endpoint for fetching all Ethnicities
router.get("/ethnicity", async (req, res) => {
  try {
    const ethnicityOptions = await girlService.getAllEthnicities();
    res.json(ethnicityOptions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET endpoint for fetching all Nationalities
router.get("/nationality", async (req, res) => {
  try {
    const nationalities = await girlService.getAllNationalities();
    res.json(nationalities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET endpoint for fetching all pricing plans
router.get("/pricingPlan", async (req, res) => {
  try {
    const response = await girlService.getAllPricingPlans();
    res.status(response.status).send(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET endpoint for fetching all pricing plans
router.get("/banner", async (req, res) => {
  try {
    const response = await girlService.getBanner();
    res.status(response.status).send(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
