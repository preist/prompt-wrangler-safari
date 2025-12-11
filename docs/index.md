---
layout: default
title: Prompt Wrangler
---

# Prompt Wrangler Safari

Safari extension that detects and anonymizes sensitive data in AI chat prompts. Full source code is [available here](https://github.com/preist/prompt-wrangler-safari) alongside an [installable release](https://github.com/preist/prompt-wrangler-safari/releases/tag/v1.0.0).

A Chrome version is also [available](https://preist.github.io/prompt-wrangler/).

![Prompt Wrangler preview](preview-safari.gif)

## What it does
- Scans your prompts on ChatGPT for sensitive tokens (emails, phone numbers, social security or credit card numbers).
- Anonymizes detected data so you can share prompts safely.
- Works automatically on `chatgpt.com` and `chat.openai.com` once loaded.
- Runs locally in the browser; no data leaves your machine.

## Install on Safari (macOS, Developer Mode)
1. In Xcode, build and run the “Prompt Wrangler” app target (this packages the extension).
2. Safari will prompt to enable “Prompt Wrangler Extension.” Accept and open Safari Preferences → Extensions to turn it on.
3. Allow the extension on `chat.openai.com` and `chatgpt.com` when prompted.
4. Pin the toolbar icon if you want quick access to the popup.
5. A simpler way, not tested is to download a packaged Safari extension revision available at [github.com/preist/prompt-wrangler-safari/releases/tag/v1.0.0](https://github.com/preist/prompt-wrangler-safari/releases/tag/v1.0.0).

## Updating
- Rebuild the app/extension in Xcode (or install a new release build) and re-enable in Safari if prompted.

## Source code
- Full source is in [this repository](https://github.com/preist/prompt-wrangler-safari), build with Xcode to load the Safari extension.
- Chrome version (source + site): https://github.com/preist/prompt-wrangler · https://preist.github.io/prompt-wrangler/

## Safari-specific notes
- Safari does not support the `chrome.notifications` API, so system notifications are not shown; the extension uses in-page toasts and the toolbar badge instead.
- Background scripts may not behave exactly like Chrome’s service workers; the extension keeps working via content → popup messaging.

## Privacy & Terms
- [Terms of Service & Privacy Policy](terms.html)
