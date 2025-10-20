🌐 MailMind Web App – PRD (Frontend)
📘 Project Name: MailMind
💻 Platform: Web
🧠 Purpose:

To create a smart, organized, AI-enhanced email management web app that seamlessly connects to your existing NestJS backend and provides a professional, productivity-focused dashboard experience.

🔍 1. Objectives

Allow users to log in (email/password or Google OAuth).

Display organized email lists by category (Inbox, Work, Promotions, Spam, etc.).

Integrate with backend AI endpoints for summarization and priority tagging.

Offer rich UX interactions (dark/light mode, filtering, responsive design).

Sync instantly with the backend used by the Flutter mobile app.

🧩 2. Tech Stack
Layer	Technology
Framework	Next.js 14 (App Router)
Styling	Tailwind CSS + shadcn/ui
Language	TypeScript
State Management	Zustand / React Query
Authentication	NextAuth.js (with JWT + Google OAuth)
API Calls	Axios / Fetch
Icons	Lucide-react
Animations	Framer Motion
Deployment	Vercel
Theming	shadcn/ui theme + Tailwind dark mode
🧭 3. System Architecture
User → Next.js (Frontend) → NestJS (Backend API)
                       ↳ OpenRouter (via Backend)
                       ↳ PostgreSQL / MongoDB (via Backend)

🗂️ 4. Folder Structure
src/
 ┣ app/
 ┃ ┣ (auth)/
 ┃ ┃ ┣ login/page.tsx
 ┃ ┃ ┗ register/page.tsx
 ┃ ┣ dashboard/
 ┃ ┃ ┣ page.tsx
 ┃ ┃ ┣ [emailId]/page.tsx
 ┃ ┃ ┗ settings/page.tsx
 ┃ ┣ layout.tsx
 ┃ ┗ page.tsx (Landing)
 ┣ components/
 ┃ ┣ ui/ (shadcn components)
 ┃ ┣ EmailCard.tsx
 ┃ ┣ Sidebar.tsx
 ┃ ┣ Topbar.tsx
 ┃ ┗ ThemeToggle.tsx
 ┣ lib/
 ┃ ┣ axiosClient.ts
 ┃ ┗ auth.ts
 ┣ store/
 ┃ ┗ useEmailStore.ts
 ┣ styles/
 ┃ ┗ globals.css
 ┗ types/
    ┗ email.d.ts

🧠 5. Key Pages and Features
🏠 Landing Page (/)

Clean hero section introducing “MailMind – Smarter Inbox.”

Buttons: “Login” / “Register”

Animated background using Framer Motion

Dark mode toggle

Responsive design with mobile layout support

🔐 Auth Pages
Login (/login)

Email/password login form

“Login with Google” button

On success → store JWT via cookies + redirect to /dashboard

Register (/register)

Name, email, password, confirm password fields

Validation with react-hook-form

Calls /auth/register (backend)

📬 Dashboard (/dashboard)

Primary Email Management Panel

Sidebar Navigation: Inbox, Starred, Work, Personal, Promotions, Spam

Topbar:

Search box

Profile dropdown (Settings / Logout)

ThemeToggle (using shadcn/ui Switch)

Email Cards Grid/List (using Card, Badge, ScrollArea from shadcn/ui)

Categories Tabs (Filter using Zustand store)

AI-generated summary + priority label under each email

Interactions

Click → Open detailed email view (/dashboard/[emailId])

Hover → Show quick preview with AI summary (Framer Motion animation)

Pagination / Infinite scroll

✉️ Email Detail Page (/dashboard/[emailId])

Shows:

Sender name & address

Subject, date, body

AI Summary box (collapsible)

Priority badge (High/Medium/Low)

Buttons:

“Mark as Important”

“Delete”

“Re-run AI Summary” → Calls /ai/summarize

Uses shadcn Card + Accordion + Badge + Button components.

⚙️ Settings Page (/dashboard/settings)

