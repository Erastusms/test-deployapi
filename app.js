require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.DB_PORT || 3000;
const host = process.env.DB_HOST || '0.0.0.0';
const cors = require("cors");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(express.static("public"));

const routes = require("./routes");
app.use(routes);

app.listen(port, host, () => {
  console.log("App is running in port: ", port);
});
