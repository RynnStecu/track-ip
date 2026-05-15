# TrackIP — Next.js App

IP Intelligence tracker dengan 2 halaman, tampilan monokrom brutalis.

**dev:** RynnStecuSigamSkibidi  
**channel:** https://whatsapp.com/channel/0029Vb7gcbuLdQelWzrTzD3D

---

## Setup

```bash
npm install
npm run dev
```

Buka http://localhost:3000

## Pages

- `/trackip` — Multi-source (ipwho.is + ipapi.co + ip-api.com)
- `/trackipv2` — Single-source dengan fallback (ipwho.is → ip-api.com)

## API Routes

- `GET /api/trackip?ip=x.x.x.x`
- `GET /api/trackipv2?ip=x.x.x.x`

## Build

```bash
npm run build
npm start
```

## Deploy

Deploy ke Vercel:
```bash
npx vercel
```
