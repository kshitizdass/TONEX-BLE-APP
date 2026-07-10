const STORAGE_KEY = "tonex-one-ble-controller-v3";

const UART_SERVICE_UUID = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
const UART_RX_UUID = "6e400002-b5a3-f393-e0a9-e50e24dcca9e";
const UART_TX_UUID = "6e400003-b5a3-f393-e0a9-e50e24dcca9e";
const BLE_MIDI_SERVICE_UUID = "03b80e5a-ede8-4b33-a751-6ce34ec4c700";
const BLE_MIDI_CHARACTERISTIC_UUID = "7772e5db-3868-4112-a1a9-f2669d106bf3";

const AMP_IMAGE_FILES = [
  "tnxablk.png",
  "tnxared.png",
  "ac30.png",
  "5150.png",
  "fndrtwin.png",
  "jcm.png",
  "jtm.png",
  "orngr120.png",
  "mesamkv.png",
  "friedman.png",
  "diezel.png",
  "roljazz.png",
  "jbdumble.png",
  "supro.png",
  "slvrface.png",
  "ba500.png",
  "bigmuff.png",
  "klongld.png",
  "fuzzred.png",
  "ratyell.png",
  "ampgchrm.png",
  "bossblk.png",
  "bossslvr.png",
  "bossyel.png",
  "elgntblu.png",
  "evh.png",
  "fndrhtrd.png",
  "fndrtwdg.png",
  "fuzzslvr.png",
  "ibnzblue.png",
  "ibnzdblu.png",
  "ibnzgrn.png",
  "ibnzred.png",
  "jetcity.png",
  "lifepdl.png",
  "mdnbkplx.png",
  "mdnwhplx.png",
  "mngglry.png",
  "msamkwd.png",
  "msbogdul.png",
  "mxrdbbl.png",
  "mxrdblrd.png",
  "mxrsgorg.png",
  "mxrsngbk.png",
  "mxrsnggd.png",
  "mxrsnggn.png",
  "mxrsngwh.png",
  "mxrsngyl.png",
  "whtmdrn.png",
  "woodamp.png"
];

const AMP_IMAGE_LABELS = {
  "5150.png": "5150",
  "ac30.png": "AC30",
  "ba500.png": "Bass 500",
  "bigmuff.png": "Big Muff",
  "diezel.png": "Diezel",
  "evh.png": "EVH",
  "fndrtwin.png": "Fender Twin",
  "friedman.png": "Friedman",
  "jbdumble.png": "Dumble",
  "jcm.png": "JCM",
  "jtm.png": "JTM Plexi",
  "klongld.png": "Klon Gold",
  "mesamkv.png": "Mesa MKV",
  "orngr120.png": "Orange 120",
  "ratyell.png": "RAT Yellow",
  "roljazz.png": "Roland Jazz",
  "slvrface.png": "Silverface",
  "supro.png": "Supro",
  "tnxablk.png": "TONEX Black",
  "tnxared.png": "TONEX Red",
  "whtmdrn.png": "White Modern",
  "woodamp.png": "Wood Amp"
};

const AMP_IMAGES = AMP_IMAGE_FILES.map((file) => ({
  file: `assets/amps/${file}`,
  label: AMP_IMAGE_LABELS[file] ?? file.replace(".png", "").toUpperCase()
}));

const DEFAULT_PRESETS = [
  { name: "TONEX Black", image: "assets/amps/tnxablk.png" },
  { name: "TONEX Red", image: "assets/amps/tnxared.png" },
  { name: "AC30 Chime", image: "assets/amps/ac30.png" },
  { name: "5150 Lead", image: "assets/amps/5150.png" },
  { name: "Twin Clean", image: "assets/amps/fndrtwin.png" },
  { name: "JCM Crunch", image: "assets/amps/jcm.png" },
  { name: "JTM Plexi", image: "assets/amps/jtm.png" },
  { name: "Orange 120", image: "assets/amps/orngr120.png" },
  { name: "Mesa MKV", image: "assets/amps/mesamkv.png" },
  { name: "Friedman", image: "assets/amps/friedman.png" },
  { name: "Diezel", image: "assets/amps/diezel.png" },
  { name: "Jazz Clean", image: "assets/amps/roljazz.png" },
  { name: "Dumble", image: "assets/amps/jbdumble.png" },
  { name: "Supro Drive", image: "assets/amps/supro.png" },
  { name: "Silverface", image: "assets/amps/slvrface.png" },
  { name: "Bass 500", image: "assets/amps/ba500.png" },
  { name: "Big Muff", image: "assets/amps/bigmuff.png" },
  { name: "Klon Gold", image: "assets/amps/klongld.png" },
  { name: "Fuzz Red", image: "assets/amps/fuzzred.png" },
  { name: "RAT Yellow", image: "assets/amps/ratyell.png" }
];

const GLOBAL_CONTROLS = [
  {
    key: "globalBypass",
    type: "toggle",
    title: "Global Bypass",
    subtitle: "CC12",
    cc: 12,
    onValue: 127,
    offValue: 0,
    onLabel: "Bypass",
    offLabel: "Active",
    default: 0
  },
  {
    key: "cabBypass",
    type: "toggle",
    title: "Cab Section",
    subtitle: "CC117",
    cc: 117,
    onValue: 0,
    offValue: 127,
    onLabel: "Cab",
    offLabel: "Bypass",
    default: 0
  },
  {
    key: "tempoSource",
    type: "toggle",
    title: "Tempo Source",
    subtitle: "CC118",
    cc: 118,
    onValue: 127,
    offValue: 0,
    onLabel: "Global",
    offLabel: "Preset",
    default: 0
  },
  {
    key: "bpm",
    type: "range",
    title: "BPM",
    subtitle: "CC99/100",
    min: 40,
    max: 227,
    step: 1,
    unit: "BPM",
    default: 120,
    send(value) {
      return value <= 127 ? sendCc(99, value) : sendCc(100, value - 100);
    }
  },
  {
    key: "inputTrim",
    type: "range",
    title: "Input Trim",
    subtitle: "CC116",
    cc: 116,
    min: -15,
    max: 15,
    step: 1,
    unit: "dB",
    default: 0
  },
  {
    key: "tuningReference",
    type: "range",
    title: "Tuning Ref",
    subtitle: "CC119",
    cc: 119,
    min: 415,
    max: 465,
    step: 1,
    unit: "Hz",
    default: 440
  },
  {
    key: "masterVolume",
    type: "range",
    title: "Master Volume",
    subtitle: "CC122",
    cc: 122,
    min: -40,
    max: 3,
    step: 1,
    unit: "dB",
    default: 0
  }
];