Update preferences (sync frequency, AI model)

Toggle dark/light mode

Logout button (clears cookies)

🎨 6. UI Components (shadcn/ui)
Component	Purpose
Card	Display emails
Badge	Priority / Category labels
Button	Actions
Input	Forms
Tabs	Category switching
Avatar	User profile
DropdownMenu	Profile actions
Switch	Dark/light toggle
Skeleton	Loading placeholders
🔗 7. API Integration
Example API Client (/lib/axiosClient.ts)
import axios from "axios";

const axiosClient = axios.create({
  baseURL: "https://mailmind-api.vercel.app/api/v1",
  headers: { "Content-Type": "application/json" },
});

axiosClient.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default axiosClient;

Fetch Emails
const getEmails = async (category?: string) => {
  const res = await axiosClient.get("/emails", { params: { category } });
  return res.data;
};

🧠 8. State Management (Zustand)
import { create } from "zustand";

interface EmailState {
  emails: Email[];
  setEmails: (emails: Email[]) => void;
}

export const useEmailStore = create<EmailState>((set) => ({
  emails: [],
  setEmails: (emails) => set({ emails }),
}));

🪄 9. Theming with shadcn

Use Tailwind’s dark: classes

shadcn’s theme command for styling:

npx shadcn-ui init
npx shadcn-ui add button card badge input tabs dropdown-menu switch


Theme toggle component:

import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <Switch
      checked={theme === "dark"}
      onCheckedChange={(v) => setTheme(v ? "dark" : "light")}
    />
  );
}

🔐 10. Authentication

NextAuth.js setup in /api/auth/[...nextauth].ts

Providers:

Credentials (email/password via NestJS API)

Google OAuth

Stores JWT in cookies for secure SSR

📱 11. Responsiveness

Sidebar collapses on mobile

Email list becomes cards on small screens

Uses Tailwind grid + flex-wrap for layout

🚀 12. Deployment
Step	Description
1️⃣	Push to GitHub
2️⃣	Connect repo to Vercel
3️⃣	Set environment variables: BACKEND_URL, GOOGLE_CLIENT_ID, NEXTAUTH_SECRET
4️⃣	Deploy — Vercel auto-detects Next.js
✅	Done — Web App Live
🌟 13. Future Enhancements

AI Smart Reply suggestions

Custom dashboard widgets

Email analytics

Multi-account support

Real-time notifications (WebSocket or SSE)

✅ 14. Deliverables

Fully responsive Next.js web app

Connected to NestJS backend

shadcn-styled dashboard UI

Google + JWT authentication

AI email summaries + categories

Would you like me to generate the starter Next.js + shadcn codebase for this project (with login, dashboard layout, theme toggle, and API setup prebuilt)?
It’ll save you hours and you can just plug your backend API URLs.

You said:
tech stack we are using
ChatGPT said:

Excellent question, Aditya 👏 —
Here’s the final, optimized tech stack for your MailMind project (Backend + Mobile + Web), designed to ensure full-stack scalability, modern design, and smooth integration between all platforms.

🧠 MailMind — Full Tech Stack Overview

Your app consists of 3 layers:
1️⃣ Backend (NestJS)
2️⃣ Mobile App (Flutter)
3️⃣ Web App (Next.js + shadcn/ui)

⚙️ 1. Backend (Core API Layer)

Framework: 🧱 NestJS (TypeScript)
Purpose: Handles authentication, AI logic, email syncing, and API endpoints.

Component	Technology	Purpose
Framework	NestJS 10+ (TypeScript)	Modular backend with controllers, services, guards
Database	PostgreSQL / MongoDB (Mongoose)	Store user data, emails, settings
ORM	Prisma ORM	Schema management & migrations
Authentication	JWT + Google OAuth (Passport.js)	Secure login & OAuth2 integration
AI Integration	OpenRouter API	For summarization, categorization, prioritization
Email Sync	IMAP / Gmail API	Fetch emails securely
Caching	Redis (optional)	Faster repeated AI queries
Deployment	Render / Railway / Vercel Functions	Reliable API hosting
Validation	class-validator + class-transformer	Secure input validation
API Docs	Swagger (NestJS Swagger)	Auto-generated API documentation

