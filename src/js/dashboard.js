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

  for (const SCRIPT of NEW_SCRIPTS) {
    // creating the class by default will
    SCRIPTS.push(
      new ListScript(
        SCRIPT["port"],
        SCRIPT["title"],
        SCRIPT["dir"],
        SCRIPT["exec"]
      )
    );
  }
}

// socket io events
SOCKET.on("loadScripts", NEW_SCRIPTS => loadScripts(NEW_SCRIPTS));
