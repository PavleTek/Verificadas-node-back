const prisma = require("../prisma.js");
const bcrypt = require("bcrypt");
const girlService = require("../girl/girlService.js");

// City logic part
const createCity = async (req) => {
  const { name, metaTitle, metaDescription } = req.body;
  try {
    const city = await prisma.city.create({
      data: {
        name,
        metaTitle: metaTitle,
        metaDescription: metaDescription,
      },
    });
    return { status: 200, data: city };
  } catch (error) {
    console.error("Error creating city:", error);
    return { status: 500, data: error };
  }
};

const updateCityName = async (req) => {
  const { id, name, metaTitle, metaDescription } = req.body;

  try {
    const city = await prisma.city.update({
      where: {
        id: id,
      },
      data: {
        name: name,
        metaTitle: metaTitle,
        metaDescription: metaDescription,
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

const updateAllCities = async (cities) => {
  try {
    // Fetch all cities from the database
    const existingCities = await prisma.city.findMany();

    // Iterate through the provided cities array
    for (const city of cities) {
      const { id, name, metaTitle, metaDescription } = city;

      // Check if the city exists in the database
      const existingCity = existingCities.find((n) => n.id === id);

      if (existingCity) {
        // Update the existing city
        const updatedCity = await prisma.city.update({
          where: {
            id: existingCity.id,
          },
          data: {
            name: capitalizeFirstLetter(name),
            metaTitle: capitalizeFirstLetterOnly(metaTitle),
            metaDescription: capitalizeFirstLetterOnly(metaDescription),
          },
        });
      } else {
        await prisma.city.create({
          data: {
            name: capitalizeFirstLetter(name),
            metaTitle: capitalizeFirstLetterOnly(metaTitle),
            metaDescription: capitalizeFirstLetterOnly(metaDescription),
          },
        });
      }
    }

    // Delete cities that are not present in the new array
    const newCityIds = cities.map((n) => n.id);
    const citiesToDelete = existingCities.filter((n) => !newCityIds.includes(n.id));
    for (const cityToDelete of citiesToDelete) {
      await prisma.city.delete({
        where: {
          id: cityToDelete.id,
        },
      });
    }

    return { status: 200, message: "Cities updated successfully" };
  } catch (error) {
    console.error("Error updating cities:", error);
    return { status: 500, message: "Internal server error" };
  }
};

// Blog Logic Part
const createBlog = async (req) => {
  const { title, content, shortDescription, metaTitle, metaDescription, category } = req.body;
  try {
    const blog = await prisma.blog.create({
      data: {
        title,
        content,
        category,
        shortDescription,
        metaTitle,
        metaDescription,
      },
    });
    return { status: 200, data: blog };
  } catch (error) {
    console.error("Error creating blog:", error);
    return { status: 500, data: error };
  }
};

const updateBlog = async (req) => {
  const { id, title, content, category, shortDescription, metaTitle, metaDescription } = req.body;

  try {
    const blog = await prisma.blog.update({
      where: {
        id: id,
      },
      data: {
        title: title,
        category: category,
        content: content,
        shortDescription: shortDescription,
        shortDescription: shortDescription,
        metaTitle: metaTitle,
        metaDescription: metaDescription,
      },
    });
    return { status: 200, data: blog };
  } catch (error) {
    console.error("Error updating Blog Article:", error);
    return { status: 500, data: error };
  }
};

const deleteBlogById = async (blogId) => {
  try {
    await prisma.blog.delete({
      where: {
        id: blogId,
      },
    });
    return { status: 200, message: `Blog with ID ${blogId} has been deleted` };
  } catch (error) {
    console.error("Error deleting blog:", error);
    return { status: 500, data: error };
  }
};

// Verification update
const updateVerification = async (req) => {
  const { girlId, verificationId, verificationData, girlData, adminData, scheduleLink } = req.body;
  try {
    const verificationStatus = verificationData.status;
    if (verificationStatus === "Verified") {
      verificationData.verificationDate = new Date();
      verificationData.verifiedBy = adminData.id;
    }
    delete verificationData.carnetAtras;
    delete verificationData.carnetFrontal;
    const verification = await prisma.verification.update({
      where: {
        id: verificationId,
      },
      data: verificationData,
    });
    const girl = await prisma.girl.update({
      where: {
        id: girlId,
      },
      data: girlData,
    });
    return { status: 200, data: { verification, girl } };
  } catch (error) {
    console.error("Error updating verification Information:", error);
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
            nationality: true,
            ethnicity: true,
            specificLocation: true,
            services: true, // Include services
            paidServices: true,
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
  const { email, name, phoneNumber, password, bday, cityId, welcomeMessage, paymentTier, anounceRequestId } = req.body;

  try {
    // Step 1: Create a verification
    const verificationResult = await girlService.createVerification(bday, name);
    const verificationId = verificationResult.verificationId;

    // Step 2: Create a prices object for the girl
    const pricesObject = await girlService.createPricesObject();
    const pricesObjectId = pricesObject.pricesObjectId;

    // Step 3: Create a Subscription Object for the girl
    const subscription = await girlService.createSubscription();
    const subscriptionId = subscription.subscriptionId;

    // Step 4: Create a girl with the verification ID
    const girlResult = await girlService.createGirl(bday, phoneNumber, cityId, verificationId, pricesObjectId, subscriptionId, paymentTier);
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
        welcomeMessage: welcomeMessage,
      },
    });

    if (anounceRequestId && anounceRequestId !== 0) {
      // Delete the user
      await prisma.notification.deleteMany({
        where: {
          searchId: anounceRequestId,
        },
      });
      await prisma.anounceRequest.delete({
        where: {
          id: anounceRequestId,
        },
      });
    }

    return { status: 200, data: user };
  } catch (error) {
    console.error(error);
    return { status: 500, data: error };
  }
};

async function setUserWelcomeSentTrue(userId) {
  try {
    await prisma.user.update({
      where: { id: parseInt(userId) },
      data: {
        welcomeSent: true,
      },
    });
    return { status: 200 };
  } catch (error) {
    return { status: 500, data: error };
  }
}

async function setPasswordChangeSentTrue(userId) {
  try {
    await prisma.user.update({
      where: { id: parseInt(userId) },
      data: {
        changePasswordSent: true,
      },
    });
    return { status: 200 };
  } catch (error) {
    return { status: 500, data: error };
  }
}

async function updateGirl(req) {
  const { id, sessionPricesId, sessionPrices, ...updateData } = req.body; // Extract the 'serviceIds' field

  // Exclude the 'verification' field from the updateData object
  delete updateData.verification;
  delete updateData.verificationId;
  delete updateData.subscriptionId;
  delete updateData.specificLocationId;
  delete updateData.ethnicityId;
  delete updateData.nationalityId;
  delete updateData.subscription;
  delete updateData.verificationId;
  delete updateData.sessionPricesId;
  delete updateData.sessionPrices;

  try {
    // Fetch the current girl's services to determine which to disconnect
    const currentGirl = await prisma.girl.findUnique({
      where: { id },
      include: {
        services: true,
        paidServices: true,
      },
    });

    const currentServiceIds = currentGirl.services.map((service) => service.id);
    const currentPaidServiceIds = currentGirl.paidServices.map((service) => service.id);

    const newServiceIds = services.map((service) => service.id);
    const newPaidServiceIds = paidServices.map((service) => service.id);

    const disconnectServices = currentServiceIds.filter((id) => !newServiceIds.includes(id)).map((id) => ({ id }));
    const disconnectPaidServices = currentPaidServiceIds.filter((id) => !newPaidServiceIds.includes(id)).map((id) => ({ id }));

    const girl = await prisma.girl.update({
      where: { id },
      data: {
        ...updateData,
        city: { connect: { id: updateData.city.id } },
        nationality: { connect: { id: updateData.nationality.id } },
        ethnicity: { connect: { id: updateData.ethnicity.id } },
        specificLocation: { connect: { id: updateData.specificLocation.id } },
        services: {
          connect: newServiceIds.map((id) => ({ id })),
          disconnect: disconnectServices,
        },
        paidServices: {
          connect: newPaidServiceIds.map((id) => ({ id })),
          disconnect: disconnectPaidServices,
        },
      },
    });

    const updatedPrices = await prisma.prices.update({
      where: { id: sessionPricesId },
      data: {
        ...sessionPrices,
      },
    });

    return { status: 200, data: girl };
  } catch (error) {
    console.error("Error updating girl:", error);
    return { status: 500, data: error };
  }
}

async function updateGirlPhysicalVerification(req) {
  const { girlData, girlId } = req.body;
  try {
    // Fetch the current attributes of the girl
    const girl = await prisma.girl.findUnique({
      where: { id: girlId },
    });

    if (!girl) {
      throw new Error("Girl not found");
    }

    const currentAttributes = girl.attributes;
    const attributesToUpdate = girlData.attributes;
    const newAttributes = {
      eyes: attributesToUpdate.eyes,
      hair: attributesToUpdate.hair,
      tatoos: currentAttributes.tatoos,
      shaving: currentAttributes.shaving,
      smoking: currentAttributes.smoking,
      chestSize: attributesToUpdate.chestSize,
      languages: currentAttributes.languages,
      bottomSize: attributesToUpdate.bottomSize,
      contexture: attributesToUpdate.contexture,
      attentionAtHotels: currentAttributes.attentionAtHotels,
      attentionAtGirlPlace: currentAttributes.attentionAtGirlPlace,
      attentionAtClientPlace: currentAttributes.attentionAtClientPlace,
    };
    girlData.attributes = newAttributes;

    // Perform checks on the current attributes and the proposed changes
    // Example: Check if the new attributes are within valid ranges

    // Update the girl's attributes if the changes are valid

    const updatedGirl = await prisma.girl.update({
      where: { id: girlId },
      data: girlData,
    });

    return { status: 200, data: updatedGirl };
  } catch (error) {
    console.error("Error updating girl attributes:", error);
    return { status: 500, data: error.message };
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
      return { status: 500, message: "No user found, no user deleted" };
    }

    const girlId = user.girlId;
    if (girlId) {
      try {
        const deletedGirl = await prisma.girl.delete({
          where: {
            id: girlId,
          },
        });
        const pricesId = deletedGirl.sessionPricesId;
        const verificationId = deletedGirl.verificationId;
        const subscriptionId = deletedGirl.subscriptionId;
        await prisma.prices.delete({
          where: {
            id: pricesId,
          },
        });
        await prisma.verification.delete({
          where: {
            id: verificationId,
          },
        });
        await prisma.subscription.delete({
          where: {
            id: subscriptionId,
          },
        });
      } catch (error) {}
    }
    // Delete the user
    await prisma.user.delete({
      where: {
        id: userId,
      },
    });

    return { status: 200, message: `User with ID ${userId} has been deleted` };
  } catch (error) {
    console.error(error); // Log the error for debugging
    return { status: 500, message: "An error occurred while deleting the user" };
  }
}

// Service logic part
const createService = async (req) => {
  const { name, description, metaTitle, metaDescription } = req.body;

  try {
    const service = await prisma.service.create({
      data: {
        name,
        description,
        metaTitle: metaTitle,
        metaDescription: metaDescription,
      },
    });
    return { status: 200, data: service };
  } catch (error) {
    console.error("Error creating service:", error);
    return { status: 500, data: error };
  }
};

const updateService = async (req) => {
  const { id, name, description, metaTitle, metaDescription } = req.body;

  try {
    const service = await prisma.service.update({
      where: {
        id: id,
      },
      data: {
        name,
        description,
        metaTitle: metaTitle,
        metaDescription: metaDescription,
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

const updateAllServices = async (services) => {
  try {
    // Fetch all services from the database
    const existingServices = await prisma.service.findMany();

    // Iterate through the provided services array
    for (const service of services) {
      const { id, name, description, metaTitle, metaDescription } = service;

      // Check if the service exists in the database
      const existingService = existingServices.find((n) => n.id === id);

      if (existingService) {
        // Update the existing service
        await prisma.service.update({
          where: {
            id: existingService.id,
          },
          data: {
            name: capitalizeFirstLetter(name),
            description: capitalizeFirstLetterOnly(description),
            metaTitle: capitalizeFirstLetterOnly(metaTitle),
            metaDescription: capitalizeFirstLetterOnly(metaDescription),
          },
        });
      } else {
        await prisma.service.create({
          data: {
            name: capitalizeFirstLetter(name),
            description: capitalizeFirstLetterOnly(description),
            metaTitle: capitalizeFirstLetterOnly(metaTitle),
            metaDescription: capitalizeFirstLetterOnly(metaDescription),
          },
        });
      }
    }

    // Delete services that are not present in the new array
    const newServiceIds = services.map((n) => n.id);
    const servicesToDelete = existingServices.filter((n) => !newServiceIds.includes(n.id));
    for (const serviceToDelete of servicesToDelete) {
      await prisma.service.delete({
        where: {
          id: serviceToDelete.id,
        },
      });
    }

    return { status: 200, message: "Services updated successfully" };
  } catch (error) {
    console.error("Error updating services:", error);
    return { status: 500, message: "Internal server error" };
  }
};

// Specific Location logic part
const createSpecificLocation = async (req) => {
  const { name, metaTitle, metaDescription } = req.body;
  try {
    const specificLocation = await prisma.specificLocation.create({
      data: {
        name,
        metaTitle: metaTitle,
        metaDescription: metaDescription,
      },
    });
    return { status: 200, data: specificLocation };
  } catch (error) {
    console.error("Error creating specific location:", error);
    return { status: 500, data: error };
  }
};

const updateSpecificLocationName = async (req) => {
  const { id, name, metaTitle, metaDescription } = req.body;

  try {
    const specificLocation = await prisma.specificLocation.update({
      where: {
        id: id,
      },
      data: {
        name: name,
        metaTitle: metaTitle,
        metaDescription: metaDescription,
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

const updateAllSpecificLocations = async (specificLocations) => {
  try {
    // Fetch all specific locations from the database
    const existingSpecificLocations = await prisma.specificLocation.findMany();

    // Iterate through the provided specific locations array
    for (const specificLocation of specificLocations) {
      const { id, name, metaTitle, metaDescription } = specificLocation;

      // Check if the specific Location exists in the database
      const existingSpecificLocation = existingSpecificLocations.find((n) => n.id === id);

      if (existingSpecificLocation) {
        // Update the existing specific Location
        await prisma.specificLocation.update({
          where: {
            id: existingSpecificLocation.id,
          },
          data: {
            name: capitalizeFirstLetter(name),
            metaTitle: capitalizeFirstLetterOnly(metaTitle),
            metaDescription: capitalizeFirstLetterOnly(metaDescription),
          },
        });
      } else {
        await prisma.specificLocation.create({
          data: {
            name: capitalizeFirstLetter(name),
            metaTitle: capitalizeFirstLetterOnly(metaTitle),
            metaDescription: capitalizeFirstLetterOnly(metaDescription),
          },
        });
      }
    }

    // Delete specific locations that are not present in the new array
    const newSpecificLocationIds = specificLocations.map((n) => n.id);
    const specificLocationsToDelete = existingSpecificLocations.filter((n) => !newSpecificLocationIds.includes(n.id));
    for (const specificLocationToDelete of specificLocationsToDelete) {
      await prisma.specificLocation.delete({
        where: {
          id: specificLocationToDelete.id,
        },
      });
    }

    return { status: 200, message: "specific locations updated successfully" };
  } catch (error) {
    console.error("Error updating specific locations:", error);
    return { status: 500, message: "Internal server error" };
  }
};

// Ethnicity Location logic part
const createEthnicity = async (req) => {
  const { name, metaTitle, metaDescription } = req.body;
  try {
    const ethnicity = await prisma.ethnicity.create({
      data: {
        name,
        metaTitle: metaTitle,
        metaDescription: metaDescription,
      },
    });
    return { status: 200, data: ethnicity };
  } catch (error) {
    console.error("Error creating ethnicity:", error);
    return { status: 500, data: error };
  }
};

const updateEthnicityName = async (req) => {
  const { id, name, metaTitle, metaDescription } = req.body;

  try {
    const ethnicity = await prisma.ethnicity.update({
      where: {
        id: id,
      },
      data: {
        name: name,
        metaTitle: metaTitle,
        metaDescription: metaDescription,
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

const updateAllEthnicities = async (ethnicities) => {
  try {
    // Fetch all ethnicities from the database
    const existingEthnicities = await prisma.ethnicity.findMany();

    // Iterate through the provided ethnicities array
    for (const ethnicity of ethnicities) {
      const { id, name, metaTitle, metaDescription } = ethnicity;

      // Check if the ethnicity exists in the database
      const existingEthnicity = existingEthnicities.find((n) => n.id === id);

      if (existingEthnicity) {
        // Update the existing ethnicity
        await prisma.ethnicity.update({
          where: {
            id: existingEthnicity.id,
          },
          data: {
            name: capitalizeFirstLetter(name),
            metaTitle: capitalizeFirstLetterOnly(metaTitle),
            metaDescription: capitalizeFirstLetterOnly(metaDescription),
          },
        });
      } else {
        await prisma.ethnicity.create({
          data: {
            name: capitalizeFirstLetter(name),
            metaTitle: capitalizeFirstLetterOnly(metaTitle),
            metaDescription: capitalizeFirstLetterOnly(metaDescription),
          },
        });
      }
    }

    // Delete ethnicities that are not present in the new array
    const newEthnicityIds = ethnicities.map((n) => n.id);
    const ethnicitiesToDelete = existingEthnicities.filter((n) => !newEthnicityIds.includes(n.id));
    for (const ethnicityToDelete of ethnicitiesToDelete) {
      await prisma.ethnicity.delete({
        where: {
          id: ethnicityToDelete.id,
        },
      });
    }

    return { status: 200, message: "Ethnicities updated successfully" };
  } catch (error) {
    console.error("Error updating Ethnicities:", error);
    return { status: 500, message: "Internal server error" };
  }
};

// Nationality logic part
const createNationality = async (req) => {
  const { name, metaTitle, metaDescription } = req.body;
  try {
    const nationality = await prisma.nationality.create({
      data: {
        name,
        metaTitle: metaTitle,
        metaDescription: metaDescription,
      },
    });
    return { status: 200, data: nationality };
  } catch (error) {
    console.error("Error creating nationality:", error);
    return { status: 500, data: error };
  }
};

const updateNationality = async (req) => {
  const { id, name, metaTitle, metaDescription } = req.body;

  try {
    const nationality = await prisma.nationality.update({
      where: {
        id: id,
      },
      data: {
        name: name,
        metaTitle: metaTitle,
        metaDescription: metaDescription,
      },
    });
    return { status: 200, data: nationality };
  } catch (error) {
    console.error("Error updating nationality name:", error);
    return { status: 500, data: error };
  }
};

const deleteNationality = async (nationalityId) => {
  try {
    await prisma.nationality.delete({
      where: {
        id: nationalityId,
      },
    });
    return { status: 200, message: `Nationality with ID: ${nationalityId} has been deleted` };
  } catch (error) {
    console.error("Error deleting Nationality:", error);
    return { status: 500, data: error };
  }
};

const updateAllNationalities = async (nationalities) => {
  try {
    // Fetch all nationalities from the database
    const existingNationalities = await prisma.nationality.findMany();

    // Iterate through the provided nationalities array
    for (const nationality of nationalities) {
      const { id, name, metaTitle, metaDescription } = nationality;

      // Check if the nationality exists in the database
      const existingNationality = existingNationalities.find((n) => n.id === id);

      if (existingNationality) {
        // Update the existing nationality
        await prisma.nationality.update({
          where: {
            id: existingNationality.id,
          },
          data: {
            name: capitalizeFirstLetter(name),
            metaTitle: capitalizeFirstLetterOnly(metaTitle),
            metaDescription: capitalizeFirstLetterOnly(metaDescription),
          },
        });
      } else {
        // Create a new nationality
        await prisma.nationality.create({
          data: {
            name: capitalizeFirstLetter(name),
            metaTitle: capitalizeFirstLetterOnly(metaTitle),
            metaDescription: capitalizeFirstLetterOnly(metaDescription),
          },
        });
      }
    }

    // Delete nationalities that are not present in the new array
    const newNationalityIds = nationalities.map((n) => n.id);
    const nationalitiesToDelete = existingNationalities.filter((n) => !newNationalityIds.includes(n.id));
    for (const nationalityToDelete of nationalitiesToDelete) {
      await prisma.nationality.delete({
        where: {
          id: nationalityToDelete.id,
        },
      });
    }

    return { status: 200, message: "Nationalities updated successfully" };
  } catch (error) {
    console.error("Error updating nationalities:", error);
    return { status: 500, message: "Internal server error" };
  }
};

// CENSS = City, ethnicity, nationality, service, specific Location
// This function is for when using the excel upload method
const bulkUpdateCENSS = async (req) => {
  try {
    const { type, data } = req.body;
    if (type === "city") {
      const response = await updateAllCities(data);
      return response;
    } else if (type === "nationality") {
      const response = await updateAllNationalities(data);
      return response;
    } else if (type === "specificLocation") {
      const response = await updateAllSpecificLocations(data);
      return response;
    } else if (type === "ethnicity") {
      const response = await updateAllEthnicities(data);
      return response;
    } else if (type === "service") {
      const response = await updateAllServices(data);
      return response;
    }
  } catch (error) {
    return { status: 500, data: error };
  }
};

const capitalizeFirstLetter = (str) => {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

const capitalizeFirstLetterOnly = (str) => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Pricing Plan logic
async function createPricingPlan(req) {
  try {
    const { name, price, discount, discountMessage } = req.body;
    const pricingPlan = await prisma.pricingPlan.create({
      data: {
        name,
        price,
        discount,
        discountMessage,
      },
    });
    return { status: 200, data: pricingPlan };
  } catch (error) {
    console.error("Error creating pricing plan", error);
    return { status: 500, data: error };
  }
}

async function updatePricingPlan(req) {
  try {
    const { id, name, price, discount, discountMessage } = req.body;
    const pricingPlan = await prisma.pricingPlan.update({
      where: {
        id: id,
      },
      data: {
        name: name,
        price: price,
        discount: discount,
        discountMessage: discountMessage,
      },
    });
    return { status: 200, data: pricingPlan };
  } catch (error) {
    console.error("Error updating PricingPlan", error);
    return { status: 500, data: error };
  }
  F;
}

async function deletePricingPlan(pricingPlanId) {
  try {
    await prisma.pricingPlan.delete({
      where: {
        id: pricingPlanId,
      },
    });
    return { status: 200, data: `pricing Plan with ID ${pricingPlanId} has been deleted` };
  } catch (error) {
    console.error("Error deleting Pricing Plan:", error);
    return { status: 500, data: error };
  }
}

// category SEO Logic

async function createCategorySeo(req) {
  try {
    const { name, metaTitle, metaDescription } = req.body;
    const seoCategory = await prisma.seoCategory.create({
      data: {
        name,
        metaTitle,
        metaDescription,
      },
    });
    return { status: 200, data: seoCategory };
  } catch (error) {
    console.error("Error creating category for SEO", error);
    return { status: 500, data: error };
  }
}

async function updateCategorySeo(req) {
  try {
    const { id, name, metaTitle, metaDescription } = req.body;
    const seoCategory = await prisma.seoCategory.update({
      where: {
        id: id,
      },
      data: {
        name: name,
        metaTitle: metaTitle,
        metaDescription: metaDescription,
      },
    });
    return { status: 200, data: seoCategory };
  } catch (error) {
    console.error("Error updating SEO Category", error);
    return { status: 500, data: error };
  }
  F;
}

async function deleteCategorySeoById(categoryId) {
  try {
    await prisma.seoCategory.delete({
      where: {
        id: categoryId,
      },
    });
    return { status: 200, data: `Seo Category with ID ${categoryId} has been deleted` };
  } catch (error) {
    console.error("Error deleting Category:", error);
    return { status: 500, data: error };
  }
}

// banner logic
async function updateBanner(req) {
  try {
    const { bannerMessage, title } = req.body;
    const firstBanner = await prisma.banner.findFirst();
    if (firstBanner) {
      const banner = await prisma.banner.update({
        where: {
          id: firstBanner.id,
        },
        data: {
          title: title,
          message: bannerMessage,
        },
      });
      return { status: 200, data: banner };
    } else {
      return { status: 200, data: { message: "No banner was found" } };
    }
  } catch (error) {
    console.error("Error updating banner Message:", error);
    return { status: 200, data: error };
  }
}

async function updateShowBannerValue(req) {
  try {
    const { showBannerValue } = req.body;
    const firstBanner = await prisma.banner.findFirst();
    if (firstBanner) {
      const banner = await prisma.banner.update({
        where: {
          id: firstBanner.id,
        },
        data: {
          showBanner: showBannerValue,
        },
      });
      return { status: 200, data: banner };
    } else {
      return { status: 200, data: { message: "No banner was found" } };
    }
  } catch (error) {
    console.error("Error updating banner Show value:", error);
    return { status: 200, data: error };
  }
}

async function initializeBanner() {
  try {
    // Check if a banner exists
    const existingBanner = await prisma.banner.findFirst();

    // If no banner exists, create one with default values
    if (!existingBanner) {
      await prisma.banner.create({
        data: {
          message: "",
          showBanner: false,
          title: "",
        },
      });
    }
  } catch (error) {
    console.error("Error initializing banner:", error);
  }
}

async function getAnounceRequestById(anounceRequestId) {
  try {
    const anounceRequest = await prisma.anounceRequest.findUnique({ where: { id: anounceRequestId } });
    return { status: 200, data: anounceRequest };
  } catch (error) {
    console.error(error);
    return { status: 500, data: error };
  }
}

async function deleteAnounceRequest(anounceRequestId) {
  try {
    await prisma.anounceRequest.delete({
      where: {
        id: anounceRequestId,
      },
    });
    return { status: 200 };
  } catch (error) {
    console.error(error);
    return { status: 500, data: error };
  }
}

async function getAllNotifications() {
  try {
    const notifications = await prisma.notification.findMany();
    return { status: 200, data: notifications };
  } catch (error) {
    console.error(error);
    return { status: 500, data: error };
  }
}

async function deleteNotification(notificationId) {
  try {
    await prisma.notification.delete({
      where: {
        id: notificationId,
      },
    });
    return { status: 200 };
  } catch (error) {
    console.error(error);
    return { status: 500, data: error };
  }
}

module.exports = {
  createCity,
  updateCityName,
  deleteCity,
  createBlog,
  updateBlog,
  deleteBlogById,
  updateVerification,
  updateGirlPhysicalVerification,
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
  setUserWelcomeSentTrue,
  setPasswordChangeSentTrue,
  updateEthnicityName,
  deleteEthnicity,
  createNationality,
  updateNationality,
  deleteNationality,
  bulkUpdateCENSS,
  createPricingPlan,
  updatePricingPlan,
  deletePricingPlan,
  updateBanner,
  updateShowBannerValue,
  initializeBanner,
  getAnounceRequestById,
  deleteAnounceRequest,
  getAllNotifications,
  deleteNotification,
  createCategorySeo,
  updateCategorySeo,
  deleteCategorySeoById,
};
