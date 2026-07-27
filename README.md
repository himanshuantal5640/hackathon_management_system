# HackPulse
### The Ultimate Hackathon Hub for Developers, Organizers, and Judges

HackPulse is a full-featured hackathon management platform built to take the friction out of running and participating in coding competitions. Whether you are a organizer coordinating registrations, a judge reviewing project submissions, or a participant collaborating in real-time with your teammates, HackPulse provides a unified workspace for everyone.

---

## he Three Pillars (User Roles)

HackPulse is designed around three distinct, polished workflows:

### 1.  Participants
* **Team Formation**: Create teams or join existing ones using unique invitation codes.
* **Live Team Chat**: Real-time messaging with your teammates (powered by Socket.io) directly within your team dashboard.
* **Doubt Desk**: Submit chat proposals to organizers to resolve questions. Once approved, a live chat room opens.
* **Countdown Deadlines**: Keep track of the ticking clock for project submissions.
* **Project Submission**: Upload drafts or finalize your codebase and submission details.

### 2.  Organizers
* **Event Console**: Create, edit, publish, or delete hackathon events.
* **Registration Control**: Open or close registrations in one click, and approve/reject pending registrations.
* **Judge Allocation**: Assign specific judges to evaluate incoming project submissions.
* **Doubt Console**: A centralized panel to review and approve participant doubt queries, initializing real-time support chats.
* **Leaderboards & Reports**: Declare winners, publish final results, and export leaderboard analytics to PDF or CSV files.

### 3.  Judges
* **Assigned Projects Portal**: A dedicated workspace showing pending evaluations and completed project reviews.
* **Interactive Evaluation**: Submit rubrics, write feedback notes, save evaluation drafts, or finalize scores.
* **Organizer Hot-Line**: A direct, secure chat link to communicate instantly with organizers (bypassing any request approvals) to clarify criteria.

---

## The Tech Stack

* **Frontend**: React (Vite), Tailwind CSS (Vanilla styling), React Router DOM, React Hook Form, Socket.io Client.
* **Backend**: Node.js, Express.js, Socket.io, JWT Authentication, Cookie Parsers.
* **Database**: MongoDB Atlas via Mongoose.

---

##  Getting Started Locally

To run the application on your computer:

### 1. Prerequisites
Ensure you have **Node.js** and **npm** installed on your system.

### 2. Backend Setup
1. Open the `/Backend` directory.
2. Create a `.env` file and define the following variables:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_random_secure_hex_key
   NODE_ENV=development
   ```
3. Install dependencies and start the server:
   ```bash
   npm install
   npm run dev
   ```

### 3. Frontend Setup
1. Open the `/Frontend` directory.
2. Run Vite's local dev server (it proxy-routes `/api` to the backend automatically):
   ```bash
   npm install
   npm run dev
   ```
3. Open your browser and head to `http://localhost:5173`.

---

##  Deploying to Production

When hosting the application:

1. **Database**: Use a free database cluster on **MongoDB Atlas** (make sure to whitelist access from all IPs `0.0.0.0/0`).
2. **Backend**: Host on **Render** or **Railway** (these services support WebSockets out of the box). Add environment config values for `MONGO_URI`, `JWT_SECRET`, and `PORT`.
3. **Frontend**: Host on **Vercel** or **Netlify**. Set the root folder to `Frontend`. Set the environment variables in your build configuration:
   * `VITE_API_URL` ➔ `https://your-backend.onrender.com/api`
   * `VITE_SOCKET_URL` ➔ `https://your-backend.onrender.com`
