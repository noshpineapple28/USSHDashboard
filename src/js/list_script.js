class ListScript {
  constructor(port, title, dir, exec, id, on = false) {
    this.port = port;
    this.title = title;
    this.dir = dir;
    this.exec = exec;
    this.id = id;
    this.on = on;
    this.html = document.createElement("div");
    this.createHTML();
    document.getElementById("scripts").appendChild(this.html);
  }

  /**
   * tell server to remove the socket
   */
  attemptRemoveScript() {
    SOCKET.emit("attemptRemoveScript", this.id);
  }

  /**
   * performs the edit operation
   */
  editScript() {
    window.location.href += `edit_script.html?id=${this.id}`;
  }

  /**
   * execute the given script
   */
  executeScript() {
    SOCKET.emit("executeScript", this.id);
  }

  /**
   * terminate the given script
   */
  terminateScript() {
    SOCKET.emit("terminateScript", this.id);
  }

  /**
   * fills the `this.html` field with associated html tags
   *
   * to update the dom, append this.html to it
   */
  createHTML() {
    this.container_div = document.createElement("div");
    this.container_div.classList += "list_script";
    this.html.appendChild(this.container_div);

    // headers
    this.header_div = document.createElement("div");
    this.header_div.classList += "script_header";
    this.header_div.addEventListener(
      "click",
      (_) => (window.location.href += `script_console.html?id=${this.id}`)
    );
    this.container_div.appendChild(this.header_div);
    // port
    this.html_port = document.createElement("p");
    this.html_port.classList += "script_port";
    this.html_port.innerText = this.port;
    this.header_div.appendChild(this.html_port);
    // title
    this.html_title = document.createElement("p");
    this.html_title.classList += "script_title";
    this.html_title.innerText = this.title;
    this.header_div.appendChild(this.html_title);
    // status
    this.html_status = document.createElement("p");
    this.html_status.classList += `script_status ${this.on ? "on" : "off"}`;
    this.html_status.innerText = this.on ? "ON" : "OFF";
    this.header_div.appendChild(this.html_status);

    // script access
    this.script_access = document.createElement("div");
    this.script_access.classList += "script_access";
    this.container_div.appendChild(this.script_access);

    // meta info
    this.meta_info = document.createElement("div");
    this.meta_info.classList += "meta_info";
    this.script_access.appendChild(this.meta_info);
    // dir
    this.html_dir = document.createElement("div");
    this.html_dir.classList += "script_title script_info";
    this.html_dir.innerText = this.dir;
    this.meta_info.appendChild(this.html_dir);
    // exec
    this.html_exec = document.createElement("div");
    this.html_exec.classList += "script_title script_info";
    this.html_exec.innerText = `{ ${this.exec} }`;
    this.meta_info.appendChild(this.html_exec);

    // script_controls
    this.script_controls = document.createElement("div");
    this.script_controls.classList += "script_controls";
    this.script_access.appendChild(this.script_controls);
    // html_edit
    this.html_edit = document.createElement("i");
    this.html_edit.classList += "fa-solid fa-pen-to-square edit";
    this.html_edit.addEventListener("click", () => this.editScript());
    this.script_controls.appendChild(this.html_edit);
    // html_terminate
    this.html_terminate = document.createElement("i");
    this.html_terminate.classList += "fa-solid fa-stop terminate";
    this.html_terminate.addEventListener("click", () => this.terminateScript());
    this.script_controls.appendChild(this.html_terminate);
    // html_execute
    this.html_execute = document.createElement("i");
    this.html_execute.classList += "fa-solid fa-person-running execute";
    this.html_execute.addEventListener("click", () => this.executeScript());
    this.script_controls.appendChild(this.html_execute);
    // html_remove
    this.html_remove = document.createElement("i");
    this.html_remove.classList += "fa-solid fa-trash remove";
    this.html_remove.addEventListener("click", () =>
      this.attemptRemoveScript()
    );
    this.script_controls.appendChild(this.html_remove);
  }
}
