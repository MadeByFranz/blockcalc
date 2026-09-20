# BlockCalc

Masonry calculator for Finnish valuharkko construction: blocks, fill concrete,
rebar, per-course cut lists, stepped foundations, and a footing calculator.
FI / SV / EN. Share links encode the whole project in the URL.

## Local dev
    npm install
    npm run dev

## Deploy (GitHub Pages)
Push to `main`. The included workflow builds and deploys automatically —
one-time setup: repo **Settings → Pages → Source: GitHub Actions**.

## Notes
- Styling uses the Tailwind CDN for simplicity. For production polish,
  migrate to the Tailwind Vite plugin later.
- Blocks module 600×200 mm. Fill menekki defaults are editable —
  always check the manufacturer's pallet label and your structural drawings.


or go here:

https://madebyfranz.github.io/blockcalc/
