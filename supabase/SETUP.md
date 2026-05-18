# 🚗 Sree True Value — Supabase Setup Guide

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **"New Project"**
3. Name: `sree-true-value`
4. Set a strong database password (save it!)
5. Select region: **Southeast Asia (Singapore)** (closest to India)
6. Click **Create new project** and wait ~2 minutes

---

## Step 2: Run the Database Schema

1. In your Supabase project, go to **SQL Editor** (left sidebar)
2. Click **"New query"**
3. Paste the entire contents of `supabase/schema.sql`
4. Click **Run** ✅

---

## Step 3: Create Storage Bucket

1. Go to **Storage** in the left sidebar
2. Click **"New bucket"**
3. Name: `car-images`
4. Enable **Public bucket** toggle
5. Click **Create bucket**

Then run these policies in SQL Editor:
```sql
CREATE POLICY "Public can view car images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'car-images');

CREATE POLICY "Admin can upload car images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'car-images' AND auth.role() = 'authenticated');

CREATE POLICY "Admin can delete car images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'car-images' AND auth.role() = 'authenticated');
```

---

## Step 4: Create Admin User

1. Go to **Authentication** → **Users**
2. Click **"Invite user"** or **"Add user"**
3. Enter email: `admin@sreetv.com` (or your preferred admin email)
4. Set a strong password
5. Click **Create user**

> ⚠️ **Important**: Change your admin email/password to your actual credentials before going live!

---

## Step 5: Get Your API Keys

1. Go to **Settings** → **API** in your Supabase project
2. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role secret** key → `SUPABASE_SERVICE_ROLE_KEY`

---

## Step 6: Configure Environment Variables

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Your WhatsApp Business Number (with country code, no + or spaces)
NEXT_PUBLIC_WHATSAPP_NUMBER=919876543210

# Site URL (update when deployed)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> 🔐 **Never commit `.env.local` to Git!** It's already in `.gitignore`.

---

## Step 7: Install Dependencies & Run

```bash
# Navigate to project directory
cd sree-true-value

# Install all dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## Step 8: Admin Login

1. Go to [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
2. Enter the email and password you created in Step 4
3. You'll be redirected to the admin dashboard

---

## Step 9: Update Your Contact Info

In `lib/utils.ts`, update the `DEALER_INFO` object:

```typescript
export const DEALER_INFO = {
  name: 'Sree True Value',
  phone: '+91 YOUR_PHONE_NUMBER',
  whatsapp: '91YOUR_NUMBER_WITHOUT_+',  // e.g. 919876543210
  email: 'your@email.com',
  address: 'Your exact address, Kakinada',
  // ... etc
}
```

---

## Step 10: Production Deployment (Vercel)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repo
3. Add all environment variables from `.env.local`
4. Update `NEXT_PUBLIC_SITE_URL` to your Vercel domain
5. Deploy! ✅

---

## Troubleshooting

### "JSX element implicitly has type 'any'" errors
→ Run `npm install` to install `@types/react`. These disappear once node_modules exists.

### Supabase connection error
→ Check `.env.local` has correct URL and anon key (no trailing spaces)

### Images not loading
→ Ensure the `car-images` storage bucket is set to **Public**

### Admin login redirects to login page
→ Check you created the user in Supabase Auth, not just the database

---

*Built with ❤️ using Next.js 15, TypeScript, TailwindCSS, Framer Motion & Supabase*
