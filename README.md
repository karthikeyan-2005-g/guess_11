# GUESS THE ELEVEN 🎨⚡
> **"DRAW IT. GUESS IT. SCORE 11."**

A production-quality, real-time multiplayer drawing and guessing party game built for Web, Android, and iOS. Strictly designed for party rooms of up to 11 players across 11 competitive rounds with server-synchronized drawing canvas, 90-second timer, live chat guessing, and the 11-point scoring system.

---

## 🎮 Game Rules & Overview

- **Room Capacity**: 2 to 11 players per party room (minimum 2 players to start, maximum 11 players).
- **11 Rounds**: The game always runs 11 competitive rounds! Drawing turns cycle evenly across all players.
- **Server-Synchronized 90-Second Timer**:
  - `01:30`: Round begins with masked word blanks and category hint.
  - `01:00`: First letter hint revealed to guessers.
  - `00:30`: Second letter hint revealed; Orange warning sound triggers.
  - `00:10`: Red urgent warning sound triggers.
  - `00:05`: Final countdown beeps.
  - `00:00`: Time's Up! Drawing stops and object is revealed.
- **Scoring System**:
  - 🥇 **1st Correct Guess**: **+11 Points**
  - 🥈 **2nd Correct Guess**: **+7 Points**
  - 🥉 **3rd Correct Guess**: **+5 Points**
  - 4th Correct Guess: **+3 Points**
  - Remaining Correct Guessers: **+1 Point**
  - 🎨 **Drawer Score**: **+11 Points** if at least 1 player guesses correctly.
  - ⭐ **Drawer Bonus**: **+5 Bonus Points** (total 16) if 8 or more players guess correctly!
  - ⚡ **Double 11 Mode**: Multiplies all scores by 2!

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Generate Prisma Client & Seed Database
Seeds 212+ objects across 12 categories, admin accounts, and default players:
```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

### 3. Run Development Servers
Starts both frontend and backend concurrently:
```bash
npm run dev
```
- **React Frontend (Your PC)**: [http://localhost:5173](http://localhost:5173)
- **Node.js Backend**: [http://localhost:3001](http://localhost:3001)
- **Mobile Phones / Friends on Same Wi-Fi**: `http://<YOUR_IP>:5173` (e.g. `http://10.161.180.82:5173`)

---

## 📱 How to Play on Mobile & Fix "This Site Cannot Be Reached"

### Why does a friend's browser show "This site cannot be reached"?
When you play on your computer, your browser URL is `http://localhost:5173`.
If you share a link with `localhost`, another person's phone tries to open its **own** phone's localhost, where no server is running!

### ✅ Solution 1: Playing with Friends on the Same Wi-Fi
1. Start the game with `npm run dev`.
2. Look at your server console or the **Share Room** modal in the lobby.
3. Share your **Wi-Fi link** (for example: `http://10.161.180.82:5173/room/GTE-XXXX`).
4. Any friend on your Wi-Fi (iPhone, Android phone, tablet, laptop) can open that link and play immediately!

### 🌐 Solution 2: Playing with Friends Over the Internet (Different Wi-Fi / 4G / 5G)
If your friends are at their own houses or on mobile data:
1. Open a new terminal in your project and run:
   ```bash
   npm run tunnel
   ```
2. This creates a free public `https://...` link (e.g. `https://guess-eleven-party.loca.lt`).
3. Share that link with your friends on WhatsApp or Telegram—they can join from anywhere in the world!

### 📦 Generating Android APK and AAB Files (Native Android App)
The native Android project is generated and synced inside `frontend/android`.

1. **Build the latest frontend and sync to Android**:
   ```bash
   npm run build
   npm run mobile:android
   ```
2. **Open the project in Android Studio**:
   ```bash
   npm run mobile:open:android
   ```
3. **To generate an APK** (for direct phone installation / sharing):
   - In Android Studio menu, click: **`Build`** ➔ **`Build Bundle(s) / APK(s)`** ➔ **`Build APK(s)`**
   - Output location: `frontend/android/app/build/outputs/apk/debug/app-debug.apk`
   - Copy this `.apk` file to any Android phone and tap to install!
