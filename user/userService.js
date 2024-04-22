const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../prisma.js");
const girlService = require("../girl/girlService.js");

require("dotenv").config();
const secretKey = process.env.JWT_SECRET_KEY;

const registerGirlUser = async (req) => {
  const { email, password, bday, cityId } = req.body;

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
    const girlResult = await girlService.createGirl(bday, cityId, verificationId, pricesObjectId, subscriptionId);
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

    return { status: 200, data: user };
  } catch (error) {
    return { status: 500, data: error };
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(404).send("User not found");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).send("Invalid password");
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role, girlId: user.girlId }, secretKey, {
      expiresIn: "30d",
    });

    res.send({ token, role: user.role });
  } catch (error) {
    res.status(500).send(error, req.body);
  }
};

const verifyTokenAdmin = async (token) => {
  if (!token) {
    return false;
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    const isAdmin = decoded.role === "admin";
    if (isAdmin) {
      return { status: 200, data: decoded };
    } else {
      return { status: 401, data: { message: "Not an administrator" } };
    }
  } catch (error) {
    console.log(error, "ERROR");
    // Token is invalid or has expired, user is not logged in
    return { status: 401, data: {} };
  }
};

const verifyTokenGirl = async (token) => {
  if (!token) {
    return false;
  }

  try {
    const decoded = jwt.verify(token, secretKey);

    // If the token is valid, the user is logged in
    return { status: 200, data: decoded };
  } catch (error) {
    console.log(error, "ERROR");
    // Token is invalid or has expired, user is not logged in
    return { status: 401, data: {} };
  }
};

async function changePassword(userId, oldPassword, newPassword) {
  try {
    // Find the user by ID
    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(userId),
      },
    });

    if (!user) {
      return { status: 500, message: "User not found" };
    }

    // Check if the old password is valid
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordValid) {
      return { status: 500, message: "Invalid old password" };
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    await prisma.user.update({
      where: {
        id: parseInt(userId),
      },
      data: {
        password: hashedNewPassword,
      },
    });

    return { status: 200, message: "Password updated successfully" };
  } catch (error) {
    return { status: 500, message: "An error occurred", error: error };
  }
}

async function changePasswordByAdmin(userId, newPassword) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(userId),
      },
    });
    if (!user) {
      return { status: 500, data: "User not found" };
    }
    const changePasswordMessage = `Su nueva contraseña temporal es:\n\n${newPassword}\n\n Le recomendamos cambiarla una vez que acceda a su cuenta. Puede hacerlo accediendo a "Suscripción" en el menú lateral de la página.`;
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    const updatedUser = await prisma.user.update({
      where: {
        id: parseInt(userId),
      },
      data: {
        password: hashedNewPassword,
        changePasswordMessage: changePasswordMessage,
        changePasswordSent: false,
      },
    });
    return { status: 200, data: changePasswordMessage };
  } catch (error) {
    return { status: 500, data: error };
  }
}

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).send("No Bearer token provided");
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      console.error("Token verification error:", err);
      return res.status(401).send("Token verification failed: " + err.message);
    }

    req.user = decoded;
    next();
  });
};

const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).send("No Bearer token provided");
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).send("Invalid token");
    }

    req.user = decoded;

    // Check if the user is an admin
    if (req.user.role !== "admin") {
      return res.status(403).send("Access denied. Admin rights required.");
    }

    next();
  });
};

const updateUser = async (userId, updatedUserData) => {
  try {
    // Check if a new password is provided and is not null or empty
    if (updatedUserData.password && updatedUserData.password.trim() !== "") {
      updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
    } else {
      // If no new password is provided or it's empty, remove it from the data object
      delete updatedUserData.password;
    }

    // Update the user's data in the database
    const updatedUser = await prisma.User.update({
      where: {
        id: userId,
      },
      data: updatedUserData,
    });

    return { success: true, data: updatedUser };
  } catch (error) {
    console.error(error); // Log the error for debugging
    return { success: false, message: "An error occurred while updating the user" };
  }
};

const getUserFromToken = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return null;
    }
    return decoded; // Attach the user data to the request object
  });
  return null;
};

async function getUserFromReq(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  } else {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        return null;
      } else {
        return decoded; // Attach the user data to the request object
      }
    });
  }
}

const getProfile = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    delete user.password;
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  registerGirlUser,
  verifyTokenAdmin,
  verifyTokenGirl,
  login,
  changePassword,
  changePasswordByAdmin,
  authenticate,
  authenticateAdmin,
  getProfile,
  getUserFromToken,
  updateUser,
  getUserFromReq,
};
