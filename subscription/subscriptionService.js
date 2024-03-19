const prisma = require("../prisma.js");

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

async function changeGirlHidenStatus(req) {
  const { girlId, desiredHidenStatus } = req.body;
  try {
    const girl = await prisma.girl.update({
      where: {
        id: girlId,
      },
      data: {
        hiden: desiredHidenStatus,
      },
    });

    return { status: 200, data: girl };
  } catch (error) {
    console.error("Error changing girl hiden status:", error);
    return { status: 500, data: error.message };
  }
}

async function registerPayment(req) {
  const { paymentData, subscriptionData, girlId } = req.body;
  const today = new Date();
  const expiryDate = new Date(subscriptionData.expiryDate);
  const newerDate = today > expiryDate ? today : expiryDate;
  const newExpiryDate = getExpiryDate(newerDate, paymentData.duration);
  const availablePauses = getAmountOfPauses(paymentData.paymentTier);
  subscriptionData.expiryDate = newExpiryDate;
  subscriptionData.availablePauses = availablePauses;
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

function getAmountOfPauses(paymentTier) {
  if (paymentTier === "Especial" || "Premium") {
    return 3;
  } else if (paymentTier === "Regular") {
    return 2;
  } else if (paymentTier === "Economica") {
    return 1;
  } else {
    return 0;
  }
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
          id: parseInt(girlId),
        },
        data: {
          paymentTier: paymentTier,
        },
      });
      return { status: 200, data: { shouldActivate: false } };
    }
  } catch (error) {
    return { status: 500, data: error };
  }
}

function differenceInDays(startDate, endDate) {
  const oneDay = 24 * 60 * 60 * 1000; // hours * minutes * seconds * milliseconds
  const diffInMilliseconds = Math.abs(endDate.getTime() - startDate.getTime());
  return Math.round(diffInMilliseconds / oneDay);
}

function isDateInRange(startDate, endDate) {
  const today = new Date();
  return startDate <= today && today <= endDate;
}

async function registerSubscriptionPause(req) {
  try {
    let { pauseStartDate, pauseEndDate, subscriptionId } = req.body;
    pauseStartDate = new Date(pauseStartDate);
    pauseEndDate = new Date(pauseEndDate);
    const pauseLengthInDays = differenceInDays(pauseStartDate, pauseEndDate);
    const subscription = await prisma.subscription.findUnique({
      where: {
        id: subscriptionId,
      },
    });
    const originalExpiryDate = new Date(subscription.expiryDate);
    const newExpiryDate = new Date(originalExpiryDate);
    newExpiryDate.setDate(originalExpiryDate.getDate() + pauseLengthInDays);
    const newDeactivationDate = new Date(newExpiryDate);
    newDeactivationDate.setDate(newExpiryDate.getDate() + 3);
    const updatedSubscriptionData = {
      pauseEndDate: pauseEndDate,
      pauseStartDate: pauseStartDate,
      availablePauses: subscription.availablePauses - 1,
      expiryDate: newExpiryDate,
      deactivationDate: newDeactivationDate,
    };

    if (pauseStartDate > originalExpiryDate) {
      return { status: 500, data: { error: "Pause can not start after current expiry date" } };
    }

    if (subscription.availablePauses <= 0) {
      return { status: 500, data: { error: "No available pauses for this subscription" } };
    } else {
      const updatedSubscription = await prisma.subscription.update({
        where: {
          id: subscriptionId,
        },
        data: updatedSubscriptionData,
      });
      return { status: 200, data: updatedSubscription };
    }
  } catch (error) {
    return { status: 500, data: error };
  }
}

async function cancelSubscriptionPause(req) {
  try {
    const { subscriptionId, girlId } = req.body;
    const currentSubscription = await prisma.subscription.findUnique({
      where: {
        id: parseInt(subscriptionId),
      },
    });
    let updatedSubscription;
    let isTodayInBetweenPause;
    if (currentSubscription.pauseStartDate !== undefined || currentSubscription.pauseEndDate !== undefined) {
      const pauseStartDate = new Date(currentSubscription.pauseStartDate);
      const pauseEndDate = new Date(currentSubscription.pauseEndDate);
      isTodayInBetweenPause = isDateInRange(pauseStartDate, pauseEndDate);
      const currentExpiryDate = new Date(currentSubscription.expiryDate);
      const newExpiryDate = new Date(currentExpiryDate);
      const pauseLengthInDays = differenceInDays(pauseStartDate, pauseEndDate);
      newExpiryDate.setDate(newExpiryDate.getDate() - pauseLengthInDays);
      const newDeactivationDate = new Date(newExpiryDate);
      newDeactivationDate.setDate(newDeactivationDate.getDate() + 3);
      const newAvailablePauses = isTodayInBetweenPause ? currentSubscription.availablePauses : currentSubscription.availablePauses + 1;
      updatedSubscription = await prisma.subscription.update({
        where: {
          id: subscriptionId,
        },
        data: {
          deactivationDate: newDeactivationDate,
          expiryDate: newExpiryDate,
          pauseStartDate: null,
          pauseEndDate: null,
          availablePauses: newAvailablePauses,
        },
      });
      if (isTodayInBetweenPause) {
        await prisma.girl.update({
          where: {
            id: parseInt(girlId),
          },
          data: {
            active: true,
          },
        });
      }
    }
    return { status: 200, data: { subscription: updatedSubscription, girlActivated: isTodayInBetweenPause } };
  } catch (error) {
    console.error(error);
    return { status: 500, data: error };
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

async function getMostRecentPaymentBySubscriptionId(subscriptionId) {
  try {
    const mostRecentPayment = await prisma.subscriptionPayment.findFirst({
      where: {
        subscriptionId: subscriptionId,
      },
      orderBy: {
        paymentDate: "desc",
      },
    });
    return { status: 200, data: mostRecentPayment };
  } catch (error) {
    return { status: 500, data: error };
  }
}

async function getAllPaymentsByTime(req) {} // month, year, currentyear, always pagination needed sos

module.exports = {
  changeGirlStatus,
  changeGirlHidenStatus,
  updateGirlSubscription,
  registerPayment,
  getAllPaymentsBySubscriptionId,
  deletePaymentById,
  updatePayment,
  getMostRecentPaymentBySubscriptionId,
  registerSubscriptionPause,
  cancelSubscriptionPause,
};
