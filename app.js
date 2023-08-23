require('dotenv').config();
const express = require('express');
// const app = express();
// const port = process.env.DB_PORT || 3000;
// const host = process.env.DB_HOST || '0.0.0.0';
// const cors = require('cors');
const app = express();
const router = express.Router();
const port = process.env.PORT || 3000;
const cors = require("cors");

// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
// app.use(cors());
// app.use(express.static('public'));

app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

// app.get('/', (req, res) => {
//   res.status(200).json({
//     message: 'Hello world',
//   });
// });
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});
const routes = require('./routes');
app.use(routes);

// app.listen(port, () => {
//   console.log('App is running in port: ', port);
// });

router.get('/', (req, res) => {
  res.status(200).json({
    message: 'Hello world',
  });
});

// Mount the router middleware
app.use(router);
// const routes = require("./routes");
// app.use(routes);

// Start the server and listen for incoming connections
app.listen(port, () => {
  console.log(`Server running at https://localhost:${port}/`);
});
