require("dotenv").config();
const userService = require("./user/userService.js");
const fs = require("fs").promises;
const girlService = require("./girl/girlService.js");
const path = require("path");
const prisma = require("./prisma.js");
const adminService = require("./admin/adminService.js");
const { all } = require("./user/userController.js");

const adminUser = {
  email: "mpavle134@gmail.com",
  password: "admin",
  role: "admin",
};

const adminUser2 = {
  email: "asdf",
  password: "asdf",
  role: "admin",
};

const girlUser1 = {
  email: "testingGirl@edu.com",
  password: "asdf",
  bday: new Date(1999, 2, 2),
  cityId: 1,
};

const girlUser2 = {
  email: "girl2@edu.com",
  password: "asdf",
  bday: new Date(2003, 2, 2),
  cityId: 1,
};

async function createMultipleServices() {
  const services = [
    { name: "Oral Natural", description: "Oral sin presevativo" },
    { name: "Anal", description: "Anal" },
    { name: "Oral Americana", description: "Oral hasta venirse en la boca" },
    { name: "Besos", description: "Besos" },
  ];

  for (const service of services) {
    const request = {
      body: service,
    };
    const result = await adminService.createService(request);
  }
}

async function createAdmin(user) {
  await adminService.registerAdminUser({ body: user });
}

async function logAllUsers() {
  const allUsers = await adminService.getAllUsers();
}

async function createGirl() {
  const req = {
    body: {
      email: "zxcv",
      phoneNumber: "56976681508",
      password: "zxcv",
      bday: new Date(2001, 2, 2),
      cityId: 1,
      wellcomeMessage: "hello this is your message ASDASDASDASDSAD",
    },
  };
  await adminService.registerGirlUser(req);
}

async function createGirlAndAdminUser() {
  await createGirl();
  await createAdmin(adminUser2);
}

async function getAllUsers() {
  const response = await adminService.getAllGirlsUsersWithAllInfo();
}
async function deleteAllReviews() {
  const deletedReveiws = await prisma.clientReview.deleteMany();
  const deletedClients = await prisma.client.deleteMany();
}

async function deleteAllGirls() {
  try {
    const deletedGirls = await prisma.girl.deleteMany();
    const deleteAllUsers = await prisma.user.deleteMany();
    const deletedReveiws = await prisma.clientReview.deleteMany();
    const deletedClients = await prisma.client.deleteMany();
    const deletedVerifications = await prisma.verification.deleteMany();
    const deletePrices = await prisma.prices.deleteMany();
    const deletePayments = await prisma.subscriptionPayment.deleteMany();
    const deleteSubscriptions = await prisma.subscription.deleteMany();
    return { success: true, message: `Deleted ${deletedGirls.count} girls.` };
  } catch (error) {
    console.error("Error deleting girls:", error);
    return { success: false, message: "Failed to delete girls." };
  } finally {
    await prisma.$disconnect(); // Close the Prisma client connection
  }
}

async function fixUser() {
  const id = 107;
  const user = await prisma.user.findUnique({ where: { id } });
  const girlId = user.girlId;
  await prisma.girl.update({
    where: {
      id: girlId,
    },
    data: {
      images: { active: [], request: [], bluredFace: [] },
    },
  });
}

const beforeApprovalFolderPath = process.env.BEFORE_APPROVAL_IMAGES_FOLDER_PATH;

async function deleteImage(imageFileName) {
  try {
    imagePath = path.join(__dirname, beforeApprovalFolderPath, imageFileName);
    console.log("imagePath", imagePath);
    const fileExists = await fs
      .access(imagePath)
      .then(() => true)
      .catch(() => false);
    if (fileExists) {
      console.log("file exists");
      await fs.unlink(imagePath);
    }
  } catch (error) {
    console.error(`Error deleting image ${imageFileName}:`, error);
    return false;
  }
}

async function deleteBanner() {
  try {
    await prisma.banner.deleteMany();
    console.log("banner deleted succesfully");
  } catch (error) {
    console.error(error);
  }
}

// deleteAllGirls();
// createGirlAndAdminUser();
// deleteBanner();
fixUser();
