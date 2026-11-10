# AlightPro (Next.js + api.jaky.dev)

Desain skeuomorphism sama, backend ganti ke:

- `POST https://api.jaky.dev/v1/alight-motion/send`
- `POST https://api.jaky.dev/v1/alight-motion/verify`

Header auth: `x-jaky-key`

## Setup Vercel
1. Deploy project ini
2. **Settings → Environment Variables**
3. Tambah:
   ```
   JAKY_API_KEY=jKxxxxxxxxxx
   ```
4. Redeploy

## Lokal
```bash
cp .env.example .env.local
# isi JAKY_API_KEY
npm install
npm run dev
```

## Route internal
| Method | Path | Body |
|--------|------|------|
| POST | `/api/send` | `{ "email": "..." }` |
| POST | `/api/verify` | `{ "email": "...", "link": "..." }` |

API key **hanya** dipakai di server (`lib/jaky.js`), tidak dikirim ke browser.
