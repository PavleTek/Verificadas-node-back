const express = require("express");
const userService = require("../user/userService");
const adminService = require("./adminService");

const router = express.Router();

// GET endpoint to retrieve all users - Admin only
router.get("/users", userService.authenticateAdmin, async (req, res) => {
  try {
    const users = await adminService.getAllUsers();
    res.send(users);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// POPST endpoint to create a girl user - Admin only
router.post("/users", userService.authenticateAdmin, async (req, res) => {
  try {
    const users = await adminService.registerGirlUser(req);
    res.send(users);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// GET endpoint to retrieve all girl users with all their data - Admin only
router.get("/users/complete", userService.authenticateAdmin, async (req, res) => {
  try {
    const response = await adminService.getAllGirlsUsersWithAllInfo();
    res.send(response);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// GET endpoint to retrieve a user by ID - Admin only
router.get("/user/:userId", userService.authenticateAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await adminService.getUserById(userId);
    res.send(user);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.put("/girl", userService.authenticateAdmin, async (req, res) => {
  const response = await adminService.updateGirl(req);
  res.status(response.status).send(response);
});

// DELETE endpoint to delete a user by ID - Admin only
router.delete("/user/:userId", userService.authenticateAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const response = await adminService.deleteUserById(userId);
    res.status(response.success ? 200 : 400).send(response.message);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// POST endpoint for creating a city - Admin only
router.post("/city", userService.authenticateAdmin, async (req, res) => {
  const response = await adminService.createCity(req);
  res.status(response.status).send(response);
});

// POST endpoint for creating a specific location - Admin only
router.post("/specificLocation", userService.authenticateAdmin, async (req, res) => {
  const response = await adminService.createSpecificLocation(req);
  res.status(response.status).send(response);
});

// POST endpoint for creating a ethnicity - Admin only
router.post("/ethnicity", userService.authenticateAdmin, async (req, res) => {
  const response = await adminService.createEthnicity(req);
  res.status(response.status).send(response);
});

// POST endpoint for creating a nationality - Admin only
router.post("/nationality", userService.authenticateAdmin, async (req, res) => {
  const response = await adminService.createNationality(req);
  res.status(response.status).send(response);
});

// PUT endpoint for updating a city name - Admin only
router.put("/city", userService.authenticateAdmin, async (req, res) => {
  const response = await adminService.updateCityName(req);
  res.status(response.status).send(response);
});

// PUT endpoint for updating a specific location name - Admin only
router.put("/specificLocation", userService.authenticateAdmin, async (req, res) => {
  const response = await adminService.updateSpecificLocationName(req);
  res.status(response.status).send(response);
});

// PUT endpoint for updating a ethnicity name - Admin only
router.put("/ethnicity", userService.authenticateAdmin, async (req, res) => {
  const response = await adminService.updateEthnicityName(req);
  res.status(response.status).send(response);
});

// PUT endpoint for updating a nationality name - Admin only
router.put("/nationality", userService.authenticateAdmin, async (req, res) => {
  const response = await adminService.updateNationality(req);
  res.status(response.status).send(response);
});

// DELETE endpoint for deleting a city - Admin only
router.delete("/city/:cityId", userService.authenticateAdmin, async (req, res) => {
  const cityId = Number(req.params.cityId);
  const response = await adminService.deleteCity(cityId);
  res.status(response.status).send(response);
});

// DELETE endpoint for deleting a specific location - Admin only
router.delete("/specificLocation/:specificLocationId", userService.authenticateAdmin, async (req, res) => {
  const specificLocationId = Number(req.params.specificLocationId);
  const response = await adminService.deleteSpecificLocation(specificLocationId);
  res.status(response.status).send(response);
});

// DELETE endpoint for deleting a ethnicity - Admin only
router.delete("/ethnicity/:ethnicityId", userService.authenticateAdmin, async (req, res) => {
  const ethnicityId = Number(req.params.ethnicityId);
  const response = await adminService.deleteEthnicity(ethnicityId);
  res.status(response.status).send(response);
});

// DELETE endpoint for deleting a nationality - Admin only
router.delete("/nationality/:nationalityId", userService.authenticateAdmin, async (req, res) => {
  const nationalityId = Number(req.params.nationalityId);
  const response = await adminService.deleteNationality(nationalityId);
  res.status(response.status).send(response);
});

// PUT endpoint for updating a verification - Admin only
router.put("/verification", userService.authenticateAdmin, async (req, res) => {
  const response = await girlService.updateVerification(req);
  res.status(response.status).send(response.data);
});

// POST endpoint for creating a service - Admin only
router.post("/service", userService.authenticateAdmin, async (req, res) => {
  const response = await adminService.createService(req);
  res.status(response.status).send(response);
});

// PUT endpoint for updating a service - Admin only
router.put("/service", userService.authenticateAdmin, async (req, res) => {
  const response = await adminService.updateService(req);
  res.status(response.status).send(response);
});

// DELETE endpoint for deleting a service - Admin only
router.delete("/service/:serviceId", userService.authenticateAdmin, async (req, res) => {
  const serviceId = Number(req.params.serviceId);
  const response = await adminService.deleteService(serviceId);
  res.status(response.status).send(response);
});

module.exports = router;
