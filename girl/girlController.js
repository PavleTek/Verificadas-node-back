const express = require("express");
const girlService = require("./girlService");

const router = express.Router();

// PUT endpoint for updating a girl
router.put("/girl", async (req, res) => {
  const response = await girlService.updateGirl(req);
  res.status(response.status).send(response.data);
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
    console.log("get cities is being called");
    const cities = await girlService.getAllCities();
    console.log(cities);
    res.json(cities);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
