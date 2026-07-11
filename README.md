# TONEX ONE Android BLE-MIDI Controller

This app is for Greg Smith's/Builty's TonexOneController firmware running on a Waveshare ESP32-S3-Zero.

The phone does not connect directly to the TONEX ONE. The phone connects to the Waveshare board over BLE-MIDI. The Waveshare board connects to the TONEX ONE over USB-C.

## Important Android Requirement

Android Chrome only allows Web Bluetooth from a secure page:

- `https://...` works.
- `http://localhost...` works only on the same device.
- `http://your-computer-ip...` usually will not work for Bluetooth on Android.

For the phone, deploy this folder to HTTPS, for example GitHub Pages, Netlify, Vercel, or Cloudflare Pages.

## Quick Implementation

1. Flash the official TonexOneController Waveshare Zero firmware.
2. Configure the board in web config:
   - Bluetooth Mode: `Peripheral`
   - Peripheral name: `TnxBT`
   - Bluetooth MIDI CC: enabled
   - MIDI channel: `1`
3. Deploy this app folder to HTTPS.
4. Open the HTTPS URL in Chrome on Android.
5. Tap `Connect`.
6. Choose `TnxBT`.
7. Use preset buttons and controls.

See [IMPLEMENTATION_STEPS.md](IMPLEMENTATION_STEPS.md) for the full checklist.

## What This Build Adds

- Image preset cards using skins from Builty's `skins_png` folder.
- Editable local preset names and skin assignments from the `Edit Names` button.
- BIAS X inspired rig stage with signal-chain blocks and active amp art.
- Effect block dropdown menu with TONEX-style effect icons.
- Saved commands dropdown menu.
- Firmware defaults strip showing Peripheral / TnxBT / MIDI CC On / Ch 1.
- Full effect editor for gate, compressor, EQ, mod, delay, reverb, and cab/VIR.
- CAB/VIR visual mic placement display.
- Continuous controls shown as `0-100` in the app, scaled to MIDI `0-127` when sent.
- Global controls for bypass, cab, tempo source, BPM, input trim, tuning reference, and master volume.
- Phone microphone tuner. This listens through the Android phone mic; it does not require tuner data from the TONEX firmware.
- Traffic console starts hidden.

## MIDI Mapping Used By The App

- Presets: Program Change `0-19`
- Bypass toggle: CC `12`, value `64`
- Tap tempo: CC `10`, value `0`
- Reverb toggle: CC `75`, value `64`
- Cab bypass toggle: CC `117`, value `64`
- Load selected preset to Slot A: CC `120`, value `0-19`
- Load selected preset to Slot B: CC `121`, value `0-19`
- AB bank up: CC `90`, value `0`
- Gain: CC `102`
- Volume: CC `103`
- Bass: CC `23`
- Middle: CC `25`
- Treble: CC `28`
- Presence: CC `106`
- BPM: CC `99` for `40-127`, CC `100` for `128-227`
- Input trim: CC `116`
- Tempo source: CC `118`
- Tuning reference: CC `119`
- Master volume: CC `122`

## Effects Section

The Effects section controls these TONEX blocks:

- Gate: on/off, position, threshold, release, depth
- Compressor: on/off, position, threshold, gain, attack
- EQ: position, bass, mid, treble, frequency/Q controls
- Mod: on/off, position, type, and type-specific controls
- Delay: on/off, position, digital/tape type, and type-specific controls
- Reverb: on/off, position, spring/room/plate type, and type-specific controls
- Cab / VIR: cab active/bypass, mic type, resonance, mic position, blend

These controls use Bluetooth MIDI CC, so `Bluetooth MIDI CC` must be enabled in the TonexOneController web configuration.

The included custom firmware patch makes a fresh erased firmware build default to Bluetooth Peripheral mode and Bluetooth MIDI CC enabled. Existing saved board settings still override firmware defaults until erased.

## Preset Names And Images

The TONEX ONE BLE-MIDI path does not send the real preset names or amp pictures back to the browser. The app stores the phone-side names and chosen skin images locally in Chrome. Use `Edit Names`, pick a skin, and save; GitHub Pages only needs an update when you change the app files themselves.

## Local Preview

Local preview is only for checking layout on this computer:

```powershell
python -m http.server 5173
```

Then open:

```text
http://127.0.0.1:5173
```

Do not expect Android Bluetooth to work from your PC's plain HTTP LAN address.
