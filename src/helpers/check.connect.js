'use strict';

const mongoose = require('mongoose');
const os = require('os');
const process = require('process');
const _SECOND = 5000;

// count connect
const countConnect = () => {
  const numConnection = mongoose.connections.length;
  console.log(`Count Connection: ${numConnection}`);
};

// check over load
const checkOverload = () => {
  setInterval(() => {
    const numConnection = mongoose.connections.length;
    const numCores = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;

    console.log(`Active connection::: ${numConnection}`);
    console.log(`memoryUsage::: ${memoryUsage / 1024 / 1024} MB`);

    // Example maxium number of connections based on number cores
    const maxConnections = numCores * 5;
    if (numConnection > maxConnections) {
      console.log(`Connect overload detected`);
    }
  }, _SECOND); // Monitor every 5 seconds
};

module.exports = {
  countConnect,
  checkOverload,
};
