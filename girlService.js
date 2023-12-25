const prisma = require("./prisma/prisma.js");

// City logic part
const createCity = async (req) => {
  const { name } = req.body;
  try {
    const city = await prisma.City.create({
      data: {
        name,
      },
    });
    console.log(`City "${city.name}" created with ID ${city.id}`);
    return { status: 200, data: city };
  } catch (error) {
    console.error("Error creating city:", error);
    return { status: 500, data: error };
  }
};

const updateCityName = async (req) => {
  const { id, newName } = req.body;

  try {
    const city = await prisma.City.update({
      where: {
        id: id,
      },
      data: {
        name: newName,
      },
    });
    console.log(`City with ID ${city.id} updated with new name: ${city.name}`);
    return { status: 200, data: city };
  } catch (error) {
    console.error("Error updating city name:", error);
    return { status: 500, data: error };
  }
};

const createGirl = async (bday, cityId, verificationId) => {
  try {
    const girl = await prisma.Girl.create({
      data: {
        name: "",
        bday,
        active: false,
        bluredFace: false,
        cityId: cityId,
        specificLocation: "",
        phoneNumber: "",
        description: "",
        sessionPrices: [],
        oneHourPrice: 0,
        ethnicity: "",
        height: 0,
        weight: 0,
        chestCm: 0,
        waistCm: 0,
        bottomCm: 0,
        services: [],
        parking: false,
        schedule: {},
        attributes: {},
        images: [],
        videos: [],
        profilePicture: "",
        editLevel: 0,
        countryOfOrigin: undefined,
        categories: [],
        verificationId: verificationId,
      },
    });
    console.log(`Girl "${girl.name}" created with ID ${girl.id}`);
    return { status: 200, data: girl };
  } catch (error) {
    console.error("Error creating girl:", error);
    return { status: 500, data: error };
  }
};

const updateGirl = async (req) => {
  const { id, ...updateData } = req.body;

  try {
    const girl = await prisma.Girl.update({
      where: {
        id,
      },
      data: updateData,
    });
    console.log(`Girl with ID ${girl.id} updated`);
    return { status: 200, data: girl };
  } catch (error) {
    console.error("Error updating girl:", error);
    return { status: 500, data: error };
  }
};

const createVerification = async (bday) => {
  try {
    const verification = await prisma.Verification.create({
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
    console.log(`Verification created with ID ${verification.id}`);
    return { status: 200, data: verification, verificationId: verification.id };
  } catch (error) {
    console.error("Error creating verification:", error);
    return { status: 500, data: error };
  }
};

const updateVerification = async (req) => {
  const { id, ...updateData } = req.body;

  try {
    const verification = await prisma.Verification.update({
      where: {
        id,
      },
      data: updateData,
    });
    console.log(`Verification with ID ${verification.id} updated`);
    return { status: 200, data: verification };
  } catch (error) {
    console.error("Error updating verification:", error);
    return { status: 500, data: error };
  }
};

const getGirlsByCityId = async (cityId) => {
  try {
    const girls = await prisma.girl.findMany({
      where: {
        cityId: cityId,
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

module.exports = {
  createCity,
  updateCityName,
  createGirl,
  updateGirl,
  createVerification,
  updateVerification,
  getGirlsByCityId,
  getGirlById,
};
