# Unplug — Phone De-Addiction App

A Progressive Web App (PWA) to help you break social media and phone addiction through evidence-based CBT techniques.

## What it does

Guides you through a 4-phase behavior change program:

| Phase | Duration | Focus |
|---|---|---|
| 1 — Awareness | Days 1–7 | Identify triggers and patterns |
| 2 — Friction | Days 8–21 | Break the automatic behavior chain |
| 3 — Structure | Days 22–42 | Replace habits, build phone-free zones |
| 4 — Maintenance | Day 43+ | Long-term tracking |

**Core features:**
- **Urge Logger + Surfer** — log what triggered you and do a 90-second breathing exercise to ride out the craving
- **Daily check-ins** — 30-second morning intention + evening reflection
- **Streak tracker** — with a streak-freeze so one bad day doesn't reset everything
- **Challenge library** — 25 progressive evidence-based micro-challenges
- **Progress dashboard** — trigger heatmap, resistance rate, mood trend charts

## Running the app

### Prerequisites
- Java 21+
- Maven 3.8+
- Node 18+ and npm (only needed for frontend changes)

### Quick start

```bash
# Build the whole app (downloads Node, builds React, packages JAR)
mvn package -DskipTests

# Run
java -jar target/unplug-app-1.0.0.jar
```

Open `http://localhost:8080` in your browser.

**On your phone:** make sure your phone and computer are on the same WiFi, then navigate to `http://<your-computer-ip>:8080` and use your browser's "Add to Home Screen" option.

### Development (hot-reload)

```bash
# Terminal 1: backend
mvn spring-boot:run

# Terminal 2: frontend with Vite dev server (auto-proxies API to :8080)
cd frontend && npm run dev
```

Frontend dev server runs at `http://localhost:5173`.

## Data storage

Data is stored in `~/.unplug/data.mv.db` (H2 file database). It persists between restarts. To reset, delete that file.

## Tech stack

- **Backend:** Spring Boot 3.2, Spring Data JPA, H2 embedded database
- **Frontend:** React 18, TypeScript, Tailwind CSS, Recharts
- **PWA:** Web App Manifest + Service Worker (installable on phone home screen)
