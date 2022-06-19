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



  checkConnection() {
    if (!ipc.of[this.id]) {
      this.connected = false;
    }
  }

  connect() {
    this.checkConnection();
    if (this.connected || this.connecting) {
      return;
    }

    this.connecting = true;
    this.disconnecting = false;
    ipc.connectTo(this.id, () => {
      this.connected = true;
      this.connecting = false;
      this.queue && this.queue.forEach(data => this.send(data));
      this.queue = null;

      ipc.of[this.id].on('message', this._onMessage);
    });
  }

  disconnect() {
    this.checkConnection();
    if (!this.connected || this.disconnecting) {
      return;
    }

    this.disconnecting = true;
    this.connecting = false;

    const ipcTimer = setTimeout(() => {
      this._disconnect();
    }, this.disconnectTimeout);

    this.send({
      done: true
    }, 'ack');

    ipc.of[this.id].on('ack', data => {
      if (data.ok) {
        clearTimeout(ipcTimer);
        this._disconnect();
      }
    });
  }

  on(listener) {
    this.listeners.push(listener);
  }

  off(listener) {
    const index = this.listeners.indexOf(listener);
    if (index !== -1) {
      this.listeners.splice(index, 1);
    }
  }

  _reset() {
    this.queue = [];
    this.connected = false;
  }

  _disconnect() {
    this.connected = false;
    this.disconnecting = false;
    ipc.disconnect(this.id);
    this._reset();
  }

  _onMessage(data) {
    this.listeners.forEach(fn => {
      if (this.options.namespaceOnProject && data._projectId) {
        if (data._projectId === PROJECT_ID) {
          data = data._data;
        } else {
          return;
        }
      }
      fn(data);
    });
  }
}

new exports.IpcMessenger()