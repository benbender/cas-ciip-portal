const path = require('path');
const Dotenv = require('dotenv-webpack');
const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  cssModules: true,
  webpack: (config) => {
    config.plugins = config.plugins || [];

    config.plugins = [
      ...config.plugins,

      // Read the .env file
      new Dotenv({
        path: path.join(__dirname, '.env'),
        systemvars: true
      })
    ];

    return config;
  },
  publicRuntimeConfig: {
    NO_MATHJAX: process.env.NO_MATHJAX,
    FEEDBACK_SITE_URL: process.env.FEEDBACK_SITE_URL,
    ENABLE_ANALYTICS: process.env.ENABLE_ANALYTICS,
    SITEWIDE_NOTICE: process.env.SITEWIDE_NOTICE,
    ENABLE_DB_MOCKS: process.env.ENABLE_DB_MOCKS
  }
};
