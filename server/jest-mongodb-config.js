module.exports = {
  mongodbMemoryServerOptions: {
    binary: {
      version: '8.0.6',
      skipMD5: true,
    },
    instance: {
      dbName: 'jest',
    },
    autoStart: false,
  },
};