const addOneGeneralClick = async () => {
  try {
    const today = new Date().toISOString().slice(0, 10); // Get today's date in "YYYY-MM-DD" format
    const existingStats = await prisma.ClickStats.findFirst({
      where: {
        date: today,
      },
    });

    if (existingStats) {
      // If stats for today exist, increment generalClicks
      await prisma.ClickStats.update({
        where: {
          id: existingStats.id,
        },
        data: {
          generalClicks: {
            increment: 1,
          },
        },
      });
    } else {
      // If stats for today don't exist, create a new record
      await prisma.ClickStats.create({
        data: {
          generalClicks: 1,
          date: today,
        },
      });
    }
  } catch (error) {
    console.error("Error updating general clicks:", error);
  }
};

const addOneGirlClick = async (girlId, type) => {
  try {
    const today = new Date().toISOString().slice(0, 10); // Get today's date in "YYYY-MM-DD" format
    const generalStats = await prisma.ClickStats.findFirst({
      where: {
        date: today,
      },
    });
    if (generalStats) {
      // If stats for today exist, increment generalClicks
      await prisma.ClickStats.update({
        where: {
          id: generalStats.id,
        },
        data: {
          generalClicks: {
            increment: 1,
          },
          clicksOnGirls: {
            increment: 1,
          },
        },
      });
    } else {
      // If stats for today don't exist, create a new record
      await prisma.ClickStats.create({
        data: {
          generalClicks: 1,
          clicksOnGirls: 1,
          date: today,
        },
      });
    }

    const existingStats = await prisma.GirlClickStats.findFirst({
      where: {
        girlId: girlId,
        date: today,
      },
    });

    if (existingStats) {
      if (type === "wsp") {
        await prisma.GirlClickStats.update({
          where: {
            id: existingStats.id,
          },
          data: {
            clciksToWhatsapp: {
              increment: 1,
            },
          },
        });
      } else if (type === "profile") {
        await prisma.GirlClickStats.update({
          where: {
            id: existingStats.id,
          },
          data: {
            clicksToProfile: {
              increment: 1,
            },
          },
        });
      }
    } else {
      if (type === "wsp") {
        await prisma.GirlClickStats.create({
          data: {
            clciksToWhatsapp: 1,
            date: today,
          },
        });
      } else if (type === "profile") {
        await prisma.GirlClickStats.create({
          data: {
            clicksToProfile: 1,
            clicksOnGirls: today,
          },
        });
      }

      // If stats for today don't exist, create a new record
    }
  } catch (error) {
    console.error("Error updating girl clicks:", error);
  }
};

const getLastXDaysClickStats = async (X) => {
  try {
    const clickStats = await prisma.ClickStats.findMany({
      take: X,
      orderBy: {
        date: "desc", // Order by date in descending order (newest to oldest)
      },
    });
    return { status: 200, data: clickStats };
  } catch (error) {
    console.error("Error fetching last X days of ClickStats:", error);
    return { status: 500, data: error };
  }
};

const getLastXDaysGirlClickStats = async (X, girlId) => {
  try {
    const girlClickStats = await prisma.GirlClickStats.findMany({
      where: {
        girlId: girlId,
      },
      take: X,
      orderBy: {
        date: "desc", // Order by date in descending order (newest to oldest)
      },
    });
    return { status: 200, data: girlClickStats };
  } catch (error) {
    console.error("Error fetching last X days of GirlClickStats:", error);
    return { status: 500, data: error };
  }
};

const createDailyStatsRecords = async () => {
  try {
    const today = new Date().toISOString().slice(0, 10); // Get today's date in "YYYY-MM-DD" format

    // Create or update the ClickStats record for today
    const clickStats = await prisma.ClickStats.upsert({
      where: {
        date: today,
      },
      create: {
        date: today,
        generalClicks: 0, // You can initialize this to any default value
        clicksOnGirls: 0, // You can initialize this to any default value
      },
      update: {
        date: today,
      },
    });

    // Fetch all girls
    const allGirls = await prisma.Girl.findMany({
        select: {
          id: true,
        },
      });

    // Create or update GirlClickStats records for today for each active girl
    for (const girl of allGirls) {
      await prisma.GirlClickStats.upsert({
        where: {
          girlId_date: {
            girlId: girl.id,
            date: today,
          },
        },
        create: {
          girlId: girl.id,
          date: today,
          clicksToProfile: 0, // You can initialize this to any default value
          clciksToWhatsapp: 0, // You can initialize this to any default value
        },
        update: {
          date: today,
        },
      });
    }

    console.log(`Daily stats records created for ${today}`);
  } catch (error) {
    console.error("Error creating daily stats records:", error);
  }
};
