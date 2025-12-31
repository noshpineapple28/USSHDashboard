// creates socket io server do not touch
const SOCKET = io();
let SCRIPTS = [];

window.onload = () => {
  SOCKET.emit("getScripts");
};

function loadScripts(NEW_SCRIPTS) {
  // first remove all loaded scripts
  SCRIPTS.forEach((script) => script.html.remove());
  SCRIPTS = [];

  for (const SCRIPT in NEW_SCRIPTS) {
    // creating the class by default will
    SCRIPTS.push(
      new ListScript(
        NEW_SCRIPTS[SCRIPT]["port"],
        NEW_SCRIPTS[SCRIPT]["title"],
        NEW_SCRIPTS[SCRIPT]["dir"],
        NEW_SCRIPTS[SCRIPT]["exec"],
        NEW_SCRIPTS[SCRIPT]["id"],
        NEW_SCRIPTS[SCRIPT]["on"]
      )
    );
  }
}

// socket io events
SOCKET.on("loadScripts", (NEW_SCRIPTS) => loadScripts(NEW_SCRIPTS));
