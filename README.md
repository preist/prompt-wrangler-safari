# Prompt Wrangler Safari Extension

This repo contains the Xcode host app plus a TypeScript/React project under `extension/` that builds the Safari Web Extension.

## Structure
- `Prompt Wrangler Extension/`: Safari Web Extension resources (manifest, scripts, assets).
- `extension/`: React + TypeScript + Vite project. Builds the popup and extension scripts into `Prompt Wrangler Extension/Resources`.
- `docs/`: Static site docs.
- `Prompt Wrangler.xcodeproj`: Xcode project for the macOS host app and extension wrapper.

## Building the extension
1) Install JS deps in `extension/`: `cd extension && npm install`.
2) Build web assets: `npm run build` (outputs into `Prompt Wrangler Extension/Resources`).
3) In Xcode, build/run the “Prompt Wrangler” app target to package and load the Safari extension.
4) Enable the extension in Safari Preferences → Extensions and allow on ChatGPT domains.

During development, `npm run lint` and `npm run test` are available in `extension/`. Popup UI and extension scripts live under `extension/src/`.