const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

const DEFAULT_SETTINGS = {
  profile: "midi",
  midiChannel: 1,
  bank: 1,
  serviceUuid: BLE_MIDI_SERVICE_UUID,
  writeUuid: BLE_MIDI_CHARACTERISTIC_UUID,
  notifyUuid: BLE_MIDI_CHARACTERISTIC_UUID,
  lineEnding: "\n",
  presets: DEFAULT_PRESETS,
  effectValues: {},
  globalValues: {},
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
    { label: "Gain", cc: 102, value: 50 },
    { label: "Volume", cc: 103, value: 76 },
    { label: "Bass", cc: 23, value: 50 },
    { label: "Middle", cc: 25, value: 50 },
    { label: "Treble", cc: 28, value: 50 },
    { label: "Presence", cc: 106, value: 50 }
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

const EFFECT_GROUPS = [
  {
    id: "gate",
    title: "Gate",
    subtitle: "Noise gate",
    imageOn: "assets/effects/effect_icon_gate_on.png",
    imageOff: "assets/effects/effect_icon_gate_off.png",
    power: { cc: 14, on: 127, off: 0, onLabel: "On", offLabel: "Off" },
    selects: [
      {
        key: "gatePosition",
        label: "Position",
        cc: 13,
        default: 0,
        options: [
          { label: "First", value: 0 },
          { label: "Post Amp", value: 127 }
        ]
      }
    ],
    controls: [
      { label: "Threshold", cc: 15, default: 64 },
      { label: "Release", cc: 16, default: 64 },
      { label: "Depth", cc: 17, default: 64 }
    ]
  },
  {
    id: "comp",
    title: "Compressor",
    subtitle: "Dynamics",
    imageOn: "assets/effects/effect_icon_comp_on.png",
    imageOff: "assets/effects/effect_icon_comp_off.png",
    power: { cc: 18, on: 127, off: 0, onLabel: "On", offLabel: "Off" },
    selects: [
      {
        key: "compPosition",
        label: "Position",
        cc: 22,
        default: 0,
        options: [
          { label: "First", value: 0 },
          { label: "Post Amp", value: 127 }
        ]
      }
    ],
    controls: [
      { label: "Threshold", cc: 19, default: 64 },
      { label: "Gain", cc: 20, default: 64 },
      { label: "Attack", cc: 21, default: 64 }
    ]
  },
  {
    id: "eq",
    title: "EQ",
    subtitle: "Tone shaping",
    image: "assets/effects/effect_icon_eq.png",
    note: "TonexOneController exposes EQ parameters, but not an EQ power CC.",
    selects: [
      {
        key: "eqPosition",
        label: "Position",
        cc: 30,
        default: 0,
        options: [
          { label: "Pre Amp", value: 0 },
          { label: "Post Amp", value: 127 }
        ]
      }
    ],
    controls: [
      { label: "Bass", cc: 23, default: 64 },
      { label: "Bass Hz", cc: 24, default: 64 },
      { label: "Mid", cc: 25, default: 64 },
      { label: "Mid Q", cc: 26, default: 64 },
      { label: "Mid Hz", cc: 27, default: 64 },
      { label: "Treble", cc: 28, default: 64 },
      { label: "Treble Hz", cc: 29, default: 64 }
    ]
  },
  {
    id: "mod",
    title: "Mod",
    subtitle: "Chorus, trem, phaser, flanger, rotary",
    imageOn: "assets/effects/effect_icon_mod_on.png",
    imageOff: "assets/effects/effect_icon_mod_off.png",
    imageByValue: {
      key: "modType",
      values: {
        0: "assets/effects/effect_icon_mod_on_chorus.png",
        1: "assets/effects/effect_icon_mod_on_tremolo.png",
        2: "assets/effects/effect_icon_mod_on_phaser.png",
        3: "assets/effects/effect_icon_mod_on_flanger.png",
        4: "assets/effects/effect_icon_mod_on_rotary.png"
      }
    },
    power: { cc: 32, on: 127, off: 0, onLabel: "On", offLabel: "Off" },
    selects: [
      {
        key: "modPosition",
        label: "Position",
        cc: 31,
        default: 0,
        options: [
          { label: "Pre Amp", value: 0 },
          { label: "Post Amp", value: 127 }
        ]
      },
      {
        key: "modType",
        label: "Type",
        cc: 33,
        default: 0,
        rerender: true,
        options: [
          { label: "Chorus", value: 0 },
          { label: "Tremolo", value: 1 },
          { label: "Phaser", value: 2 },
          { label: "Flanger", value: 3 },
          { label: "Rotary", value: 4 }
        ]
      }
    ],
    controlSetsKey: "modType",
    controlSets: {
      0: [
        { kind: "select", key: "chorusSync", label: "Sync", cc: 34, default: 0, options: [{ label: "Off", value: 0 }, { label: "On", value: 127 }] },
        { label: "Rate", cc: 35, default: 64 },
        { label: "Depth", cc: 36, default: 64 },
        { label: "Level", cc: 37, default: 64 }
      ],
      1: [
        { kind: "select", key: "tremoloSync", label: "Sync", cc: 38, default: 0, options: [{ label: "Off", value: 0 }, { label: "On", value: 127 }] },
        { label: "Rate", cc: 39, default: 64 },
        { label: "Shape", cc: 40, default: 64 },
        { label: "Spread", cc: 41, default: 64 },
        { label: "Level", cc: 42, default: 64 }
      ],
      2: [
        { kind: "select", key: "phaserSync", label: "Sync", cc: 43, default: 0, options: [{ label: "Off", value: 0 }, { label: "On", value: 127 }] },
        { label: "Rate", cc: 44, default: 64 },
        { label: "Depth", cc: 45, default: 64 },
        { label: "Level", cc: 46, default: 64 }
      ],
      3: [
        { kind: "select", key: "flangerSync", label: "Sync", cc: 47, default: 0, options: [{ label: "Off", value: 0 }, { label: "On", value: 127 }] },
        { label: "Rate", cc: 48, default: 64 },
        { label: "Depth", cc: 49, default: 64 },
        { label: "Feedback", cc: 50, default: 64 },
        { label: "Level", cc: 51, default: 64 }
      ],
      4: [
        { kind: "select", key: "rotarySync", label: "Sync", cc: 52, default: 0, options: [{ label: "Off", value: 0 }, { label: "On", value: 127 }] },
        { label: "Speed", cc: 53, default: 64 },
        { label: "Radius", cc: 54, default: 64 },
        { label: "Spread", cc: 55, default: 64 },
        { label: "Level", cc: 56, default: 64 }
      ]
    }
  },
  {
    id: "delay",
    title: "Delay",
    subtitle: "Digital or tape",
    imageOn: "assets/effects/effect_icon_delay_on.png",
    imageOff: "assets/effects/effect_icon_delay_off.png",
    imageByValue: {
      key: "delayType",
      values: {
        0: "assets/effects/effect_icon_delay_on_d.png",
        1: "assets/effects/effect_icon_delay_on_t.png"
      }
    },
    power: { cc: 2, on: 127, off: 0, onLabel: "On", offLabel: "Off" },
    selects: [
      {
        key: "delayPosition",
        label: "Position",
        cc: 1,
        default: 0,
        options: [
          { label: "Pre Amp", value: 0 },
          { label: "Post Amp", value: 127 }
        ]
      },
      {
        key: "delayType",
        label: "Type",
        cc: 3,
        default: 0,
        rerender: true,
        options: [
          { label: "Digital", value: 0 },
          { label: "Tape", value: 1 }
        ]
      }
    ],
    controlSetsKey: "delayType",
    controlSets: {
      0: [
        { kind: "select", key: "digitalDelaySync", label: "Sync", cc: 4, default: 0, options: [{ label: "Off", value: 0 }, { label: "On", value: 127 }] },
        { label: "Time", cc: 5, default: 64 },
        { label: "Feedback", cc: 6, default: 64 },
        { kind: "select", key: "digitalDelayMode", label: "Mode", cc: 7, default: 0, options: [{ label: "Normal", value: 0 }, { label: "Ping-Pong", value: 64 }] },
        { label: "Mix", cc: 8, default: 64 }
      ],
      1: [
        { kind: "select", key: "tapeDelaySync", label: "Sync", cc: 91, default: 0, options: [{ label: "Off", value: 0 }, { label: "On", value: 127 }] },
        { label: "Time", cc: 92, default: 64 },
        { label: "Feedback", cc: 93, default: 64 },
        { kind: "select", key: "tapeDelayMode", label: "Mode", cc: 94, default: 0, options: [{ label: "Normal", value: 0 }, { label: "Ping-Pong", value: 64 }] },
        { label: "Mix", cc: 95, default: 64 }
      ]
    }
  },
  {
    id: "reverb",
    title: "Reverb",
    subtitle: "Spring, room, plate",
    imageOn: "assets/effects/effect_icon_reverb_on.png",
    imageOff: "assets/effects/effect_icon_reverb_off.png",
    imageByValue: {
      key: "reverbType",
      values: {
        0: "assets/effects/effect_icon_reverb_on_s1.png",
        1: "assets/effects/effect_icon_reverb_on_s2.png",
        2: "assets/effects/effect_icon_reverb_on_s3.png",
        3: "assets/effects/effect_icon_reverb_on_s4.png",
        4: "assets/effects/effect_icon_reverb_on_r.png",
        5: "assets/effects/effect_icon_reverb_on_p.png"
      }
    },
    power: { cc: 75, on: 127, off: 0, onLabel: "On", offLabel: "Off" },
    selects: [
      {
        key: "reverbPosition",
        label: "Position",
        cc: 84,
        default: 0,
        options: [
          { label: "Post Amp", value: 0 },
          { label: "Last", value: 127 }
        ]
      },
      {
        key: "reverbType",
        label: "Type",
        cc: 85,
        default: 0,
        rerender: true,
        options: [
          { label: "Spring 1", value: 0 },
          { label: "Spring 2", value: 1 },
          { label: "Spring 3", value: 2 },
          { label: "Spring 4", value: 3 },
          { label: "Room", value: 4 },
          { label: "Plate", value: 5 }
        ]
      }
    ],
    controlSetsKey: "reverbType",
    controlSets: {
      0: [
        { label: "Time", cc: 59, default: 64 },
        { label: "Predelay", cc: 60, default: 64 },
        { label: "Color", cc: 61, default: 64 },
        { label: "Mix", cc: 62, default: 64 }
      ],
      1: [
        { label: "Time", cc: 63, default: 64 },
        { label: "Predelay", cc: 64, default: 64 },
        { label: "Color", cc: 65, default: 64 },
        { label: "Mix", cc: 66, default: 64 }
      ],
      2: [
        { label: "Time", cc: 67, default: 64 },
        { label: "Predelay", cc: 68, default: 64 },
        { label: "Color", cc: 69, default: 64 },
        { label: "Mix", cc: 70, default: 64 }
      ],
      3: [
        { label: "Time", cc: 80, default: 64 },
        { label: "Predelay", cc: 81, default: 64 },
        { label: "Color", cc: 82, default: 64 },
        { label: "Mix", cc: 83, default: 64 }
      ],
      4: [
        { label: "Time", cc: 71, default: 64 },
        { label: "Predelay", cc: 72, default: 64 },
        { label: "Color", cc: 73, default: 64 },
        { label: "Mix", cc: 74, default: 64 }
      ],
      5: [
        { label: "Time", cc: 76, default: 64 },
        { label: "Predelay", cc: 77, default: 64 },
        { label: "Color", cc: 78, default: 64 },
        { label: "Mix", cc: 79, default: 64 }
      ]
    }
  },
  {
    id: "cab",
    title: "Cab / VIR",
    subtitle: "Cab bypass and microphone",
    imageOn: "assets/effects/effect_icon_cab_on.png",
    imageOff: "assets/effects/effect_icon_cab_off.png",
    power: { cc: 117, on: 0, off: 127, onLabel: "Cab", offLabel: "Bypass" },
    selects: [
      {
        key: "mic1",
        label: "Mic 1",
        cc: 109,
        default: 0,
        options: [
          { label: "Condenser", value: 0 },
          { label: "Dynamic", value: 1 },
          { label: "Ribbon", value: 2 }
        ]
      },
      {
        key: "mic2",
        label: "Mic 2",
        cc: 112,
        default: 1,
        options: [
          { label: "Condenser", value: 0 },
          { label: "Dynamic", value: 1 },
          { label: "Ribbon", value: 2 }
        ]
      }
    ],
    controls: [
      { label: "Resonance", cc: 108, default: 64 },
      { label: "Mic 1 X", cc: 110, default: 64 },
      { label: "Mic 1 Z", cc: 111, default: 64 },
      { label: "Mic 2 X", cc: 113, default: 64 },
      { label: "Mic 2 Z", cc: 114, default: 64 },
      { label: "Blend", cc: 115, default: 64 }
    ]
  }
];

const dom = {
  statusBlock: document.querySelector(".status-block"),
  statusDot: document.getElementById("statusDot"),
  statusText: document.getElementById("statusText"),
  deviceName: document.getElementById("deviceName"),
  connectButton: document.getElementById("connectButton"),
  disconnectButton: document.getElementById("disconnectButton"),
  rigPresetName: document.getElementById("rigPresetName"),
  rigAmpImage: document.getElementById("rigAmpImage"),
  rigAmpLabel: document.getElementById("rigAmpLabel"),
  rigChain: document.getElementById("rigChain"),
  presetGrid: document.getElementById("presetGrid"),
  activePreset: document.getElementById("activePreset"),
  activePresetName: document.getElementById("activePresetName"),
  editPresetsButton: document.getElementById("editPresetsButton"),
  presetDialog: document.getElementById("presetDialog"),
  presetForm: document.getElementById("presetForm"),
  presetEditor: document.getElementById("presetEditor"),
  bankInput: document.getElementById("bankInput"),
  bankDownButton: document.getElementById("bankDownButton"),
  bankUpButton: document.getElementById("bankUpButton"),
  channelReadout: document.getElementById("channelReadout"),
  quickTunerButton: document.getElementById("quickTunerButton"),
  effectSelect: document.getElementById("effectSelect"),
  effectsGrid: document.getElementById("effectsGrid"),
  effectsOffButton: document.getElementById("effectsOffButton"),
  globalGrid: document.getElementById("globalGrid"),
  tapTempoButton: document.getElementById("tapTempoButton"),
  startTunerButton: document.getElementById("startTunerButton"),
  stopTunerButton: document.getElementById("stopTunerButton"),
  tunerNote: document.getElementById("tunerNote"),
  tunerCents: document.getElementById("tunerCents"),
  tunerNeedle: document.getElementById("tunerNeedle"),
  tunerFrequency: document.getElementById("tunerFrequency"),
  tunerTarget: document.getElementById("tunerTarget"),
  tunerStatus: document.getElementById("tunerStatus"),
  sliderGrid: document.getElementById("sliderGrid"),
  panicButton: document.getElementById("panicButton"),
  customPads: document.getElementById("customPads"),
  padSelect: document.getElementById("padSelect"),
  sendPadButton: document.getElementById("sendPadButton"),
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
let selectedEffectId = "gate";
let sliderTimers = new Map();
let effectTimers = new Map();
let globalTimers = new Map();
let tunerAudioContext = null;
let tunerAnalyser = null;
let tunerStream = null;
let tunerData = null;
let tunerFrame = null;
let lastTunerUpdate = 0;

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
  merged.presets = base.presets.map((preset, index) => ({
    ...preset,
    ...(incoming.presets?.[index] ?? {})
  }));
  merged.effectValues = { ...(incoming.effectValues ?? {}) };
  merged.globalValues = { ...(incoming.globalValues ?? {}) };
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

function clampNumber(value, min, max, fallback) {
  const parsed = Number.parseFloat(value);
  if (Number.isNaN(parsed)) return fallback;
  return Math.min(max, Math.max(min, parsed));
}

function mapRangeToMidi(value, min, max) {
  if (max === min) return 0;
  return clampInt(Math.round(((value - min) / (max - min)) * 127), 0, 127, 0);
}

function formatControlValue(value, unit = "") {
  return unit ? `${value} ${unit}` : String(value);
}

function midiToPercent(value, fallback = 64) {
  return Math.round((clampInt(value, 0, 127, fallback) / 127) * 100);
}

function percentToMidi(value) {
  return mapRangeToMidi(clampInt(value, 0, 100, 0), 0, 100);
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

function effectValueKey(item) {
  return item.key ?? `cc:${item.cc}`;
}

function getEffectValue(item) {
  const key = effectValueKey(item);
  return clampInt(settings.effectValues[key], item.min ?? 0, item.max ?? 127, item.default ?? 64);
}

function setEffectValue(item, value) {
  settings.effectValues[effectValueKey(item)] = clampInt(value, item.min ?? 0, item.max ?? 127, item.default ?? 64);
  saveSettings();
}

function getEffectRangeValue(item) {
  const fallback = midiToPercent(item.default ?? 64);
  return clampInt(settings.effectValues[effectValueKey(item)], 0, 100, fallback);
}

function setEffectRangeValue(item, value) {
  const nextValue = clampInt(value, 0, 100, midiToPercent(item.default ?? 64));
  settings.effectValues[effectValueKey(item)] = nextValue;
  saveSettings();
  return nextValue;
}

function getEffectControls(effect) {
  if (!effect.controlSetsKey) {
    return effect.controls ?? [];
  }

  const selected = settings.effectValues[effect.controlSetsKey] ?? effect.selects.find((item) => item.key === effect.controlSetsKey)?.default ?? 0;
  return effect.controlSets?.[selected] ?? [];
}

function getEffectImage(effect) {
  const stateKey = `power:${effect.id}`;
  const explicitPower = settings.effectValues[stateKey];
  const isOff = effect.power && explicitPower === effect.power.off;

  if (isOff && effect.imageOff) {
    return effect.imageOff;
  }

  if (effect.imageByValue) {
    const selected = String(settings.effectValues[effect.imageByValue.key] ?? 0);
    return effect.imageByValue.values[selected] ?? effect.imageOn ?? effect.image;
  }

  return effect.imageOn ?? effect.image ?? effect.imageOff ?? "";
}

function getPresetMeta(presetNumber) {
  const index = (presetNumber - 1) % DEFAULT_PRESETS.length;
  return settings.presets[index] ?? DEFAULT_PRESETS[index];
}

function getAmpLabel(imagePath) {
  const file = imagePath.split("/").pop();
  return AMP_IMAGES.find((image) => image.file === imagePath)?.label ?? AMP_IMAGE_LABELS[file] ?? "Amp Skin";
}

function getGlobalControlValue(control) {
  return clampNumber(settings.globalValues[control.key], control.min ?? 0, control.max ?? 127, control.default ?? 0);
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
    const meta = getPresetMeta(preset);
    const button = document.createElement("button");
    button.className = "preset-button";
    button.type = "button";
    button.setAttribute("aria-label", `${String(preset).padStart(2, "0")} ${meta.name}`);
    button.classList.toggle("active", preset === activePreset);

    const art = document.createElement("span");
    art.className = "preset-art";
    const image = document.createElement("img");
    image.src = meta.image;
    image.alt = "";
    image.loading = "lazy";
    art.append(image);

    const text = document.createElement("span");
    text.className = "preset-text";
    const number = document.createElement("strong");
    number.textContent = String(preset).padStart(2, "0");
    const name = document.createElement("span");
    name.className = "preset-name";
    name.textContent = meta.name;
    const program = document.createElement("span");
    program.className = "preset-program";
    program.textContent = `PC ${preset - 1}`;
    text.append(number, name, program);
    button.append(art, text);

    button.addEventListener("click", () => sendPreset(preset));
    dom.presetGrid.append(button);
  }

  const activeMeta = getPresetMeta(activePreset);
  dom.activePreset.textContent = String(activePreset).padStart(2, "0");
  dom.activePresetName.textContent = activeMeta.name;
  renderRigChain();
}

function renderRigChain() {
  if (!dom.rigChain) return;

  const meta = getPresetMeta(activePreset);
  dom.rigPresetName.textContent = meta.name;
  dom.rigAmpImage.src = meta.image;
  dom.rigAmpLabel.textContent = `Preset ${String(activePreset).padStart(2, "0")} / PC ${activePreset - 1}`;
  dom.rigChain.replaceChildren();

  const ordered = ["gate", "comp", "amp", "cab", "eq", "mod", "delay", "reverb"];
  ordered.forEach((id) => {
    const effect = EFFECT_GROUPS.find((item) => item.id === id);
    const block = document.createElement("button");
    block.className = "rig-block";
    block.type = "button";

    if (id === "amp") {
      block.classList.add("is-amp", "is-active");
      block.innerHTML = `
        <img src="${escapeAttribute(meta.image)}" alt="">
        <span>Amp</span>
        <strong>${escapeAttribute(meta.name)}</strong>
      `;
      block.addEventListener("click", () => {
        document.querySelector(".preset-panel")?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
      dom.rigChain.append(block);
      return;
    }

    if (!effect) return;

    const stateKey = `power:${effect.id}`;
    const isOff = effect.power && settings.effectValues[stateKey] === effect.power.off;
    block.classList.toggle("is-off", Boolean(isOff));
    block.dataset.effectId = effect.id;
    block.innerHTML = `
      <img src="${escapeAttribute(getEffectImage(effect))}" alt="">
      <span>${effect.title}</span>
      <strong>${isOff ? "Off" : "Ready"}</strong>
    `;
    block.addEventListener("click", () => openEffectBlock(effect.id));
    dom.rigChain.append(block);
  });
}

function openEffectBlock(effectId) {
  selectedEffectId = effectId;
  if (dom.effectSelect) {
    dom.effectSelect.value = effectId;
  }
  renderEffects();
  document.querySelector(".effects-panel")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function openPresetEditor() {
  dom.presetEditor.replaceChildren();

  settings.presets.forEach((preset, index) => {
    const row = document.createElement("div");
    row.className = "preset-edit-row";

    const preview = document.createElement("img");
    preview.className = "preset-edit-preview";
    preview.src = preset.image;
    preview.alt = "";

    const nameField = document.createElement("label");
    nameField.className = "field";
    const nameLabel = document.createElement("span");
    nameLabel.textContent = `Preset ${String(index + 1).padStart(2, "0")}`;
    const nameInput = document.createElement("input");
    nameInput.dataset.presetName = String(index);
    nameInput.type = "text";
    nameInput.value = preset.name;
    nameField.append(nameLabel, nameInput);

    const imageField = document.createElement("label");
    imageField.className = "field";
    const imageLabel = document.createElement("span");
    imageLabel.textContent = "Skin";
    const imageSelect = document.createElement("select");
    imageSelect.dataset.presetImage = String(index);

    AMP_IMAGES.forEach((image) => {
      const option = document.createElement("option");
      option.value = image.file;
      option.textContent = image.label;
      option.selected = image.file === preset.image;
      imageSelect.append(option);
    });

    imageSelect.addEventListener("change", () => {
      preview.src = imageSelect.value;
      preview.title = getAmpLabel(imageSelect.value);
    });

    imageField.append(imageLabel, imageSelect);
    row.append(preview, nameField, imageField);
    dom.presetEditor.append(row);
  });

  dom.presetDialog.showModal();
}

function savePresetEditor() {
  settings.presets = settings.presets.map((preset, index) => ({
    name: dom.presetEditor.querySelector(`[data-preset-name="${index}"]`)?.value.trim() || preset.name,
    image: dom.presetEditor.querySelector(`[data-preset-image="${index}"]`)?.value || preset.image
  }));
  saveSettings();
  renderPresetGrid();
}

function renderSliders() {
  dom.sliderGrid.replaceChildren();

  settings.sliders.forEach((slider, index) => {
    const sliderValue = clampInt(slider.value, 0, 100, midiToPercent(64));
    const card = document.createElement("div");
    card.className = "slider-card";
    card.innerHTML = `
      <div class="slider-row">
        <strong>${slider.label}</strong>
        <span class="slider-value">${sliderValue}</span>
      </div>
      <input type="range" min="0" max="100" value="${sliderValue}" aria-label="${slider.label}">
    `;
    settings.sliders[index].value = sliderValue;
    const range = card.querySelector("input");
    const value = card.querySelector(".slider-value");

    range.addEventListener("input", () => {
      const nextValue = clampInt(range.value, 0, 100, 0);
      settings.sliders[index].value = nextValue;
      value.textContent = String(nextValue);
      saveSettings();
      window.clearTimeout(sliderTimers.get(index));
      sliderTimers.set(index, window.setTimeout(() => sendCc(slider.cc, percentToMidi(nextValue)), 80));
    });

    range.addEventListener("change", () => sendCc(slider.cc, percentToMidi(range.value)));
    dom.sliderGrid.append(card);
  });
}

function renderEffects() {
  dom.effectsGrid.replaceChildren();

  if (dom.effectSelect.options.length !== EFFECT_GROUPS.length) {
    dom.effectSelect.replaceChildren();
    EFFECT_GROUPS.forEach((effect) => {
      const option = document.createElement("option");
      option.value = effect.id;
      option.textContent = effect.title;
      dom.effectSelect.append(option);
    });
  }

  if (!EFFECT_GROUPS.some((effect) => effect.id === selectedEffectId)) {
    selectedEffectId = EFFECT_GROUPS[0]?.id ?? "";
  }

  dom.effectSelect.value = selectedEffectId;
  const effect = EFFECT_GROUPS.find((item) => item.id === selectedEffectId);
  if (effect) {
    const card = document.createElement("article");
    card.className = "effect-card";
    card.dataset.effectId = effect.id;

    const head = document.createElement("div");
    head.className = "effect-head";
    const effectImage = getEffectImage(effect);
    const effectIsOff = effect.power && settings.effectValues[`power:${effect.id}`] === effect.power.off;
    head.innerHTML = `
      <div class="effect-identity">
        <span class="effect-image${effectIsOff ? " is-off" : ""}">
          <img src="${escapeAttribute(effectImage)}" alt="">
        </span>
        <div class="effect-title">
          <strong>${effect.title}</strong>
          <span>${effect.subtitle}</span>
        </div>
      </div>
    `;

    if (effect.power) {
      const power = document.createElement("div");
      power.className = "effect-power";
      const stateKey = `power:${effect.id}`;
      const current = settings.effectValues[stateKey];
      const onButton = document.createElement("button");
      const offButton = document.createElement("button");

      onButton.className = "mini-button";
      onButton.type = "button";
      onButton.textContent = effect.power.onLabel ?? "On";
      onButton.classList.toggle("active-on", current === effect.power.on);

      offButton.className = "mini-button";
      offButton.type = "button";
      offButton.textContent = effect.power.offLabel ?? "Off";
      offButton.classList.toggle("active-off", current === effect.power.off);

      onButton.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        settings.effectValues[stateKey] = effect.power.on;
        saveSettings();
        sendCc(effect.power.cc, effect.power.on);
        renderEffects();
      });

      offButton.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        settings.effectValues[stateKey] = effect.power.off;
        saveSettings();
        sendCc(effect.power.cc, effect.power.off);
        renderEffects();
      });

      power.append(onButton, offButton);
      head.append(power);
    }

    card.append(head);
    const body = document.createElement("div");
    body.className = "effect-body";

    if (effect.note) {
      const note = document.createElement("p");
      note.className = "effect-note";
      note.textContent = effect.note;
      body.append(note);
    }

    if (effect.selects?.length) {
      const selectGrid = document.createElement("div");
      selectGrid.className = "effect-select-grid";

      effect.selects.forEach((selectDef) => {
        const label = document.createElement("label");
        label.className = "effect-field";
        const select = document.createElement("select");
        const value = getEffectValue(selectDef);

        selectDef.options.forEach((option) => {
          const item = document.createElement("option");
          item.value = String(option.value);
          item.textContent = option.label;
          item.selected = value === option.value;
          select.append(item);
        });

        select.addEventListener("change", () => {
          const nextValue = clampInt(select.value, 0, 127, selectDef.default ?? 0);
          setEffectValue(selectDef, nextValue);
          sendCc(selectDef.cc, nextValue);
          if (selectDef.rerender) {
            renderEffects();
          }
        });

        label.append(document.createElement("span"), select);
        label.firstElementChild.textContent = selectDef.label;
        selectGrid.append(label);
      });

      body.append(selectGrid);
    }

    if (effect.id === "cab") {
      body.append(createCabVisual());
    }

    const controls = getEffectControls(effect);
    if (controls.length) {
      const controlGrid = document.createElement("div");
      controlGrid.className = "effect-control-grid";

      controls.forEach((control) => {
        if (control.kind === "select") {
          const label = document.createElement("label");
          label.className = "effect-field";
          const select = document.createElement("select");
          const value = getEffectValue(control);

          control.options.forEach((option) => {
            const item = document.createElement("option");
            item.value = String(option.value);
            item.textContent = option.label;
            item.selected = value === option.value;
            select.append(item);
          });

          select.addEventListener("change", () => {
            const nextValue = clampInt(select.value, 0, 127, control.default ?? 0);
            setEffectValue(control, nextValue);
            sendCc(control.cc, nextValue);
          });

          label.append(document.createElement("span"), select);
          label.firstElementChild.textContent = control.label;
          controlGrid.append(label);
          return;
        }

        const wrap = document.createElement("div");
        wrap.className = "effect-slider";
        const value = getEffectRangeValue(control);
        wrap.innerHTML = `
          <div class="effect-slider-row">
            <strong>${control.label}</strong>
            <span>${value}</span>
          </div>
          <input type="range" min="0" max="100" value="${value}" aria-label="${effect.title} ${control.label}">
        `;

        const range = wrap.querySelector("input");
        const readout = wrap.querySelector("span");
        const timerKey = effectValueKey(control);

        range.addEventListener("input", () => {
          const nextValue = clampInt(range.value, 0, 100, midiToPercent(control.default ?? 64));
          settings.effectValues[timerKey] = nextValue;
          readout.textContent = String(nextValue);
          saveSettings();
          window.clearTimeout(effectTimers.get(timerKey));
          effectTimers.set(timerKey, window.setTimeout(() => sendCc(control.cc, percentToMidi(nextValue)), 80));
        });

        range.addEventListener("change", () => {
          const nextValue = setEffectRangeValue(control, range.value);
          sendCc(control.cc, percentToMidi(nextValue));
        });

        controlGrid.append(wrap);
      });

      body.append(controlGrid);
    }

    card.append(body);
    dom.effectsGrid.append(card);
  }

  renderRigChain();
}

function createCabVisual() {
  const mic1X = getEffectRangeValue({ cc: 110, default: 64 });
  const mic1Z = 100 - getEffectRangeValue({ cc: 111, default: 64 });
  const mic2X = getEffectRangeValue({ cc: 113, default: 64 });
  const mic2Z = 100 - getEffectRangeValue({ cc: 114, default: 64 });
  const blend = getEffectRangeValue({ cc: 115, default: 64 });
  const resonance = getEffectRangeValue({ cc: 108, default: 64 });

  const visual = document.createElement("div");
  visual.className = "cab-visual";
  visual.style.setProperty("--mic1-x", `${mic1X}%`);
  visual.style.setProperty("--mic1-y", `${mic1Z}%`);
  visual.style.setProperty("--mic2-x", `${mic2X}%`);
  visual.style.setProperty("--mic2-y", `${mic2Z}%`);
  visual.style.setProperty("--blend", `${blend}%`);
  visual.style.setProperty("--resonance", `${resonance}%`);
  visual.innerHTML = `
    <div class="cab-box" aria-hidden="true">
      <span class="speaker"></span>
      <span class="speaker-ring"></span>
      <span class="mic-marker mic-one">1</span>
      <span class="mic-marker mic-two">2</span>
    </div>
    <div class="cab-readouts">
      <span>Mic blend <strong>${blend}</strong></span>
      <span>Resonance <strong>${resonance}</strong></span>
    </div>
  `;
  return visual;
}

function disablePrimaryEffects() {
  const offCommands = [
    { id: "gate", cc: 14, value: 0 },
    { id: "comp", cc: 18, value: 0 },
    { id: "delay", cc: 2, value: 0 },
    { id: "mod", cc: 32, value: 0 },
    { id: "reverb", cc: 75, value: 0 }
  ];

  offCommands.forEach((command) => {
    settings.effectValues[`power:${command.id}`] = command.value;
    sendCc(command.cc, command.value);
  });

  saveSettings();
  renderEffects();
}

function renderGlobalControls() {
  dom.globalGrid.replaceChildren();

  GLOBAL_CONTROLS.forEach((control) => {
    const card = document.createElement("article");
    card.className = "global-card";

    const title = document.createElement("div");
    title.className = "global-card-title";
    const name = document.createElement("strong");
    name.textContent = control.title;
    const subtitle = document.createElement("small");
    subtitle.textContent = control.subtitle;
    title.append(name, subtitle);
    card.append(title);

    if (control.type === "toggle") {
      const value = getGlobalControlValue(control);
      const row = document.createElement("div");
      row.className = "global-button-row";
      const onButton = document.createElement("button");
      const offButton = document.createElement("button");

      onButton.className = "mini-button";
      onButton.type = "button";
      onButton.textContent = control.onLabel;
      onButton.classList.toggle("active-on", value === control.onValue);

      offButton.className = "mini-button";
      offButton.type = "button";
      offButton.textContent = control.offLabel;
      offButton.classList.toggle("active-off", value === control.offValue);

      onButton.addEventListener("click", () => {
        setGlobalControlValue(control, control.onValue);
        sendGlobalControl(control, control.onValue);
        renderGlobalControls();
      });

      offButton.addEventListener("click", () => {
        setGlobalControlValue(control, control.offValue);
        sendGlobalControl(control, control.offValue);
        renderGlobalControls();
      });

      row.append(onButton, offButton);
      card.append(row);
      dom.globalGrid.append(card);
      return;
    }

    const value = getGlobalControlValue(control);
    const row = document.createElement("div");
    row.className = "global-range-row";
    const range = document.createElement("input");
    range.type = "range";
    range.min = String(control.min);
    range.max = String(control.max);
    range.step = String(control.step ?? 1);
    range.value = String(value);
    range.setAttribute("aria-label", control.title);

    const readout = document.createElement("input");
    readout.className = "global-value";
    readout.type = "number";
    readout.min = String(control.min);
    readout.max = String(control.max);
    readout.step = String(control.step ?? 1);
    readout.value = String(value);
    readout.setAttribute("aria-label", `${control.title} value`);

    const unit = document.createElement("span");
    unit.className = "global-unit";
    unit.textContent = control.unit ?? "";

    range.addEventListener("input", () => {
      const nextValue = setGlobalControlValue(control, range.value);
      readout.value = String(nextValue);
      window.clearTimeout(globalTimers.get(control.key));
      globalTimers.set(control.key, window.setTimeout(() => sendGlobalControl(control, nextValue), 90));
    });

    range.addEventListener("change", () => {
      const nextValue = setGlobalControlValue(control, range.value);
      sendGlobalControl(control, nextValue);
    });

    readout.addEventListener("change", () => {
      const nextValue = setGlobalControlValue(control, readout.value);
      range.value = String(nextValue);
      readout.value = String(nextValue);
      sendGlobalControl(control, nextValue);
    });

    row.append(range, readout, unit);
    card.append(row);
    dom.globalGrid.append(card);
  });
}

function setGlobalControlValue(control, value) {
  const nextValue = control.type === "range"
    ? clampNumber(value, control.min, control.max, control.default)
    : clampInt(value, 0, 127, control.default);
  settings.globalValues[control.key] = nextValue;
  saveSettings();

  if (control.key === "tuningReference") {
    updateTunerReference();
  }

  return nextValue;
}

function sendGlobalControl(control, value) {
  if (control.send) {
    return control.send(clampInt(value, control.min, control.max, control.default));
  }

  if (control.type === "range") {
    return sendCc(control.cc, mapRangeToMidi(value, control.min, control.max));
  }

  return sendCc(control.cc, value);
}

function getTuningReference() {
  return clampNumber(settings.globalValues.tuningReference, 415, 465, 440);
}

function updateTunerReference() {
  dom.tunerTarget.textContent = `A4 ${getTuningReference()} Hz`;
}

async function startTuner() {
  if (!navigator.mediaDevices?.getUserMedia) {
    dom.tunerStatus.textContent = "Microphone access is not available in this browser.";
    log("Tuner unavailable: microphone access missing", "error");
    return;
  }

  try {
    tunerStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false
      }
    });

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    tunerAudioContext = new AudioContextClass();
    await tunerAudioContext.resume();

    const source = tunerAudioContext.createMediaStreamSource(tunerStream);
    tunerAnalyser = tunerAudioContext.createAnalyser();
    tunerAnalyser.fftSize = 4096;
    tunerAnalyser.smoothingTimeConstant = 0;
    tunerData = new Float32Array(tunerAnalyser.fftSize);
    source.connect(tunerAnalyser);

    dom.startTunerButton.disabled = true;
    dom.stopTunerButton.disabled = false;
    dom.tunerStatus.textContent = "Listening...";
    log("Tuner microphone started");
    runTuner();
  } catch (error) {
    log(`Tuner failed: ${error.message}`, "error");
    stopTuner();
    dom.tunerStatus.textContent = `Mic error: ${error.message}`;
  }
}

