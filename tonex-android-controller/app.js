const STORAGE_KEY = "tonex-one-ble-controller-v2";

const UART_SERVICE_UUID = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
const UART_RX_UUID = "6e400002-b5a3-f393-e0a9-e50e24dcca9e";
const UART_TX_UUID = "6e400003-b5a3-f393-e0a9-e50e24dcca9e";
const BLE_MIDI_SERVICE_UUID = "03b80e5a-ede8-4b33-a751-6ce34ec4c700";
const BLE_MIDI_CHARACTERISTIC_UUID = "7772e5db-3868-4112-a1a9-f2669d106bf3";

const DEFAULT_SETTINGS = {
  profile: "midi",
  midiChannel: 1,
  bank: 1,
  serviceUuid: BLE_MIDI_SERVICE_UUID,
  writeUuid: BLE_MIDI_CHARACTERISTIC_UUID,
  notifyUuid: BLE_MIDI_CHARACTERISTIC_UUID,
  lineEnding: "\n",
  commands: {
    preset: "PC {program}",
    cc: "CC {cc} {value}",
    bypass: "CC 12 64",
    reverb: "CC 75 64",
    tap: "CC 10 0",
    cab: "CC 117 64",
    slotA: "CC 120 {program}",
    slotB: "CC 121 {program}",
    slotBankUp: "CC 90 0"
  },
  sliders: [
    { label: "Gain", cc: 102, value: 64 },
    { label: "Volume", cc: 103, value: 96 },
    { label: "Bass", cc: 23, value: 64 },
    { label: "Middle", cc: 25, value: 64 },
    { label: "Treble", cc: 28, value: 64 },
    { label: "Presence", cc: 106, value: 64 }
  ],
  pads: [
    { label: "Preset 1", command: "PC 0" },
    { label: "Preset 2", command: "PC 1" },
    { label: "Slot A 1", command: "CC 120 0" },
    { label: "Slot B 2", command: "CC 121 1" },
    { label: "Delay", command: "CC 2 64" },
    { label: "Mod", command: "CC 32 64" }
  ]
};

const dom = {
  statusBlock: document.querySelector(".status-block"),
  statusDot: document.getElementById("statusDot"),
  statusText: document.getElementById("statusText"),
  deviceName: document.getElementById("deviceName"),
  connectButton: document.getElementById("connectButton"),
  disconnectButton: document.getElementById("disconnectButton"),
  presetGrid: document.getElementById("presetGrid"),
  activePreset: document.getElementById("activePreset"),
  bankInput: document.getElementById("bankInput"),
  bankDownButton: document.getElementById("bankDownButton"),
  bankUpButton: document.getElementById("bankUpButton"),
  channelReadout: document.getElementById("channelReadout"),
  sliderGrid: document.getElementById("sliderGrid"),
  panicButton: document.getElementById("panicButton"),
  customPads: document.getElementById("customPads"),
  editPadsButton: document.getElementById("editPadsButton"),
  padDialog: document.getElementById("padDialog"),
  padForm: document.getElementById("padForm"),
  padEditor: document.getElementById("padEditor"),
  profileSelect: document.getElementById("profileSelect"),
  midiChannelInput: document.getElementById("midiChannelInput"),
  serviceUuidInput: document.getElementById("serviceUuidInput"),
  writeUuidInput: document.getElementById("writeUuidInput"),
  notifyUuidInput: document.getElementById("notifyUuidInput"),
  lineEndingSelect: document.getElementById("lineEndingSelect"),
  saveSettingsButton: document.getElementById("saveSettingsButton"),
  resetSettingsButton: document.getElementById("resetSettingsButton"),
  rawForm: document.getElementById("rawForm"),
  rawInput: document.getElementById("rawInput"),
  logList: document.getElementById("logList"),
  clearLogButton: document.getElementById("clearLogButton")
};

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

let settings = loadSettings();
let device = null;
let server = null;
let writeCharacteristic = null;
let notifyCharacteristic = null;
let connected = false;
let activePreset = 1;
let activeSlot = null;
let sliderTimers = new Map();

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function loadSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    const merged = mergeSettings(DEFAULT_SETTINGS, saved ?? {});
    merged.lineEnding = normalizeLineEnding(merged.lineEnding);
    return merged;
  } catch {
    return clone(DEFAULT_SETTINGS);
  }
}

