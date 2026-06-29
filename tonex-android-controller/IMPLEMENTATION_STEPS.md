# Implementation Steps

## 1. Hardware

You need:

- Waveshare ESP32-S3-Zero, USB-C version.
- TONEX ONE.
- USB-C cable from Waveshare board to TONEX ONE.
- 5V power for the Waveshare board.

Do not feed 9V pedalboard power directly into the Waveshare Zero.

## 2. Flash Greg Smith's Firmware

1. On a computer, open Chrome or Edge.
2. Go to `https://builty.github.io/TonexOneController/`.
3. Hold the Waveshare board `BOOT` button.
4. Plug the Waveshare board into the computer by USB-C.
5. Release `BOOT`.
6. In the flasher page, select the Waveshare Zero build.
7. Click Connect.
8. Pick the ESP32-S3 serial device.
9. Flash it.
10. Unplug and power-cycle the board.

## 3. Connect Hardware

1. Connect the Waveshare board USB-C port to the TONEX ONE USB-C port.
2. Power the Waveshare board from 5V.
3. Wait a few seconds for boot.

## 4. Configure TonexOneController

1. Connect your phone or computer Wi-Fi to `TonexConfig`.
2. Use password `12345678`.
3. Open `http://tonex.local`.
4. Open Bluetooth settings.
5. Set Bluetooth Mode to `Peripheral`.
6. Set Peripheral Name to `TnxBT`.
7. Enable `Bluetooth MIDI CC`.
8. Open MIDI settings.
9. Set MIDI channel to `1`.
10. Save and reboot.

## 5. Put This App Online With HTTPS

Android Chrome needs HTTPS for Web Bluetooth.

Good options:

- GitHub Pages
- Netlify
- Vercel
- Cloudflare Pages

Upload the contents of this folder:

```text
outputs/tonex-android-controller
```

The page must open as `https://...`, not plain `http://...`.

## 6. Use On Android

1. Open the HTTPS app URL in Chrome on Android.
2. Tap Connect.
3. Select `TnxBT`.
4. Tap preset `01` through `20`.
5. Test Tap, Bypass, Reverb, Cab, Gain, Volume.

## 7. If It Does Not Connect

Check these first:

- You are using Chrome on Android.
- The app URL starts with `https://`.
- Bluetooth and Location are enabled on Android.
- The Waveshare board is configured as Bluetooth `Peripheral`.
- The device name is `TnxBT`.
- The board was rebooted after settings were saved.
- The phone is not already paired/connected through another MIDI app.

## 8. If Presets Work But Sliders Do Not

Enable `Bluetooth MIDI CC` in TonexOneController web config, then save and reboot.
