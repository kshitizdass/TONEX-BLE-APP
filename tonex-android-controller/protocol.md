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
