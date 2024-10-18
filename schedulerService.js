const cron = require("node-cron");
const prisma = require("./prisma.js");
const sitemapService = require("./sitemapService.js");

function isDateTodayOrBefore(dateString) {
  const date = new Date(dateString);

  const currentDate = new Date();

  const dateYear = date.getFullYear();
  const dateMonth = date.getMonth();
  const dateDay = date.getDate();

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const currentDay = currentDate.getDate();

  return (
    dateYear < currentYear ||
    (dateYear === currentYear && dateMonth < currentMonth) ||
    (dateYear === currentYear && dateMonth === currentMonth && dateDay <= currentDay)
  );
}

function isDateTodayOrLater(dateString) {
  // Convert the date string to a Date object
  const date = new Date(dateString);

  // Get the current date
  const currentDate = new Date();

  // Extract year, month, and day components of both dates
  const dateYear = date.getFullYear();
  const dateMonth = date.getMonth();
  const dateDay = date.getDate();

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const currentDay = currentDate.getDate();

  // Compare the year, month, and day components
  return (
    dateYear > currentYear ||
    (dateYear === currentYear && dateMonth > currentMonth) ||
    (dateYear === currentYear && dateMonth === currentMonth && dateDay >= currentDay)
  );
}

function shouldDeactivateBySubscriptionPause(subscription) {
  let pauseShouldStart;
  let pauseShouldEnd;
  if (subscription.pauseStartDate) {
    pauseShouldStart = isDateTodayOrBefore(subscription.pauseStartDate);
  }
  if (subscription.pauseEndDate) {
    pauseShouldEnd = isDateTodayOrBefore(subscription.pauseEndDate);
  }
  if (subscription.pauseStartDate) {
  }
  if (pauseShouldStart) {
    if (pauseShouldEnd) {
      return false;
    } else {
      return true;
    }
  } else {
    return false;
  }
}

function shouldBeDeactivatedByExpiryDate(subscription) {
  return isDateTodayOrBefore(subscription.deactivationDate);
}

function shouldBeActivatedByPauseEnd(subscription) {
  if (subscription.pauseEndDate) {
    const pauseEndIsAlready = isDateTodayOrBefore(subscription.pauseEndDate);
    if (pauseEndIsAlready) {
      const isExpiryDateAlreadyPassed = isDateTodayOrBefore(subscription.expiryDate);
      if (!isExpiryDateAlreadyPassed) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
}

async function updateActiveStatusForAllUsers() {
  const allActiveGirls = [];
  const allInactiveGirls = [];
  const toBeDeactivatedGirls = [];
  const toBeActivatedGirls = [];
  const allGirls = await prisma.girl.findMany({
    include: {
      subscription: true,
    },
  });
  allGirls.forEach((girl) => {
    if (girl.active) {
      allActiveGirls.push(girl);
    } else {
      allInactiveGirls.push(girl);
    }
  });
  allActiveGirls.forEach((girl) => {
    const subscription = girl.subscription;
    if (shouldBeDeactivatedByExpiryDate(subscription)) {
      toBeDeactivatedGirls.push(girl);
    } else if (shouldDeactivateBySubscriptionPause(subscription)) {
      toBeDeactivatedGirls.push(girl);
    }
  });
  allInactiveGirls.forEach((girl) => {
    const subscription = girl.subscription;
    if (shouldBeActivatedByPauseEnd(subscription)) {
      toBeActivatedGirls.push(girl);
    }
  });
  toBeActivatedGirls.forEach(async (girl) => {
    const subscriptionId = girl.subscription.id;
    await prisma.girl.update({
      where: {
        id: girl.id,
      },
      data: {
        active: true,
      },
    });
    await prisma.subscription.update({
      where: {
        id: subscriptionId,
      },
      data: {
        pauseStartDate: null,
        pauseEndDate: null,
      },
    });
  });
  toBeDeactivatedGirls.forEach(async (girl) => {
    await prisma.girl.update({
      where: {
        id: girl.id,
      },
      data: {
        active: false,
      },
    });
  });
}

cron.schedule("00 1 * * *", updateActiveStatusForAllUsers);
cron.schedule("15 3 * * *", sitemapService.generateSitemap);
cron.schedule("15 3 * * *", sitemapService.generateRouteText);
