'use strict';

const mongoose = require('mongoose');
const connectString = 'mongodb://172.17.0.3:27017/shopDEV';
const { countConnect } = require('../helpers/check.connect');
// design pattern singleton
class Database {
  constructor() {
    this.connect();
  }
  // connect
  connect(type = 'mongodb') {
    if (1 === 1) {
      mongoose.set('debug', true);
      mongoose.set('debug', { color: true });
    }
    mongoose
      .connect(connectString, {
        maxPoolSize: 50,
      })
      .then((_) => console.log(`Connected Mongodb Success`, countConnect()))
      .catch((err) => console.log('Error Connect'));
  }
  static getIntance() {
    if (!Database.intance) {
      Database.intance = new Database();
    }
    return Database.intance;
  }
}

const instanceMongoDb = Database.getIntance();
module.exports = instanceMongoDb;
