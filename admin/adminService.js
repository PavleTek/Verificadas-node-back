const prisma = require("../prisma.js");
const bcrypt = require("bcrypt");

// City logic part
const createCity = async (req) => {
  const { name } = req.body;
  try {
    const city = await prisma.city.create({
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
    const city = await prisma.city.update({
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

const deleteCity = async (cityId) => {
  try {
    await prisma.city.delete({
      where: {
        id: cityId,
      },
    });
    console.log(`City with ID ${cityId} deleted`);
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
    console.log(`Verification with ID ${verification.id} updated`);
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
    console.log(`Service "${service.name}" created with ID ${service.id}`);
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
    console.log(`Service with ID ${service.id} updated`);
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
    console.log(`Service with ID ${serviceId} deleted`);
    return { status: 200, message: `Service with ID ${serviceId} has been deleted` };
  } catch (error) {
    console.error("Error deleting service:", error);
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
};
