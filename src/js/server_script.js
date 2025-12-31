class ServerScript {
  constructor(port, title, dir, exec, id) {
    this.port = port;
    this.title = title;
    this.dir = dir;
    this.exec = exec;
    this.id = id;
    this.on = false;
  }

  toJSON() {
    return {
      port: this.port,
      title: this.title,
      dir: this.dir,
      exec: this.exec,
      id: this.id,
    };
  }

  delete() {
    console.log(`Deleting script ${this.title}`)
  }
}

module.exports = { ServerScript };