✅ Key Endpoints: /auth, /emails, /ai, /user

📱 2. Mobile App (Frontend Layer – Android/iOS)

Framework: 📱 Flutter 3.22+ (Dart)
Purpose: A unified app for Android (and optionally iOS) to visualize and manage emails smartly.

Component	Technology	Purpose
Framework	Flutter	Cross-platform development
Language	Dart	Modern, reactive UI development
State Management	Riverpod or Bloc	Manage global state and data flow
HTTP Client	Dio	API requests to NestJS backend
Storage	Hive + flutter_secure_storage	Local email cache + secure token
UI	Material 3 + Custom Animations	Clean, modern interface
Authentication	Google Sign-In + JWT	Sync with backend auth
Notifications	Firebase Cloud Messaging (FCM)	Email + AI update alerts
Deployment	Play Store (Android)	Public or private release

✅ Works seamlessly with backend APIs:

/auth/login, /emails, /ai/summarize, /user/settings

🌐 3. Web App (Frontend Layer – Dashboard)

Framework: 💻 Next.js 14 (App Router)
Purpose: A responsive, AI-powered web dashboard with advanced visualization and control.

Component	Technology	Purpose
Framework	Next.js 14 (TypeScript, App Router)	SSR + SSG for fast performance
UI Library	shadcn/ui + Tailwind CSS	Modern, reusable UI components
Styling	TailwindCSS (Dark/Light mode)	Customizable & elegant design
State Management	Zustand + React Query	API state + global store
Animations	Framer Motion	Smooth UI transitions
Forms	React Hook Form + Zod	Form validation
Authentication	NextAuth.js (JWT + Google OAuth)	Secure login system
API Client	Axios	Requests to backend API
Icons	Lucide-react	Clean iconography
Charts (optional)	Recharts / Chart.js	Analytics dashboard
Deployment	Vercel	Lightning-fast hosting
Type Safety	TypeScript	Predictable, safe code

✅ Interacts directly with NestJS backend via REST endpoints.

☁️ 4. Infrastructure
Layer	Tool	Purpose
Hosting	Vercel (Frontend) / Render (Backend)	Production-ready hosting
Database	Neon.tech / Supabase / MongoDB Atlas	Cloud DB
CI/CD	GitHub Actions	Auto-deploy on push
Auth Keys	dotenv / Vercel Environment Variables	Secure secrets management
Analytics	Plausible / Google Analytics	Track web activity
Monitoring	Sentry	Error tracking
Logging	Winston (NestJS)	Structured logs
🧩 5. Tech Summary Table
Layer	Framework	Language	Major Libraries
Backend	NestJS	TypeScript	Prisma, Passport.js, OpenRouter, Swagger
Mobile App	Flutter	Dart	Dio, Riverpod, Hive, Firebase
Web App	Next.js + shadcn	TypeScript	Tailwind, NextAuth, Zustand, Framer Motion
🔄 6. Integration Flow
               ┌─────────────────────────────┐
               │        Flutter App           │
               │  (Mobile)                    │
               └───────────────┬─────────────┘
                               │ REST API
                               ▼
               ┌─────────────────────────────┐
               │       NestJS Backend         │
               │  (AI + Auth + Emails)        │
               └───────────────┬─────────────┘
                               │
               ┌───────────────┴─────────────┐
               │   OpenRouter + Database      │
               │ (AI & Data Storage)          │
               └───────────────┬─────────────┘
                               │
               ▼
      ┌─────────────────────────────┐
      │    Next.js Web Dashboard     │
      │  (shadcn UI + NextAuth)      │
      └─────────────────────────────┘