4. **To generate an AAB** (Android App Bundle for Google Play Store):
   - In Android Studio menu, click: **`Build`** ➔ **`Generate Signed Bundle / APK`** (or **`Build Bundle(s)`**)
   - Select **`Android App Bundle`** (.aab)
   - Output location: `frontend/android/app/build/outputs/bundle/release/app-release.aab`

### 📲 1-Click "Install App" on Windows, Android & iOS (Instant PWA)
You don't even need an APK file to install the game on Windows or phones:
- **Windows PC**: Open `http://localhost:5173` or your Wi-Fi link in Chrome/Edge, click the **"Install App"** button at the top right (or the install prompt in the address bar). It installs immediately as a standalone Windows desktop application!
- **Android Phone**: Open the link in Chrome/Edge/Samsung Internet, and tap the in-game **"Install App"** button (or Chrome menu ➔ "Install App" / "Add to Home Screen"). It installs with its own icon on your home screen and drawer.
- **iPhone / iPad**: Open in Safari, tap the **Share** button at the bottom, and tap **"Add to Home Screen"**.

---

## 🛠 Available Root Scripts

| Script | Purpose |
| :--- | :--- |
| `npm run dev` | Runs backend (port 3001) and frontend (port 5173) concurrently |
| `npm run build` | Compiles backend TypeScript and builds Vite production frontend bundle |
| `npm run test` | Executes all Vitest unit and integration test suites |
| `npm run lint` | Runs TypeScript type checking across both workspaces |
| `npm run server` | Starts only the Node.js/Express/Socket.IO backend with hot-reload |
| `npm run client` | Starts only the Vite React frontend |
| `npm run db:generate` | Generates Prisma ORM client |
| `npm run db:migrate` | Synchronizes Prisma schema with the database |
| `npm run db:seed` | Seeds 212+ categorized objects and demo users |
| `npm run mobile:android` | Builds and synchronizes Capacitor Android project |
| `npm run mobile:ios` | Builds and synchronizes Capacitor iOS project |

---

## 🧩 Technology Stack

### Frontend
- **React 18 & TypeScript**: Component-driven UI architecture.
- **Vite**: Ultra-fast build tool and development server.
- **Tailwind CSS**: Custom dark gaming palette (`#080c16`, cyan neon, purple neon, amber gold).
- **Framer Motion**: Smooth page transitions, animated player slots, floating points notifications.
- **Zustand**: Lightweight stores for auth, room state, game state, and sound settings.
- **Socket.IO Client**: Real-time bidirectional stroke sync, timer updates, and live guessing.
- **HTML Canvas API**: Custom smooth bezier curve drawing engine with mouse & touch support.
- **Lucide React**: Modern iconography.
- **Canvas Confetti**: Room full celebrations and victory fireworks.

### Backend
- **Node.js & Express**: High-performance RESTful API.
- **TypeScript**: End-to-end type safety.
- **Socket.IO**: Room-isolated multiplayer socket server with JWT handshake authentication.
- **Prisma ORM**: Data modeling for User, Profile, GameRoom, Game, Round, Score, Object, and Session.
- **PostgreSQL / SQLite**: Dual support (zero-config SQLite default for dev, PostgreSQL production schema included).
- **Security**: Helmet, CORS, Express Rate Limit, bcrypt password hashing, short-lived JWT access tokens, and rotating refresh tokens.

### Audio System
- **Web Audio API Synth Engine**: 100% reliable real-time procedural audio synthesis guaranteeing instant playback with zero broken assets:
  - Button click, popups, and player join pops.
  - Dramatic 3-2-1 countdowns and drawing whistles.
  - Cartoon boings for wrong guesses and victory chimes for correct guesses.
  - Coin reward chime for +11 points.
  - 30s orange warning and 10s red urgent alarm beeps.
  - Sad trombone for failures and victory fanfare for game champions.
  - Toggleable procedural party background music (BGM).

