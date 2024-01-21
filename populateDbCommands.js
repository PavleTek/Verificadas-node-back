const userService = require("./user/userService.js");
const girlService = require("./girl/girlService.js");
const adminService = require("./admin/adminService.js");

const adminUser = {
  email: "mpavle134@gmail.com",
  password: "admin",
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

userService.registerGirlUser({ body: { email: girlUser1.email, password: girlUser1.password, bday: girlUser1.bday, cityId: girlUser1.cityId } });
userService.registerGirlUser({ body: { email: girlUser2.email, password: girlUser2.password, bday: girlUser2.bday, cityId: girlUser2.cityId } });

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
createMultipleServices();