function mergeSettings(base, incoming) {
  const merged = { ...clone(base), ...incoming };
  merged.commands = { ...base.commands, ...(incoming.commands ?? {}) };
  merged.sliders = Array.isArray(incoming.sliders) ? incoming.sliders : clone(base.sliders);
  merged.pads = Array.isArray(incoming.pads) ? incoming.pads : clone(base.pads);
  return merged;
}

function saveSettings() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

function setConnectionState(isConnected, label = "") {
  connected = isConnected;
  dom.statusBlock.classList.toggle("connected", isConnected);
  dom.statusText.textContent = isConnected ? "Connected" : "Offline";
  dom.deviceName.textContent = label || (isConnected ? "Board connected" : "No board selected");
  dom.connectButton.disabled = isConnected;
  dom.disconnectButton.disabled = !isConnected;
}

function log(message, type = "out") {
  const item = document.createElement("li");
  item.className = type;
  const time = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
  item.textContent = `${time} ${message}`;
  dom.logList.prepend(item);

  while (dom.logList.children.length > 80) {
    dom.logList.lastElementChild?.remove();
  }
}

function applyTemplate(template, values) {
  return template.replace(/\{([a-zA-Z0-9_]+)\}/g, (_, key) => values[key] ?? "");
}

function clampInt(value, min, max, fallback) {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) return fallback;
  return Math.min(max, Math.max(min, parsed));
}

function normalizeUuid(value) {
  return value.trim().toLowerCase();
}

function normalizeLineEnding(value) {
  if (value === "crlf" || value === "\\r\\n") return "\r\n";
  if (value === "none") return "";
  if (value === "lf" || value === "\\n") return "\n";
  return value === "" ? "" : "\n";
}

function lineEndingToSelectValue(value) {
  if (value === "\r\n") return "crlf";
  if (value === "") return "none";
  return "lf";
}

function getBleConfig() {
  if (settings.profile === "midi") {
    return {
      serviceUuid: BLE_MIDI_SERVICE_UUID,
      writeUuid: BLE_MIDI_CHARACTERISTIC_UUID,
      notifyUuid: BLE_MIDI_CHARACTERISTIC_UUID
    };
  }

  return {
    serviceUuid: normalizeUuid(settings.serviceUuid),
    writeUuid: normalizeUuid(settings.writeUuid),
    notifyUuid: normalizeUuid(settings.notifyUuid)
  };
}

async function connect() {
  if (!navigator.bluetooth) {
    log("Web Bluetooth is not available in this browser.", "error");
    return;
  }

  const ble = getBleConfig();

  try {
    log(`Scanning for ${settings.profile === "midi" ? "TonexController BLE-MIDI" : "UART"} devices...`);
    device = await navigator.bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: [ble.serviceUuid]
    });

    device.addEventListener("gattserverdisconnected", onDisconnected);
    server = await device.gatt.connect();
    const service = await server.getPrimaryService(ble.serviceUuid);
    writeCharacteristic = await service.getCharacteristic(ble.writeUuid);

    if (ble.notifyUuid) {
      try {
        notifyCharacteristic = await service.getCharacteristic(ble.notifyUuid);
        await notifyCharacteristic.startNotifications();
        notifyCharacteristic.addEventListener("characteristicvaluechanged", onNotification);
      } catch (error) {
        notifyCharacteristic = null;
        log(`Notifications unavailable: ${error.message}`, "error");
      }
    }

    setConnectionState(true, device.name || "Unnamed BLE board");
    log(`Connected to ${device.name || "BLE board"}`);
    await handshake();
  } catch (error) {
    log(`Connect failed: ${error.message}`, "error");
    await disconnect();
  }
}

