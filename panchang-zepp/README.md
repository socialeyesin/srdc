# Hindu Panchang – Zepp OS (Amazfit) app

This folder contains a lightweight Zepp OS app scaffold for displaying a Hindu Panchang on Amazfit watches. It renders the exact fields you listed, updates using the watch’s local (Gregorian) date/time, and is ready to build into a `.zab` package with the Zepp/Zeus CLI.

## What I need from you
1. **Panchang data source**
   - Do you prefer **precomputed daily data** (offline, light) or **on-device calculation** (algorithmic, heavier)?
   - If precomputed: share city/time‑zone targets and the date range (e.g., 2025–2026) so I can produce `resources/data/panchang-YYYY.json` tables. One entry looks like `2025-12-21` with the fields below.
   - If algorithmic: confirm acceptable precision and which elements must be exact (tithi, nakshatra, yoga, karana, sunrise/sunset, moonrise/moonset).
2. **Location handling**
   - Should we support multiple cities or just one default? Provide coordinates/time zones if multiple.
3. **Branding & store assets**
   - App icon (240×240 png, circular with transparent background) and any screenshots you want to ship with the store listing.
   - Exact **App Name** (max 30 chars), **Introduction** (40 chars), and **Details** (up to 600 chars) for the store form. Language coverage (English, Simplified/Traditional Chinese, etc.).
4. **Signing**
   - Developer certificate/private key from the Zepp developer console to sign the `.zab` for sideload/store upload.
5. **Target platform/version**
   - Zepp OS version and device list (if known) so we can adjust `minPlatformVersion` and capabilities.

## Project structure
```
panchang-zepp/
├── app.json                # High-level app metadata
├── manifest.json           # Permissions, platform, pages
├── app/page/index.js       # UI + daily refresh + data binding
├── app/page/index.page     # Layout skeleton
├── resources/data/panchang-2025.json   # Sample precomputed entry
└── README.md               # You are here
```

## Data format (precomputed)
`resources/data/panchang-2025.json` maps an ISO date (`YYYY-MM-DD`) to the Panchang fields:
```json
{
  "2025-12-21": {
    "dateLine": "🌻रविवार, २१ दिसम्बर २०२५🌻",
    "sunrise": "०७:१६",
    "sunset": "०५:३४",
    "moonrise": "०८:१७",
    "moonset": "१८:२०",
    "ayan": "उत्तरायणे (दक्षिण गोले)",
    "ritu": "शिशिर",
    "shaka": "१९४७ (विश्वावसु)",
    "vikram": "२०८२ (सिद्धार्थी)",
    "maas": "पौष",
    "paksha": "शुक्ल",
    "tithi": "प्रतिपदा (०९:१० से द्वितीया)",
    "nakshatra": "पूर्वाषाढ (२७:३६ से उत्तराषाढ)",
    "yoga": "वृद्धि (१६:३६ से ध्रुव)",
    "karana1": "बव (०९:१० तक)",
    "karana2": "बालव (२२:०३ तक)"
  }
}
```
Add more dates or more yearly files (e.g., `panchang-2026.json`) and import them in `app/page/index.js`.

## How the app works
- Uses the watch’s **local time** to choose the Panchang entry.
- Renders header + date + the full list of fields you specified.
- Schedules a **midnight refresh** so the UI updates automatically without relaunching.
- If a date is missing from the dataset, it shows a friendly prompt to add Panchang data for that day.

## Build & run (Zeus CLI)
1. Install the toolchain: `npm install -g @zeppos/zeus-cli`.
2. From the repo root, run: `zeus build --private-key <path/to/private.pem> --certificate <path/to/cert.pem>`
   - Output `.zab` lands in `dist/`.
3. Sideload/test: `zeus devices` to list, then `zeus push --device <id> dist/<package>.zab`.
4. Emulator (if available for your target OS): `zeus run --emulator`.

## Store form hints (matches your screenshot)
- **App Installation Package**: upload the built `.zab`.
- **Payment status**: free (unless you want IAP; code currently uses none).
- **Publish Area**: Global unless you need geo limits.
- **Service Category / App Classification**: pick “Utilities” or “Lifestyle” (adjust per Zepp options).
- **Supported Devices / Version No.**: auto-detected after upload.
- **Languages**: choose the languages you provide strings for (currently Hindi content baked in; English can be added easily).
- **App Name / Introduction / Details**: provide your final text (see “What I need from you”).
- **App icon**: 240×240 png, circular/transparent.
- **Privacy Statement**: paste your privacy policy URL/text if required by Zepp.

## Next steps once you reply
- I’ll generate the full Panchang tables for your chosen cities/years (or wire up an algorithm) and integrate them here.
- I’ll add any branding/assets you supply and adjust store metadata accordingly.
- I’ll ship a signed `.zab` you can upload directly, or a ready-to-build project if you prefer to sign yourself.
