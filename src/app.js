const express = require('express');
const morgan = require('morgan');
const { default: helmet } = require('helmet');
const compression = require('compression');
const app = express();

// init middleware
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());

// init db
require('./dbs/init.mongodb');
const { checkOverload } = require('./helpers/check.connect');

checkOverload();
// init router
app.get('/', (req, res, next) => {
  const strCompress = 'hello Hungvu';
  return res.status(200).json({
    message: 'done',
    metadata: strCompress.repeat(100000),
  });
});

// handle error

module.exports = app;
