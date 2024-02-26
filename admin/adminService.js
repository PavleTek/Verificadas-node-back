const prisma = require("../prisma.js");
const bcrypt = require("bcrypt");
const girlService = require("../girl/girlService.js");

// City logic part
const createCity = async (req) => {
  const { name } = req.body;
  try {
    const city = await prisma.city.create({
      data: {
        name,
      },
    });
    return { status: 200, data: city };
  } catch (error) {
    console.error("Error creating city:", error);
    return { status: 500, data: error };
  }
};

const updateCityName = async (req) => {
  const { id, name } = req.body;

  try {
    const city = await prisma.city.update({
      where: {
        id: id,
      },
      data: {
        name: name,
      },
    });
    return { status: 200, data: city };
  } catch (error) {
    console.error("Error updating city name:", error);
    return { status: 500, data: error };
  }
};

const deleteCity = async (cityId) => {
  try {
    await prisma.city.delete({
      where: {
        id: cityId,
      },
    });
    return { status: 200, message: `City with ID ${cityId} has been deleted` };
  } catch (error) {
    console.error("Error deleting city:", error);
    return { status: 500, data: error };
  }
};

// Verification update
const updateVerification = async (req) => {
  const { id, ...updateData } = req.body;

  try {
    const verification = await prisma.verification.update({
      where: {
        id,
      },
      data: updateData,
    });
    return { status: 200, data: verification };
  } catch (error) {
    console.error("Error updating verification:", error);
    return { status: 500, data: error };
  }
};

// can be called from console only
const registerAdminUser = async (req) => {
  const { email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const lowerCaseEmail = email.toLowerCase();
    const user = await prisma.user.create({
      data: {
        email: lowerCaseEmail,
        password: hashedPassword,
        role: "admin",
      },
    });
    return { status: 200, data: user };
  } catch (error) {
    return { status: 500, data: error };
  }
};

// User logic part
async function getAllUsers() {
  try {
    const users = await prisma.user.findMany();
    return users;
  } catch (error) {
    throw new Error(`Error fetching users: ${error.message}`);
  }
}

const getAllGirlsUsersWithAllInfo = async () => {
  try {
    const users = await prisma.user.findMany({
      where: {
        role: "girl", // Filter users by role 'girl'
      },
    });

    const usersWithGirls = await Promise.all(
      users.map(async (user) => {
        if (!user.girlId) return null; // Skip users without a girlId

        const girl = await prisma.girl.findUnique({
          where: {
            id: user.girlId,
          },
          include: {
            city: true, // Include city details
            services: true, // Include services
            verification: true, // Include verification details
            sessionPrices: true, // Include Prices
            subscription: true, // Include Subscritpion
          },
        });

        return girl ? { ...user, girl } : null;
      })
    );

    return {
      status: 200,
      data: usersWithGirls.filter((user) => user !== null), // Filter out null values
    };
  } catch (error) {
    console.error("Error fetching users with role 'girl':", error);
    return { status: 500, data: error };
  }
};

async function getUserById(userId) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }

    return user;
  } catch (error) {
    throw new Error(`Error fetching user by ID: ${error.message}`);
  }
}

const registerGirlUser = async (req) => {
  const { email, phoneNumber, password, bday, cityId } = req.body;

  try {
    // Step 1: Create a verification
    const verificationResult = await girlService.createVerification(bday);
    const verificationId = verificationResult.verificationId;

    // Step 2: Create a prices object for the girl
    const pricesObject = await girlService.createPricesObject();
    const pricesObjectId = pricesObject.pricesObjectId;

    // Step 3: Create a Subscription Object for the girl
    const subscription = await girlService.createSubscription();
    const subscriptionId = subscription.subscriptionId;

    // Step 4: Create a girl with the verification ID
    const girlResult = await girlService.createGirl(bday, phoneNumber, cityId, verificationId, pricesObjectId, subscriptionId);
    const girlId = girlResult.data.id;

    // update verification, prices, and subscription to add girl id
    const updatedVerification = await prisma.verification.update({
      where: {
        id: verificationId,
      },
      data: {
        girlId: girlId,
      },
    });
    const updatedPrices = await prisma.prices.update({
      where: {
        id: pricesObjectId,
      },
      data: {
        girlId: girlId,
      },
    });
    const updatedSubscription = await prisma.subscription.update({
      where: {
        id: subscriptionId,
      },
      data: {
        girlId: girlId,
      },
    });

    // Step 5: Create a user with the girl ID
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: "girl",
        girlId: girlId,
      },
    });

    console.log("worked");
    return { status: 200, data: user };
  } catch (error) {
    console.log(error);
    return { status: 500, data: error };
  }
};

