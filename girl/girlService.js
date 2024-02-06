const prisma = require("../prisma.js");

// This function will only be called through function CreateGirlUser
// Will never be called independently through api
const createGirl = async (bday, cityId, verificationId, pricesObjectId) => {
  try {
    const serviceIds = [];
    const girl = await prisma.girl.create({
      data: {
        name: "",
        bday,
        active: false,
        bluredFace: false,
        cityId: cityId,
        specificLocation: "",
        phoneNumber: "",
        description: "",
        ethnicity: "",
        height: 0,
        weight: 0,
        chestCm: 0,
        waistCm: 0,
        bottomCm: 0,
        services: {
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
        images: [],
        videos: [],
        profilePicture: "",
        editLevel: 0,
        countryOfOrigin: undefined,
        categories: [],
        sessionPricesId: pricesObjectId,
        verificationId: verificationId,
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
        status: "pending",
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
  try {
    const girl = await prisma.girl.findUnique({
      where: {
        id: girlId,
        active: true, // Check if the girl is active
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

module.exports = {
  createGirl,
  updateGirl,
  createVerification,
  getGirlsByCityId,
  getGirlById,
  getAllServices,
  getAllCities,
  createPricesObject,
};
