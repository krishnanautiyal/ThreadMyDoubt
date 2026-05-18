# ThreadMyDoubt - Full Stack Application

This project has been upgraded from a React frontend-only app into a full-stack MERN (MongoDB, Express, React, Node) application.

## Prerequisites
- **Node.js**: Make sure you have Node.js installed.
- **MongoDB**: You need a running instance of MongoDB locally (default port 27017) or a MongoDB Atlas URI.

## Project Structure
- `/backend`: The newly created Node.js + Express backend with Mongoose models.
- `/threadmydoubt`: The React frontend upgraded to use API services instead of local JSON data.

## Setup Instructions

### 1. Database Setup
1. Start your local MongoDB server: `mongod`.
2. Ensure it's running on `mongodb://127.0.0.1:27017/threadmydoubt`.
*(If you use MongoDB Atlas, update `MONGODB_URI` in `backend/.env`)*

### 2. Backend Setup
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Express server:
   ```bash
   npm start
   ```
   *(Server will run on http://localhost:5000)*

### 3. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd threadmydoubt
   ```
2. Install dependencies (if you haven't already):
   ```bash
   npm install
   ```
3. Start the React development server:
   ```bash
   npm run dev
   ```
   *(Vite will serve the app on http://localhost:5173)*

## How to Test the Flow

1. **Register**: Go to the frontend and create a new account.
2. **Explore**: Navigate to the Communities page. The initial list is fetched from the Node server.
3. **Join & Post**: Create a new community, join it, and post a question. Notice how it persists in the MongoDB database.
4. **Interact**: Post answers and cast your upvotes/downvotes to see the reputation system in motion.

Enjoy the fully transformed Reddit + StackOverflow platform!
