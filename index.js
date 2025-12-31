const express = require("express");
const socketIO = require("socket.io");
const http = require("http");
const app = express();
const PORT = process.argv[process.argv.length - 1]

// server
const server = http.createServer(app);
const io = socketIO(server);

// whenever the "/" endpoint appears, allow server to serve all files in the site_map folder
app.use("/", express.static("src"));

/**
 * sets up the socket.io connection endpoints
 * all events are related to whatever the client requests
 */
io.on("connection", (socket) => {
  /**
   * when the client requests the server status, respond
   */
  socket.on("status", () => {
    socket.emit("status", MC_SERVER_INFO);
  });

  /**
   * runs when the client requests to start the server
   * @param data the name of the server we wish to start
   */
  socket.on("start_server", () => {
    if (MC_SERVER_INFO.status === "off") {
      console.log("STARTING");
      MC_SERVER_INFO.status = "idle";
      startServer();
    }
    // update all clients of the change
    io.emit("status", MC_SERVER_INFO);
  });

  /**
   * runs when the client requests to stop the server
   * @param data the name of the server we wish to stop
   */
  socket.on("stop_server", () => {
    if (MC_SERVER_INFO.status === "on") {
      console.log("STOPPING");
      MC_SERVER_INFO.status = "turning_off";
      stopServer();
    }
    // update all clients of the change
    io.emit("status", MC_SERVER_INFO);
  });
});

// startup
server.listen(PORT, () => {
  console.log(`Started app on port ${PORT}`)
});
