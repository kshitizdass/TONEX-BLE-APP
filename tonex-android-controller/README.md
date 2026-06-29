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
