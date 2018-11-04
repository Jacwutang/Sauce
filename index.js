const express = require("express");
const app = express();
const server = require("http").Server(app);
const socket = require("socket.io")(server);
const path = require("path");
const cors = require("cors");
const request = require("request");
const { PythonShell } = require("python-shell");

app.use(cors());

var intervalId;
app.get("/api/health-check/", (request, response) => {
  const { active } = request.query;
  
  if (active == "false") {
    intervalId = setInterval(pollingHelper, 1000);
  } else {
    // clear Interval
    clearInterval(intervalId);
  }
  response.sendStatus(200);
});

const pollingHelper = () => {
  request("http://127.0.0.1:12345", (error, response, body) => {
    //Emit statusCode, and timestamp to front-end
    socket.emit("dataPoint", {
      timestamp: Date.now(),
      status: response.statusCode
    });
  });
};

//Serve static assets when pushed to heroku
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/build")));
} else {
  app.use(express.static(path.join(__dirname, "./frontend/public")));
}

// app.get("*", (request, response) => {
//   response.sendFile(path.join(__dirname, "/frontend/public/index.html"));
// });
// app.use(express.static(path.join(__dirname, "/frontend/public")));

const port = process.env.PORT || 5000;
server.listen(port, () => {
  // Spawn python/magnificient server
  // Add checks to enforce process actually started
  const python_process = new PythonShell("server.py");
  
});
