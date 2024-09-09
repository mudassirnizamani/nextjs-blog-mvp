const CopyWebpackPlugin = require('copy-webpack-plugin');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  webpack: (config, { isServer, dev, webpack }) => {
    // Only run the plugin in production mode and on the server
    if (!dev && !isServer) {
      config.plugins.push(
        new CopyWebpackPlugin({
          patterns: [
            { from: 'sw.js', to: '.' }, // copy 'sw.js' from project root to build root
          ],
        })
      );
    }

    return config;
  },
};

module.exports = nextConfig;
