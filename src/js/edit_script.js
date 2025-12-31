// DO NOT MODIFY
// the io server sent from the node server. loaded in the html file
const SOCKET = io();
const ID = new URLSearchParams(window.location.search).get("id");

function onEdit(id, e) {
  document.getElementById(id).innerHTML = e.target.value;
}

function editScript(button, port, title, dir, exec, id) {
  button.disabled = true;
  SOCKET.emit("editScript", {
    port: port,
    title: title,
    dir: dir,
    exec: exec,
    id: id,
  });
}

window.onload = () => {
  SOCKET.emit("getScriptByID", ID);
};

/**
 * when the script comes in, handle the attatchment of values
 */
SOCKET.on("handleScriptRequest", (script) => {
  document.title = `Edit ${script.title}`;
  // theres an id called window_title, so im just accessing its value
  window_title.innerText = `Edit ${script.title}`;
  const PORT = document.getElementById("port_input");
  PORT.value = script["port"];
  document.getElementById("port").innerHTML = PORT.value;
  PORT.addEventListener("input", (e) => onEdit(PORT.id.split("_")[0], e));

  const TITLE = document.getElementById("title_input");
  TITLE.addEventListener("input", (e) => onEdit(TITLE.id.split("_")[0], e));
  TITLE.value = script["title"];
  document.getElementById("title").innerHTML = TITLE.value;

  const DIRECTORY = document.getElementById("directory_input");
  DIRECTORY.addEventListener("input", (e) =>
    onEdit(DIRECTORY.id.split("_")[0], e)
  );
  DIRECTORY.value = script["dir"];
  document.getElementById("directory").innerHTML = DIRECTORY.value;

  const EXECUTION = document.getElementById("execution_input");
  EXECUTION.addEventListener("input", (e) =>
    onEdit(EXECUTION.id.split("_")[0], e)
  );
  EXECUTION.value = script["exec"];
  document.getElementById("execution").innerHTML = EXECUTION.value;

  const CREATE = document.getElementById("create");
  CREATE.addEventListener("click", () =>
    editScript(
      CREATE,
      PORT.value,
      TITLE.value,
      DIRECTORY.value,
      EXECUTION.value,
      ID
    )
  );
});

SOCKET.on(
  "scriptEdited",
  () =>
    (window.location.href = window.location.href.replace(
      `edit_script.html?id=${ID}`,
      ""
    ))
);

SOCKET.on("scriptEditFailed", () => {
  alert("Failed to edit script");
  const CREATE = document.getElementById("create");
  CREATE.disabled = false;
});
