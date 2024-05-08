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
        <changefreq>daily</changefreq>
        <priority>0.0</priority>
    </url>
    <!-- Dynamic listings of escorts, potentially changes frequently -->
    <url>
        <loc>https://verificadas.cl/escorts/</loc>
        <lastmod>2024-05-07</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>
    <!-- Individual escort profiles, assume dynamic -->

    INSER_DYNAMIC_HERE

    <url>
        <loc>https://verificadas.cl/prices/</loc>
        <lastmod>2024-05-01</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.6</priority>
    </url>
    <url>
        <loc>https://verificadas.cl/about/</loc>
        <lastmod>2024-05-01</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.5</priority>
    </url>
    <url>
        <loc>https://verificadas.cl/contact/</loc>
        <lastmod>2024-05-01</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.5</priority>
    </url>
    <!-- Blog entries -->
    <url>
        <loc>https://verificadas.cl/blog/</loc>
        <lastmod>2024-05-06</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
    </url>
    <url>
        <loc>https://verificadas.cl/primer-encuentro-con-una-escort-de-lujo/</loc>
        <lastmod>2024-05-06</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
    </url>
    <url>
        <loc>https://verificadas.cl/escorts-en-santiago-oriente/</loc>
        <lastmod>2024-05-06</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
    </url>
    <url>
        <loc>https://verificadas.cl/seguridad-y-verificadas-santiago/</loc>
        <lastmod>2024-05-06</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
    </url>
</urlset>
`;

async function generateDynamicSitemapEntries() {
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

async function generateSitemap() {
  const dynamicEntries = await generateDynamicSitemapEntries();
  const completeSitemap = baseSitemap.replace("INSER_DYNAMIC_HERE", dynamicEntries);
  const sitemapPath = path.join(__dirname, "..", "sitemap.xml");
  fs.writeFileSync(sitemapPath, completeSitemap);
}

generateSitemap();

module.exports = {
  generateSitemap,
};
