# AI Course - Setup Lokal

Panduan lengkap untuk menjalankan project di environment lokal macOS.

## Prerequisites

- Node.js 18+ dan npm
- PostgreSQL lokal atau akun Supabase (opsional untuk dev, bisa pakai SQLite in-memory)
- Google Cloud Console (untuk YouTube Data API v3)
- Google AI Studio (untuk Gemini API)

---

## 1. Clone & Install Dependencies

```zsh
# Clone repository
cd ~/Documents/arfidakai\ projectt/ai.course

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

---

## 2. Setup Server

### A. Environment Variables

Copy `.env.example` ke `.env`:

```zsh
cd server
cp .env.example .env
```

Edit `server/.env` dengan nilai yang valid:

```env
PORT=3000
DATABASE_URL=your_db_url_here
GEMINI_API_KEY=your_gemini_api_here
YOUTUBE_API_KEY=your_yt_api_here
JWT_SECRET=jwt_secret
SESSION_SECRET=session_secret
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback
CLIENT_REDIRECT_URL=http://localhost:3001/login
```

### B. Dapatkan API Keys

#### YouTube Data API v3

1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. Buat project baru atau pilih existing
3. **Enable API**: APIs & Services → Library → cari "YouTube Data API v3" → Enable
4. **Create Credentials**: APIs & Services → Credentials → Create Credentials → API Key
5. **Configure Key** (klik ikon edit):
   - **Application restrictions**: pilih "None" (untuk backend dev)
   - **API restrictions**: pilih "Restrict key" → centang "YouTube Data API v3"
   - Save
6. Copy key ke `YOUTUBE_API_KEY` di `.env`

**Troubleshooting 403:**
- Pastikan API sudah di-enable (tunggu 1-2 menit setelah enable)
- Jangan gunakan "HTTP referrers" restriction untuk backend
- Cek quota: Console → APIs & Services → Dashboard → YouTube Data API v3

#### Gemini API

1. Buka [Google AI Studio](https://ai.google.dev/)
2. Sign in dengan Google account
3. Klik "Get API Key" → Create API Key
4. Copy key ke `GEMINI_API_KEY` di `.env`

**Troubleshooting:**
- Pastikan sudah accept Terms of Service
- Key hanya berlaku untuk project yang sama

#### Database (Opsional)

**Option 1: SQLite In-Memory (Recommended untuk Dev)**
- Tidak perlu setup database
- Data tidak persisten (hilang setelah restart)
- Jalankan dengan: `NODE_ENV=test npm start` atau `npm run dev`

**Option 2: PostgreSQL/Supabase**
1. Buat project di [Supabase](https://supabase.com/)
2. Project Settings → Database → Connection String (URI mode)
3. Copy connection string ke `DATABASE_URL` di `.env`
4. Format: `postgresql://postgres:<PASSWORD>@db.<project-id>.supabase.co:5432/postgres?sslmode=require`

#### JWT & Session Secrets

Generate random strings untuk production:
```zsh
# macOS/Linux
openssl rand -base64 32
```

Update `JWT_SECRET` dan `SESSION_SECRET` di `.env`.

#### Google OAuth (Opsional)

1. Google Cloud Console → Credentials → Create OAuth 2.0 Client ID
2. Application type: Web application
3. Authorized redirect URIs: `http://localhost:3000/api/auth/google/callback`
4. Copy Client ID dan Client Secret ke `.env`

---

## 3. Setup Client

Copy `.env.example` ke `.env`:

```zsh
cd client
cp .env.example .env
```

Edit `client/.env`:

```env
VITE_API_URL=http://localhost:3000/api
```

---

## 4. Jalankan Development Servers

### Terminal 1: Server

```zsh
cd server

# SQLite mode (no DATABASE_URL needed)
npm run dev

# atau dengan PostgreSQL/Supabase
npm start
```

Server akan jalan di: `http://localhost:3000`

### Terminal 2: Client

```zsh
cd client
npm run dev
```

Client akan jalan di: `http://localhost:3001`

---

## 5. Verify Setup

### Check Server Health

```zsh
curl http://localhost:3000/api/health
# Expected: {"ok":true}
```

### Check YouTube API

```zsh
curl http://localhost:3000/api/youtube/ping
# Success: {"ok":true,"items":1}
# Failure: {"ok":false,"error":"...","reason":"...","status":403}
```

**Common errors:**
- `accessNotConfigured`: YouTube API belum di-enable
- `keyInvalid`: API key salah atau typo
- `quotaExceeded`: Quota habis (default 10,000 units/day)
- `forbidden` + "unregistered callers": Key tidak ter-set atau placeholder

### Check Gemini API

```zsh
curl http://localhost:3000/api/gemini/ping
# Success: {"ok":true,"reply":"..."}
```

---

## 6. Test Application

1. Buka browser: `http://localhost:3001`
2. Register akun baru
3. Login
4. Test AI consultation (perlu `GEMINI_API_KEY`)
5. Test video recommendations (perlu `YOUTUBE_API_KEY`)

---

## Troubleshooting

### Port Already in Use

```zsh
# Kill process di port 3000
lsof -ti:3000 | xargs kill -9

# Kill process di port 3001
lsof -ti:3001 | xargs kill -9
```

### Database Connection Error

Mode test (SQLite):
```zsh
NODE_ENV=test PORT=3000 npm start
```

### CORS Errors

Pastikan:
- Server jalan di port 3000
- Client `.env` memuat `VITE_API_URL=http://localhost:3000/api`
- Server `cors()` middleware sudah dipanggil

### API Keys Not Working

1. Restart server setelah update `.env`
2. Cek warning saat startup:
   ```
   ⚠️  YOUTUBE_API_KEY not set or still placeholder
   ⚠️  GEMINI_API_KEY not set or still placeholder
   ```
3. Pastikan tidak ada spasi/quotes di nilai `.env`

---

## Running Tests

### Server Tests

```zsh
cd server
npm test
```

Coverage report: `server/coverage/lcov-report/index.html`

### Client Tests

```zsh
cd client
npm test
```

---

## Production Deployment

Untuk production:
1. Set `NODE_ENV=production`
2. Gunakan strong secrets untuk `JWT_SECRET` dan `SESSION_SECRET`
3. Enable database (PostgreSQL/Supabase)
4. Update `CLIENT_REDIRECT_URL` ke production domain
5. Restrict API keys di Google Cloud Console (IP/domain)
6. Set CORS origin di `server.js`: `app.use(cors({ origin: 'https://yourdomain.com' }))`

---

## Struktur Port

- Client (Vite): `3001`
- Server (Express): `3000`
- Database (lokal Postgres): `5432` (jika pakai lokal)

---

## Kontak & Support

Jika ada masalah:
1. Cek terminal output untuk error messages
2. Test diagnostics endpoints (`/api/health`, `/api/youtube/ping`, `/api/gemini/ping`)
3. Verify `.env` values (jangan commit `.env` ke git!)

Happy coding! 🚀
