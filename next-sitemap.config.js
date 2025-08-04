/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://skeepscollection.vercel.app',
  generateRobotsTxt: true,
  exclude: ['/admin', '/api/*'], // any private routes
};
