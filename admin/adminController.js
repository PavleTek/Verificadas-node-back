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

// GET endpoint to retrieve all Anounce Requests - Admin only
router.get("/anounceRequest/:id", userService.authenticateAdmin, async (req, res) => {
  const anounceRequestId = Number(req.params.id);
  const response = await adminService.getAnounceRequestById(anounceRequestId);
  res.status(response.status).send(response);
});

// GET endpoint to retrieve all Notifications - Admin only
router.get("/notification", userService.authenticateAdmin, async (req, res) => {
  const response = await adminService.getAllNotifications();
  res.status(200).send(response);
});

// POST endpoint to create a girl user - Admin only
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

// PUT endpoint to update a girl object
router.put("/girl", userService.authenticateAdmin, async (req, res) => {
  const response = await adminService.updateGirl(req);
  res.status(response.status).send(response);
});

// PUT endpoint to update a girl object
router.put("/change-password/:userId", userService.authenticateAdmin, async (req, res) => {
  const { userId } = req.params;
  const { newPassword } = req.body;
  const response = await userService.changePasswordByAdmin(userId, newPassword);
  res.status(response.status).send(response);
});

// PUT endpoint to update a a girl welcome message sent
router.put("/welcomeSent/:userId", userService.authenticateAdmin, async (req, res) => {
  const { userId } = req.params;
  const response = await adminService.setUserWelcomeSentTrue(userId);
  res.status(response.status).send(response);
});

// PUT endpoint to update a a girl passwordChange sent to true
router.put("/changePasswordSent/:userId", userService.authenticateAdmin, async (req, res) => {
  const { userId } = req.params;
  const response = await adminService.setPasswordChangeSentTrue(userId);
  res.status(response.status).send(response);
});

router.put("/girlPhysicalVerification", userService.authenticateAdmin, async (req, res) => {
  const response = await adminService.updateGirlPhysicalVerification(req);
  res.status(response.status).send(response);
});

// DELETE endpoint to delete a user by ID - Admin only
router.delete("/user/:userId", userService.authenticateAdmin, async (req, res) => {
  try {
    let { userId } = req.params;
    userId = parseInt(userId);
    const response = await adminService.deleteUserById(userId);
    res.status(response.status).send(response);
  } catch (error) {
    res.status(500).send({ status: 500, data: error });
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

// POST endpoint for creating a pricing plan - Admin only
router.post("/pricingPlan", userService.authenticateAdmin, async (req, res) => {
  const response = await adminService.createPricingPlan(req);
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

// PUT endpoint for updating a pricing plan - Admin only
router.put("/pricingPlan", userService.authenticateAdmin, async (req, res) => {
  const response = await adminService.updatePricingPlan(req);
  res.status(response.status).send(response);
});

// PUT endpoint for updating a banner show value - Admin only
router.put("/bannerShow", userService.authenticateAdmin, async (req, res) => {
  const response = await adminService.updateShowBannerValue(req);
  res.status(response.status).send(response);
});

// PUT endpoint for updating a banner Message - Admin only
router.put("/banner", userService.authenticateAdmin, async (req, res) => {
  const response = await adminService.updateBanner(req);
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

// DELETE endpoint for deleting a pricing plan - Admin only
router.delete("/pricingPlan/:pricingPlanId", userService.authenticateAdmin, async (req, res) => {
  const pricingPlanId = Number(req.params.pricingPlanId);
  const response = await adminService.deletePricingPlan(pricingPlanId);
  res.status(response.status).send(response);
});

// DELETE endpoint for deleting an anounce request - Admin only
router.delete("/anounceRequest/:id", userService.authenticateAdmin, async (req, res) => {
  const anounceRequestId = Number(req.params.id);
  const response = await adminService.deleteAnounceRequest(anounceRequestId);
  res.status(response.status).send(response);
});

// DELETE endpoint for deleting a notification - Admin only
router.delete("/notification/:id", userService.authenticateAdmin, async (req, res) => {
  const notificationId = Number(req.params.id);
  const response = await adminService.deleteNotification(notificationId);
  res.status(response.status).send(response);
});

// PUT endpoint for updating a verification - Admin only
router.put("/verification", userService.authenticateAdmin, async (req, res) => {
  const response = await adminService.updateVerification(req);
  res.status(response.status).send(response);
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

// CENSS = City, ethnicity, nationality, service, specific Location
// POST endpoint for bulk updating CENSS - Admin only
router.post("/bulkUpdateCENSS", userService.authenticateAdmin, async (req, res) => {
  const response = await adminService.bulkUpdateCENSS(req);
  res.status(response.status).send(response);
});

module.exports = router;
