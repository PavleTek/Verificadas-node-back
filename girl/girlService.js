const prisma = require("../prisma.js");
const userService = require("../user/userService.js");
const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET_KEY;

// This function will only be called through function CreateGirlUser
// Will never be called independently through api
const createGirl = async (bday, phoneNumber, cityId, verificationId, pricesObjectId, subscriptionId) => {
  let girlPhoneNumber = "";
  if (phoneNumber) {
    girlPhoneNumber = phoneNumber;
  }
  try {
    const serviceIds = [];
    const multimedia = {
      verifiedUploaded: [],
      active: [],
      request: [],
    };
    const girl = await prisma.girl.create({
      data: {
        name: "",
        bday,
        active: false,
        bluredFace: false,
        cityId: cityId,
        specificLocationId: undefined,
        phoneNumber: girlPhoneNumber,
        description: "",
        ethnicityId: undefined,
        height: 160,
        weight: 60,
        chestCm: 90,
        waistCm: 60,
        bottomCm: 90,
        services: {
          connect: serviceIds.map((serviceId) => ({
            id: serviceId,
          })),
        },
        paidServices: {
          connect: serviceIds.map((serviceId) => ({
            id: serviceId,
          })),
        },
        parking: false,
        schedule: [
          {
            monday: { startTime: "00:00", endTime: "24:00" },
            tuesday: { startTime: "00:00", endTime: "24:00" },
            wednesday: { startTime: "00:00", endTime: "24:00" },
            thursday: { startTime: "00:00", endTime: "24:00" },
            friday: { startTime: "00:00", endTime: "24:00" },
            saturday: { startTime: "00:00", endTime: "24:00" },
            sunday: { startTime: "00:00", endTime: "24:00" },
          },
          {
            monday: undefined,
            tuesday: undefined,
            wednesday: undefined,
            thursday: undefined,
            friday: undefined,
            saturday: undefined,
            sunday: undefined,
          },
          {
            monday: undefined,
            tuesday: undefined,
            wednesday: undefined,
            thursday: undefined,
            friday: undefined,
            saturday: undefined,
            sunday: undefined,
          },
        ],
        attributes: {
          contexture: "",
          hair: "",
          eyes: "",
          chestSize: "",
          bottomSize: "",
          shaving: "",
          attentionAtHotels: true,
          attentionAtGirlPlace: true,
          attentionAtClientPlace: true,
          smoking: false,
          tatoos: false,
          languages: [],
        },
        images: multimedia,
        videos: multimedia,
        profilePicture: "",
        editLevel: "Nulo",
        countryOfOrigin: undefined,
        categories: [],
        sessionPricesId: pricesObjectId,
        verificationId: verificationId,
        paymentTier: "",
        subscriptionId: subscriptionId,
      },
    });
    return { status: 200, data: girl };
  } catch (error) {
    console.error("Error creating girl:", error);
    return { status: 500, data: error };
  }
};

const updateGirl = async (req) => {
  const { id, serviceIds, ...updateData } = req.body; // Extract the 'serviceIds' field

  try {
    const girl = await prisma.girl.update({
      where: {
        id,
      },
      data: {
        ...updateData, // Include other update data
        services: {
          // Use 'connect' to update the associated serviceIds
          connect: serviceIds.map((serviceId) => ({
            id: serviceId,
          })),
        },
      },
    });

    return { status: 200, data: girl };
  } catch (error) {
    console.error("Error updating girl:", error);
    return { status: 500, data: error };
  }
};

// This function will only be called through function CreateGirlUser
// Will never be called independently through api
const createVerification = async (bday) => {
  try {
    const verification = await prisma.verification.create({
      data: {
        carnetFrontal: "",
        carnetAtras: "",
        status: "Pending",
        name: "",
        lastname: "",
        bday: bday,
        rut: undefined,
        verificationDate: undefined,
        verifiedBy: undefined,
        girlId: undefined,
      },
    });
    return { status: 200, data: verification, verificationId: verification.id };
  } catch (error) {
    console.error("Error creating verification:", error);
    return { status: 500, data: error };
  }
};

