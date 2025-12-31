const { spawn } = require("node:child_process");
const kill = require("tree-kill");
const os = require("os");
const fs = require("fs");

class ServerScript {
  constructor(port, title, dir, exec, id) {
    this.port = port;
    this.title = title;
    this.dir = dir;
    this.exec = exec;
    this.id = id;
    this.on = false;
    this.app = undefined;
  }

  toJSON() {
    return {
      port: this.port,
      title: this.title,
      dir: this.dir,
      exec: this.exec,
      id: this.id,
      on: this.on,
    };
  }

  stderrEvent(data) {
    fs.appendFileSync(
      `logs/${this.id}_${this.title}_stderr.log`,
      data.toString()
    );
  }

  stdoutEvent(data) {
    fs.appendFileSync(
      `logs/${this.id}_${this.title}_stdout.log`,
      data.toString()
    );
  }

  stdinWrite(data) {
    try {
      this.app.stdin.write(`${data}\n`);
    } catch (_) {}
  }

  exitEvent(data) {
    if (!data) return;
    fs.appendFileSync(
      `logs/${this.id}_${this.title}_stdout.log`,
      data.toString()
    );
  }

  execute() {
    if (this.on) {
      console.log("Looks like we're still on. Rebooting...");
      try {
        this.terminate();
      } catch (_) {
        console.log(_);
      }
    }
    try {
      this.on = true;
      if (os.platform() === "win32")
        this.app = spawn(`powershell`, ["-NoProfile", "-Command", "-"]);
      else if (os.platform() === "linux")
        this.app = spawn(`pwsh`, ["-NoProfile", "-Command", "-"]);
      this.app.stdin.write(`cd ${this.dir}\n`);
      this.app.stdin.write(`${this.exec}\n`);

      // attach events
      this.app.stderr.on("data", (data) => this.stderrEvent(data));
      this.app.stdout.on("data", (data) => this.stdoutEvent(data));
      this.app.on("exit", (data) => this.exitEvent(data));
    } catch (_) {
      console.log(_);
      this.on = false;
    }
  }

  terminate() {
    if (!this.on)
      console.log(
        "Looks like we're already off. Just to be sure, rekilling..."
      );
    try {
      this.on = false;
      kill(this.app.pid, 'SIGKILL');
    } catch (_) {
      console.log(_);
    }
  }

  delete() {
    console.log(`Deleting script ${this.title}`);
    try {
      this.terminate();
    } catch (_) {
      console.log(_);
    }
  }
}

module.exports = { ServerScript };
