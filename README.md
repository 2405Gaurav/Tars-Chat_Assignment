# 🤖 Tars Chat

A real-time live chat messaging web app built for the **Tars Full Stack Engineer Internship Coding Challenge 2026**.

🔗 **Live Demo:** [tarschat.thegauravthakur.in](https://tarschat.thegauravthakur.in)
📁 **GitHub:** [github.com/2405Gaurav/Tars-Chat_Assignment](https://github.com/2405Gaurav/Tars-Chat_Assignment)
👤 **Portfolio:** [thegauravthakur.in](https://thegauravthakur.in)

---

## ✨ Features

- **Authentication** — Sign up / log in via Clerk (email + social login). User profiles stored in Convex.
- **User Search** — Find and start conversations with any registered user.
- **Real-time Messaging** — One-on-one direct messages powered by Convex subscriptions.
- **Group Chat** — Create group conversations with multiple members and a custom name.
- **Message Timestamps** — Smart formatting: time only for today, date + time for older messages.
- **Online/Offline Status** — Live green indicator for users currently in the app.
- **Typing Indicator** — Animated dots when the other user is typing, disappears after 2s.
- **Unread Message Badges** — Per-conversation unread count, cleared on open.
- **Smart Auto-Scroll** — Auto-scrolls on new messages; shows a "↓ New Messages" button when scrolled up.
- **Message Reactions** — React to messages with emojis; click again to remove.
- **Delete Messages** — Soft-delete your own messages; shows "This message was deleted."
- **Empty & Loading States** — Skeleton loaders, helpful empty screens, and error handling throughout.
- **Responsive Layout** — Sidebar + chat on desktop; full-screen chat with back button on mobile.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Backend / Realtime | Convex |
| Authentication | Clerk |
| Styling | Tailwind CSS + shadcn/ui |
| Deployment | Vercel |

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/2405Gaurav/Tars-Chat_Assignment.git
cd Tars-Chat_Assignment
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root:

```env
NEXT_PUBLIC_CONVEX_URL=your_convex_deployment_url
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

### 4. Run the Convex dev server

```bash
npx convex dev
```

### 5. Run the Next.js dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

---

## 📁 Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── (auth)/             # Clerk auth pages
│   └── (main)/chat/        # Chat layout + conversation pages
├── components/             # UI components
│   ├── ChatBox.tsx         # Main chat window
│   ├── SideBar.tsx         # App sidebar
│   ├── MessageItem.tsx     # Individual message component
│   ├── TypingIndicator.tsx # Typing animation
│   ├── UserSearch.tsx      # User search UI
│   └── CreateGroup.tsx     # Group creation UI
├── convex/                 # Convex backend
│   ├── schema.ts           # Database schema
│   ├── messages.ts         # Message queries & mutations
│   └── users_conversations.ts
└── hooks/                  # Custom React hooks
```

---

## 🧠 Built With AI Assistance

This project was built using **Claude (Anthropic)** as an AI-assisted coding tool, as permitted by the challenge rules. All code has been reviewed, understood, and can be fully explained by the author.

---

## 📬 Submission

Built by **Gaurav Thakur** for the Tars Full Stack Engineer Internship Coding Challenge 2026.