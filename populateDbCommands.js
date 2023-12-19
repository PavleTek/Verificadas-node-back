import * as userService from "./userService.js";

const adminUser = {
  email: "mpavle134@gmail.com",
  password: "admin",
  role: "admin",
};

const girlUser1 = {
  email: "girl1@edu.com",
  password: "asdf",
  role: "girl",
  girlId: 1,
};

const girlUser2 = {
  email: "girl2@edu.com",
  password: "asdf",
  role: "girl",
  girlId: 2,
};

const girlObj1 = {
  id: 1,
  name: "Antonia",
  age: new Date(1999, 2, 2),
  city: {
    id: 1,
    name: "Santiago",
  },
  specificLocation: "Manquehue",
  phoneNumber: "+2093078888",
  description: "Description_1",
  prices: [
    {
      price: 100,
      duration: "30 minutos",
    },
    {
      price: 200,
      duration: "1 Hora",
    },
    {
      price: 500,
      duration: "Noche Completa",
    },
  ],
  oneHourPrice: 200,
  ethnicity: "Caucasian",
  height: 200,
  weight: 81,
  chestCm: 94,
  waistCm: 64,
  bottomCm: 93,
  services: [
    {
      id: 1,
      name: "Service_78",
      description: "Service Description 71",
    },
  ],
  parking: true,
  schedule: {
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: [],
  },
  attributes: {
    contexture: "Athletic",
    hair: "Black",
    eyes: "Blue",
    chestSize: "Medium",
    bottomSize: "Extra Large",
    shaving: "Trimmed",
    attentionPlaces: ["Place_7"],
    smoking: "Yes",
    tatoos: "No",
    languages: ["English", "French"],
  },
  active: true,
  images: ["Image_7.jpg", "Image_1.jpg", "Image_7.jpg"],
  category: [GirlCategory.Bronze],
  editLevel: 2,
  countryOfOrigin: "Argentina",
  videos: [""],
  profilePicture: "",
};
