# 🚀 Vercel Deployment Guide — AetherAvia Store

This guide describes how to deploy the **AetherAvia Store** Next.js app to **Vercel**.

---

## ✅ What the Repo Includes

- Framework: Next.js 16 (App Router)
- Database: MongoDB Atlas (cloud-hosted, no server needed)
- Analytics: Vercel Analytics (`@vercel/analytics`)
- Build: Standard Next.js build (`npm run build`)

---

## 🏗️ Architecture

```mermaid
graph TD
    Client["Browser"] --> Vercel["Vercel Edge Network (Next.js)"]
    Vercel --> Mongo["MongoDB Atlas"]
    Vercel --> Cloudinary["Cloudinary (Media)"]
    Vercel --> Razorpay["Razorpay (Payments)"]
```

---

## 1) Import Repository into Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import from GitHub: `heukcare01/aetheravia`
3. Framework: **Next.js** (auto-detected)
4. Do NOT change the build command — leave as default (`npm run build`)

---

## 2) Set Environment Variables in Vercel

Go to: **Project → Settings → Environment Variables**

### Required (App will not start without these)

| Variable | Value |
|----------|-------|
| `MONGODB_URI` | `mongodb+srv://heukcare_db_user:...@cluster0.bghvakr.mongodb.net/aetheravia` |
| `NEXTAUTH_SECRET` | A strong random 32+ char secret (generate via `openssl rand -base64 32`) |

### Authentication

| Variable | Value |
|----------|-------|
| `NEXTAUTH_URL` | Your production URL e.g. `https://aetheravia.vercel.app` |
| `GOOGLE_CLIENT_ID` | From Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | From Google Cloud Console |

### Payments

| Variable | Value |
|----------|-------|
| `RAZORPAY_KEY_ID` | Your Razorpay Key ID (live) |
| `RAZORPAY_KEY_SECRET` | Your Razorpay Key Secret |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Same as `RAZORPAY_KEY_ID` (public) |

### Media

| Variable | Value |
|----------|-------|
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Your Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Your Cloudinary API secret |

### Branding (Public)

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_BRAND_NAME` | `AetherAvia` |
| `NEXT_PUBLIC_BRAND_TAGLINE` | `Embrace the earth, unveil your personality` |
| `NEXT_PUBLIC_SUPPORT_EMAIL` | `support@aetheravia.com` |
| `NEXT_PUBLIC_SUPPORT_PHONE` | Your support number |

---

## 3) MongoDB Atlas Network Access

In Atlas → Network Access → Add IP:
- Add `0.0.0.0/0` (Allow All) — simplest option for Vercel serverless which uses dynamic IPs

---

## 4) Deploy

1. Click **Deploy** in Vercel
2. Watch build logs for:
   - Successful build
   - Static page generation completing
3. Health check: `GET /api/health`

---

## 5) Database Seeding (Optional)

Run locally against production DB:
```bash
npm run sync-seed
```
This will upsert sample users, products, and active coupons into MongoDB Atlas.

---

## 6) Custom Domain (Optional)

In Vercel → Project → Domains → Add your domain.
Then update `NEXTAUTH_URL` to `https://your-domain.com`.

---

## ⚠️ Known Limitation: WebSockets on Vercel

Vercel is a **serverless** platform. Socket.IO's persistent WebSocket connections **do not work** on Vercel serverless functions.

- **Workaround**: Use [Pusher](https://pusher.com), [Ably](https://ably.com), or [Socket.IO hosted](https://socket.io/docs/v4/hosting-on-vercel/) with a separate stateful server for real-time order tracking.
- The rest of the app (shop, checkout, admin) works fully on Vercel.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Build fails with DB error | Ensure `MONGODB_URI` is set in Vercel env vars |
| Auth redirect broken | Verify `NEXTAUTH_URL` matches your production domain exactly |
| Google OAuth fails | Add your Vercel URL to Google OAuth authorized redirect URIs |
| Payment fails | Ensure Razorpay live keys are used (not `rzp_test_`) |
