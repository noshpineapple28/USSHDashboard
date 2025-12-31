const express = require("express");
const socketIO = require("socket.io");
const http = require("http");
const fs = require('fs');
const app = express();
const PORT = process.argv[process.argv.length - 1];

// server
const server = http.createServer(app);
const io = socketIO(server);

// list of all scripts
const SCRIPTS = JSON.parse(fs.readFileSync("./scripts.json"));

// whenever the "/" endpoint appears, allow server to serve all files in the site_map folder
app.use("/", express.static("src"));

/**
 * sets up the socket.io connection endpoints
 * all events are related to whatever the client requests
 */
io.on("connection", (socket) => {
  /**
   * sends out all scripts currently held
   */
  socket.on("getScripts", () => {
    socket.emit("loadScripts", SCRIPTS);
  });

  /**
   * creates a new script
   */
  socket.on("createScript", (script) => {
    console.log(script);
    SCRIPTS.push(script);
    socket.emit("scriptCreated");
    fs.writeFileSync("./scripts.json", JSON.stringify(SCRIPTS));
  });
});

// startup
server.listen(PORT, () => {
  console.log(`Started app on port ${PORT}`);
});
