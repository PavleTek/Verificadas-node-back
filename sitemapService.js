const cron = require("node-cron");
const fs = require("fs");
const prisma = require("./prisma.js");
const path = require("path");

const baseSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <!-- Main landing page -->
    <url>
        <loc>https://verificadas.cl/</loc>
        <lastmod>2024-05-07</lastmod>
        <changefreq>Monthly</changefreq>
        <priority>0.0</priority>
    </url>
<!-- Individual escort profiles, assume dynamic -->
INSERT_DYNAMIC_HERE_GIRLS
<!-- dynamic specific locations, assume dynamic -->
INSERT_DYNAMIC_HERE_LOCATION
<!-- dynamic Cities, assume dynamic -->
INSERT_DYNAMIC_HERE_CITY
  <!-- dynamic Categories, assume dynamic -->
INSERT_DYNAMIC_HERE_CATEGORY
  <!-- dynamic blogs, assume dynamic -->
INSERT_DYNAMIC_HERE_BLOG
    <url>
        <loc>https://verificadas.cl/prices</loc>
        <lastmod>2024-05-01</lastmod>
        <changefreq>Monthly</changefreq>
        <priority>0.6</priority>
    </url>
    <url>
        <loc>https://verificadas.cl/about</loc>
        <lastmod>2024-05-01</lastmod>
        <changefreq>Monthly</changefreq>
        <priority>0.5</priority>
    </url>
    <url>
        <loc>https://verificadas.cl/contact</loc>
        <lastmod>2024-05-01</lastmod>
        <changefreq>Monthly</changefreq>
        <priority>0.5</priority>
    </url>
    <!-- Blog entries -->
    <url>
        <loc>https://verificadas.cl/blog</loc>
        <lastmod>2024-05-06</lastmod>
        <changefreq>Monthly</changefreq>
        <priority>0.7</priority>
    </url>
    <url>
        <loc>https://verificadas.cl/primer-encuentro-con-una-escort-de-lujo</loc>
        <lastmod>2024-05-06</lastmod>
        <changefreq>Monthly</changefreq>
        <priority>0.7</priority>
    </url>
    <url>
        <loc>https://verificadas.cl/escorts-en-santiago-oriente</loc>
        <lastmod>2024-05-06</lastmod>
        <changefreq>Monthly</changefreq>
        <priority>0.7</priority>
    </url>
    <url>
        <loc>https://verificadas.cl/seguridad-y-verificadas-santiago</loc>
        <lastmod>2024-05-06</lastmod>
        <changefreq>Monthly</changefreq>
        <priority>0.7</priority>
    </url>
    <url>
      <loc>https://verificadas.cl/notFound</loc>
      <lastmod>2024-05-10</lastmod>
      <changefreq>Yearly</changefreq>
      <priority>0.1</priority>
    </url>
