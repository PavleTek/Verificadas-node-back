const prisma = require("../prisma.js");
const girlService = require("../girl/girlService.js");

async function changeGirlStatus(req) {
  const { girlId, desiredActiveStatus } = req.body;
  try {
    const girl = await prisma.girl.findUnique({
      where: {
        id: girlId,
      },
      include: {
        verification: true,
      },
    });

    if (!girl) {
      throw new Error("Girl not found");
    }

    // If activating, check verification status
    if (desiredActiveStatus && girl.verification?.status !== "Verified") {
      const message = "Girl can not be activated until she is verified";
      return { status: 403, data: { message: message } };
    }

    // Update the girl's active status
    const updatedGirl = await prisma.girl.update({
      where: {
        id: girlId,
      },
      data: {
        active: desiredActiveStatus,
      },
    });

    return { status: 200, data: updatedGirl };
  } catch (error) {
    console.error("Error changing girl status:", error);
    return { status: 500, data: error.message };
  }
}

module.exports = {
  changeGirlStatus,
};
