# GUESS THE ELEVEN 🎨⚡ - Project Artifacts & Architecture

> **"DRAW IT. GUESS IT. SCORE 11."**  
> *Production-Ready Real-Time Multiplayer Party Game Architecture*

---

## 🏛️ System Architecture Overview

```
                      +-----------------------------+
                      |   GUESS THE ELEVEN CLIENT   |
                      |   (React 18 + TypeScript)   |
                      +--------------+--------------+
                                     |
               +---------------------+---------------------+
               |                                           |
        [HTTP / REST]                              [WebSocket]
    (Authentication, Rooms,                    (Drawing Broadcast,
     Profiles, Health APIs)                     Timer, Live Chat)
               |                                           |
               v                                           v
    +--------------------+                     +--------------------+
    |   Express Server   | <-----------------> |  Socket.IO Server  |
    +----------+---------+                     +----------+---------+
               |                                           |
               +---------------------+---------------------+
                                     |
                          [Prisma ORM Layer]
                                     |
                                     v
                        +-------------------------+
                        |   PostgreSQL / SQLite   |
                        |   Database Layer        |
                        +-------------------------+
```

---

## 📦 GitHub Generated Artifacts

When you push code or run the GitHub Actions workflow, GitHub automatically builds and publishes the following artifacts:

| Artifact Name | Target Platform | File / Path | Description |
| :--- | :--- | :--- | :--- |
| **`GuessTheEleven-Android-APK`** | Android Mobile | `app-debug.apk` | Standalone native Android APK ready to download and install directly on any Android smartphone. |
| **`guess-the-eleven-web-pwa`** | Web / PWA / Windows / iOS | `frontend/dist/` | Production bundle with Service Worker, HTML Canvas engine, and offline caching. |
| **`guess-the-eleven-backend`** | Server / Node.js | `backend/dist/` | Compiled TypeScript backend server executable with Express & Socket.IO. |

---

## 🎮 Game Engine Specifications

### 1. Multiplayer Synchronization
- **Room Capacity**: Maximum 11 players per party room.
- **Starting Threshold**: Minimum 2 players to start.
- **Round Count**: Strictly 11 rounds per match.
- **Fair Turn Cycling**: Formula: `drawerIndex = (round - 1) % playerOrder.length`.

### 2. The 11-Point Scoring Engine
- **1st Correct Guess**: **+11 Points**
- **2nd Correct Guess**: **+7 Points**
- **3rd Correct Guess**: **+5 Points**
- **4th Correct Guess**: **+3 Points**
- **Remaining Correct Guesses**: **+1 Point**
- **Artist Reward**: **+11 Points** when at least 1 player guesses correctly.
- **Crowd Pleaser Bonus**: **+5 Bonus Points** if 8+ players guess correctly!
- **Double 11 Mode**: All awarded scores multiplied by 2.

### 3. Canvas Protocol
- Differential stroke packet transmission:
  ```json
  {
    "type": "STROKE_POINT",
    "x": 0.452,
    "y": 0.318,
    "color": "#06b6d4",
    "width": 6,
    "tool": "brush"
  }
  ```
- Canvas resolution normalization: Normalized float coordinates `(0.0 - 1.0)` ensure drawing renders identically across phone screens, tablets, and 4K desktop monitors.

---

## 🛡️ Security & Authentication Protocols
- **Passlib/bcrypt Password Hashing**: Cost factor 10.
- **Token Dual-Pair**:
  - `access_token`: Short-lived (15 minutes).
  - `refresh_token`: Long-lived (7 days) with cryptographically secure UUID `jti` rotation.
- **Dynamic CORS Guard**: Automatically restricts or binds authorized local network IPs and tunnel origins.
- **Express Rate Limiting**: Max 100 requests per 15 minutes per IP window on auth routes.
