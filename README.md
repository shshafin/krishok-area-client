# Krishok Area — Client

React (Vite) frontend for a farmer-focused community product: posts, crops and market-oriented surfaces, galleries, and product flows — connected to the Krishok Area API.

| | |
| --- | --- |
| **API repo** | [krishok-area-server](https://github.com/shshafin/krishok-area-server) |
| **Portfolio** | [shafinsadnan.com](https://shafinsadnan.com) |

---

## What this repo is

A community web client aimed at agricultural users (“krishok”): sharing updates, browsing crop/market-related content, and interacting with product/marketplace-style features through the companion Express API.

Built as a responsive SPA with a practical UI stack suitable for day-to-day community use.

## Client capabilities

- Community feed / post-oriented UI
- Crop and market-related browsing surfaces
- Gallery / media viewing (lightbox support)
- Product and marketplace-oriented screens
- Routing via React Router; toast feedback for user actions

## Tech stack

- **React** + **Vite**
- **React Router**
- **PrimeReact** + PrimeIcons
- Embla carousel, lightbox utilities

## Run locally

```bash
git clone https://github.com/shshafin/krishok-area-client.git
cd krishok-area-client
npm install
npm run dev
```

Configure the API base URL against a running [krishok-area-server](https://github.com/shshafin/krishok-area-server). Keep credentials and env files out of version control.

```bash
npm run build
npm run preview
```

## Related

- Backend API: https://github.com/shshafin/krishok-area-server
- Portfolio: https://shafinsadnan.com
