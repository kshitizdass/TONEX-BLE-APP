# Waveshare ESP32-S3-Zero Firmware

Use the official TonexOneController firmware from:

https://github.com/Builty/TonexOneController

## Flashing

Recommended method:

1. Open the official flasher:
   https://builty.github.io/TonexOneController/
2. Hold the Waveshare board `BOOT` button.
3. Connect the board to the computer by USB-C.
4. Release `BOOT`.
5. Select the Waveshare Zero platform.
6. Flash the firmware.
7. Power-cycle the board.

## Required Settings

After flashing:

1. Connect your phone or computer to Wi-Fi network `TonexConfig`.
2. Password: `12345678`.
3. Open `http://tonex.local`.
4. Go to Bluetooth settings.
5. Set Bluetooth Mode to `Peripheral`.
6. Set or keep Peripheral Name as `TnxBT`.
7. Enable `Bluetooth MIDI CC`.
8. Save and reboot.

Program Change works for presets. Control Change must be enabled for sliders and effect toggles.

## Optional Custom Default Patch

This package includes `tonex-controller-defaults.patch`.

Apply it to the Builty TonexOneController source before building a custom Waveshare Zero firmware if you want a fresh erased flash to start with:

- Bluetooth Mode: `Peripheral`
- Peripheral Name: `TnxBT`
- Bluetooth MIDI CC: enabled
- MIDI channel: `1`

The patch changes only the defaults for Bluetooth mode and Bluetooth MIDI CC. `TnxBT` and MIDI channel `1` are already the source defaults. Existing saved settings in NVS still take priority unless you erase during flashing.