async function disconnect() {
  if (notifyCharacteristic) {
    try {
      notifyCharacteristic.removeEventListener("characteristicvaluechanged", onNotification);
      await notifyCharacteristic.stopNotifications();
    } catch {
      // A disconnect can race notification shutdown.
    }
  }

  if (device?.gatt?.connected) {
    device.gatt.disconnect();
  }

  device = null;
  server = null;
  writeCharacteristic = null;
  notifyCharacteristic = null;
  setConnectionState(false);
}

function onDisconnected() {
  log("Board disconnected", "error");
  device = null;
  server = null;
  writeCharacteristic = null;
  notifyCharacteristic = null;
  setConnectionState(false);
}

function onNotification(event) {
  const value = event.target.value;
  const bytes = new Uint8Array(value.buffer);

  if (settings.profile === "midi") {
    log(`RX MIDI ${toHex(bytes)}`, "in");
    return;
  }

  log(`RX ${textDecoder.decode(bytes).trim()}`, "in");
}

async function handshake() {
  if (settings.profile === "uart") {
    await sendRaw("HELLO");
  }
}

async function writeBytes(bytes, logLabel) {
  if (!writeCharacteristic) {
    log("No BLE board connected", "error");
    return false;
  }

  try {
    await writeCharacteristic.writeValueWithoutResponse(bytes);
    log(logLabel);
    return true;
  } catch (error) {
    try {
      await writeCharacteristic.writeValue(bytes);
      log(logLabel);
      return true;
    } catch (fallbackError) {
      log(`Send failed: ${fallbackError.message}`, "error");
      return false;
    }
  }
}

async function sendRaw(command) {
  const trimmed = command.trim();
  if (!trimmed) return false;

  if (settings.profile === "midi") {
    return sendMidiCommand(trimmed);
  }

  const payload = textEncoder.encode(`${trimmed}${settings.lineEnding}`);
  return writeBytes(payload, `TX ${trimmed}`);
}

async function sendCommand(key, values = {}) {
  const template = settings.commands[key];
  if (!template) {
    log(`Missing template: ${key}`, "error");
    return false;
  }

  const command = applyTemplate(template, values).trim();
  return sendRaw(command);
}

async function sendPreset(presetNumber) {
  activePreset = presetNumber;
  renderPresetGrid();
  const program = presetNumber - 1;

  return sendCommand("preset", { preset: presetNumber, program });
}

async function sendCc(cc, value) {
  const safeCc = clampInt(cc, 0, 127, 0);
  const safeValue = clampInt(value, 0, 127, 0);

  if (settings.profile === "midi") {
    return sendMidiControlChange(safeCc, safeValue);
  }

  return sendCommand("cc", { cc: safeCc, value: safeValue });
}

async function sendMidiCommand(command) {
  const parts = command.trim().split(/\s+/);
  const head = (parts[0] || "").toUpperCase();

  if (head === "PC") {
    return sendMidiProgram(clampInt(parts[1], 0, 127, 0));
  }

  if (head === "CC") {
    return sendMidiControlChange(clampInt(parts[1], 0, 127, 0), clampInt(parts[2], 0, 127, 0));
  }

  if (head === "NOTE") {
    return sendMidiNote(clampInt(parts[1], 0, 127, 60), clampInt(parts[2], 0, 127, 100));
  }

  if (head === "HEX") {
    const bytes = parts.slice(1).map((part) => Number.parseInt(part, 16)).filter((byte) => !Number.isNaN(byte));
    return writeBytes(new Uint8Array(bytes), `TX MIDI ${toHex(bytes)}`);
  }

  log(`BLE MIDI command not recognized: ${command}`, "error");
  return false;
}

async function sendMidiProgram(program) {
  const status = 0xc0 | (settings.midiChannel - 1);
  return writeBleMidi([status, program], `TX MIDI PC ${program}`);
}

async function sendMidiControlChange(cc, value) {
  const status = 0xb0 | (settings.midiChannel - 1);
  return writeBleMidi([status, cc, value], `TX MIDI CC ${cc} ${value}`);
}

async function sendMidiNote(note, velocity) {
  const status = 0x90 | (settings.midiChannel - 1);
  return writeBleMidi([status, note, velocity], `TX MIDI NOTE ${note} ${velocity}`);
}