function stopTuner() {
  if (tunerFrame) {
    window.cancelAnimationFrame(tunerFrame);
  }

  tunerStream?.getTracks().forEach((track) => track.stop());
  tunerAudioContext?.close().catch(() => {});

  tunerAudioContext = null;
  tunerAnalyser = null;
  tunerStream = null;
  tunerData = null;
  tunerFrame = null;
  lastTunerUpdate = 0;

  dom.startTunerButton.disabled = false;
  dom.stopTunerButton.disabled = true;
  dom.tunerNote.textContent = "--";
  dom.tunerCents.textContent = "Mic off";
  dom.tunerFrequency.textContent = "-- Hz";
  dom.tunerNeedle.style.left = "50%";
  dom.tunerStatus.textContent = "Use the phone microphone near the guitar or cab.";
}

function runTuner() {
  if (!tunerAnalyser || !tunerData || !tunerAudioContext) return;

  tunerAnalyser.getFloatTimeDomainData(tunerData);
  const frequency = detectPitch(tunerData, tunerAudioContext.sampleRate);

  if (frequency) {
    updateTunerDisplay(frequency);
  } else if (performance.now() - lastTunerUpdate > 500) {
    dom.tunerNote.textContent = "--";
    dom.tunerCents.textContent = "Listening";
    dom.tunerFrequency.textContent = "-- Hz";
    dom.tunerNeedle.style.left = "50%";
  }

  tunerFrame = window.requestAnimationFrame(runTuner);
}