</urlset>
`;

const baseRoutes = ["/", "/escorts/", "/anunciate/Premium", "/anunciate/Regular", "/anunciate/Economica"];

async function generateDynamicSiteMapEntriesForGirls() {
  const activeGirls = await prisma.girl.findMany({
    where: {
      active: true,
      hiden: false,
    },
    select: {
      id: true, // We only need the ID since we're using the script generation date
    },
  });

  const today = new Date().toISOString().split("T")[0]; // Gets today's date in YYYY-MM-DD format
  return activeGirls
    .map(
      (girl) => `
        <url>
            <loc>https://verificadas.cl/escort-verificada/${girl.id}</loc>
            <lastmod>${today}</lastmod>
            <changefreq>weekly</changefreq>
            <priority>0.8</priority>
        </url>
    `
    )
    .join("");
}

async function generateDynamicSiteMapEntriesForCities() {
  const Cities = await prisma.city.findMany({
    select: {
      name: true,
    },
  });
  const today = new Date().toISOString().split("T")[0]; // Gets today's date in YYYY-MM-DD format
  return Cities.map((city) => {
    const sanitizedCityName = city.name.replace(/\s+/g, "-");
    return `
        <url>
            <loc>https://verificadas.cl/escorts/${sanitizedCityName}</loc>
            <lastmod>${today}</lastmod>
            <changefreq>Daily</changefreq>
            <priority>1.0</priority>
        </url>
      `;
  }).join("");
}

async function generateDynamicSiteMapEntriesForLocations() {
  const locations = await prisma.specificLocation.findMany({
    select: {
      name: true,
      city: {
        select: {
          name: true, // Select only the city's name
        },
      },
    },
  });
  const today = new Date().toISOString().split("T")[0]; // Gets today's date in YYYY-MM-DD format
  return locations
    .map((location) => {
      if (location.city) {
        const sanitizedCityName = location.city.name.replace(/\s+/g, "-");
        const sanitizedLocationName = location.name.replace(/\s+/g, "-");
        return `
          <url>
              <loc>https://verificadas.cl/escorts/${sanitizedCityName}/ubicacion/${sanitizedLocationName}</loc>
              <lastmod>${today}</lastmod>
              <changefreq>Daily</changefreq>
              <priority>0.9</priority>
          </url>
        `;
      } else {
        return null;
      }
    })
    .filter((route) => route !== null)
    .join("");
}

async function generateDynamicSiteMapEntriesForCategories() {
  const categories = await prisma.seoCategory.findMany({
    select: {
      name: true,
    },
  });
  const cities = await prisma.city.findMany({
    select: {
      name: true,
    },
  });

  const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

  // Generate combinations of cities and categories
  const entries = cities.flatMap((city) =>
    categories.map((category) => {
      const sanitizedCityName = city.name.replace(/\s+/g, "-");
      const sanitizedCategoryName = category.name.replace(/\s+/g, "-");
      return `
        <url>
          <loc>https://verificadas.cl/escorts/${sanitizedCityName}/categoria/${sanitizedCategoryName}</loc>
          <lastmod>${today}</lastmod>
          <changefreq>daily</changefreq>
          <priority>0.9</priority>
        </url>
      `;
    })
  );

  return entries.join("");
}

async function generateDynamicSiteMapEntriesForBlogs() {
  const blogs = await prisma.blog.findMany({
    select: {
      id: true,
    },
  });
  const today = new Date().toISOString().split("T")[0]; // Gets today's date in YYYY-MM-DD format
  return blogs
    .map((blog) => {
      return `
        <url>
            <loc>https://verificadas.cl/blog/${blog.id}</loc>
            <lastmod>${today}</lastmod>
            <changefreq>Daily</changefreq>
            <priority>0.7</priority>
        </url>
      `;
    })
    .join("");
}

async function generateSitemap() {
  const dynamicGirlEntries = await generateDynamicSiteMapEntriesForGirls();
  const dynamicCityEntries = await generateDynamicSiteMapEntriesForCities();
  const dynamicLocationEntries = await generateDynamicSiteMapEntriesForLocations();
  const dynamicCategoryEntries = await generateDynamicSiteMapEntriesForCategories();
  const dynamicblogEntries = await generateDynamicSiteMapEntriesForBlogs();
  let completeSitemap = baseSitemap.replace("INSERT_DYNAMIC_HERE_GIRLS", dynamicGirlEntries);
  completeSitemap = completeSitemap.replace("INSERT_DYNAMIC_HERE_LOCATION", dynamicLocationEntries);
  completeSitemap = completeSitemap.replace("INSERT_DYNAMIC_HERE_CITY", dynamicCityEntries);
  completeSitemap = completeSitemap.replace("INSERT_DYNAMIC_HERE_CATEGORY", dynamicCategoryEntries);
  completeSitemap = completeSitemap.replace("INSERT_DYNAMIC_HERE_BLOG", dynamicblogEntries);
  const sitemapPath = path.join(__dirname, "..", "sitemap.xml");
  fs.writeFileSync(sitemapPath, completeSitemap);
}

async function generateRouteText() {
  const routeFile = path.join(__dirname, "..", "routes-ssr.txt");
  let routes = baseRoutes;
  const girls = await prisma.girl.findMany({
    select: {
      id: true,
    },
    orderBy: {
      id: "asc", // Ascending order (from lower to higher)
    },
  });
  const cities = await prisma.city.findMany({
    select: {
      name: true,
    },
  });
  const locations = await prisma.specificLocation.findMany({
    select: {
      name: true,
      city: {
        select: {
          name: true,
        },
      },
    },
  });
  const categories = await prisma.seoCategory.findMany({
    select: {
      name: true,
    },
  });
  const blogs = await prisma.blog.findMany({
    select: {
      id: true,
    },
    orderBy: {
      id: "asc", // Ascending order (from lower to higher)
    },
  });
  const escortRoutes = girls.map((girl) => {
    return `/escort-verificada/${girl.id}`;
  });
  const lastGirlId = girls[girls.length - 1]?.id || 0;
  const extraEscortRoutes = Array.from({ length: 15 }, (_, index) => {
    const newId = lastGirlId + index + 1;
    return `/escort-verificada/${newId}`;
  });
  const cityRoutes = cities.map((city) => {
    const sanitizedCityName = city.name.replace(/\s+/g, "-");
    return `/escorts/${sanitizedCityName}`;
  });
  const locationRoutes = locations
    .map((location) => {
      if (location.city) {
        const sanitizedCityName = location.city.name.replace(/\s+/g, "-");
        const sanitizedLocationName = location.name.replace(/\s+/g, "-");
        return `/escorts/${sanitizedCityName}/ubicacion/${sanitizedLocationName}`;
      } else {
        return null;
      }
    })
    .filter((route) => route !== null);
  const categoryRoutes = cities.flatMap((city) =>
    categories.map((category) => {
      const sanitizedCityName = city.name.replace(/\s+/g, "-");
      const sanitizedCategoryName = category.name.replace(/\s+/g, "-");
      return `/escorts/${sanitizedCityName}/categoria/${sanitizedCategoryName}`;
    })
  );
  const blogRoutes = blogs.map((blog) => {
    return `/blog/${blog.id}`;
  });
  const lastBlogId = blogs[blogs.length - 1]?.id || 0;
  const extraBlogRoutes = Array.from({ length: 15 }, (_, index) => {
    const newId = lastBlogId + index + 1;
    return `/blog/${newId}`;
  });
  const allRoutesText = routes.concat(escortRoutes, extraEscortRoutes, cityRoutes, locationRoutes, categoryRoutes, blogRoutes, extraBlogRoutes).join("\n");
  try {
    console.log(allRoutesText);
    fs.writeFileSync(routeFile, allRoutesText, { encoding: "utf8" });
    console.log("writing succesfull", routeFile);
  } catch (error) {
    console.error("Error writing to file:", error);
  }
}

module.exports = {
  generateSitemap,
  generateRouteText,
};
