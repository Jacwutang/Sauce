const express = require("express");
const app = express();
const path = require("path");

//Serve static files
app.use(express.static(path.join(__dirname, "/frontend/public")));

const port = process.env.PORT || 5000;
app.listen(port);