// This function will only be called through function CreateGirlUser
// Will never be called independently through api
const createSubscription = async () => {
  try {
    const today = new Date();
    const pause = {
      available: true,
      startDate: undefined,
      endTime: undefined,
    };
    const subscription = await prisma.subscription.create({
      data: {
        active: false,
        expiryDate: today,
        DeactivationDate: today,
        firstPause: pause,
        secondPause: pause,
        ThirdPause: pause,
        payments: undefined,
        girlId: undefined,
      },
    });
    return { status: 200, data: subscription, subscriptionId: subscription.id };
  } catch (error) {
    console.error("Error creating Subscription:", error);
    return { status: 500, data: error };
  }
};

const createPricesObject = async () => {
  try {
    const pricesObject = await prisma.prices.create({
      data: {
        halfHourPrice: 0,
        oneHourPrice: 0,
        oneAndAHalfHourPrice: 0,
        twoHourPrice: 0,
        fourHourPrice: 0,
        dinnerPrice: 0,
        wholeNight: 0,
      },
    });
    return { status: 200, data: pricesObject, pricesObjectId: pricesObject.id };
  } catch (error) {
    console.error("Error creating Prices Object:", error);
    return { status: 500, data: error };
  }
};

const createClientReview = async (req) => {
  const data = req.body;
  try {
    // Find or create the client based on the provided phone number
    let client = await prisma.client.findUnique({
      where: {
        phoneNumber: data.phoneNumber,
      },
    });

    // If the client doesn't exist, create a new one
    if (!client) {
      client = await prisma.client.create({
        data: {
          phoneNumber: data.phoneNumber,
        },
      });
    }

    // Create the client review and associate it with the client
    const clientReview = await prisma.clientReview.create({
      data: {
        girlId: data.girlId,
        review: data.review,
        rating: data.rating,
        date: new Date(),
        client: {
          connect: {
            phoneNumber: data.phoneNumber,
          },
        },
      },
    });

    return { status: 200, data: clientReview };
  } catch (error) {
    console.error("Error creating client review:", error);
    return { status: 500, data: error };
  }
};

const getClientsByPhonePrefix = async (phoneNumberPrefix) => {
  console.log(phoneNumberPrefix);
  try {
    // Retrieve clients whose phone numbers contain the specified prefix
    const clients = await prisma.client.findMany({
      where: {
        phoneNumber: {
          contains: phoneNumberPrefix,
        },
      },
      take: 10,
      orderBy: {
        phoneNumber: "asc", // Sort by phone number in ascending order
      },
    });

    return { status: 200, data: clients };
  } catch (error) {
    console.error("Error retrieving clients by phone prefix:", error);
    return { status: 500, data: error };
  }
};

const getClientReviewsByPhoneNumber = async (phoneNumber) => {
  try {
    // Retrieve client reviews associated with the specified phone number
    const clientReviews = await prisma.clientReview.findMany({
      where: {
        phoneNumber: phoneNumber,
      },
    });

    return { status: 200, data: clientReviews };
  } catch (error) {
    console.error("Error retrieving client reviews by phone number:", error);
    return { status: 500, data: error };
  }
};

const getClientReviewsByGirlId = async (girlId) => {
  const parsedGirlId = parseInt(girlId, 10);
  try {
    const clientReviews = await prisma.clientReview.findMany({
      where: {
        girlId: parsedGirlId,
      },
    });
    return { status: 200, data: clientReviews };
  } catch (error) {
    console.error("Error retrieving client reviews:", error);
    return { status: 500, data: error };
  }
};

