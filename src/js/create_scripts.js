// DO NOT MODIFY
// the io server sent from the node server. loaded in the html file
const SOCKET = io();

function onEdit(id, e) {
  document.getElementById(id).innerHTML = e.target.value;
}

function createScript(button, port, title, dir, exec) {
  button.disabled = true;
  SOCKET.emit("createScript", {
    port: port,
    title: title,
    dir: dir,
    exec: exec,
  });
}

window.onload = () => {
  const PORT = document.getElementById("port_input");
  PORT.addEventListener("input", (e) => onEdit(PORT.id.split("_")[0], e));
  const TITLE = document.getElementById("title_input");
  TITLE.addEventListener("input", (e) => onEdit(TITLE.id.split("_")[0], e));
  const DIRECTORY = document.getElementById("directory_input");
  DIRECTORY.addEventListener("input", (e) =>
    onEdit(DIRECTORY.id.split("_")[0], e)
  );
  const EXECUTION = document.getElementById("execution_input");
  EXECUTION.addEventListener("input", (e) =>
    onEdit(EXECUTION.id.split("_")[0], e)
  );

  const CREATE = document.getElementById("create");
  CREATE.addEventListener("click", () =>
    createScript(
      CREATE,
      PORT.value,
      TITLE.value,
      DIRECTORY.value,
      EXECUTION.value
    )
  );
};

SOCKET.on("scriptCreated", () =>
  window.location.href = window.location.href.replace("create_script.html", "")
);

SOCKET.on("scriptCreationFailed", () => {
  alert("Failed to create script");
  const CREATE = document.getElementById("create");
  CREATE.disabled = false;
});
