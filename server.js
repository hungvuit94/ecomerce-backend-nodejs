const app = require('./src/app');

const PORT = process.env.PORT || 3055;
const server = app.listen(PORT, () => {
  console.log(`Server Ecommerce with ${PORT}`);
});

// process.on('SIGINT', () => {
//   console.log(`Exit server Express`);
//   // notify.send(ping...)
// });