function detectPitch(buffer, sampleRate) {
  let rms = 0;

  for (let index = 0; index < buffer.length; index += 1) {
    rms += buffer[index] * buffer[index];
  }

  rms = Math.sqrt(rms / buffer.length);
  if (rms < 0.01) return null;

  let start = 0;
  let end = buffer.length - 1;
  const trimThreshold = 0.2;

  for (let index = 0; index < buffer.length / 2; index += 1) {
    if (Math.abs(buffer[index]) < trimThreshold) {
      start = index;
      break;
    }
  }

  for (let index = 1; index < buffer.length / 2; index += 1) {
    if (Math.abs(buffer[buffer.length - index]) < trimThreshold) {
      end = buffer.length - index;
      break;
    }
  }

  const size = end - start;
  if (size < 32) return null;

  const correlations = new Array(size).fill(0);
  for (let offset = 0; offset < size; offset += 1) {
    for (let index = 0; index < size - offset; index += 1) {
      correlations[offset] += buffer[start + index] * buffer[start + index + offset];
    }
  }

  let offset = 0;
  while (correlations[offset] > correlations[offset + 1]) {
    offset += 1;
  }

  let peak = -1;
  let peakIndex = -1;
  for (let index = offset; index < correlations.length; index += 1) {
    if (correlations[index] > peak) {
      peak = correlations[index];
      peakIndex = index;
    }
  }

  if (peakIndex <= 0) return null;

  const before = correlations[peakIndex - 1] ?? 0;
  const current = correlations[peakIndex] ?? 0;
  const after = correlations[peakIndex + 1] ?? 0;
  const adjustmentA = (before + after - 2 * current) / 2;
  const adjustmentB = (after - before) / 2;
  const adjustedPeak = adjustmentA ? peakIndex - adjustmentB / (2 * adjustmentA) : peakIndex;
  const frequency = sampleRate / adjustedPeak;

  if (frequency < 60 || frequency > 1400) return null;
  return frequency;
}

