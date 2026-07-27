# ⚡ HackPulse — End-to-End Hackathon Management Platform

> **A premium, responsive MERN-stack application designed to unify participants, organizers, judges, and administrators under a single glassmorphic workspace.**

Most college hackathons are currently duct-taped together using Google Forms, WhatsApp groups, spreadsheets, and emails. **HackPulse** replaces this chaotic workflow with a centralized platform. It manages the entire lifecycle of a hackathon—from initial registration and team formation to live mentor support, rubric-based evaluation, and PDF reports generation.

---

## 🚀 Key System Roles & Capabilities

The platform revolves around four distinct roles, each mapped to a tailored portal:

### 1. 👥 Participants
* **Dynamic Team Formation:** Create teams or join existing groups via secure, automatically generated unique invitation tokens.
* **Live Team Chatroom:** Real-time team communication powered by WebSockets (`Socket.io`) directly within your team dashboard.
* **Isolated Doubt Desk:** Submit support proposals to organizers to resolve questions. Once accepted, it initiates a live chat room.
* **Countdown Deadlines:** Stay on track with dynamic deadline countdown timers for project code submissions.

### 2. 📢 Organizers
* **Event Builder:** Create, update, publish, or archive hackathon events complete with banners, themes, prize pools, and schedules.
* **Registration Control:** Approve or reject participant registration requests with a single click.
* **Rubric Allocation:** Assign specific judges to evaluate specific team project submissions.
* **Help Desk Console:** Review and approve doubts, opening direct channels to guide teams.
* **Leaderboards & Reports:** Announce winners and export scoreboards to clean CSV or PDF files.

### 3. ⚖️ Judges
* **Evaluation Portal:** Access assigned team codebases, review problem statements, and submit scores.
* **Rubric Grading:** Grade entries using pre-defined rubrics with support for draft saves and final evaluations.
* **Direct Helpdesk Line:** Send messages directly to the organizer help desk (bypassing approval flows) to clarify grading criteria.

### 4. 🛡️ Administrators (Platform Owners)
* **Real-time Analytics Dashboard:** Monitor system-wide registration growth trends and hackathon lifecycle distributions.
* **User Directory Governance:** Access a categorized directory of Participants, Organizers, and Judges. Search, filter, modify roles, or suspend/delete violating accounts.
* **Event Supervision:** Override guidelines-violating hackathons and force-delete them.

---

## 🛠️ Tech Stack & Architecture

* **Frontend:** React (Vite), Tailwind CSS (Harmonious light/dark mode overrides), React Router, React Hook Form, Socket.io Client, Lucide Icons, Recharts.
* **Backend:** Node.js, Express.js (MVC Pattern), Socket.io, JWT Authentication (HTTP-only cookies), Bcrypt Hashing.
* **Database:** MongoDB Atlas via Mongoose.

---

## 🔒 Security Practices

1. **HTTP-Only JWT Cookies:** Authentication tokens are stored inside secure, HTTP-only cookies to eliminate XSS token theft.
2. **Password Complexity Rules:** User signup and profile updates require passwords with a minimum of 6 characters, including at least one letter, one number, and one special character (e.g. `Pass123!`).
3. **Role Validation Middleware:** Restricted API endpoints are protected using robust custom middleware validation (`protect`, `isAdmin`).
4. **Admin Access Lock:** Administrator registration is globally restricted. Only the authorized email `workwithgolu7@gmail.com` can sign up as an Admin.

---

## 💻 Running the App Locally

### 1. Backend Setup
1. Navigate to `/Backend` and install dependencies:
   ```bash
   cd Backend
   npm install
   ```
2. Create a `.env` file inside the `/Backend` folder:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_random_secure_hex_key
   NODE_ENV=development
   ```
3. Run the backend server:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup
1. Navigate to `/Frontend` and install dependencies:
   ```bash
   cd ../Frontend
   npm install
   ```
2. For local testing, **comment out or delete** the `.env` file in the `/Frontend` directory (if it exists) so that Vite uses its built-in proxy settings.
3. Start the Vite dev server:
   ```bash
   npm run dev
   ```
4. Open `http://localhost:5173` in your browser.

---

## ☁️ Production Deployment Steps

### 1. Database Setup
* Spin up a free shared cluster on **MongoDB Atlas**.
* Whitelist access from all IP addresses (`0.0.0.0/0`) under Network Access to allow serverless hosting platforms to connect.

### 2. Backend Hosting (e.g. Render / Railway)
* Connect your GitHub repository.
* Configure the base root folder to `Backend`.
* Set your environment variables (`MONGO_URI`, `JWT_SECRET`, `NODE_ENV=production`).

### 3. Frontend Hosting (e.g. Vercel / Netlify)
* Connect the repository and set the root directory to `Frontend`.
* Configure the production build variables:
  * `VITE_API_URL` ➔ `https://your-backend-service.onrender.com/api`
  * `VITE_SOCKET_URL` ➔ `https://your-backend-service.onrender.com`
