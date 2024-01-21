const express = require("express");
const girlService = require("./girlService");
const userService = require("../user/userService");

const router = express.Router();

// POST endpoint for creating a girl
router.post("/girl", async (req, res) => {
  const { bday, cityId, verificationId } = req.body;
  const response = await girlService.createGirl(bday, cityId, verificationId);
  res.status(response.status).send(response.data);
});

// PUT endpoint for updating a girl
router.put("/girl", async (req, res) => {
  const response = await girlService.updateGirl(req);
  res.status(response.status).send(response.data);
});

// POST endpoint for creating a verification
router.post("/verification", async (req, res) => {
  const { bday } = req.body;
  const response = await girlService.createVerification(bday);
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

module.exports = router;
