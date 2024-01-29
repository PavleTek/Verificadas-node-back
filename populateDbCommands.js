const userService = require("./user/userService.js");
const girlService = require("./girl/girlService.js");
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
  email: "girl1@edu.com",
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
    console.log(result);
  }
}

async function createAdmin(user) {
  await adminService.registerAdminUser({ body: user });
}

async function logAllUsers() {
  const allUsers = await adminService.getAllUsers();
  console.log(allUsers);
}

async function activateGirlById(id) {
  const girlObj1 = await girlService.getGirlById(id);
  console.log(girlObj1);
  const updatedGirl = { ...girlObj1, active: true };
  const req = { body: updatedGirl };
  girlService.updateGirl(req);
}

logAllUsers();
// createAdmin(adminUser2);
