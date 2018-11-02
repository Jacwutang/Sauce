const express = require("express");
const app = express();
const path = require("path");

app.get("/", (request, response) => {
  response.send("Hello from Express!");
});

app.use(express.static(path.join(__dirname, "/frontend/public")));

const port = 5000 || process.env.PORT;
app.listen(port);