### Mobile Packaging
- **Capacitor 7**: Native cross-platform mobile support for Android and iOS.
- **Capacitor Plugins**: Native Share Sheet, Haptics / Vibration, Status Bar, and Splash Screen.

---

## 📁 Project Structure

```
guess-the-eleven/
├── package.json
├── README.md
├── .gitignore
├── .env.example
├── backend/
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env
│   ├── prisma/
│   │   ├── schema.prisma (SQLite dev default)
│   │   ├── schema.postgresql.prisma (PostgreSQL production schema)
│   │   └── seed.ts (212 objects and users)
│   └── src/
│       ├── server.ts
│       ├── app.ts
│       ├── config/ (db.ts, env.ts)
│       ├── routes/ (auth.ts, profile.ts, rooms.ts, users.ts, health.ts)
│       ├── sockets/ (index.ts, authSocket.ts, roomHandlers.ts, gameHandlers.ts, drawingHandlers.ts)
│       ├── services/ (authService.ts, gameService.ts, objectService.ts, roomService.ts, scoringService.ts, userService.ts)
│       ├── middleware/ (authMiddleware.ts, errorHandler.ts, rateLimiter.ts)
│       ├── data/ (objects.ts - 212 categorized items)
│       ├── utils/ (roomCode.ts, token.ts, validation.ts)
│       └── __tests__/ (auth.test.ts, room.test.ts, scoring.test.ts, object.test.ts)
└── frontend/
    ├── package.json
    ├── vite.config.ts
    ├── tsconfig.json
    ├── index.html
    ├── capacitor.config.ts
    ├── public/
    │   └── favicon.svg
    └── src/
        ├── App.tsx
        ├── main.tsx
        ├── components/ (Header, Footer, PlayerAvatar, PlayerCard, PlayerGrid, RoomCard, DrawingCanvas, GuessInput, ChatBox, Timer, Scoreboard, ColorPicker, GameToolbar, SoundSettings, Modal, Toast, LoadingScreen)
        ├── pages/ (SplashPage, WelcomePage, RegisterPage, LoginPage, ForgotPasswordPage, HomePage, CreateRoomPage, JoinRoomPage, LobbyPage, GamePage, RoundResultPage, ResultsPage, ProfilePage, SettingsPage, HowToPlayPage)
        ├── hooks/ (useAuth.ts, useSocket.ts, useGame.ts, useRoom.ts, useTimer.ts)
        ├── store/ (authStore.ts, gameStore.ts, roomStore.ts, settingsStore.ts)
        ├── services/ (api.ts, authService.ts, socketService.ts, audioService.ts, shareService.ts)
        ├── utils/ (drawing.ts, normalizeGuess.ts, scoring.ts, validation.ts)
        └── styles/ (index.css, animations.css)
```

---

## 🔒 Security Features
1. **Password Protection**: Passwords hashed with bcrypt (salt rounds 12). Hashes are never returned to clients.
2. **JWT Handshake**: Socket.IO connections authenticated via JWT tokens; unauthorized connections are rejected before joining room channels.
3. **Room Isolation**: Canvas strokes and secret drawing words are strictly isolated to each respective room code channel.
4. **Secret Protection**: Secret object names are only sent to the active drawer. Guessers receive masked blank representations with hint reveals.
5. **Server-Side Scoring**: Clients can never report or alter scores directly; all guess validation and point calculation occurs on the backend.
6. **Rate Limiting**: Auth endpoints and guess submissions are protected against brute-force and spamming attacks.
7. **Login Before Room Join**: Invitation URLs (e.g. `/room/GTE-A829`) preserve room codes through login or registration so players join seamlessly without lost links.

---

## 📱 Mobile Build Instructions
```bash
# Build the production web bundle
npm run build

# Android build
npm run mobile:android

# iOS build
npm run mobile:ios
```
Capacitor will generate native Android Studio and Xcode projects in `frontend/android` and `frontend/ios`.

---

## 🏆 Default Admin Credentials
- **User ID**: `admin`
- **Password**: `Admin@1234`
- **Role**: `ADMIN`
