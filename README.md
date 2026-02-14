# 🔥 MoltRoast - Production-Grade AI Roast Battle Platform

**Next.js 14 App Router · TypeScript · Prisma · OpenAI GPT-4**

Where AI agents roast topics and a jury scorches the verdict. A viral webapp for meme-friendly roast battles powered by cutting-edge technology.

---

## 🚀 Features

- ✅ **AI-Powered Roast Battles**: Sequential 3-round battles with contextual responses
- ✅ **Jury Verdict System**: AI jury decides winners with scores and savage quotes
- ✅ **Shareable Battles**: Unique URLs with X/Twitter integration
- ✅ **Real-Time Leaderboard**: Ranked by weighted scoring algorithm
- ✅ **Animated Battle Display**: Sequential reveals with confetti celebrations
- ✅ **Responsive Design**: Mobile-first dark crypto aesthetic
- ✅ **Production-Ready**: TypeScript, proper error handling, no race conditions

---

## 🛠 Tech Stack

**Frontend:**
- Next.js 14 (App Router)
- React 18
- TypeScript 5
- Tailwind CSS
- SWR (for data fetching)
- Framer Motion (animations)
- Canvas Confetti

**Backend:**
- Next.js API Routes (Server-side)
- Prisma ORM
- SQLite (dev) / PostgreSQL (production)
- OpenAI GPT-4 API

**Infrastructure:**
- Sequential AI generation (no race conditions)
- Atomic view/share counting
- Status locking for battle generation
- Weighted leaderboard algorithm

---

## 📋 Prerequisites

- Node.js 18+ installed
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))
- Optional: PostgreSQL database (SQLite used by default)

---

## ⚡ Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Copy `.env.example` to `.env`:

```bash
copy .env.example .env
```

Edit `.env` and add your OpenAI API key:

```env
OPENAI_API_KEY=sk-your-actual-api-key-here
DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Initialize Database

```bash
npm run db:push
```

This creates the SQLite database and generates the Prisma client.

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Start Roasting! 🔥

1. Enter a topic (e.g., "Crypto Bros", "NFT Flippers")
2. Select personas (e.g., "Crypto Chad vs Normie")
3. Click "START ROAST BATTLE"
4. Wait 20-30 seconds for AI generation
5. View animated battle results
6. Share on social media!

---

## 📁 Project Structure

```
MoltRoast/
├── app/
│   ├── api/
│   │   ├── roast/start/route.ts         # Sequential battle generation
│   │   ├── roast/view/route.ts          # View tracking
│   │   ├── battle/[id]/route.ts         # Battle retrieval
│   │   ├── leaderboard/route.ts         # Top battles
│   │   └── share/route.ts               # Share tracking
│   ├── battle/[id]/page.tsx             # Battle display page
│   ├── leaderboard/page.tsx             # Leaderboard page
│   ├── how-it-works/page.tsx            # How it works page
│   ├── page.tsx                         # Homepage (Arena)
│   ├── layout.tsx                       # Root layout
│   └── globals.css                      # Global styles
├── components/
│   ├── Header.tsx                       # Navigation header
│   ├── Footer.tsx                       # Footer
│   ├── BattleCard.tsx                   # Battle preview card
│   ├── WinnerBanner.tsx                 # Animated winner announcement
│   └── LoadingSpinner.tsx               # Loading indicator
├── lib/
│   ├── db.ts                           # Prisma client
│   └── openai.ts                       # OpenAI service
├── types/
│   └── battle.ts                       # TypeScript types
├── prisma/
│   └── schema.prisma                   # Database schema
├── package.json
├── next.config.js
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🔌 API Endpoints

### POST `/api/roast/start`

Generate a new roast battle.

**Request:**
```json
{
  "topic": "Crypto Bros",
  "persona": "Crypto Chad vs Normie"
}
```

**Response:**
```json
{
  "success": true,
  "battleId": "uuid-here"
}
```

### GET `/api/battle/:id`

Retrieve a battle by ID.

### POST `/api/roast/view`

Increment view count (atomic).

### POST `/api/share`

Increment share count (atomic).

### GET `/api/leaderboard?limit=20`

Get top battles sorted by weighted score.

---

## 🎨 Design System

**Colors:**
- Background: `#121212`
- Primary: `#FF0000`
- Accent Cyan: `#00F2FF`
- Card Dark: `#1E1E1E`

**Animations:**
- Sequential fade-in
- Slide-up transitions
- Shake effect for winner
- Confetti burst

---

## 🗄 Database Schema

```prisma
model Battle {
  id        String   @id @default(uuid())
  topic     String
  agentA    String
  agentB    String
  round1    String
  round2    String
  round3    String
  winner    String
  score     Int
  verdict   String
  views     Int      @default(0)
  shares    Int      @default(0)
  status    BattleStatus @default(GENERATING)
  createdAt DateTime @default(now())
}

enum BattleStatus {
  GENERATING
  COMPLETE
}
```

---

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. Push to GitHub
2. Import to Vercel
3. Add environment variables:
   - `OPENAI_API_KEY`
   - `DATABASE_URL` (use Neon, Supabase, or Railway PostgreSQL)
   - `NEXT_PUBLIC_SITE_URL`
4. Deploy!

### Production Database

For production, use PostgreSQL:

```env
DATABASE_URL="postgresql://user:password@host:5432/moltroast?schema=public"
```

Then run migrations:

```bash
npm run db:migrate
```

---

## 💰 Cost Estimation

Each roast battle uses **4 OpenAI API calls**:
- Round 1 generation
- Round 2 generation  
- Round 3 generation
- Jury verdict

**Approximate cost per battle**: $0.01 - $0.05 (GPT-4)

---

## 🔒 Security & Bug Prevention

✅ **No client-side AI calls** - All generation on server  
✅ **No race conditions** - Sequential generation with status locking  
✅ **No infinite loops** - Proper dependency arrays  
✅ **No double requests** - Button disabled during submission  
✅ **Atomic operations** - View/share increments are atomic  
✅ **Input validation** - Sanitized and validated inputs  
✅ **Error boundaries** - Proper error handling throughout  
✅ **TypeScript strict mode** - Full type safety  

---

## 📊 Leaderboard Algorithm

Battles are ranked using a weighted score:

```
weighted_score = (score × 0.6) + (shares × 0.4)
```

This balances quality (jury score) with virality (shares).

---

## 🧪 Development Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Type checking
npx tsc --noEmit

# Database commands
npm run db:push      # Push schema changes
npm run db:migrate   # Create migration
npm run db:studio    # Open Prisma Studio
```

---

## 🐛 Troubleshooting

**"OpenAI API key not configured"**  
→ Check `.env` file has valid `OPENAI_API_KEY`

**"Database connection error"**  
→ Run `npm run db:push` to create database

**Build errors**  
→ Delete `.next` folder and `node_modules`, then `npm install` again

**Hydration mismatches**  
→ Clear browser cache and restart dev server

---

## 📝 License

MIT License - See LICENSE file for details

---

## 🙏 Credits

Built with ❤️ and 🔥

**Powered by:**
- OpenAI GPT-4
- Next.js 14
- Prisma ORM
- Vercel

**Launch $MOLTROAST on** [BagsApp](https://bagsapp.io)

---

**🔥 Ready to roast? Get started now!**

For issues, open a GitHub issue or contact support.
