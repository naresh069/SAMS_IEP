# SAMS — Student Attendance Management System

A modern, responsive frontend for a Student Attendance Management System built with **React.js (Vite)**, **React Router DOM**, **Axios**, and **Tailwind CSS**. Ships with two role-based portals (Teacher and Student), mock data so it runs out of the box, and a clean Axios service layer ready to plug into a Java **Spring Boot + MySQL** backend.

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run the dev server
npm run dev

# 3. Open the app
# Vite will print the URL (usually http://localhost:5173)
```

### Demo Credentials (mock mode)

| Role    | Email              | Password    |
|---------|--------------------|-------------|
| Teacher | teacher@sams.com   | teacher123  |
| Student | student@sams.com   | student123  |

---

## Project Structure

```
sams-frontend/
├── public/
├── src/
│   ├── assets/
│   ├── components/         # Reusable UI: Sidebar, Navbar, StatCard, DataTable, Modal, Charts…
│   │   └── charts/
│   ├── context/            # AuthContext (Context API)
│   ├── data/               # mockData.js — used until backend is wired
│   ├── hooks/              # useAuth
│   ├── layouts/            # TeacherLayout, StudentLayout
│   ├── pages/
│   │   ├── auth/           # TeacherLogin, TeacherRegister, StudentLogin
│   │   ├── teacher/        # Dashboard, Students, MarkAttendance, Reports, Analytics, …
│   │   └── student/        # Dashboard, MyAttendance, Percentage, Analytics, Profile
│   ├── routes/             # ProtectedRoute (role-based guard)
│   ├── services/           # api.js + authService, studentService, attendanceService, reportService
│   ├── utils/              # helpers.js
│   ├── App.jsx             # Route table (React Router v6)
│   ├── main.jsx            # App bootstrap (BrowserRouter + AuthProvider)
│   └── index.css           # Tailwind + design tokens
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
├── index.html
├── package.json
└── README.md
```

---

## Connecting the Spring Boot Backend

1. **Create a `.env` file** in the project root (next to `package.json`):

   ```
   VITE_API_URL=http://localhost:8080/api
   ```

2. **Disable mock mode** in each service file (`src/services/*.js`) by changing:

   ```js
   export const USE_MOCK = true
   // change to
   export const USE_MOCK = false
   ```

3. **Implement these REST endpoints in your Spring Boot app** (CORS must allow `http://localhost:5173`):

   ### Auth
   - `POST /api/auth/login/teacher`    → body `{ email, password }` → `{ user, token }`
   - `POST /api/auth/login/student`    → body `{ email, password }` → `{ user, token }`
   - `POST /api/auth/register/teacher` → body `{ name, email, password, subject, phone }` → `{ user, token }`

   ### Students
   - `GET    /api/students`
   - `GET    /api/students/{id}`
   - `POST   /api/students`
   - `PUT    /api/students/{id}`
   - `DELETE /api/students/{id}`
   - `GET    /api/students/{id}/summary` → `{ total, present, absent, percent }`

   ### Attendance
   - `GET  /api/attendance?date=YYYY-MM-DD&class=CSE-A`
   - `GET  /api/attendance/student/{id}`
   - `POST /api/attendance/bulk` → body `[{ studentId, date, status }]`
   - `PUT  /api/attendance/{id}` → body `{ status }`

   ### Reports
   - `GET /api/reports/overview`     → `{ totalStudents, present, absent, percent, totalRecords }`
   - `GET /api/reports/monthly`      → `[{ month, present, absent, total }]`
   - `GET /api/reports/trend`        → `[{ date, percent }]`
   - `GET /api/reports/leaderboard`  → `{ top: [...], bottom: [...] }`

The JWT returned at login is automatically attached as `Authorization: Bearer <token>` on every request by the Axios interceptor in `src/services/api.js`.

---

## Tech Stack

- React 18 + Vite 5
- React Router DOM 6
- Axios
- Tailwind CSS 3
- Recharts (charts)
- lucide-react (icons)
- react-hot-toast (notifications)
- Context API for auth state

---

## Scripts

| Command          | Description                  |
|------------------|------------------------------|
| `npm run dev`    | Start dev server             |
| `npm run build`  | Production build             |
| `npm run preview`| Preview the production build |

---

## License

MIT — use freely for academic and commercial projects.
