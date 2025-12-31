const express = require("express");
const http = require("http");
const app = express();
const PORT = process.argv[process.argv.length - 1];

// server
const server = http.createServer(app);

// startup
server.listen(PORT, () => {
  console.log(`Started app on port ${PORT}`);
});

// whenever the "/" endpoint appears, allow server to serve all files in the site_map folder
app.use("/", express.static("test"));
console.log("HELLOOOOOOOO")
