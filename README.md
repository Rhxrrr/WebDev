# WebDev

# Typing Speed Leaderboard Web App — README

## Project Summary

This is a full-stack real-time typing speed test web application featuring:

- Typing test in "Stories" or "Race" mode
- Live and dynamic leaderboard updates
- Time-based difficulty selector (15s, 30s, 60s)
- Realtime socket-based backend updates

Built with:

- Frontend: Vue.js (Vite)
- Backend: Node.js + Express
- Database: PostgreSQL
- Live Updates: Socket.IO

## Folder Structure

- /frontend → Vue 3 frontend app
- /backend → Express backend + API + DB logic
- /database → SQL setup files
- /media → Demo video
- readme.txt + contributions.txt → Documentation

## DEMO VIDEO

If the app does not run, open `intro.mp4` from /media to see expected features:

- Realtime leaderboard
- Race vs Stories toggle
- Score submission and updates
- Duration filtering (15s, 30s, 60s)

# How to Run the App from Scratch

❗Required Software:

- Node.js (v18+)
- PostgreSQL (running locally)
- npm

## Step 1: Setup the Database

1. Open your PostgreSQL CLI or GUI
2. Run:
   CREATE DATABASE typetest;
3. Navigate to the backend database folder and run:
   \c typetest  
   Then run **all necessary SQL scripts** in the `/backend/database/` folder:
   - `001_create_stories_table.sql`
   - `002_create_time_stories_table.sql`
   - `003_create_multiplayer_stories_table.sql`
   - `004_create_leaderboard_table.sql`
   - `005_add_mode_and_placement_to_leaderboard.sql`

## Step 2: Backend Setup

1. Navigate to the backend directory:
   cd backend
2. Create a `.env` file and paste this inside:
   DATABASE_URL=postgres://postgres:yourpassword@localhost:5432/typetest
   PORT=3000
3. Install dependencies:
   npm install
4. Start the backend server:
   npm start

## Step 3: Frontend Setup

1. Open another terminal and go to the frontend folder:
   cd frontend
2. Install dependencies:
   npm install
3. Start the frontend development server:
   npm run dev
4. Open your browser at:
   http://localhost:5173

## How to Use the App

1. Choose a time duration (15, 30, 60, 90s) and type a story
2. Your WPM, accuracy, and time are saved when typing ends
3. Switch to the leaderboard page to see results update live
4. Try Race mode for placement-based rankings
5. Connect through 4 tabs to play a race with yourself.

## Login / Admin Access

- User Registration and login implemented
- The user can register

## Files Required for Submission

✅ /frontend folder  
✅ /backend folder  
✅ /database folder with SQL files  
✅ .env file (your PostgreSQL credentials)  
✅ demo.mp4 video  
✅ readme.txt (this file)  
✅ contributions.txt (who did what)

## Group Contributions

Denis Djemilovc — Login system, dark/light mode, phone responsiveness  
Derek Arthur — Login system, dark/light mode, mobile responsiveness  
Hamzah Alhamadani — Design project, Race page backend/frontend, placement logic, socket live updates  
Adam Marcelo — Design project, omepage typing logic, WPM/accuracy system, graph visualization  
Firdous Hemani — Design project, Leaderboard backend logic, dynamic display, frontend leaderboard view and integration

## Troubleshooting Tips

- Leaderboard not updating?  
  → Ensure backend and frontend servers are running correctly

- “index.html not found” error?  
  → Only use `npm run dev` in the `/frontend` directory (do not use `/dist`)

- PostgreSQL error?  
  → Check your `.env` DATABASE_URL and make sure SQL schema has been run

- Realtime updates not showing?  
  → Ensure `socketHandler.js` is included in backend and frontend uses `socket.on(...)` logic for refresh

Thanks for reviewing our project!

### Video Link

https://youtu.be/4UUhQJgkvxw
