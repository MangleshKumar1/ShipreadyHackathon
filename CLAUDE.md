# ShipReady — AI Decision System for PMs

## Mission
Turn customer feedback into evidence-backed product 
decisions and engineering-ready specs in 60 seconds.

## Deadline
June 20, 2026 — 9:30 PM IST. SHIP. DO NOT OVER-ENGINEER.

## MVP IS COMPLETE WHEN:
1. User pastes feedback → gets themes with evidence quotes
2. User sees BUILD NOW / PLAN LATER / QUICK WIN / LOW SIGNAL
3. User clicks → gets full PRD with evidence-linked stories
4. Novus tracks all 7 events
5. Deployed on Vercel with public URL
6. Full flow under 60 seconds
7. Zero login required

## Tech Stack
- Next.js 15 App Router + TypeScript
- Tailwind CSS + shadcn/ui
- Claude API claude-sonnet-4-6 via @anthropic-ai/sdk
- Novus.ai (REQUIRED — ineligible without it)
- Vercel (deployment)
- NO Supabase unless explicitly told to add

## Project Structure
app/
  page.tsx              → Landing
  analyze/page.tsx      → Input (Step 1)
  insights/page.tsx     → Insights Dashboard (Step 2)
  decision/page.tsx     → Decision View (Step 2.5)
  spec/page.tsx         → PRD Output (Step 3)
  api/
    analyze/route.ts    → Claude Call 1+2 combined
    prd/route.ts        → Claude Call 3

components/
  ThemeCard.tsx
  DecisionCard.tsx
  PRDView.tsx

## State Management
localStorage only. No database.
Flow: analyze/ → saves to localStorage → 
      insights/ reads → decision/ reads → spec/ reads

## API Security Rules
- ANTHROPIC_API_KEY ONLY in /app/api/ routes
- NEVER in any page.tsx or component
- process.env.ANTHROPIC_API_KEY server-side only
- .env.local in .gitignore always

## DO NOT BUILD
- Roadmap timeline screen
- File/CSV upload
- User auth or login
- Multi-project dashboard  
- Chatbot interface
- Any feature not in 5 screens above

## Novus Events (ALL 7 MUST FIRE)
novus.track('session_started')
novus.track('feedback_submitted', {char_count, has_context})
novus.track('analysis_complete', {themes_found, top_score})
novus.track('theme_clicked', {theme_name, rank})
novus.track('decision_viewed', {build_now_theme})
novus.track('prd_generated', {theme, stories_count})
novus.track('prd_exported', {format})

## UI Rules
- Light mode, clean, professional SaaS
- shadcn/ui components only
- Mobile responsive
- Loading states on ALL API calls
- Error states on ALL API failures

## Definition of Done
Stranger opens shipready.vercel.app
Pastes feedback → sees themes → sees decisions → 
gets PRD in under 60 seconds.
No bugs. No broken buttons. Novus dashboard has data.