const { Sitemap } = require('next-sitemap');

const sitemap = new Sitemap({
  hostname: 'https://skeepscollection.vercel.app/', 
  sitemapSize: 5000, 
});

sitemap.add({
  url: '/',
  changefreq: 'daily',
  priority: 1,
});

sitemap.add({
  url: '/about',
  changefreq: 'weekly',
  priority: 0.5,
});

// Add urls that are needed to be indexed , si kila page coz some are not relevant for indexing into search console 

sitemap.toXML('sitemap.xml');