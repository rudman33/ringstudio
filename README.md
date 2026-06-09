# Ring Studio — SaaS Ring Builder

White-label ring builder SaaS for jewelry businesses.
Each jeweler gets their own branded subdomain and admin panel.

## Tech Stack
- **Frontend + API**: Next.js 15 (App Router)
- **Database + Auth**: Supabase (PostgreSQL + Row Level Security)
- **Hosting**: Vercel
- **Payments**: Stripe Subscriptions
- **Email**: Resend
- **AI chat step**: Anthropic Claude API

## Project Structure
See `structure.txt` for the full file tree.

## Getting Started

### 1. Clone and install
\`\`\`bash
git clone https://github.com/yourname/ringstudio
cd ringstudio
npm install
\`\`\`

### 2. Set up Supabase
1. Create a new project at supabase.com
2. Go to SQL Editor → New Query
3. Paste and run `schema.sql` (in the project root)
4. Go to Authentication → Email Templates and customise
5. Go to Storage → New bucket named `ring-images` (public)

### 3. Configure environment variables
Copy `.env.local` and fill in all values:
\`\`\`bash
cp .env.local.example .env.local
\`\`\`

### 4. Set up Stripe
1. Create products + prices in Stripe dashboard
2. Add Price IDs to `.env.local`
3. Run `stripe listen --forward-to localhost:3000/api/stripe/webhook` locally

### 5. Run locally
\`\`\`bash
npm run dev
\`\`\`

### 6. Test subdomain routing locally
Add to `/etc/hosts`:
\`\`\`
127.0.0.1  tiffany.localhost
\`\`\`
Then visit: http://tiffany.localhost:3000

## Deploying to Vercel
1. Push to GitHub
2. Import project in Vercel
3. Add all environment variables
4. Add wildcard domain: `*.ringstudio.com` in Vercel settings
5. Point your DNS: `*.ringstudio.com  CNAME  cname.vercel-dns.com`

## Creating your first jeweler account
After deploying, run this in Supabase SQL Editor:
\`\`\`sql
-- 1. Create the account row
INSERT INTO accounts (email, business_name, subdomain, plan, status)
VALUES ('jeweler@example.com', 'Example Jewellers', 'example', 'trial', 'trial')
RETURNING id;

-- 2. Seed default steps and options (use the ID from above)
SELECT seed_account_defaults('<paste-id-here>');
\`\`\`
Then invite the jeweler to sign up at /auth/signup — 
their account_users row links their login to the account.

## File Naming Convention
- `*-client.ts` / `'use client'` → runs in the browser
- `*-server.ts` / Server Components → runs on the server only
- `lib/supabase-client.ts` → browser Supabase (anon key)
- `lib/supabase-server.ts` → server Supabase (service role for trusted ops)