function updateTunerDisplay(frequency) {
  const reference = getTuningReference();
  const midiNote = Math.round(12 * Math.log2(frequency / reference) + 69);
  const target = reference * Math.pow(2, (midiNote - 69) / 12);
  const cents = Math.round(1200 * Math.log2(frequency / target));
  const noteName = `${NOTE_NAMES[((midiNote % 12) + 12) % 12]}${Math.floor(midiNote / 12) - 1}`;
  const clampedCents = Math.max(-50, Math.min(50, cents));

  dom.tunerNote.textContent = noteName;
  dom.tunerCents.textContent = cents === 0 ? "In tune" : `${cents > 0 ? "+" : ""}${cents} cents`;
  dom.tunerFrequency.textContent = `${frequency.toFixed(1)} Hz`;
  dom.tunerTarget.textContent = `${noteName} ${target.toFixed(1)} Hz`;
  dom.tunerNeedle.style.left = `${50 + clampedCents}%`;
  dom.tunerStatus.textContent = Math.abs(cents) <= 5 ? "Centered" : cents < 0 ? "Tune up" : "Tune down";
  lastTunerUpdate = performance.now();
}

function renderPads() {
  dom.customPads.replaceChildren();
  dom.padSelect.replaceChildren();

  settings.pads.forEach((pad, index) => {
    const option = document.createElement("option");
    option.value = String(index);
    option.textContent = `${pad.label} / ${pad.command}`;
    dom.padSelect.append(option);

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
    disablePrimaryEffects();
  });

  dom.editPresetsButton.addEventListener("click", openPresetEditor);

  dom.presetForm.addEventListener("submit", (event) => {
    if (event.submitter?.id === "savePresetsButton") {
      savePresetEditor();
    }
  });

  dom.effectsOffButton.addEventListener("click", disablePrimaryEffects);
  dom.effectSelect.addEventListener("change", () => {
    selectedEffectId = dom.effectSelect.value;
    renderEffects();
  });
  dom.tapTempoButton.addEventListener("click", () => sendCc(10, 0));
  dom.quickTunerButton.addEventListener("click", () => {
    document.querySelector(".tuner-panel")?.scrollIntoView({ behavior: "smooth", block: "start" });
    if (!tunerStream) {
      startTuner();
    }
  });
  dom.startTunerButton.addEventListener("click", startTuner);
  dom.stopTunerButton.addEventListener("click", stopTuner);

  dom.editPadsButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    openPadEditor();
  });

  dom.sendPadButton.addEventListener("click", () => {
    const pad = settings.pads[clampInt(dom.padSelect.value, 0, settings.pads.length - 1, 0)];
    if (pad) {
      sendRaw(pad.command);
    }
  });

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
    renderEffects();
    renderGlobalControls();
    renderPads();
    updateTunerReference();
    log("Settings reset");
  });

  dom.rawForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const command = dom.rawInput.value;
    const sent = await sendRaw(command);
    if (sent) dom.rawInput.value = "";
  });

  dom.clearLogButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
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
  renderEffects();
  renderGlobalControls();
  renderSliders();
  renderPads();
  updateTunerReference();
  wireEvents();
  registerServiceWorker();
  setConnectionState(false);
  log("Controller ready");
}

init();
