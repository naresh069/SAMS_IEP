# Student Attendance Management System – Spring Boot Backend

Java 17 · Spring Boot 3.3 · Spring Security · Spring Data JPA · MySQL · JWT · Lombok

## 1. Prerequisites
- JDK 17
- Maven 3.9+
- MySQL 8.x running locally

## 2. Database
```sql
CREATE DATABASE attendance_db;
```
(The app also auto-creates it via `createDatabaseIfNotExist=true`.)

Configure credentials with environment variables. See `.env.example` for the full list:
```properties
DB_URL=jdbc:mysql://localhost:3306/attendance_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
DB_USERNAME=root
DB_PASSWORD=your_mysql_password
JWT_SECRET=replace-with-a-long-random-secret
```

## 3. Run
```bash
mvn spring-boot:run
```
Backend starts on `http://localhost:8080`. Tables auto-create on first run (`ddl-auto=update`).

## 4. CORS
Allowed origins include `http://localhost:3000`, `http://localhost:5173`, and `http://127.0.0.1:5173` for the Vite frontend.

## 5. REST API

### Auth (public)
| Method | URL | Body |
|---|---|---|
| POST | `/api/auth/teacher/register` | `{ name, email, password, subject?, phone? }` |
| POST | `/api/auth/teacher/login` | `{ email, password }` |
| POST | `/api/auth/student/login` | `{ rollNumber, password }` |

All return `{ token, user }`. Send token as `Authorization: Bearer <token>` on protected routes.

### Students
| Method | URL |
|---|---|
| GET | `/api/students` |
| GET | `/api/students/{id}` |
| POST | `/api/students` |
| PUT | `/api/students/{id}` |
| DELETE | `/api/students/{id}` |

### Attendance
| Method | URL |
|---|---|
| POST | `/api/attendance/bulk` — `{ date, className, entries:[{studentId,status}] }` |
| GET | `/api/attendance/date?date=YYYY-MM-DD&className=CSE-A` |
| GET | `/api/attendance/student/{studentId}` |
| GET | `/api/attendance` |
| PUT | `/api/attendance/{id}` — `{ status: "PRESENT" }` |
| DELETE | `/api/attendance/{id}` |

### Reports
| Method | URL |
|---|---|
| GET | `/api/reports/overview` |
| GET | `/api/reports/monthly` |
| GET | `/api/reports/student-summary/{id}` |

## 6. Connecting the React Frontend
In the Vite app set:
```
VITE_API_URL=http://localhost:8080/api
```
And flip `USE_MOCK = false` in each `src/services/*.js` file.

## 7. Project Structure
```
src/main/java/com/sams
 ├── SamsBackendApplication.java
 ├── controller/   AuthController, StudentController, AttendanceController, ReportController
 ├── service/      AuthService, StudentService, AttendanceService, ReportService
 ├── repository/   TeacherRepository, StudentRepository, AttendanceRepository
 ├── entity/       Teacher, Student, Attendance
 ├── dto/          LoginRequest, LoginResponse, TeacherRegisterRequest, StudentRequest, AttendanceRequest, DashboardResponse, ReportResponse
 ├── config/       SecurityConfig
 ├── security/     JwtTokenProvider, JwtAuthFilter
 └── exception/    GlobalExceptionHandler, ResourceNotFoundException, BadRequestException
```

## 8. Open in Eclipse / IntelliJ
- Eclipse: *File → Import → Existing Maven Project* → select the unzipped folder.
- IntelliJ: *Open* → select `pom.xml`.

That's it — `mvn spring-boot:run` and the React app will work end-to-end.