async function updateGirl(req) {
  const { id, sessionPricesId, sessionPrices, ...updateData } = req.body; // Extract the 'serviceIds' field

  // Exclude the 'verification' field from the updateData object
  delete updateData.verification;
  delete updateData.verificationId;
  delete updateData.subscriptionId;
  delete updateData.subscription;
  delete updateData.verificationId;
  delete updateData.sessionPricesId;
  delete updateData.sessionPrices;

  try {
    const girl = await prisma.girl.update({
      where: {
        id,
      },
      data: {
        ...updateData,
        city: {
          connect: {
            id: updateData.city.id,
          },
        },
        services: {
          connect: updateData.services.map((service) => ({
            id: service.id,
          })),
        },
      },
    });
    const updatedPrices = await prisma.prices.update({
      where: { id: sessionPricesId },
      data: {
        ...sessionPrices,
      },
    });

    return { status: 200, data: { girl, sessionPrices } };
  } catch (error) {
    console.error("Error updating girl:", error);
    return { status: 500, data: error };
  }
}

async function deleteUserById(userId) {
  try {
    // Check if the user exists before deleting
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }

    // Delete the user
    await prisma.user.delete({
      where: {
        id: userId,
      },
    });

    return { success: true, message: `User with ID ${userId} has been deleted` };
  } catch (error) {
    console.error(error); // Log the error for debugging
    return { success: false, message: "An error occurred while deleting the user" };
  }
}

// Service logic part
const createService = async (req) => {
  const { name, description } = req.body;

  try {
    const service = await prisma.service.create({
      data: {
        name,
        description,
      },
    });
    return { status: 200, data: service };
  } catch (error) {
    console.error("Error creating service:", error);
    return { status: 500, data: error };
  }
};

const updateService = async (req) => {
  const { id, name, description } = req.body;

  try {
    const service = await prisma.service.update({
      where: {
        id: id,
      },
      data: {
        name,
        description,
      },
    });
    return { status: 200, data: service };
  } catch (error) {
    console.error("Error updating service:", error);
    return { status: 500, data: error };
  }
};

const deleteService = async (serviceId) => {
  try {
    await prisma.service.delete({
      where: {
        id: serviceId,
      },
    });
    return { status: 200, message: `Service with ID ${serviceId} has been deleted` };
  } catch (error) {
    console.error("Error deleting service:", error);
    return { status: 500, data: error };
  }
};

// Specific Location logic part
const createSpecificLocation = async (req) => {
  const { name } = req.body;
  try {
    const specificLocation = await prisma.specificLocation.create({
      data: {
        name,
      },
    });
    return { status: 200, data: specificLocation };
  } catch (error) {
    console.error("Error creating specific location:", error);
    return { status: 500, data: error };
  }
};

const updateSpecificLocationName = async (req) => {
  const { id, name } = req.body;

  try {
    const specificLocation = await prisma.specificLocation.update({
      where: {
        id: id,
      },
      data: {
        name: name,
      },
    });
    return { status: 200, data: specificLocation };
  } catch (error) {
    console.error("Error updating specific location name:", error);
    return { status: 500, data: error };
  }
};

const deleteSpecificLocation = async (specificLocationId) => {
  try {
    await prisma.specificLocation.delete({
      where: {
        id: specificLocationId,
      },
    });
    return { status: 200, message: `Specific Location with ID: ${specificLocationId} has been deleted` };
  } catch (error) {
    console.error("Error deleting specific location:", error);
    return { status: 500, data: error };
  }
};

// Ethnicity Location logic part
const createEthnicity = async (req) => {
  const { name } = req.body;
  try {
    const ethnicity = await prisma.ethnicity.create({
      data: {
        name,
      },
    });
    return { status: 200, data: ethnicity };
  } catch (error) {
    console.error("Error creating ethnicity:", error);
    return { status: 500, data: error };
  }
};

const updateEthnicityName = async (req) => {
  const { id, name } = req.body;

  try {
    const ethnicity = await prisma.ethnicity.update({
      where: {
        id: id,
      },
      data: {
        name: name,
      },
    });
    return { status: 200, data: ethnicity };
  } catch (error) {
    console.error("Error updating ethnicity name:", error);
    return { status: 500, data: error };
  }
};

const deleteEthnicity = async (ethnicityId) => {
  try {
    await prisma.ethnicity.delete({
      where: {
        id: ethnicityId,
      },
    });
    return { status: 200, message: `Ethnicity with ID: ${ethnicityId} has been deleted` };
  } catch (error) {
    console.error("Error deleting Ethnicity:", error);
    return { status: 500, data: error };
  }
};

module.exports = {
  createCity,
  updateCityName,
  deleteCity,
  updateVerification,
  registerAdminUser,
  getAllUsers,
  getUserById,
  deleteUserById,
  createService,
  updateService,
  deleteService,
  getAllGirlsUsersWithAllInfo,
  updateGirl,
  registerGirlUser,
  createSpecificLocation,
  updateSpecificLocationName,
  deleteSpecificLocation,
  createEthnicity,
  updateEthnicityName,
  deleteEthnicity,
};
