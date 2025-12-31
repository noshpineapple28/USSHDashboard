// DO NOT MODIFY
// the io server sent from the node server. loaded in the html file
const SOCKET = io();
const ID = new URLSearchParams(window.location.search).get("id");
let list_script = undefined;

window.onload = () => {
  SOCKET.emit("getScriptByID", ID);
};

function sendInput(id) {
  let input = document.querySelector("input").value;
  SOCKET.emit("stdin", {
    id: id,
    input: input,
  });
}

/**
 * when the script comes in, handle the attatchment of values
 */
SOCKET.on("handleScriptRequest", (script) => {
  document.title = `Edit ${script.title}`;
  // theres an id called window_title, so im just accessing its value
  window_title.innerText = `Edit ${script.title}`;
  list_script = script;

  const PORT = document.getElementById("port");
  PORT.innerText = script["port"];

  const TITLE = document.getElementById("title");
  TITLE.innerText = script["title"];

  const DIRECTORY = document.getElementById("directory");
  DIRECTORY.innerText = script["dir"];

  const EXECUTION = document.getElementById("execution");
  EXECUTION.innerText = script["exec"];

  const STATUS = document.getElementById("status");
  STATUS.innerText = script["on"] ? "ON" : "OFF";
  STATUS.classList = `script_status ${script["on"] ? "on" : "off"}`;

  const STDIN = document.getElementById("submit");
  STDIN.disabled = !script["on"];
  STDIN.addEventListener("click", (_) => sendInput(script["id"]));
});

SOCKET.on("consoleMessage", (data) => {
  let msg = document.createElement("p");
  msg.innerText = data;
  let console = document.getElementById("console");
  console.appendChild(msg);
});
