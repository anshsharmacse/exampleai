# 🚀 Example.Ai — Complete Deployment Guide

Everything is **100% FREE**. No credit card required for any service.

## 📋 Prerequisites
- [Git](https://git-scm.com) installed
- [Node.js 18+](https://nodejs.org) or [Bun](https://bun.sh) installed
- A code editor (VS Code recommended)

---

## 🧩 Free Services Used

| Service | Purpose | Cost | Link |
|---------|---------|------|------|
| **Groq** | AI Models (Llama, Mixtral, Gemma) | $0 forever | [console.groq.com](https://console.groq.com) |
| **Supabase** | PostgreSQL Database | $0 (500MB) | [supabase.com](https://supabase.com) |
| **Vercel** | Hosting / Deployment | $0 (100GB bandwidth) | [vercel.com](https://vercel.com) |
| **Razorpay** | Payment Gateway (test + live) | $0 setup | [razorpay.com](https://razorpay.com) |

**Total cost: ₹0 / $0**

---

## 📦 Step-by-Step Deployment

### Step 1: Get Your Free API Keys

#### 1a. Groq AI (required for real AI responses)
1. Go to [console.groq.com](https://console.groq.com)
2. Click **"Sign In"** → use Google/GitHub
3. Go to **API Keys** → Click **"Create API Key"**
4. Copy the key (starts with `gsk_`)

#### 1b. Supabase Database (required for production)
1. Go to [supabase.com](https://supabase.com) → Sign in
2. Click **"New Project"** → Enter name: `example-ai`
3. Set a database password → Click **"Create new project"**
4. Wait ~2 minutes for setup
5. Go to **Settings** → **Database**
6. Copy the **Connection string** (URI format)

#### 1c. Razorpay (required for payments)
1. Go to [dashboard.razorpay.com](https://dashboard.razorpay.com)
2. Sign up with email
3. Go to **Settings** → **API Keys**
4. Copy **Key ID** (starts with `rzp_test_`)
5. Copy **Key Secret** (click "Reveal")
6. **⚠️ Test mode is free. For live mode, complete KYC.**

---

### Step 2: Setup the Project

```bash
# Clone/extract the project
cd example-ai

# Install dependencies
npm install
# or: bun install

# Generate Prisma client
npx prisma generate

# Setup environment variables
cp .env.example .env
```

### Step 3: Configure Environment Variables

Edit `.env` with your keys:

```env
# Database (Supabase — paste your connection string)
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres"

# Auth (generate a random string)
NEXTAUTH_SECRET="generate-a-random-32-char-string-here"
NEXTAUTH_URL="http://localhost:3000"

# AI (Groq — paste your key)
GROQ_API_KEY="gsk_your_key_here"

# Razorpay (paste your keys)
RAZORPAY_KEY_ID="rzp_test_xxxxxxxxxxxx"
RAZORPAY_KEY_SECRET="xxxxxxxxxxxxxxxxxxxxxxxx"
```

> 💡 **For local development**, you can keep SQLite:
> `DATABASE_URL="file:/db/custom.db"`

### Step 4: Initialize Database

```bash
# Push schema to database
npx prisma db push

# Verify tables were created
npx prisma studio
```

### Step 5: Test Locally

```bash
npm run dev
# Open http://localhost:3000
```

1. **Sign up** with any email/password
2. Go to **Settings** → Paste your Groq API key → Save
3. **Chat** — You'll get real AI responses from Llama 3.1!
4. **Pricing** → Test Razorpay checkout (test mode accepts any card)

---

### Step 6: Deploy to Vercel

#### Option A: One-Click Deploy (Easiest)
```
1. Push code to GitHub
2. Go to vercel.com → "New Project"
3. Import your GitHub repo
4. Add environment variables in Vercel dashboard:
   - DATABASE_URL
   - DIRECT_URL  
   - NEXTAUTH_SECRET
   - NEXTAUTH_URL (your Vercel URL)
   - GROQ_API_KEY
   - RAZORPAY_KEY_ID
   - RAZORPAY_KEY_SECRET
5. Click "Deploy"
```

#### Option B: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Set environment variables (first time)
vercel env add DATABASE_URL
vercel env add NEXTAUTH_SECRET
vercel env add GROQ_API_KEY
vercel env add RAZORPAY_KEY_ID
vercel env add RAZORPAY_KEY_SECRET
vercel env add NEXTAUTH_URL

# Redeploy with env vars
vercel --prod
```

#### Option C: Docker
```bash
# Build
docker build -t example-ai .

# Run
docker run -p 3000:3000 \
  -e DATABASE_URL="your-supabase-url" \
  -e NEXTAUTH_SECRET="random-string" \
  -e GROQ_API_KEY="your-key" \
  -e RAZORPAY_KEY_ID="your-key-id" \
  -e RAZORPAY_KEY_SECRET="your-secret" \
  example-ai
```

---

## 🔧 Production Checklist

- [ ] All 4 API keys configured in `.env` / Vercel env vars
- [ ] `NEXTAUTH_URL` set to your production domain
- [ ] `NEXTAUTH_SECRET` is a long random string (not default)
- [ ] Database schema pushed: `npx prisma db push`
- [ ] Razorpay KYC completed (for live payments)
- [ ] Test a real payment in Razorpay test mode
- [ ] Verify Groq AI responses work
- [ ] SSL enabled (Vercel does this automatically)

---

## 🏗 Architecture

```
┌─────────────┐     ┌──────────────┐     ┌──────────┐
│   Frontend   │────▶│  Next.js API │────▶│  Groq AI │
│  (React)     │     │   (Server)   │     │  (Free)  │
└─────────────┘     └──────┬───────┘     └──────────┘
                           │
                    ┌──────┴───────┐
                    │   Supabase   │
                    │ PostgreSQL  │
                    │  (Free DB)   │
                    └──────────────┘
                           │
                    ┌──────┴───────┐
                    │   Razorpay   │
                    │  Payments   │
                    └──────────────┘
```

---

## 📊 Pricing Model

| Plan | Cost | Rate Limit | AI Models |
|------|------|------------|-----------|
| Free | ₹0 | 30 req/hr, 100 req/day | 5 Groq models |
| Pro | ₹1,419/100 credits | 200 req/hr, 1000 req/day | 5 Groq + Custom |

- 1 credit = ₹14.19 (~$0.17)
- Credits used per AI request (Pro only)
- Free users have unlimited free model access with rate limits

---

## 🔑 Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL connection (Supabase) |
| `NEXTAUTH_SECRET` | ✅ | Random string for JWT encryption |
| `NEXTAUTH_URL` | ✅ | Your app URL (e.g., `https://example-ai.vercel.app`) |
| `GROQ_API_KEY` | ✅ | Groq API key for AI models |
| `RAZORPAY_KEY_ID` | ✅ | Razorpay key ID |
| `RAZORPAY_KEY_SECRET` | ✅ | Razorpay key secret |
| `NVIDIA_API_KEY` | ❌ | Optional NVIDIA NIM fallback |
| `DIRECT_URL` | ❌ | Supabase direct connection (for migrations) |

---

## 🐛 Troubleshooting

**"Rate limit exceeded"**
→ Free plan: 30 req/hr. Upgrade to Pro or wait.

**AI gives demo responses**
→ Add Groq API key in Settings or `.env`

**Razorpay not opening**
→ Ensure `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` are set.
→ Razorpay test mode works with any test card (e.g., `4111 1111 1111 1111`)

**Database connection error (Vercel)**
→ Use Supabase connection string with `?pgbouncer=true` suffix
→ Ensure IP is allowed in Supabase settings

**Build fails on Vercel**
→ Run `npx prisma generate` before deploy
→ Check that all env vars are set in Vercel dashboard