const deleteReviewById = async (reviewId, girlToken) => {
  const decoded = jwt.verify(girlToken, secretKey);
  const girlId = decoded.girlId;

  // Convert reviewId to a number
  const parsedReviewId = parseInt(reviewId, 10);

  try {
    // Check if the requesting girl matches the girlId associated with the review
    const review = await prisma.clientReview.findUnique({
      where: {
        id: parsedReviewId,
      },
      select: {
        girlId: true,
      },
    });

    if (!review) {
      throw new Error("Client review not found.");
    }

    if (review.girlId !== girlId) {
      throw new Error("Unauthorized to delete this client review.");
    }

    const deletedReview = await prisma.clientReview.delete({
      where: {
        id: parsedReviewId,
      },
    });
    return { status: 200, data: deletedReview };
  } catch (error) {
    console.error("Error deleting client review:", error);
    return { status: 500, data: error.message };
  }
};

const updateReviewById = async (reviewId, girlToken, updatedReview) => {
  const decoded = jwt.verify(girlToken, secretKey);
  const girlId = decoded.girlId;

  // Convert reviewId to a number
  const parsedReviewId = parseInt(reviewId, 10);

  try {
    // Check if the requesting girl matches the girlId associated with the review
    const review = await prisma.clientReview.findUnique({
      where: {
        id: parsedReviewId,
      },
      select: {
        girlId: true,
      },
    });

    if (!review) {
      throw new Error("Client review not found.");
    }

    if (review.girlId !== girlId) {
      throw new Error("Unauthorized to update this client review.");
    }

    const updatedReviewData = {
      review: updatedReview,
    };

    const updatedReviewResult = await prisma.clientReview.update({
      where: {
        id: parsedReviewId,
      },
      data: updatedReviewData,
    });

    return { status: 200, data: updatedReviewResult };
  } catch (error) {
    console.error("Error updating client review:", error);
    return { status: 500, data: error.message };
  }
};

const getGirlsByCityId = async (cityId) => {
  try {
    const girls = await prisma.girl.findMany({
      where: {
        cityId: Number(cityId),
        active: true, // Only fetch active girls
      },
    });
    return { status: 200, data: girls };
  } catch (error) {
    console.error("Error fetching active girls by city ID:", error);
    return { status: 500, data: error };
  }
};

const getGirlById = async (girlId) => {
  if (girlId !== undefined) {
    girlId = Number(girlId);
  }
  try {
    const girl = await prisma.girl.findUnique({
      where: {
        id: girlId,
      },
      include: {
        city: true, // Include city details
        services: true, // Include services
        verification: true, // Include verification details
        sessionPrices: true, // Include Prices
      },
    });

    if (!girl) {
      return { status: 404, data: "Girl not found" };
    }

    return { status: 200, data: girl };
  } catch (error) {
    console.error("Error fetching active girl by ID:", error);
    return { status: 500, data: error };
  }
};

const getAllServices = async () => {
  try {
    const services = await prisma.service.findMany({});
    return { status: 200, data: services };
  } catch (error) {
    console.error("Error fetching services:", error);
    throw error; // Or handle error as needed
  }
};

const getAllCities = async () => {
  try {
    const cities = await prisma.city.findMany({});
    return { status: 200, data: cities };
  } catch (error) {
    console.error("Error fetching cities:", error);
    throw error; // Or handle error as needed
  }
};

const getAllSpecificLocations = async () => {
  try {
    const locations = await prisma.specificLocation.findMany({});
    return { status: 200, data: locations };
  } catch (error) {
    console.error("Error fetching specific locations:", error);
    throw error; // Or handle error as needed
  }
};

const getAllEthnicities = async () => {
  try {
    const options = await prisma.ethnicity.findMany({});
    return { status: 200, data: options };
  } catch (error) {
    console.error("Error fetching ethnicities:", error);
    throw error; // Or handle error as needed
  }
};

module.exports = {
  createGirl,
  updateGirl,
  createVerification,
  getGirlsByCityId,
  getGirlById,
  getAllServices,
  getAllCities,
  createPricesObject,
  createSubscription,
  createClientReview,
  getAllSpecificLocations,
  getClientsByPhonePrefix,
  getClientReviewsByGirlId,
  deleteReviewById,
  getClientReviewsByPhoneNumber,
  getAllEthnicities,
  updateReviewById,
};