async function writeBleMidi(messageBytes, label) {
  const timestamp = performance.now() & 0x1fff;
  const packet = new Uint8Array([
    0x80 | ((timestamp >> 7) & 0x3f),
    0x80 | (timestamp & 0x7f),
    ...messageBytes
  ]);
  return writeBytes(packet, label);
}

function toHex(bytes) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join(" ").toUpperCase();
}

function setBleProfileDefaults(profile) {
  settings.profile = profile;

  if (profile === "midi") {
    settings.serviceUuid = BLE_MIDI_SERVICE_UUID;
    settings.writeUuid = BLE_MIDI_CHARACTERISTIC_UUID;
    settings.notifyUuid = BLE_MIDI_CHARACTERISTIC_UUID;
  } else {
    settings.serviceUuid = UART_SERVICE_UUID;
    settings.writeUuid = UART_RX_UUID;
    settings.notifyUuid = UART_TX_UUID;
  }

  syncSettingsForm();
}

function renderPresetGrid() {
  dom.presetGrid.replaceChildren();
  const bank = clampInt(settings.bank, 1, 10, 1);
  const start = (bank - 1) * 20 + 1;

  for (let index = 0; index < 20; index += 1) {
    const preset = start + index;
    const button = document.createElement("button");
    button.className = "preset-button";
    button.type = "button";
    button.classList.toggle("active", preset === activePreset);
    button.innerHTML = `<strong>${String(preset).padStart(2, "0")}</strong><span>PC ${preset - 1}</span>`;
    button.addEventListener("click", () => sendPreset(preset));
    dom.presetGrid.append(button);
  }

  dom.activePreset.textContent = String(activePreset).padStart(2, "0");
}

function renderSliders() {
  dom.sliderGrid.replaceChildren();

  settings.sliders.forEach((slider, index) => {
    const card = document.createElement("div");
    card.className = "slider-card";
    card.innerHTML = `
      <div class="slider-row">
        <strong>${slider.label}</strong>
        <span class="slider-value">${slider.value}</span>
      </div>
      <input type="range" min="0" max="127" value="${slider.value}" aria-label="${slider.label}">
    `;
    const range = card.querySelector("input");
    const value = card.querySelector(".slider-value");

    range.addEventListener("input", () => {
      const nextValue = clampInt(range.value, 0, 127, 0);
      settings.sliders[index].value = nextValue;
      value.textContent = String(nextValue);
      saveSettings();
      window.clearTimeout(sliderTimers.get(index));
      sliderTimers.set(index, window.setTimeout(() => sendCc(slider.cc, nextValue), 80));
    });

    range.addEventListener("change", () => sendCc(slider.cc, range.value));
    dom.sliderGrid.append(card);
  });
}

function renderPads() {
  dom.customPads.replaceChildren();

  settings.pads.forEach((pad) => {
    const button = document.createElement("button");
    button.className = "custom-pad";
    button.type = "button";
    button.innerHTML = `<strong>${pad.label}</strong><span>${pad.command}</span>`;
    button.addEventListener("click", () => sendRaw(pad.command));
    dom.customPads.append(button);
  });
}

function openPadEditor() {
  dom.padEditor.replaceChildren();

  settings.pads.forEach((pad, index) => {
    const row = document.createElement("div");
    row.className = "pad-edit-row";
    row.innerHTML = `
      <label class="field">
        <span>Pad ${index + 1}</span>
        <input data-pad-label="${index}" type="text" value="${escapeAttribute(pad.label)}">
      </label>
      <label class="field">
        <span>Command</span>
        <input data-pad-command="${index}" type="text" value="${escapeAttribute(pad.command)}" spellcheck="false">
      </label>
    `;
    dom.padEditor.append(row);
  });

  dom.padDialog.showModal();
}

function savePadEditor() {
  settings.pads = settings.pads.map((pad, index) => ({
    label: dom.padEditor.querySelector(`[data-pad-label="${index}"]`)?.value.trim() || pad.label,
    command: dom.padEditor.querySelector(`[data-pad-command="${index}"]`)?.value.trim() || pad.command
  }));
  saveSettings();
  renderPads();
}

