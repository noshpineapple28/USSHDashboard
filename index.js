const express = require("express");
const socketIO = require("socket.io");
const { ServerScript } = require("./src/js/server_script");
const http = require("http");
const fs = require("fs");
const app = express();
const PORT = process.argv[process.argv.length - 1];

// server
const server = http.createServer(app);
const io = socketIO(server);

// list of all scripts
const SCRIPTS = loadScripts();

/**
 * loads scripts to usable format
 * @returns array of scripts in server script format
 */
function loadScripts() {
  let js = JSON.parse(fs.readFileSync("./scripts.json"));
  let arr = {
    nextID: js["nextID"],
    scripts: [],
  };
  for (let scr in js["scripts"])
    arr["scripts"].push(
      new ServerScript(
        js["scripts"][scr]["port"],
        js["scripts"][scr]["title"],
        js["scripts"][scr]["dir"],
        js["scripts"][scr]["exec"],
        js["scripts"][scr]["id"]
      )
    );

  return arr;
}

/**
 * saves the scripts into a json compatible format
 */
function saveScripts() {
  let arr = {
    nextID: SCRIPTS["nextID"],
    scripts: fetchJSONScripts(),
  };
  fs.writeFileSync("./scripts.json", JSON.stringify(arr));
}

/**
 * fetches scripts in json format
 * @returns array of json format scripts
 */
function fetchJSONScripts() {
  // when in class format, the scripts are an array, turn to an obj
  let obj = {};
  for (let scr of SCRIPTS["scripts"]) {
    obj[scr.id] = scr.toJSON();
  }
  return obj;
}

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
    socket.emit("loadScripts", fetchJSONScripts());
  });

  /**
   * gets a specific script
   */
  socket.on("getScriptByID", (scriptID) => {
    let i = 0;
    let discovered = false;
    for (let script of SCRIPTS["scripts"]) {
      console.log(script);
      if (script.id == scriptID) {
        discovered = true;
        break;
      }
      i++;
    }

    if (!discovered) {
      console.log("Script does not exist");
      return;
    }
    socket.emit("handleScriptRequest", SCRIPTS["scripts"][i].toJSON());
  });

  /**
   * creates a new script
   */
  socket.on("createScript", (script) => {
    script["id"] = SCRIPTS["nextID"];
    SCRIPTS["nextID"]++;
    SCRIPTS["scripts"].push(
      new ServerScript(
        script["port"],
        script["title"],
        script["dir"],
        script["exec"],
        script["id"]
      )
    );
    socket.emit("scriptCreated");
    saveScripts();
  });

  /**
   * edit an existing script
   */
  socket.on("editScript", (script) => {
    let i = 0;
    let discovered = false;
    for (let script of SCRIPTS["scripts"]) {
      console.log(script);
      if (script.id == script.id) {
        discovered = true;
        break;
      }
      i++;
    }
    if (!discovered) {
      console.log("Script does not exist");
      return;
    }
    let newScript = new ServerScript(
      script["port"],
      script["title"],
      script["dir"],
      script["exec"],
      script["id"]
    );

    console.log(
      `Updating script id: ${script["id"]} "${SCRIPTS["scripts"][i].title}" to "${newScript.title}"`
    );
    SCRIPTS["scripts"][i] = newScript;
    socket.emit("scriptEdited");
    saveScripts();
  });

  /**
   * attempts to delete a script
   */
  socket.on("attemptRemoveScript", (scriptID) => {
    console.log(`Removing script: ${scriptID}`);
    let i = 0;
    let discovered = false;
    for (let script of SCRIPTS["scripts"]) {
      if (script.id == scriptID) {
        discovered = true;
        break;
      }
      i++;
    }

    if (!discovered) {
      console.log("Script does not exist");
      return;
    }

    // delete the script
    SCRIPTS["scripts"][i].delete();
    SCRIPTS["scripts"].splice(i, 1);
    saveScripts();
    socket.emit("loadScripts", fetchJSONScripts());
  });

  socket.on("executeScript", (id) => {});
});

// startup
server.listen(PORT, () => {
  console.log(`Started app on port ${PORT}`);
});
