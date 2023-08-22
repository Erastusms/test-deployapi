require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.DB_PORT || 3000;
const cors = require("cors");
const path = require("path");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(
  "/assets/images",
  express.static(path.join(__dirname, "/assets/images"))
);
app.use(express.static("public"));

const routes = require("./routes");
app.use(routes);

app.listen(port, () => {
  console.log("App is running in port: ", port);
});
