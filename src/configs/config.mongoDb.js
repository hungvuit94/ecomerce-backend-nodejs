'use strict';

// level 0
const dev = {
  app: {
    port: process.env.DEV_APP_PORT,
  },
  db: {
    host: '172.17.0.2',
    port: 27017,
    name: 'shopDEV',
  },
};

// level 1
const pro = {
  app: {
    port: 3000,
  },
  db: {
    host: '172.17.0.3',
    port: 27017,
    name: 'Dbproduct',
  },
};

const config = { dev, pro };
const env = process.env.NODE_ENV || 'dev';
module.exports = config[env];
