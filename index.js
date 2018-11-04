const express = require("express");
const app = express();
const server = require("http").Server(app);
const socket = require("socket.io")(server);
const path = require("path");
const cors = require("cors");
const request = require("request");
const { PythonShell } = require("python-shell");

app.use(cors());

socket.on("connection", io => null);

var intervalId;
app.get("/api/health-check/", (request, response) => {
  const { active } = request.query;
  console.log("get request");
  if (active == "false") {
    intervalId = setInterval(pollingHelper, 3000);
  } else {
    console.log("mag process paused");

    // python_process.childProcess.kill("SIGINT");
    // clear Interval
    clearInterval(intervalId);
  }
  response.sendStatus(200);
});

const pollingHelper = () => {
  // Interval keep going
  // intervalId =
  console.log("Polling helper begin");

  request("http://127.0.0.1:12345", (error, response, body) => {
    //console.log(error, response.statusCode);
    //Emit statusCode, and timestamp to front-end
    socket.emit("dataPoint", response.statusCode);
  });
};

//Serve static files
app.use(express.static(path.join(__dirname, "/frontend/public")));

const port = process.env.PORT || 5000;
server.listen(port, () => {
  // Spawn python/magnificient server
  // Add checks to enforce process actually started
  const python_process = new PythonShell("server.py");
  console.log("python_process spawned");
});
