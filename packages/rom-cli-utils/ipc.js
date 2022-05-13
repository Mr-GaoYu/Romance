const ipc = require('node-ipc');
const DEFAULT_ID = process.env.ROM_CLI_IPC || 'rom-cli';
const DEFAULT_IDLE_TIMEOUT = 3000;

const DEFAULT_OPTIONS = {
  networkId: DEFAULT_ID,
  autoConnect: true,
  disconnectOnIdle: false,
  idleTimeout: DEFAULT_IDLE_TIMEOUT,
  namespaceOnProject: true
};

const PROJECT_ID = process.env.ROM_CLI_PROJECT_ID;

exports.IpcMessenger = class IpcMessenger {
  constructor(options = {}) {
    options = Object.assign({}, DEFAULT_OPTIONS, options);
    ipc.config.id = this.id = options.networkId;
    ipc.config.retry = 1500;
    ipc.config.silent = true;

    this.connected = false;
    this.connecting = false;
    this.disconnecting = false;
    this.queue = null;
    this.options = options;

    this.listeners = [];

    this.disconnectTimeout = 15000;
    this.idleTimer = null;

    process.exit = code => {
      process.exitCode = code;
    };

    this._reset();
  }

  _reset() {
    this.queue = [];
    this.connected = false;
  }

  checkConnection() {
    if (!ipc.of[this.id]) {
      this.connected = false;
    }
  }

  send(data, type = 'message') {
    this.checkConnection()
    if (this.connected) {
      if (this.options.namespaceOnProject && PROJECT_ID) {
        data = {
          _projectId: PROJECT_ID,
          _data: data
        };
      }
    } else {
      this.queue.push(data);

      if (this.options.autoConnect && !this.connecting) {}
    }
  }
}

new exports.IpcMessenger()