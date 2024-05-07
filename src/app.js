require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const { default: helmet } = require('helmet');
const compression = require('compression');
const app = express();
// init middleware
app.use(morgan('dev'));

 // curl http://localhost:3052 --include ( che dau X-Powered-By: Express de khong lo cong nghe su dung)
app.use(helmet());

// app.get('/', (req, res, next) => {
//   return res.status(200).json({
//     data: "hello world".repeat(100000)
//   })
// });
app.use(compression());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);


// init db
require('./dbs/init.mongodb');
const { checkOverload } = require('./helpers/check.connect');

// checkOverload();

// init router
app.use('/', require('./routes'));

// handle error
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  const statusCode = error.status || 500;
  return res.status(statusCode).json({
    status: 'error',
    code: statusCode,
    message: error.message || 'Internal server error',
  });
});
module.exports = app;
