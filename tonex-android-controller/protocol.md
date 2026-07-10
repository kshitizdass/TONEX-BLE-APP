# TonexOneController BLE-MIDI Protocol

The app targets the standard BLE-MIDI service used by Greg Smith's TonexOneController firmware.

## BLE UUIDs

- Service: `03b80e5a-ede8-4b33-a751-6ce34ec4c700`
- Characteristic: `7772e5db-3868-4112-a1a9-f2669d106bf3`

The app sends BLE-MIDI timestamp packets containing standard MIDI messages.

## Core Commands

| Action | MIDI |
| --- | --- |
| Preset 1-20 | Program Change `0-19` |
| Select preset by CC | CC `127`, value `0-19` |
| Preset down | CC `86` |
| Preset up | CC `87` |
| Tap tempo | CC `10` |
| Global bypass toggle | CC `12`, value `64` |
| Delay toggle | CC `2`, value `64` |
| Mod toggle | CC `32`, value `64` |
| Reverb toggle | CC `75`, value `64` |
| Cab bypass toggle | CC `117`, value `64` |
| Load preset to Slot A | CC `120`, value `0-19` |
| Load preset to Slot B | CC `121`, value `0-19` |
| AB bank down/up | CC `89` / CC `90` |
| Amp gain | CC `102`, value `0-127` |
| Amp volume | CC `103`, value `0-127` |
| Presence | CC `106`, value `0-127` |
| Global volume | CC `122`, value `0-127` |

Most Control Change commands need `Bluetooth MIDI CC` enabled in the TonexOneController web configuration.

## Global Controls

| Action | MIDI |
| --- | --- |
| Global bypass | CC `12` |
| BPM `40-127` | CC `99`, value `40-127` |
| BPM `128-227` | CC `100`, value `28-127` |
| Input trim | CC `116`, value `0-127` scaled by firmware |
| Cab sim bypass | CC `117` |
| Tempo source | CC `118` |
| Tuning reference | CC `119`, value `0-127` scaled by firmware |
| Master volume | CC `122`, value `0-127` scaled by firmware |

## Effect Editor Coverage

The app includes editor controls for:

| Block | Controls |
| --- | --- |
| Gate | CC `13-17` |
| Compressor | CC `18-22` |
| EQ | CC `23-30` |
| Mod | CC `31-56` |
| Delay | CC `1-8`, `91-95` |
| Reverb | CC `59-85` |
| Cab / VIR | CC `108-117` |

## Raw Console

The app console accepts:

```text
PC 0
CC 12 64
CC 120 0
CC 121 1
HEX 80 80 C0 00
```

`PC`, `CC`, and `NOTE` are wrapped in BLE-MIDI timestamp bytes. `HEX` writes exactly the bytes you enter.

## Browser-Only Data

Preset names, selected amp skin images, and the tuner display are browser-side features. BLE-MIDI does not provide preset names, amp images, or live tuner pitch data from the TONEX ONE in this app.
