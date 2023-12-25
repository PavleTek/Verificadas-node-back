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