function escapeAttribute(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function syncSettingsForm() {
  dom.profileSelect.value = settings.profile;
  dom.midiChannelInput.value = String(settings.midiChannel);
  dom.serviceUuidInput.value = settings.serviceUuid;
  dom.writeUuidInput.value = settings.writeUuid;
  dom.notifyUuidInput.value = settings.notifyUuid;
  dom.lineEndingSelect.value = lineEndingToSelectValue(settings.lineEnding);
  dom.bankInput.value = String(settings.bank);
  dom.channelReadout.textContent = String(settings.midiChannel);

  document.querySelectorAll("[data-template-key]").forEach((input) => {
    input.value = settings.commands[input.dataset.templateKey] ?? "";
  });
}

function readSettingsForm() {
  settings.profile = dom.profileSelect.value;
  settings.midiChannel = clampInt(dom.midiChannelInput.value, 1, 16, 1);
  settings.serviceUuid = dom.serviceUuidInput.value.trim();
  settings.writeUuid = dom.writeUuidInput.value.trim();
  settings.notifyUuid = dom.notifyUuidInput.value.trim();
  settings.lineEnding = normalizeLineEnding(dom.lineEndingSelect.value);
  settings.bank = clampInt(dom.bankInput.value, 1, 10, 1);

  document.querySelectorAll("[data-template-key]").forEach((input) => {
    settings.commands[input.dataset.templateKey] = input.value.trim();
  });

  saveSettings();
  syncSettingsForm();
  renderPresetGrid();
}

function wireEvents() {
  dom.connectButton.addEventListener("click", connect);
  dom.disconnectButton.addEventListener("click", disconnect);

  dom.bankDownButton.addEventListener("click", () => {
    settings.bank = Math.max(1, settings.bank - 1);
    saveSettings();
    syncSettingsForm();
    renderPresetGrid();
  });

  dom.bankUpButton.addEventListener("click", () => {
    settings.bank = Math.min(10, settings.bank + 1);
    saveSettings();
    syncSettingsForm();
    renderPresetGrid();
  });

  dom.bankInput.addEventListener("change", () => {
    settings.bank = clampInt(dom.bankInput.value, 1, 10, 1);
    saveSettings();
    syncSettingsForm();
    renderPresetGrid();
  });

  document.querySelectorAll("[data-command-key]").forEach((button) => {
    button.addEventListener("click", async () => {
      const key = button.dataset.commandKey;
      const values = { preset: activePreset, program: activePreset - 1 };

      if (key?.startsWith("slot")) {
        activeSlot = key;
        document.querySelectorAll(".segment-button").forEach((item) => {
          item.classList.toggle("active", item.dataset.commandKey === activeSlot);
        });
      }
      await sendCommand(key, values);
    });
  });

  dom.panicButton.addEventListener("click", () => {
    sendCc(2, 0);
    sendCc(32, 0);
    sendCc(75, 0);
  });

  dom.editPadsButton.addEventListener("click", openPadEditor);

  dom.padForm.addEventListener("close", () => {});
  dom.padForm.addEventListener("submit", (event) => {
    if (event.submitter?.id === "savePadsButton") {
      savePadEditor();
    }
  });

  dom.profileSelect.addEventListener("change", () => {
    setBleProfileDefaults(dom.profileSelect.value);
  });

  dom.saveSettingsButton.addEventListener("click", () => {
    readSettingsForm();
    log("Settings saved");
  });

  dom.resetSettingsButton.addEventListener("click", () => {
    settings = clone(DEFAULT_SETTINGS);
    saveSettings();
    syncSettingsForm();
    renderPresetGrid();
    renderSliders();
    renderPads();
    log("Settings reset");
  });

  dom.rawForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const command = dom.rawInput.value;
    const sent = await sendRaw(command);
    if (sent) dom.rawInput.value = "";
  });

  dom.clearLogButton.addEventListener("click", () => {
    dom.logList.replaceChildren();
  });
}

function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }
}

function init() {
  syncSettingsForm();
  renderPresetGrid();
  renderSliders();
  renderPads();
  wireEvents();
  registerServiceWorker();
  setConnectionState(false);
  log("Controller ready");
}

init();
