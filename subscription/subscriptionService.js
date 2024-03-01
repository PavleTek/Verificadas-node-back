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

async function registerPayment(req) {
  const { paymentData, subscriptionData, girlId } = req.body;
  const today = new Date();
  const expiryDate = new Date(subscriptionData.expiryDate);
  const newerDate = today > expiryDate ? today : expiryDate;
  const newExpiryDate = getExpiryDate(newerDate, paymentData.duration);
  subscriptionData.expiryDate = newExpiryDate;
  subscriptionData.deactivationDate = addDeactivationMargin(newExpiryDate);
  try {
    const newPayment = await prisma.subscriptionPayment.create({
      data: paymentData,
    });
    const updatedSubscription = await prisma.subscription.update({
      where: {
        id: subscriptionData.id,
      },
      data: subscriptionData,
    });
    const updatedGirl = await prisma.girl.update({
      where: {
        id: girlId,
      },
      data: {
        active: true,
        paymentTier: paymentData.paymentTier,
      },
    });
    return { status: 200, data: { newPayment, updatedSubscription, updatedGirl } };
  } catch (error) {
    return { status: 500, data: error.message };
  }
}

function getExpiryDate(currentDate, duration) {
  const newDate = new Date(currentDate);
  if (duration === "1week") {
    newDate.setDate(newDate.getDate() + 7);
  } else if (duration === "2weeks") {
    newDate.setDate(newDate.getDate() + 14);
  } else if (duration === "month") {
    newDate.setMonth(newDate.getMonth() + 1);
  }
  return newDate;
}

function addDeactivationMargin(expiryDate) {
  const deactivationDate = new Date(expiryDate);
  deactivationDate.setDate(deactivationDate.getDate() + 3);
  return deactivationDate;
}

async function updateGirlSubscription(req) {
  try {
    const { paymentTier, expiryDate, deactivationDate, girlId, subscriptionId } = req.body;
    const today = new Date();
    const shouldActivate = new Date(expiryDate) > today || new Date(deactivationDate) > today;
    await prisma.subscription.update({
      where: {
        id: subscriptionId,
      },
      data: {
        expiryDate,
        deactivationDate,
      },
    });
    if (shouldActivate) {
      await prisma.girl.update({
        where: {
          id: girlId,
        },
        data: {
          active: true,
          paymentTier: paymentTier,
        },
      });
      return { status: 200, data: { shouldActivate: true } };
    } else {
      await prisma.girl.update({
        where: {
          id: girlId,
        },
        data: {
          paymentTier: paymentTier,
        },
      });
      return { status: 200, data: { shouldActivate: false } };
    }
  } catch (err) {
    return { status: 500, data: err };
  }
}

async function updatePayment(req) {
  try {
    const { paymentData } = req.body;
    const paymentId = paymentData.id;
    await prisma.subscriptionPayment.update({
      where: {
        id: paymentId,
      },
      data: paymentData,
    });
    return { status: 200 };
  } catch (err) {
    return { status: 500, data: err };
  }
}

async function deletePaymentById(paymentId) {
  try {
    await prisma.subscriptionPayment.delete({
      where: {
        id: parseInt(paymentId),
      },
    });
    return { status: 200 };
  } catch (error) {
    return { status: 500, data: error };
  }
}

async function getAllPaymentsBySubscriptionId(subscriptionId) {
  try {
    const payments = await prisma.subscriptionPayment.findMany({
      where: {
        subscriptionId: parseInt(subscriptionId),
      },
    });
    return { status: 200, data: payments };
  } catch (error) {
    return { status: 500, data: error };
  }
}

async function getAllPaymentsByTime(req) {} // month, year, currentyear, always pagination needed sos

module.exports = {
  changeGirlStatus,
  updateGirlSubscription,
  registerPayment,
  getAllPaymentsBySubscriptionId,
  deletePaymentById,
  updatePayment,
};
